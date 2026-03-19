import { useState, useRef, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useKnowledgeStore } from "@/stores/knowledgeStore";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  BookOpen,
  Send,
  User,
  MessagesSquare,
  AlertTriangle,
  Award,
  FileCheck,
  Calendar,
  UserPlus,
  FileUp,
  XCircle,
  Download,
  CalendarCheck2,
  FileText,
  FileCheck2,
  RefreshCw,
} from "lucide-react";
import { useThesisStore, type SupervisorMessage } from "@/stores/thesisStore";
import topics from "@/data/topics.json";
import supervisions from "@/data/supervisions.json";
import experts from "@/data/experts.json";
import companies from "@/data/companies.json";
import supervisorsData from "@/data/supervisors.json";



export function SupervisorStudentView() {
  const { studentId: urlStudentId } = useParams<{ studentId: string }>();
  const { getAllRelevantItems } = useKnowledgeStore();
  const { 
    studentId: storeStudentId,
    activeSupervisions,
    addSupervisorMessageToStudent,
    thesisContext,
    updateContext,
    submitFinalGrade,
    approveDocument,
    rejectDocument,
    updateMeetingStatus,
    cancelThesis,
  } = useThesisStore();
  
  const [newMessage, setNewMessage] = useState("");
  const [gradeInput, setGradeInput] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedNewSupervisor, setSelectedNewSupervisor] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const [searchParams] = useSearchParams();

  const student = activeSupervisions.find(s => s.id === urlStudentId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [student?.messages]);

  useEffect(() => {
    // If the URL has ?action=chat, auto-focus the chat field on mount
    if (searchParams.get("action") === "chat") {
      setTimeout(() => {
        chatInputRef.current?.focus();
        chatInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [searchParams]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !urlStudentId) return;
    addSupervisorMessageToStudent(urlStudentId, newMessage);
    setNewMessage("");
  };

  if (!student) {
    return (
      <div className="scroll-area">
        <div className="scroll-area-content">
          <p className="ds-body text-muted-foreground">Student not found.</p>
          <Link to="/supervisor" className="ds-small text-foreground underline">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  const kbItems = student ? getAllRelevantItems(student.topicId) : [];
  const totalMilestones = student?.phases.reduce((a, p) => a + p.milestones.length, 0) || 0;
  const doneMilestones = student?.phases.reduce((a, p) => a + p.milestones.filter((m: any) => m.completed).length, 0) || 0;

  // Generate dynamic supervisor action items based on student state
  const getSupervisorActions = () => {
    if (!student) return [];
    
    // In a production environment, 'thesisState' would be part of the student record.
    // We'll use progress as a proxy or assume the record in the store represents the state.
    if (student.progress === 100) return [];
    
    const actions = [];
    
    const pendingDocs = student.documents.filter(d => d.status === "pending");
    if (pendingDocs.length > 0) {
      actions.push({ 
        title: "Document Review", 
        desc: `You have ${pendingDocs.length} document${pendingDocs.length > 1 ? "s" : ""} pending review.`, 
        icon: FileUp, 
        color: "text-blue-500", 
        bg: "bg-blue-500/10 border-blue-500/20" 
      });
    }

    if (student.progress > 90) {
      actions.push({ title: "Final Review & Grading", desc: "Thesis is nearly complete. Prepare for the defense.", icon: FileCheck, color: "text-red-500", bg: "bg-red-500/10 border-red-500/20" });
    } else {
      actions.push({ title: "Check-in on Progress", desc: `Student is in the ${student.phases[student.currentPhase]?.title} phase.`, icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" });
    }
    
    return actions;
  };

  const actions = getSupervisorActions();

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
            <h1 className="ds-title-lg text-foreground">{student.name}</h1>
            <p className="ds-small text-muted-foreground">
              {student.degree} at {student.university}
            </p>
          </div>
        </div>

        {/* Overview cards */}
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border p-4">
            <p className="ds-badge text-muted-foreground mb-1">Progress</p>
            <p className="ds-title-md text-foreground">{student.progress}%</p>
            <p className="ds-caption text-muted-foreground">{doneMilestones} of {totalMilestones} milestones</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="ds-badge text-muted-foreground mb-1">Phase</p>
            <p className="ds-title-cards text-foreground">{student.phases[student.currentPhase]?.title}</p>
            <p className="ds-caption text-muted-foreground">Phase {student.currentPhase + 1} of {student.phases.length}</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="ds-badge text-muted-foreground mb-1">Timeline</p>
            <p className="ds-small text-foreground">Start: {student.startDate}</p>
            <p className="ds-small text-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Deadline: {student.deadline}
            </p>
          </div>
        </div>

        {/* Thesis info */}
        <div className="mb-6 rounded-lg border border-border p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="ds-badge text-muted-foreground mb-1">Topic</p>
              <h3 className="ds-title-cards text-foreground">{student.topic}</h3>
              <p className="ds-caption text-muted-foreground">{student.company}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <p className="ds-caption text-muted-foreground">Email</p>
              <p className="ds-small text-foreground">{student.email}</p>
            </div>
            <div>
              <p className="ds-caption text-muted-foreground">Supervisor</p>
              <p className="ds-small text-foreground">{student.supervisor}</p>
            </div>
          </div>
        </div>

        {/* Cancel / Rematch */}
        {student.progress < 90 && (
          <div className="mb-6">
            {!showCancelDialog ? (
              <button
                onClick={() => setShowCancelDialog(true)}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 ds-small text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Transfer supervision
              </button>
            ) : (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-5">
                <h3 className="ds-label text-foreground mb-1">Transfer this thesis to another supervisor</h3>
                <p className="ds-caption text-muted-foreground mb-4">
                  The student will be reassigned and notified. You will no longer supervise this thesis.
                </p>
                <label className="ds-badge text-muted-foreground block mb-1">New supervisor</label>
                <select
                  value={selectedNewSupervisor}
                  onChange={(e) => setSelectedNewSupervisor(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 ds-small text-foreground mb-4 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select a supervisor...</option>
                  {(supervisorsData as any[]).filter(s => s.id !== student.supervisor).map(s => (
                    <option key={s.id} value={s.id}>{s.title} {s.firstName} {s.lastName} — {s.researchInterests?.slice(0, 2).join(", ")}</option>
                  ))}
                </select>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowCancelDialog(false); setSelectedNewSupervisor(""); }}
                    className="flex-1 rounded-lg border border-border px-4 py-2 ds-label text-foreground hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (selectedNewSupervisor && urlStudentId) {
                        cancelThesis(urlStudentId, selectedNewSupervisor);
                        setShowCancelDialog(false);
                        setSelectedNewSupervisor("");
                      }
                    }}
                    disabled={!selectedNewSupervisor}
                    className="flex-1 rounded-lg bg-destructive text-white px-4 py-2 ds-label hover:opacity-90 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Confirm transfer
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Items */}
        {actions.length > 0 && (
          <div className="mb-8">
            <h2 className="ds-title-sm text-foreground mb-3">Action Items</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {actions.map((action, i) => (
                <div key={i} className={`rounded-xl border p-4 ${action.bg}`}>
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-lg p-2 bg-background border border-border ${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="ds-label text-foreground">{action.title}</h3>
                      <p className="ds-caption text-muted-foreground mt-1">{action.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grading Interface */}
        {(student.progress > 90) && (
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <h2 className="ds-title-sm text-foreground mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              {student.progress === 100 ? "Final Assessment" : "Grade Thesis"}
            </h2>
            {student.progress === 100 ? (
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ds-title-lg">
                  {/* In a real app, grade would be on the student record */}
                  1.0
                </div>
                <div>
                  <p className="ds-label text-foreground">Grade officially submitted</p>
                  <p className="ds-caption text-muted-foreground">The journey is successfully concluded.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="ds-small text-muted-foreground">
                  The student has submitted their work. After the defense, enter the final grade below.
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    placeholder="e.g. 1.0 or 5.5"
                    className="h-10 w-32 rounded-lg border border-border bg-background px-3 ds-label text-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    onClick={() => submitFinalGrade(student.id, gradeInput)}
                    disabled={!gradeInput}
                    className="h-10 rounded-lg bg-foreground text-background px-5 ds-label hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    Submit Grade
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Co-Supervisor Integration */}
        {student.id === storeStudentId && (
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <h2 className="ds-title-sm text-foreground mb-4 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-muted-foreground" />
              Co-Supervisor / Industry Expert
            </h2>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[240px]">
                <p className="ds-caption text-muted-foreground mb-2">Assign an external expert for this thesis</p>
                <select 
                  value={thesisContext.coSupervisorId || ""}
                  onChange={(e) => updateContext({ coSupervisorId: e.target.value })}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 ds-label text-foreground focus:border-primary focus:outline-none appearance-none"
                >
                  <option value="">No co-supervisor assigned</option>
                  {experts.map(e => (
                    <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({companies.find(c => c.id === e.companyId)?.name})</option>
                  ))}
                </select>
              </div>
              {thesisContext.coSupervisorId && (
                <div className="flex h-10 items-center px-4 rounded-lg bg-secondary ds-badge text-foreground italic">
                   Shared access enabled
                </div>
              )}
            </div>
          </div>
        )}

        {/* Document Approvals */}
        {student.documents.length > 0 && (
          <div className="mb-8">
            <h2 className="ds-title-sm text-foreground mb-3 flex items-center gap-2">
              <FileUp className="h-5 w-5 text-muted-foreground" />
              Document Approvals
            </h2>
            <div className="space-y-3">
              {student.documents.map(doc => (
                <div key={doc.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="ds-label text-foreground">{doc.name}</p>
                        <p className="ds-caption text-muted-foreground">Version from {new Date(doc.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.status === "pending" ? (
                        <>
                          <button 
                            onClick={() => approveDocument(student.id, doc.id)}
                            className="flex h-9 px-3 items-center gap-1.5 rounded-lg bg-primary text-primary-foreground ds-caption font-medium hover:opacity-90"
                          >
                            <CheckCircle2 className="h-4 w-4" /> Approve
                          </button>
                          <button 
                            onClick={() => rejectDocument(student.id, doc.id)}
                            className="flex h-9 px-3 items-center gap-1.5 rounded-lg border border-border bg-background text-foreground ds-caption font-medium hover:bg-accent"
                          >
                            <XCircle className="h-4 w-4" /> Request Changes
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border">
                          {doc.status === "approved" ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="ds-caption font-medium uppercase tracking-wider">{doc.status}</span>
                        </div>
                      )}
                      <button className="p-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors">
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meetings & Sync */}
        <div className="mb-8">
          <h2 className="ds-title-sm text-foreground mb-3 flex items-center gap-2">
            <CalendarCheck2 className="h-5 w-5 text-muted-foreground" />
            Meetings & Sync Sessions
          </h2>
          <div className="rounded-xl border border-border bg-card p-5">
            {student.meetings.length === 0 ? (
              <p className="ds-small text-muted-foreground text-center py-4">No meetings scheduled yet.</p>
            ) : (
              <div className="space-y-4">
                {student.meetings.map(m => (
                  <div key={m.id} className="flex items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="ds-label text-foreground">{m.topic}</p>
                      <p className="ds-caption text-muted-foreground flex items-center gap-1.5 mt-1">
                        <Clock className="h-3 w-3" /> {m.date}
                      </p>
                      {m.protocol && (
                        <div className="mt-3 p-3 rounded-lg bg-secondary/30 border border-border">
                          <p className="ds-caption text-muted-foreground font-medium mb-1 uppercase tracking-tighter">Meeting Minutes</p>
                          <p className="ds-small text-foreground line-clamp-2 italic">"{m.protocol}"</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`ds-badge px-2 py-0.5 rounded-full border ${
                        m.status === "scheduled" ? "bg-blue-500/10 border-blue-500/20 text-blue-600" :
                        m.status === "completed" ? "bg-green-500/10 border-green-500/20 text-green-600" :
                        "bg-amber-500/10 border-amber-500/20 text-amber-600"
                      }`}>
                        {m.status}
                      </span>
                      {m.status === "requested" && (
                        <button 
                          onClick={() => updateMeetingStatus(student.id, m.id, "scheduled")}
                          className="ds-caption text-primary hover:underline"
                        >
                          Confirm Date
                        </button>
                      )}
                      {m.status === "scheduled" && (
                        <button 
                          onClick={() => {
                            const note = prompt("Enter meeting protocol/summary:");
                            if (note) updateMeetingStatus(student.id, m.id, "completed", note);
                          }}
                          className="ds-caption text-primary hover:underline"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messaging Interface */}
        <div className="mb-6 rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3 bg-secondary/30">
              <MessagesSquare className="h-4 w-4 text-primary" />
              <h2 className="ds-title-sm text-foreground">Direct Messages</h2>
            </div>
            <div className="h-80 overflow-y-auto p-4 scroll-area-content bg-background/50 flex flex-col gap-4">
              {student.messages.length === 0 ? (
                <p className="ds-small text-muted-foreground text-center my-auto">No messages yet. Send a message to start the conversation.</p>
              ) : (
                student.messages.map((msg: SupervisorMessage) => (
                  <div key={msg.id} className={`flex ${msg.senderRole === "supervisor" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex items-start gap-3 max-w-[85%] ${msg.senderRole === "supervisor" ? "flex-row-reverse" : ""}`}>
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0 mt-0.5 ${
                        msg.senderRole === "supervisor" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                      }`}>
                        {msg.senderRole === "supervisor" ? <MessagesSquare className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </div>
                      <div className={`flex flex-col ${msg.senderRole === "supervisor" ? "items-end" : "items-start"}`}>
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span className="ds-caption text-foreground">{msg.senderRole === "supervisor" ? "You" : student.name}</span>
                          <span className="ds-caption text-muted-foreground">
                            {new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(msg.timestamp)}
                          </span>
                        </div>
                        <div className={`rounded-2xl px-4 py-2.5 ds-small shadow-sm ${
                          msg.senderRole === "supervisor"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted border border-border text-foreground"
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border px-4 py-3 bg-card">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  ref={chatInputRef as any}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${student.name.split(" ")[0]}...`}
                  className="flex-1 rounded-lg border border-input bg-background px-4 py-2 ds-small text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors duration-150 hover:opacity-90 disabled:opacity-30 flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

        {/* Journey progress */}
        <div className="mb-6">
          <h2 className="ds-title-sm text-foreground mb-3">Journey progress</h2>
          <div className="space-y-2">
            {student.phases.map((phase, pi) => {
              const phaseDone = phase.milestones.filter((m: any) => m.completed).length;
              const phaseTotal = phase.milestones.length;
              const phaseComplete = phaseDone === phaseTotal;
              return (
                <div key={pi} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full ds-badge ${
                        phaseComplete ? "bg-foreground text-background" : pi === student.currentPhase ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                      }`}>{pi + 1}</span>
                      <h3 className="ds-label text-foreground">{phase.title}</h3>
                      {phaseComplete && <CheckCircle2 className="h-3.5 w-3.5 text-foreground" />}
                    </div>
                    <span className="ds-caption text-muted-foreground">{phaseDone}/{phaseTotal}</span>
                  </div>
                  <div className="space-y-1 ml-8">
                    {phase.milestones.map((m: any, mi: number) => (
                      <div key={mi} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {m.completed ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-foreground flex-shrink-0" />
                          ) : (
                            <Circle className="h-3.5 w-3.5 text-muted-foreground/40 flex-shrink-0" />
                          )}
                          <span className={`ds-small ${m.completed ? "text-muted-foreground" : "text-foreground"}`}>{m.title}</span>
                        </div>
                        {m.date && <span className="ds-caption text-muted-foreground">{m.date}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Relevant KB items */}
        {kbItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="ds-title-sm text-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Relevant knowledge base items
              </h2>
              <Link to="/supervisor/knowledge-base" className="ds-small text-muted-foreground hover:text-foreground transition-colors duration-150">
                Manage
              </Link>
            </div>
            <div className="space-y-1.5">
              {kbItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 ds-small text-muted-foreground">
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                  <span className="text-foreground">{item.title}</span>
                  <span className="ds-badge px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{item.scope}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Supervisor notes */}
        {student.notes && (
          <div className="mb-6 rounded-lg border border-border p-4">
            <p className="ds-badge text-muted-foreground mb-1">Your notes</p>
            <p className="ds-small text-foreground">{student.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
