import { Link } from "react-router-dom";
import { useKnowledgeStore } from "@/stores/knowledgeStore";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Users,
  Check,
  X,
  MessagesSquare,
} from "lucide-react";
import { useThesisStore } from "@/stores/thesisStore";
import topics from "@/data/topics.json";
import companies from "@/data/companies.json";
import supervisions from "@/data/supervisions.json";

function getCompanyName(id: string | null) {
  if (!id) return null;
  return (companies as any[]).find((c) => c.id === id)?.name ?? null;
}

export function SupervisorDashboard() {
  const { items } = useKnowledgeStore();
  const { 
    pendingApplications,
    activeSupervisions,
    rejectionHistory,
    acceptApplication, 
    rejectApplication,
  } = useThesisStore();
  
  const globalItems = items.filter((i) => i.scope === "global");
  const topicItems = items.filter((i) => i.scope === "topic");

  const displayStudents = activeSupervisions.map(s => ({
    id: s.id,
    name: s.name,
    topic: s.topic,
    company: s.company || "University",
    phase: s.currentPhase,
    phaseLabel: s.phases[s.currentPhase]?.shortTitle || "Orientation",
    progress: s.progress,
    lastActivity: s.lastActivity,
    needsAttention: s.needsAttention,
  }));

  const needsAttentionList = displayStudents.filter((s) => s.needsAttention);

  const aggregatedActions = [
    ...pendingApplications.map(app => ({ student: app.studentName, title: "Review Application", color: "text-amber-500", type: "app", id: app.id })),
    ...activeSupervisions.flatMap(s => s.documents.filter(d => d.status === "pending").map(d => ({ student: s.name, title: `Approve ${d.name}`, color: "text-blue-500", type: "student", id: s.id }))),
    ...displayStudents.filter(s => s.needsAttention).map(s => ({ student: s.name, title: "Thesis Action Required", color: "text-red-500", type: "student", id: s.id }))
  ];

  return (
    <div className="scroll-area">
      <div className="scroll-area-content max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="ds-title-lg text-foreground">Supervisor Dashboard</h1>
          <p className="mt-1 ds-body text-muted-foreground">
            Overview of your active thesis supervisions and knowledge base.
          </p>
        </div>

        {/* Incoming Applications */}
        {pendingApplications.length > 0 && (
          <div className="mb-6">
            <h2 className="ds-title-sm text-foreground mb-3 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">{pendingApplications.length}</span>
              Incoming Applications
            </h2>
            <div className="space-y-4">
              {pendingApplications.map((app) => {
                const topic = (topics as any[]).find(t => t.id === app.topicId);
                return (
                  <div key={app.id} className="rounded-lg border border-primary/50 bg-primary/5 p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="ds-label text-foreground">{app.studentName}</p>
                          <span className="ds-caption text-muted-foreground">applied for</span>
                        </div>
                        <h3 className="ds-title-cards text-foreground">{topic?.title}</h3>
                        {topic?.companyId && (
                          <p className="ds-caption text-muted-foreground mt-0.5">{getCompanyName(topic.companyId)}</p>
                        )}
                      </div>
                    </div>
                    <div className="mb-5 rounded-md bg-background border border-border p-4">
                      <p className="ds-caption text-muted-foreground mb-2">Message from student:</p>
                      <p className="ds-small text-foreground italic">"{app.message}"</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => acceptApplication(app.id)}
                        className="flex items-center justify-center gap-2 rounded-lg bg-foreground text-background px-4 py-2 ds-label transition-colors duration-150 hover:bg-foreground/90"
                      >
                        <Check className="h-4 w-4" /> Accept
                      </button>
                      <button
                        onClick={() => rejectApplication(app.id)}
                        className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 ds-label text-foreground transition-colors duration-150 hover:bg-accent hover:text-destructive"
                      >
                        <X className="h-4 w-4" /> Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rejection History */}
        {rejectionHistory.length > 0 && (
          <div className="mb-6">
            <h2 className="ds-title-sm text-foreground mb-3 flex items-center gap-2">
              <X className="h-4 w-4 text-muted-foreground" />
              Rejection History
            </h2>
            <div className="space-y-2">
              {rejectionHistory.map((rej, i) => {
                const topic = (topics as any[]).find(t => t.id === rej.topicId);
                return (
                  <div key={i} className="rounded-lg border border-border bg-secondary/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="ds-label text-foreground">{topic?.title || "Unknown Topic"}</h3>
                      <span className="ds-caption text-muted-foreground">
                        {new Date(rej.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="ds-caption text-muted-foreground italic">"{rej.message}"</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="ds-badge text-muted-foreground">Active students</span>
            </div>
            <p className="ds-title-md text-foreground">{displayStudents.length}</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="ds-badge text-muted-foreground">Knowledge base items</span>
            </div>
            <p className="ds-title-md text-foreground">{items.length}</p>
            <p className="ds-caption text-muted-foreground">{globalItems.length} shared, {topicItems.length} topic-specific</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="ds-badge text-muted-foreground">Needs attention</span>
            </div>
            <p className="ds-title-md text-foreground">{needsAttentionList.length}</p>
          </div>
        </div>

        {/* aggregated Actions */}
        {aggregatedActions.length > 0 && (
          <div className="mb-6">
            <h2 className="ds-title-sm text-foreground mb-3">Priority Actions</h2>
            <div className="grid gap-2">
              {aggregatedActions.map((action, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${action.color.replace("text-", "bg-")}`} />
                    <p className="ds-small text-foreground"><span className="font-semibold">{action.student}</span>: {action.title}</p>
                  </div>
                  <button className="ds-caption text-primary hover:underline">Start Review</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Student list */}
        <div className="mb-6">
          <h2 className="ds-title-sm text-foreground mb-3">Active supervisions</h2>
          <div className="space-y-3">
            {displayStudents.map((student) => (
              <div
                key={student.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-md hover:border-primary/20"
              >
                <Link to={`/supervisor/student/${student.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ds-label flex-shrink-0">
                    {student.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="ds-label text-foreground group-hover:text-primary transition-colors duration-150">{student.name}</p>
                      <span className={`ds-badge px-2.5 py-0.5 rounded-full ${
                        student.progress >= 60 ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                      }`}>
                        {student.phaseLabel}
                      </span>
                    </div>
                    <p className="ds-caption text-foreground truncate font-medium">{student.topic}</p>
                    <p className="ds-caption text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Clock className="h-3 w-3" /> Last active {student.lastActivity}
                    </p>
                  </div>
                </Link>
                
                <div className="flex items-center gap-4 sm:border-l sm:border-border sm:pl-4">
                  <div className="w-24 text-right">
                    <div className="flex items-center justify-between mb-1">
                      <span className="ds-caption text-muted-foreground font-medium">Progress</span>
                      <span className="ds-label text-foreground">{student.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                  </div>
                  <Link
                    to={`/supervisor/student/${student.id}?action=chat`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all flex-shrink-0"
                    title={`Message ${student.name}`}
                  >
                    <MessagesSquare className="h-4 w-4" />
                  </Link>
                  <Link
                    to={`/supervisor/student/${student.id}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground hover:bg-foreground hover:text-background transition-all flex-shrink-0"
                    title="View Details"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Knowledge base link */}
        <div>
          <Link
            to="/supervisor/knowledge-base"
            className="group flex items-center justify-between rounded-lg border border-border p-5 transition-all duration-200 hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary flex-shrink-0">
                <BookOpen className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <h3 className="ds-title-cards text-foreground group-hover:text-primary transition-colors duration-150">Knowledge Base</h3>
                <p className="ds-small text-muted-foreground">
                  Manage guidelines, requirements, and resources that students and Ona can access.
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </div>
  );
}
