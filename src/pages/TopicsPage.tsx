import { useState, useMemo } from "react";
import { useThesisStore } from "@/stores/thesisStore";
import {
  Search,
  Briefcase,
  GraduationCap,
  X,
  CheckCircle2,
  ArrowRight,
  Wand2,
  Loader2,
  Send,
  Clock,
} from "lucide-react";
import topics from "@/data/topics.json";
import companies from "@/data/companies.json";
import fields from "@/data/fields.json";
import supervisors from "@/data/supervisors.json";
import type { Topic, Company, Field, Supervisor } from "@/data/types";

const typedTopics = topics as Topic[];
const typedCompanies = companies as Company[];
const typedFields = fields as Field[];
const typedSupervisors = supervisors as Supervisor[];

function getCompanyName(id: string | null) {
  if (!id) return null;
  return typedCompanies.find((c) => c.id === id)?.name ?? null;
}

function getFieldName(id: string) {
  return typedFields.find((f) => f.id === id)?.name ?? id;
}

function getSupervisor(id: string | null) {
  if (!id) return null;
  return typedSupervisors.find((s) => s.id === id) ?? null;
}

// Simple field-based match scoring
function getMatchScore(topic: Topic): number {
  const studentFields = ["field-01", "field-03"]; // CS and Data Science
  const fieldMatch = topic.fieldIds.filter((f) => studentFields.includes(f)).length;
  const base = 30 + fieldMatch * 25;
  // Add some deterministic variation
  const hash = topic.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return Math.min(98, base + (hash % 20));
}

export function TopicsPage() {
  const { thesisState, selectedTopicId, applyForTopic, clearTopic, skills, studentName } = useThesisStore();
  const [search, setSearch] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedSource, setSelectedSource] = useState<"all" | "company" | "university">("all");
  const [detailTopicId, setDetailTopicId] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [aiWriting, setAiWriting] = useState(false);

  const filteredTopics = useMemo(() => {
    let result = typedTopics;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }
    if (selectedField !== "all") {
      result = result.filter((t) => t.fieldIds.includes(selectedField));
    }
    if (selectedSource === "company") {
      result = result.filter((t) => t.companyId);
    } else if (selectedSource === "university") {
      result = result.filter((t) => t.universityId && !t.companyId);
    }
    // Sort by match score descending
    return result.sort((a, b) => getMatchScore(b) - getMatchScore(a));
  }, [search, selectedField, selectedSource]);

  const detailTopic = detailTopicId ? typedTopics.find((t) => t.id === detailTopicId) : null;
  const isSelected = (id: string) => selectedTopicId === id;

  const uniqueFields = useMemo(() => {
    const fieldSet = new Set<string>();
    typedTopics.forEach((t) => t.fieldIds.forEach((f) => fieldSet.add(f)));
    return Array.from(fieldSet);
  }, []);

  // Early returns after all hooks
  if (thesisState !== "exploring" && thesisState !== "topic_selected" && thesisState !== "application_pending") {
    return (
      <div className="scroll-area">
        <div className="scroll-area-content max-w-3xl mx-auto text-center py-12">
          <p className="ds-body text-foreground mb-2">Topic locked in</p>
          <p className="ds-small text-muted-foreground">
            You have already registered your thesis. Focus on your journey milestones.
          </p>
        </div>
      </div>
    );
  }
  
  if (thesisState === "application_pending") {
    const pendingTopic = selectedTopicId ? typedTopics.find(t => t.id === selectedTopicId) : null;
    return (
      <div className="scroll-area">
        <div className="scroll-area-content max-w-3xl mx-auto py-12">
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-4">
              <Send className="h-8 w-8" />
            </div>
            <h2 className="ds-title-sm text-foreground mb-2">Application sent</h2>
            {pendingTopic && (
              <p className="ds-body text-foreground mb-1">{pendingTopic.title}</p>
            )}
            <p className="ds-caption text-muted-foreground mb-6">
              Your supervisor is reviewing your application.
            </p>
            <div className="flex items-center justify-center gap-6 mb-6">
              {["Sent", "Under Review", "Decision"].map((label, i) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    i === 0 ? "border-primary bg-primary text-primary-foreground" :
                    i === 1 ? "border-primary bg-card text-primary" :
                    "border-border bg-secondary text-muted-foreground/40"
                  }`}>
                    {i === 0 ? <CheckCircle2 className="h-4 w-4" /> : i === 1 ? <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" /> : <span className="ds-badge">3</span>}
                  </div>
                  <span className={`ds-caption ${i <= 1 ? "text-foreground font-medium" : "text-muted-foreground"}`}>{label}</span>
                  {i < 2 && <div className={`w-8 h-0.5 ${i === 0 ? "bg-primary" : "bg-border"}`} />}
                </div>
              ))}
            </div>
            <p className="ds-caption text-muted-foreground flex items-center justify-center gap-1.5">
              <Clock className="h-3 w-3" /> Supervisors typically respond within 2–5 business days
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scroll-area">
      <div className="scroll-area-content max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="ds-title-lg text-foreground">Discover Topics</h1>
          <p className="mt-1 ds-body text-muted-foreground">
            {filteredTopics.length} thesis topics from companies and universities.
          </p>
        </div>

        {/* Selected topic banner */}
        {selectedTopicId && thesisState === "topic_selected" && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-foreground bg-foreground/5 p-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground flex-shrink-0" />
              <span className="ds-label text-foreground">
                Topic selected: {typedTopics.find((t) => t.id === selectedTopicId)?.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearTopic}
                className="ds-small text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                Change
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 ds-small text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 ds-small text-foreground"
          >
            <option value="all">All Fields</option>
            {uniqueFields.map((fid) => (
              <option key={fid} value={fid}>{getFieldName(fid)}</option>
            ))}
          </select>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value as "all" | "company" | "university")}
            className="rounded-lg border border-input bg-background px-3 py-2 ds-small text-foreground"
          >
            <option value="all">All Sources</option>
            <option value="company">Companies</option>
            <option value="university">Universities</option>
          </select>
        </div>

        {/* Topic grid */}
        <div className="grid-3-col">
          {filteredTopics.map((topic) => {
            const company = getCompanyName(topic.companyId);
            const matchScore = getMatchScore(topic);
            const selected = isSelected(topic.id);

            return (
              <button
                key={topic.id}
                onClick={() => setDetailTopicId(topic.id)}
                className={`group rounded-lg border p-4 text-left transition-all duration-200 hover:shadow-lg ${
                  selected ? "border-foreground" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {company ? (
                      <>
                        <Briefcase className="h-3 w-3 text-muted-foreground" />
                        <span className="ds-badge text-muted-foreground">{company}</span>
                      </>
                    ) : (
                      <>
                        <GraduationCap className="h-3 w-3 text-muted-foreground" />
                        <span className="ds-badge text-muted-foreground">University</span>
                      </>
                    )}
                  </div>
                  <span className={`ds-badge px-2 py-0.5 rounded-full ${
                    matchScore >= 85
                      ? "bg-foreground text-background"
                      : matchScore >= 70
                      ? "bg-secondary text-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    {matchScore}% match
                  </span>
                </div>
                <h3 className="ds-label text-foreground mb-1.5 line-clamp-2 group-hover:text-primary transition-colors duration-150">
                  {topic.title}
                </h3>
                <p className="ds-caption text-muted-foreground line-clamp-2 mb-2">{topic.description}</p>
                <div className="flex flex-wrap gap-1">
                  {topic.degrees.slice(0, 1).map((d: string) => (
                    <span key={d} className="ds-caption px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{d}</span>
                  ))}
                  {topic.fieldIds.slice(0, 2).map((fid) => (
                    <span key={fid} className="ds-caption px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{getFieldName(fid)}</span>
                  ))}
                  {topic.employmentType && (
                    <span className="ds-caption px-2 py-0.5 rounded-full bg-foreground/10 text-foreground">{topic.employmentType.replace(/_/g, " ")}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      {detailTopic && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-transparent backdrop-blur-sm" onClick={() => setDetailTopicId(null)} />
          <div className="relative z-10 w-full max-w-lg bg-background border-l border-border overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="ds-caption text-muted-foreground">Topic details</span>
                <button onClick={() => { setDetailTopicId(null); setShowContactForm(false); setContactMessage(""); }} className="text-muted-foreground hover:text-foreground transition-colors duration-150">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <h2 className="ds-title-sm text-foreground mb-2">{detailTopic.title}</h2>
              <div className="flex items-center gap-2 mb-4">
                {getCompanyName(detailTopic.companyId) && (
                  <span className="ds-badge text-muted-foreground flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />{getCompanyName(detailTopic.companyId)}
                  </span>
                )}
                <span className={`ds-badge px-2 py-0.5 rounded-full ${
                  getMatchScore(detailTopic) >= 85 ? "bg-foreground text-background" : "bg-secondary text-foreground"
                }`}>
                  {getMatchScore(detailTopic)}% match
                </span>
              </div>
              <p className="ds-body text-foreground mb-4">{detailTopic.description}</p>

              {/* Fields */}
              <div className="mb-4">
                <p className="ds-label text-muted-foreground mb-1.5">Fields</p>
                <div className="flex flex-wrap gap-1.5">
                  {detailTopic.fieldIds.map((fid) => (
                    <span key={fid} className="ds-badge px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">{getFieldName(fid)}</span>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-4">
                <p className="ds-label text-muted-foreground mb-1.5">Requirements</p>
                <div className="flex flex-wrap gap-1.5">
                  {detailTopic.degrees.map((d: string) => (
                    <span key={d} className="ds-badge px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">{d}</span>
                  ))}
                  {detailTopic.employmentType && (
                    <span className="ds-badge px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">{detailTopic.employmentType.replace(/_/g, " ")}</span>
                  )}
                </div>
              </div>

              {/* Supervisor */}
              {detailTopic.supervisorIds.length > 0 && (
                <div className="mb-4">
                  <p className="ds-label text-muted-foreground mb-1.5">Supervisor</p>
                  {detailTopic.supervisorIds.map((sid) => {
                    const sup = getSupervisor(sid);
                    if (!sup) return null;
                    return (
                      <div key={sid} className="flex items-center gap-2 mb-1.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary ds-caption text-muted-foreground">
                          {sup.firstName[0]}{sup.lastName[0]}
                        </div>
                        <div>
                          <p className="ds-label text-foreground">{sup.title} {sup.firstName} {sup.lastName}</p>
                          <p className="ds-caption text-muted-foreground">{sup.researchInterests?.slice(0, 3).join(", ")}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Actions & Contact Form */}
              <div className="mt-6 flex flex-col gap-3">
                {isSelected(detailTopic.id) ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => clearTopic()}
                      className="flex-1 rounded-lg border border-border px-4 py-2.5 ds-label text-foreground transition-colors duration-150 hover:bg-accent"
                    >
                      Cancel Application
                    </button>
                    <button
                      onClick={() => { setDetailTopicId(null); setShowContactForm(false); }}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 ds-label transition-colors duration-150 hover:opacity-90"
                    >
                      Continue <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : showContactForm ? (
                  <div className="rounded-lg border border-border p-4 bg-secondary/30 mt-2">
                    <h3 className="ds-label text-foreground mb-2">Contact Supervisor</h3>
                    <p className="ds-caption text-muted-foreground mb-3">Introduce yourself and explain why you're a good fit for this topic.</p>
                    <button
                      onClick={() => {
                        setAiWriting(true);
                        setTimeout(() => {
                          const sup = detailTopic.supervisorIds.length > 0 ? getSupervisor(detailTopic.supervisorIds[0]) : null;
                          const supName = sup ? `${sup.title} ${sup.lastName}` : "Professor";
                          const studentSkills = skills.slice(0, 3).join(", ");
                          setContactMessage(`Dear ${supName},\n\nI am ${studentName}, and I am writing to express my strong interest in your thesis topic "${detailTopic.title}". My background in ${studentSkills} aligns well with the requirements of this project.\n\nI believe my technical expertise and research ambition make me a strong candidate. I would welcome the opportunity to discuss how I can contribute to this research.\n\nBest regards,\n${studentName}`);
                          setAiWriting(false);
                        }, 1200);
                      }}
                      disabled={aiWriting}
                      className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-lg border border-ai/30 bg-ai/5 text-ai ds-caption font-semibold hover:bg-ai/10 transition-all duration-200 disabled:opacity-50"
                    >
                      {aiWriting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
                      {aiWriting ? "Writing..." : "Write with AI"}
                    </button>
                    <textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Dear Professor..."
                      rows={6}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 ds-small text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none mb-3"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowContactForm(false)}
                        className="flex-1 rounded-lg border border-border px-4 py-2 ds-label text-foreground transition-colors duration-150 hover:bg-accent"
                      >
                        Back
                      </button>
                      <button
                         onClick={() => {
                          applyForTopic(detailTopic.id, contactMessage);
                          setDetailTopicId(null);
                          setShowContactForm(false);
                          setContactMessage("");
                        }}
                        disabled={contactMessage.trim().length === 0}
                        className="flex-1 rounded-lg bg-primary text-primary-foreground px-4 py-2 ds-label transition-colors duration-150 hover:opacity-90 disabled:opacity-30 flex items-center justify-center gap-2"
                      >
                        Send Application
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full rounded-lg bg-primary text-primary-foreground px-4 py-2.5 ds-label transition-colors duration-150 hover:opacity-90"
                  >
                    Apply & Contact Supervisor
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
