import { useState } from "react";
import { useKnowledgeStore, type KBItem, type KBCategory, type KBScope } from "@/stores/knowledgeStore";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ArrowLeft,
  Globe,
  Target,
  FileText,
  HelpCircle,
  BookOpen,
  Layout,
  FolderOpen,
  Link2,
  Loader2,
} from "lucide-react";

const categoryLabels: Record<KBCategory, { label: string; icon: typeof FileText }> = {
  requirements: { label: "Requirements", icon: FileText },
  faq: { label: "FAQ", icon: HelpCircle },
  guidelines: { label: "Guidelines", icon: BookOpen },
  templates: { label: "Templates", icon: Layout },
  resources: { label: "Resources", icon: FolderOpen },
};

export function KnowledgeBasePage() {
  const { items, addItem, updateItem, removeItem } = useKnowledgeStore();
  const [filterCategory, setFilterCategory] = useState<KBCategory | "all">("all");
  const [filterScope, setFilterScope] = useState<KBScope | "all">("all");
  const [editingItem, setEditingItem] = useState<KBItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // New item form
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState<KBCategory>("guidelines");
  const [formScope, setFormScope] = useState<KBScope>("global");
  const [showUrlImport, setShowUrlImport] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);

  const filteredItems = items.filter((item) => {
    if (filterCategory !== "all" && item.category !== filterCategory) return false;
    if (filterScope !== "all" && item.scope !== filterScope) return false;
    return true;
  });

  const globalCount = items.filter((i) => i.scope === "global").length;
  const topicCount = items.filter((i) => i.scope === "topic").length;

  const resetForm = () => {
    setFormTitle("");
    setFormContent("");
    setFormCategory("guidelines");
    setFormScope("global");
    setEditingItem(null);
    setIsCreating(false);
    setShowUrlImport(false);
    setImportUrl("");
  };

  const startEdit = (item: KBItem) => {
    setFormTitle(item.title);
    setFormContent(item.content);
    setFormCategory(item.category);
    setFormScope(item.scope);
    setEditingItem(item);
    setIsCreating(false);
  };

  const startCreate = () => {
    resetForm();
    setIsCreating(true);
  };

  const handleSave = () => {
    if (!formTitle.trim() || !formContent.trim()) return;
    if (editingItem) {
      updateItem(editingItem.id, {
        title: formTitle,
        content: formContent,
        category: formCategory,
        scope: formScope,
      });
    } else {
      addItem({
        id: `kb-${Date.now()}`,
        title: formTitle,
        content: formContent,
        category: formCategory,
        scope: formScope,
        createdBy: "supervisor-01",
      });
    }
    resetForm();
  };

  const showForm = isCreating || editingItem;

  return (
    <div className="scroll-area">
      <div className="scroll-area-content max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/supervisor"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="ds-title-lg text-foreground">Knowledge Base</h1>
            <p className="mt-0.5 ds-small text-muted-foreground">
              {globalCount} shared items, {topicCount} topic-specific items. Students and Ona use these for guidance.
            </p>
          </div>
          {!showForm && (
            <button
              onClick={startCreate}
              className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 ds-label transition-colors duration-150 hover:opacity-90"
            >
              <Plus className="h-4 w-4" />Add item
            </button>
          )}
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="mb-6 rounded-lg border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="ds-title-cards text-foreground">{editingItem ? "Edit item" : "New item"}</h3>
              <button onClick={resetForm} className="text-muted-foreground hover:text-foreground transition-colors duration-150">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="ds-label text-muted-foreground mb-1 block">Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Citation style requirements"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 ds-small text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="ds-label text-muted-foreground block">Content</label>
                  <button
                    onClick={() => setShowUrlImport(!showUrlImport)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-ai/30 bg-ai/5 text-ai ds-caption font-semibold hover:bg-ai/10 transition-all duration-200"
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    Import from URL
                  </button>
                </div>
                {showUrlImport && (
                  <div className="mb-3 rounded-lg border border-ai/20 bg-ai/5 p-3">
                    <p className="ds-caption text-muted-foreground mb-2">Paste a URL to auto-import content (e.g. university guidelines page)</p>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={importUrl}
                        onChange={(e) => setImportUrl(e.target.value)}
                        placeholder="https://university.ch/thesis-guidelines"
                        className="flex-1 rounded-lg border border-input bg-background px-3 py-2 ds-small text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ai/50"
                      />
                      <button
                        onClick={() => {
                          setImporting(true);
                          setTimeout(() => {
                            setFormTitle("Thesis Formatting & Submission Guidelines");
                            setFormContent("1. Format: All theses must use the official university LaTeX or Word template.\n2. Length: M.Sc. theses should be 60–80 pages (excluding appendices).\n3. Citation Style: APA 7th Edition is the default. Deviations must be approved by the supervisor.\n4. Submission: Upload the final PDF to the thesis portal by the registered deadline. Late submissions require a formal extension request.\n5. Declaration of Authorship: Must be signed and included as the last page.\n6. Digital Copy: An additional digital copy must be submitted to the university library via the ETH Research Collection.");
                            setFormCategory("requirements");
                            setImporting(false);
                            setShowUrlImport(false);
                            setImportUrl("");
                          }, 1800);
                        }}
                        disabled={!importUrl.trim() || importing}
                        className="flex items-center gap-2 rounded-lg bg-ai text-white px-4 py-2 ds-label transition-all hover:opacity-90 disabled:opacity-30"
                      >
                        {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                        {importing ? "Importing..." : "Import"}
                      </button>
                    </div>
                  </div>
                )}
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Detailed content that students and Ona can reference..."
                  rows={5}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 ds-small text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="ds-label text-muted-foreground mb-1 block">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as KBCategory)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 ds-small text-foreground"
                  >
                    {Object.entries(categoryLabels).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="ds-label text-muted-foreground mb-1 block">Scope</label>
                  <select
                    value={formScope}
                    onChange={(e) => setFormScope(e.target.value as KBScope)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 ds-small text-foreground"
                  >
                    <option value="global">Shared (all theses)</option>
                    <option value="topic">Topic-specific</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSave}
                  disabled={!formTitle.trim() || !formContent.trim()}
                  className="rounded-lg bg-primary text-primary-foreground px-4 py-2 ds-label transition-colors duration-150 hover:opacity-90 disabled:opacity-30"
                >
                  {editingItem ? "Save changes" : "Add item"}
                </button>
                <button
                  onClick={resetForm}
                  className="rounded-lg border border-border px-4 py-2 ds-label text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as KBCategory | "all")}
            className="rounded-lg border border-input bg-background px-3 py-2 ds-small text-foreground"
          >
            <option value="all">All categories</option>
            {Object.entries(categoryLabels).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select
            value={filterScope}
            onChange={(e) => setFilterScope(e.target.value as KBScope | "all")}
            className="rounded-lg border border-input bg-background px-3 py-2 ds-small text-foreground"
          >
            <option value="all">All scopes</option>
            <option value="global">Shared</option>
            <option value="topic">Topic-specific</option>
          </select>
          <span className="ds-caption text-muted-foreground">{filteredItems.length} items</span>
        </div>

        {/* Items list */}
        <div className="space-y-2">
          {filteredItems.map((item) => {
            const catInfo = categoryLabels[item.category];
            const CatIcon = catInfo.icon;
            return (
              <div
                key={item.id}
                className="rounded-lg border border-border p-4 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary flex-shrink-0">
                      <CatIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="ds-label text-foreground">{item.title}</h3>
                        <span className="ds-badge px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          {catInfo.label}
                        </span>
                        {item.scope === "global" ? (
                          <span className="ds-badge px-2 py-0.5 rounded-full bg-secondary text-muted-foreground flex items-center gap-1">
                            <Globe className="h-2.5 w-2.5" />Shared
                          </span>
                        ) : (
                          <span className="ds-badge px-2 py-0.5 rounded-full bg-foreground/10 text-foreground flex items-center gap-1">
                            <Target className="h-2.5 w-2.5" />Topic
                          </span>
                        )}
                      </div>
                      <p className="ds-small text-muted-foreground line-clamp-2">{item.content}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => startEdit(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-accent transition-colors duration-150"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
