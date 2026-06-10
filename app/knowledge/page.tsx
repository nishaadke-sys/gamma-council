
import { useEffect, useState, useRef } from "react"
import { Plus, Trash2, Upload, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface KnowledgeEntry {
  id: number
  section: string
  title: string
  content: string
  source: string
  updated_at: string
}

const SECTIONS = ["product", "validation", "funding", "strategy", "constraints", "questions"]

const SECTION_LABELS: Record<string, string> = {
  product: "Product",
  validation: "Validation & Data",
  funding: "Funding",
  strategy: "Strategy",
  constraints: "Constraints",
  questions: "Open Questions",
}

export default function KnowledgePage() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [uploadStatus, setUploadStatus] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadEntries()
  }, [])

  async function loadEntries() {
    setLoading(true)
    const res = await fetch("/api/knowledge")
    const data = await res.json()
    setEntries(data.entries || [])
    setLoading(false)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadStatus("Reading file...")

    const text = await file.text()
    setUploadStatus("Extracting knowledge with Claude...")

    const res = await fetch("/api/knowledge/upload", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ filename: file.name, content: text.slice(0, 8000) }),
    })
    const data = await res.json()
    if (data.success) {
      setUploadStatus(`Extracted ${data.count} entries from ${file.name}`)
      loadEntries()
    } else {
      setUploadStatus("Upload failed: " + (data.error || "unknown error"))
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ""
  }

  async function deleteEntry(id: number) {
    await fetch("/api/knowledge", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    })
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  function toggleSection(section: string) {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const grouped = SECTIONS.reduce(
    (acc, s) => {
      acc[s] = entries.filter((e) => e.section === s)
      return acc
    },
    {} as Record<string, KnowledgeEntry[]>,
  )

  const totalEntries = entries.length

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-5 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Knowledge Base</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {totalEntries} entries loaded into every council debate automatically.
        </p>
      </header>

      <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm">
        <p className="mb-3 text-xs font-medium text-muted-foreground">Upload a document to extract knowledge</p>
        <div className="flex items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,.csv,.json"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="size-3.5" />
            {uploading ? "Extracting..." : "Upload document"}
          </Button>
          {uploadStatus && (
            <span className="text-xs text-muted-foreground">{uploadStatus}</span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          Loading...
        </div>
      ) : (
        <div className="space-y-3">
          {SECTIONS.map((section) => {
            const sectionEntries = grouped[section] || []
            const isExpanded = expandedSections[section] !== false
            return (
              <div key={section} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleSection(section)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {SECTION_LABELS[section]}
                    </span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      {sectionEntries.length}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  )}
                </button>

                {isExpanded && sectionEntries.length > 0 && (
                  <div className="border-t border-border divide-y divide-border">
                    {sectionEntries.map((entry) => (
                      <div key={entry.id} className="px-4 py-3 group">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground">{entry.title}</p>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                              {entry.content}
                            </p>
                            {entry.source && (
                              <p className="mt-1 text-[11px] text-muted-foreground/60">
                                {entry.source}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10"
                          >
                            <Trash2 className="size-3.5 text-destructive" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isExpanded && sectionEntries.length === 0 && (
                  <div className="border-t border-border px-4 py-3">
                    <p className="text-xs text-muted-foreground">No entries in this section yet.</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
