import { useState } from "react";
import { useThesisStore } from "@/stores/thesisStore";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Lock,
  BookOpen,
  FileText,
  HelpCircle,
  Layout,
  FolderOpen,
  X,
  FileUp,
  Download,
  Clock,
  AlertCircle,
  FileCheck2,
  Sparkles,
  ExternalLink,
  PartyPopper,
  Trophy,
  Rocket,
} from "lucide-react";
import { useKnowledgeStore, type KBCategory, type KBItem } from "@/stores/knowledgeStore";

const categoryIcons: Record<KBCategory, any> = {
  requirements: FileText,
  faq: HelpCircle,
  guidelines: BookOpen,
  templates: Layout,
  resources: FolderOpen,
};

// Ona prefilled questions per milestone
const onaQuicklinks: Record<string, string> = {
  "m-formal": "What are the key formal requirements I should know about before starting my thesis?",
  "m-align": "Help me prepare questions for my first supervisor alignment meeting",
  "m-topic": "Help me narrow down my thesis topic to something specific and manageable",
  "m-rq": "Help me formulate a strong research question from my topic",
  "m-lit": "What are the best strategies for an initial literature search?",
  "m-method": "What methodology fits best for my research question?",
  "m-expose": "Help me structure my expose — what should I include?",
  "m-litreview": "How should I structure my deep literature review?",
  "m-setup": "Help me plan my data collection and experimental setup",
  "m-execute": "I am stuck on my analysis, help me debug my approach",
  "m-write-method": "Help me write a strong methodology chapter",
  "m-write-results": "How should I present my results objectively?",
  "m-write-theory": "Help me structure my theory chapter",
  "m-write-disc": "How do I write a convincing discussion section?",
  "m-write-intro": "Help me write a compelling introduction and conclusion",
  "m-write-abstract": "Help me write my thesis abstract in roughly 250 words",
  "m-citations": "Help me verify my citation format and check for missing references",
  "m-formal-rev": "Proofread my formatting — what should I check before submission?",
  "m-content-rev": "Review my thesis structure for logical flow and argument gaps",
  "m-feedback": "Help me prepare my draft for supervisor feedback",
  "m-submit": "Final submission checklist — what should I verify?",
  "m-slides": "Help me structure my defense presentation",
  "m-defense": "What questions should I prepare for during my oral defense?",
};

// Resource links per phase
const phaseResources: Record<string, Array<{ label: string; url: string; description: string }>> = {
  execution: [
    { label: "Google Scholar", url: "https://scholar.google.com", description: "Search academic papers across all disciplines" },
    { label: "Semantic Scholar", url: "https://www.semanticscholar.org", description: "AI-powered research discovery tool" },
    { label: "Connected Papers", url: "https://www.connectedpapers.com", description: "Explore connected papers in a visual graph" },
    { label: "arXiv", url: "https://arxiv.org", description: "Open-access preprint server for STEM fields" },
  ],
  writing: [
    { label: "ETH Sample Theses", url: "https://ethz.ch/students/en/studies/thesis.html", description: "Repository of awarded M.Sc. theses" },
    { label: "Overleaf LaTeX Templates", url: "https://www.overleaf.com/latex/templates", description: "Professional thesis templates" },
    { label: "Academic Phrasebank", url: "https://www.phrasebank.manchester.ac.uk", description: "Framework phrases for academic writing" },
  ],
  finalization: [
    { label: "Google Scholar", url: "https://scholar.google.com", description: "Verify and cross-check your references" },
    { label: "Crossref", url: "https://search.crossref.org", description: "DOI lookup for citation verification" },
    { label: "Turnitin (Plagiarism Check)", url: "https://www.turnitin.com", description: "Plagiarism detection for academic work" },
    { label: "GPTZero (AI Detection)", url: "https://gptzero.me", description: "AI-content detection tool" },
    { label: "Grammarly", url: "https://www.grammarly.com", description: "Grammar, spelling, and style checker" },
  ],
};

export function JourneyPage() {
  const { 
    phases, 
    currentPhase, 
    setCurrentPhase, 
    toggleMilestone, 
    getPhaseProgress, 
    isPhaseUnlocked, 
    thesisState, 
    registerThesis, 
    selectedTopicId,
    documents,
    uploadDocument,
    studentId,
    getOverallProgress,
    finalGrade,
  } = useThesisStore();
  const navigate = useNavigate();
  const { items: allKbItems } = useKnowledgeStore();
  const [expandedPhase, setExpandedPhase] = useState<number>(currentPhase);
  const [selectedKbItem, setSelectedKbItem] = useState<KBItem | null>(null);
  const overallProgress = getOverallProgress();

  // If not yet registered, show registration prompt
  if (thesisState === "exploring" || thesisState === "topic_selected") {
    return (
      <div className="scroll-area">
        <div className="scroll-area-content max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="ds-title-lg text-foreground">Thesis Journey</h1>
            <p className="mt-1 ds-body text-muted-foreground">
              Your guided roadmap from orientation to submission, roughly 24 weeks of structured progress.
            </p>
          </div>
          <div className="rounded-lg border border-border p-6 text-center">
            {thesisState === "exploring" ? (
              <>
                <p className="ds-body text-foreground mb-2">Select a topic first</p>
                <p className="ds-small text-muted-foreground mb-4">Browse available topics and select one to unlock the guided thesis journey.</p>
              </>
            ) : (
              <>
                <p className="ds-body text-foreground mb-2">Ready to begin?</p>
                <p className="ds-small text-muted-foreground mb-4">
                  You have selected a topic. Register your thesis to unlock the step-by-step journey.
                </p>
                <button
                  onClick={registerThesis}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 ds-label transition-colors duration-150 hover:opacity-90"
                >
                  Register thesis
                </button>
              </>
            )}
          </div>

          {/* Show phase overview as a preview */}
          <div className="mt-6 space-y-2">
            <p className="ds-label text-muted-foreground">What the journey covers</p>
            {phases.map((phase, i) => (
              <div key={phase.id} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 opacity-60">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary ds-badge text-muted-foreground flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="ds-label text-foreground">{phase.title}</p>
                  <p className="ds-caption text-muted-foreground">{phase.weeks}</p>
                </div>
                <Lock className="ml-auto h-3.5 w-3.5 text-muted-foreground/40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 100% completion celebration
  if (overallProgress === 100 || thesisState === "graded") {
    return (
      <div className="scroll-area">
        <div className="scroll-area-content max-w-3xl mx-auto py-8">
          <div className="rounded-2xl border border-primary/50 bg-card p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none select-none">
              <div className="absolute top-4 left-8 text-4xl animate-bounce" style={{ animationDelay: "0ms" }}>🎓</div>
              <div className="absolute top-6 right-12 text-3xl animate-bounce" style={{ animationDelay: "200ms" }}>🎉</div>
              <div className="absolute bottom-8 left-16 text-3xl animate-bounce" style={{ animationDelay: "400ms" }}>🏆</div>
              <div className="absolute bottom-6 right-20 text-4xl animate-bounce" style={{ animationDelay: "600ms" }}>🚀</div>
              <div className="absolute top-12 left-1/3 text-2xl animate-bounce" style={{ animationDelay: "300ms" }}>⭐</div>
              <div className="absolute bottom-12 right-1/3 text-2xl animate-bounce" style={{ animationDelay: "500ms" }}>🎊</div>
            </div>
            <div className="relative z-10">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground mx-auto mb-6">
                <Trophy className="h-10 w-10" />
              </div>
              <h1 className="ds-title-lg text-foreground mb-2">Congratulations!</h1>
              <p className="ds-body text-foreground mb-2">You have completed your thesis journey.</p>
              {finalGrade && (
                <div className="inline-flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/30 px-6 py-3 mb-4">
                  <span className="ds-caption text-primary font-semibold">Final Grade</span>
                  <span className="ds-title-md text-primary">{finalGrade}</span>
                </div>
              )}
              <p className="ds-caption text-muted-foreground mt-4 max-w-md mx-auto">
                From your first literature search to your final defense — you made it. Time to celebrate and share your achievement with the world.
              </p>
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => navigate("/chat")}
                  className="flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 ds-label text-foreground hover:bg-accent transition-colors"
                >
                  <Sparkles className="h-4 w-4" /> Chat with Ona
                </button>
                <button
                  onClick={() => navigate("/community")}
                  className="flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 ds-label hover:opacity-90 transition-all"
                >
                  <Rocket className="h-4 w-4" /> Share with community
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scroll-area">
      <div className="scroll-area-content max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="ds-title-lg text-foreground">Thesis Journey</h1>
          <p className="mt-1 ds-body text-muted-foreground">
            Your guided roadmap from orientation to submission.
          </p>
        </div>

        {/* Timeline bar */}
        <div className="mb-6">
          <div className="flex items-center gap-0">
            {phases.map((phase, i) => {
              const progress = getPhaseProgress(i);
              const isActive = i === currentPhase;
              const isComplete = progress === 100;
              const unlocked = isPhaseUnlocked(i);
              return (
                <div key={phase.id} className="flex-1 flex items-center">
                  <button
                    onClick={() => {
                      if (unlocked) {
                        setCurrentPhase(i);
                        setExpandedPhase(i);
                      }
                    }}
                    disabled={!unlocked}
                    className="relative flex flex-col items-center w-full"
                  >
                    <div
                      className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                        isComplete
                          ? "border-foreground bg-foreground text-background"
                          : isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : unlocked
                          ? "border-border bg-card text-muted-foreground hover:border-muted-foreground"
                          : "border-border bg-secondary text-muted-foreground/30"
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : !unlocked ? (
                        <Lock className="h-3 w-3" />
                      ) : (
                        <span className="ds-badge">{i + 1}</span>
                      )}
                    </div>
                    <span className={`mt-1.5 ds-caption text-center transition-colors duration-150 ${
                      isActive ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}>
                      {phase.shortTitle}
                    </span>
                  </button>
                  {/* Connector */}
                  {i < phases.length - 1 && (
                    <div className="h-0.5 flex-1 bg-border mx-1 mt-[-20px] relative">
                      <div
                        className="absolute h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Phase cards */}
        <div className="space-y-3">
          {phases.map((phase, phaseIndex) => {
            const progress = getPhaseProgress(phaseIndex);
            const isExpanded = expandedPhase === phaseIndex;
            const isComplete = progress === 100;
            const unlocked = isPhaseUnlocked(phaseIndex);
            const resources = phaseResources[phase.id] || [];

            return (
              <div
                key={phase.id}
                className={`rounded-lg border transition-colors duration-200 ${
                  !unlocked ? "border-border bg-secondary/30 opacity-50" :
                  isExpanded ? "border-primary bg-card" : "border-border bg-card hover:border-muted-foreground/30"
                }`}
              >
                <button
                  onClick={() => {
                    if (unlocked) setExpandedPhase(isExpanded ? -1 : phaseIndex);
                  }}
                  disabled={!unlocked}
                  className="w-full flex items-center gap-4 p-4 text-left"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0 ${
                    isComplete ? "bg-foreground text-background" : "bg-secondary"
                  }`}>
                    {isComplete ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : !unlocked ? (
                      <Lock className="h-4 w-4 text-muted-foreground/30" />
                    ) : (
                      <span className="ds-title-cards text-muted-foreground">{phaseIndex + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="ds-title-cards text-foreground">{phase.title}</h3>
                      {isComplete && (
                        <span className="ds-badge px-2 py-0.5 rounded-full bg-foreground text-background">Done</span>
                      )}
                    </div>
                    <p className="ds-small text-muted-foreground">{phase.description}</p>
                    {unlocked && (
                      <div className="mt-2 flex items-center gap-3">
                        <div className="h-1.5 flex-1 max-w-xs rounded-full bg-border overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="ds-caption text-muted-foreground">{Math.round(progress)}%</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {unlocked && (isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />)}
                  </div>
                </button>

                {/* Milestones */}
                {isExpanded && unlocked && (
                  <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
                    {phase.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className={`rounded-lg border p-4 transition-colors duration-200 ${
                          milestone.completed
                            ? "border-border bg-secondary/50"
                            : "border-border bg-background"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleMilestone(phaseIndex, milestone.id)}
                            className="mt-0.5 flex-shrink-0 transition-colors duration-150"
                          >
                            {milestone.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-foreground" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                            )}
                          </button>
                          <div className="flex-1">
                            <h4 className={`ds-label ${milestone.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                              {milestone.title}
                            </h4>
                            <ul className="mt-1.5 space-y-0.5">
                              {milestone.tasks.map((task, ti) => (
                                <li key={ti} className="flex items-center gap-2 ds-caption text-muted-foreground">
                                  <span className="h-1 w-1 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                                  {task}
                                </li>
                              ))}
                            </ul>

                            {/* Ona quicklink */}
                            {onaQuicklinks[milestone.id] && !milestone.completed && (
                              <button
                                onClick={() => {
                                  // Navigate to /chat with Ona tab and prefill
                                  const query = encodeURIComponent(onaQuicklinks[milestone.id]);
                                  navigate(`/chat?q=${query}`);
                                }}
                                className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-ai/30 bg-ai/5 text-ai ds-caption font-semibold hover:bg-ai/10 transition-all duration-200"
                              >
                                <Sparkles className="h-3.5 w-3.5" />
                                Ask Ona for help
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Document Vault for specific milestones */}
                        {milestone.requiredDocument && (
                          <div className="mt-4 ml-8 rounded-lg border border-dashed border-border p-4 bg-secondary/20">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <FileUp className="h-4 w-4 text-muted-foreground" />
                                <span className="ds-label text-foreground text-sm">
                                  {milestone.id === "m-feedback" ? "Submit draft for review" :
                                   milestone.id === "m-slides" ? "Upload slide deck" :
                                   "Document Vault"}
                                </span>
                              </div>
                              <span className="ds-caption text-muted-foreground">Required for this milestone</span>
                            </div>

                            {documents.filter(d => d.milestoneId === milestone.id).length > 0 ? (
                              <div className="space-y-2">
                                {documents.filter(d => d.milestoneId === milestone.id).map(doc => (
                                  <div key={doc.id} className="flex items-center justify-between rounded-md border border-border bg-background p-2 px-3">
                                    <div className="flex items-center gap-3">
                                      <div className={`p-1.5 rounded bg-secondary`}>
                                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                      </div>
                                      <div>
                                        <p className="ds-label text-sm text-foreground">{doc.name}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                          {doc.status === "approved" ? (
                                            <>
                                              <FileCheck2 className="h-3 w-3 text-green-500" />
                                              <span className="ds-caption text-green-600 font-medium">Approved</span>
                                            </>
                                          ) : doc.status === "rejected" ? (
                                            <>
                                              <AlertCircle className="h-3 w-3 text-red-500" />
                                              <span className="ds-caption text-red-600 font-medium">Changes requested</span>
                                            </>
                                          ) : (
                                            <>
                                              <Clock className="h-3 w-3 text-amber-500" />
                                              <span className="ds-caption text-amber-600 font-medium">Review pending</span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <button 
                                      className="p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                                      title="Download version"
                                    >
                                      <Download className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                                <button 
                                  onClick={() => {
                                    const name = prompt(`Enter document name (e.g. ${milestone.id === "m-slides" ? "Defense_Slides_v1.pptx" : milestone.id === "m-feedback" ? "Thesis_Draft_v1.pdf" : "Thesis_Proposal_v1.pdf"})`);
                                    if (name) uploadDocument(studentId, { name, type: "pdf", url: "#", milestoneId: milestone.id });
                                  }}
                                  className="w-full mt-2 py-2 rounded-md border border-border hover:bg-secondary transition-colors ds-caption text-muted-foreground flex items-center justify-center gap-2"
                                >
                                  <FileUp className="h-3.5 w-3.5" />
                                  Upload new version
                                </button>
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <button 
                                  onClick={() => {
                                    const name = prompt(`Enter document name (e.g. ${milestone.id === "m-slides" ? "Defense_Slides_v1.pptx" : milestone.id === "m-feedback" ? "Thesis_Draft_v1.pdf" : "Thesis_Proposal_v1.pdf"})`);
                                    if (name) uploadDocument(studentId, { name, type: "pdf", url: "#", milestoneId: milestone.id });
                                  }}
                                  className="inline-flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                                >
                                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                                    <FileUp className="h-5 w-5" />
                                  </div>
                                  <span className="ds-caption font-medium">
                                    {milestone.id === "m-feedback" ? "Upload draft for supervisor review" :
                                     milestone.id === "m-slides" ? "Upload presentation slides" :
                                     "Upload required artifact"}
                                  </span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Phase-specific resource links */}
                    {resources.length > 0 && (
                      <div className="mt-4 rounded-lg border border-border bg-secondary/20 p-4">
                        <h4 className="ds-label text-foreground flex items-center gap-2 mb-3">
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          {phase.id === "finalization" ? "Verification & quality tools" :
                           phase.id === "writing" ? "Writing resources & sample theses" :
                           "Research platforms & databases"}
                        </h4>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {resources.map((r, i) => (
                            <a
                              key={i}
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start gap-3 rounded-lg border border-border bg-background p-3 hover:border-primary/30 hover:shadow-sm transition-all text-left group"
                            >
                              <div className="flex h-7 w-7 items-center justify-center rounded bg-secondary flex-shrink-0 mt-0.5">
                                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="ds-label text-foreground group-hover:text-primary transition-colors">{r.label}</p>
                                <p className="ds-caption text-muted-foreground line-clamp-1">{r.description}</p>
                              </div>
                            </a>
                          ))}
                        </div>
                        {phase.id === "execution" && (
                          <button
                            onClick={() => navigate("/chat?q=" + encodeURIComponent("Help me proofread and review a section of my thesis draft for clarity, structure, and academic tone"))}
                            className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg border border-ai/30 bg-ai/5 text-ai ds-caption font-semibold hover:bg-ai/10 transition-all duration-200 w-full justify-center"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            Ask Ona to proofread your draft
                          </button>
                        )}
                      </div>
                    )}

                    {/* Relevant Knowledge Base Items */}
                    {allKbItems.filter(item => 
                      (item.scope === "global" || item.topicId === selectedTopicId) &&
                      ([
                        ["requirements", "faq"],
                        ["guidelines", "templates"],
                        ["resources", "guidelines"],
                        ["guidelines", "templates"],
                        ["requirements", "resources"],
                        ["guidelines", "faq"]
                      ][phaseIndex] || []).includes(item.category)
                    ).length > 0 && (
                      <div className="mt-4">
                        <h4 className="ds-label text-foreground flex items-center gap-2 mb-3">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          Helpful resources for this phase
                        </h4>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {allKbItems.filter(item => 
                            (item.scope === "global" || item.topicId === selectedTopicId) &&
                            ([
                              ["requirements", "faq"],
                              ["guidelines", "templates"],
                              ["resources", "guidelines"],
                              ["guidelines", "templates"],
                              ["requirements", "resources"],
                              ["guidelines", "faq"]
                            ][phaseIndex] || []).includes(item.category)
                          ).map(item => {
                            const CatIcon = categoryIcons[item.category];
                            return (
                              <button
                                key={item.id}
                                onClick={() => setSelectedKbItem(item)}
                                className="flex items-start gap-3 rounded-lg border border-border bg-background p-3 hover:border-muted-foreground/30 transition-colors text-left"
                              >
                                <div className="flex h-7 w-7 items-center justify-center rounded bg-secondary flex-shrink-0 mt-0.5">
                                  <CatIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="ds-label text-foreground mb-0.5">{item.title}</p>
                                  <p className="ds-caption text-muted-foreground line-clamp-2">{item.content}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* KB Item Modal */}
      {selectedKbItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-transparent backdrop-blur-sm" onClick={() => setSelectedKbItem(null)} />
          <div className="relative w-full max-w-lg rounded-xl border border-border bg-background shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="ds-badge px-2 py-0.5 rounded-full bg-secondary text-muted-foreground uppercase tracking-wider">{selectedKbItem.category}</span>
                {selectedKbItem.scope === "topic" && (
                  <span className="ds-badge px-2 py-0.5 rounded-full bg-foreground/10 text-foreground">Topic-specific</span>
                )}
              </div>
              <button
                onClick={() => setSelectedKbItem(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 scroll-area-content">
              <h2 className="ds-title-sm text-foreground mb-4">{selectedKbItem.title}</h2>
              <div className="ds-body text-foreground whitespace-pre-wrap leading-relaxed">
                {selectedKbItem.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
