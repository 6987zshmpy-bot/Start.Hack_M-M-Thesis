import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { 
  ThesisPhase, 
  ChatMessage, 
  ThesisContext,
  ThesisDocument,
  ThesisMeeting,
  SystemNotification,
  Degree
} from "@/data/types";

import supervisions from "@/data/supervisions.json";
import topics from "@/data/topics.json";
import companies from "@/data/companies.json";
import { KnowledgeInjectionService } from "@/services/KnowledgeInjectionService";

// Thesis lifecycle states - progressive flow
export type ThesisState =
  | "exploring"       // Browsing topics, no commitment
  | "application_pending" // Sent application to supervisor
  | "topic_selected"  // Supervisor accepted
  | "registered"      // Formally registered thesis with supervisor
  | "planning"        // Working on methodology, timeline, expose
  | "executing"       // Conducting research, gathering data
  | "writing"         // Drafting thesis document
  | "submitted"       // Handed in
  | "defense_prep"    // Preparing for oral defense
  | "graded";         // Final grade received, journey complete

export interface RejectionRecord {
  topicId: string;
  message: string;
  timestamp: number;
}

export interface SupervisorMessage {
  id: string;
  senderId: string;
  senderRole: "student" | "supervisor" | "assistant";
  text: string;
  timestamp: number;
}

export interface PendingApplication {
  id: string;
  studentId: string;
  studentName: string;
  topicId: string;
  message: string;
  timestamp: number;
}

export interface ManagedSupervision {
  id: string;
  name: string;
  email: string;
  degree: string;
  university: string;
  topicId: string;
  topic: string;
  company: string;
  supervisor: string;
  startDate: string;
  deadline: string;
  currentPhase: number;
  phases: ThesisPhase[];
  progress: number;
  lastActivity: string;
  needsAttention: boolean;
  notes?: string;
  documents: ThesisDocument[];
  meetings: ThesisMeeting[];
  messages: SupervisorMessage[];
}

export type UserRole = "student" | "supervisor" | "company";

const defaultPhases: ThesisPhase[] = [
  {
    id: "orientation",
    title: "Orientation and Setup",
    shortTitle: "Orientation",
    description: "Clarify requirements, set up your tools, and align with your supervisor.",
    weeks: "Weeks 1 to 4",
    milestones: [
      { id: "m-formal", title: "Check formal requirements", tasks: ["Read thesis handbook (see Knowledge Base)", "Note submission deadline", "Clarify citation style and formatting", "Check mandatory elements"], completed: false },
      { id: "m-align", title: "Align expectations with supervisor", tasks: ["Clarify meeting frequency and format", "Agree on communication channel", "Discuss grading criteria", "Set first milestone deadline"], completed: false },
      { id: "m-register", title: "Complete registration", tasks: ["Submit registration form", "Get required signatures", "Store admin documents"], completed: false },
      { id: "m-tooling", title: "Set up writing tools", tasks: ["Choose writing tool (Word or LaTeX)", "Set up reference manager (Zotero, Mendeley)", "Organize file structure and backups"], completed: false },
    ],
  },
  {
    id: "planning",
    title: "Academic Planning",
    shortTitle: "Planning",
    description: "Turn an idea into a researchable, doable thesis plan.",
    weeks: "Weeks 2 to 8",
    milestones: [
      { id: "m-topic", title: "Define and narrow topic", tasks: ["Choose area of interest", "Make topic specific and manageable", "Verify literature exists"], completed: false },
      { id: "m-rq", title: "Formulate research question", tasks: ["Write main research question", "Derive sub-questions", "Align with objective"], completed: false },
      { id: "m-lit", title: "Initial literature search", tasks: ["Search databases (Scholar, Semantic Scholar)", "Collect key sources", "Organize in reference manager"], completed: false },
      { id: "m-method", title: "Define methodology", tasks: ["Choose approach (qualitative / quantitative / mixed)", "Define data basis", "Clarify ethics and privacy"], completed: false },
      { id: "m-expose", title: "Create expose and timeline", tasks: ["Summarize problem and objective", "Draft outline", "Set internal deadlines"], completed: false, requiredDocument: true },
    ],
  },
  {
    id: "execution",
    title: "Research and Execution",
    shortTitle: "Execution",
    description: "Build the scientific foundation and produce results.",
    weeks: "Weeks 6 to 20",
    milestones: [
      { id: "m-litreview", title: "Deep literature review", tasks: ["Read key sources in full", "Extract theories and methods", "Map to thesis chapters"], completed: false },
      { id: "m-setup", title: "Prepare materials and data", tasks: ["Gather datasets", "Prepare interviews or experiments", "Set up version control"], completed: false },
      { id: "m-execute", title: "Conduct analysis", tasks: ["Collect and clean data", "Implement model or prototype", "Document intermediate results"], completed: false },
    ],
  },
  {
    id: "writing",
    title: "Writing Phase",
    shortTitle: "Writing",
    description: "Draft the thesis sections with clear argument and evidence.",
    weeks: "Weeks 16 to 24",
    milestones: [
      { id: "m-write-method", title: "Write methodology chapter", tasks: ["Explain procedure", "Describe data basis", "Justify methods"], completed: false },
      { id: "m-write-results", title: "Write results chapter", tasks: ["Present findings objectively", "Use tables and figures", "Link to research question"], completed: false },
      { id: "m-write-theory", title: "Write theory chapter", tasks: ["Define concepts", "Describe state of research", "Integrate citations"], completed: false },
      { id: "m-write-disc", title: "Write discussion", tasks: ["Interpret findings", "Compare with literature", "Discuss limitations"], completed: false },
      { id: "m-write-intro", title: "Write introduction and conclusion", tasks: ["Frame the problem", "Present objective and research question", "Summarize and outlook"], completed: false },
      { id: "m-write-abstract", title: "Write abstract", tasks: ["Summarize everything in roughly 250 words"], completed: false, requiredDocument: true },
    ],
  },
  {
    id: "finalization",
    title: "Revision and Submission",
    shortTitle: "Submission",
    description: "Polish, validate, and submit with confidence.",
    weeks: "Weeks 22 to 24",
    milestones: [
      { id: "m-citations", title: "Check sources and citations", tasks: ["Verify all references", "Check citation consistency", "Ensure bibliography complete"], completed: false },
      { id: "m-formal-rev", title: "Formal revision", tasks: ["Check spelling and grammar", "Verify formatting", "Check title page and declarations"], completed: false },
      { id: "m-content-rev", title: "Content review", tasks: ["Check logical flow", "Remove repetitions", "Close argument gaps"], completed: false },
      { id: "m-feedback", title: "Get feedback and revise", tasks: ["Submit draft to supervisor for review", "Collect comments", "Revise weak sections"], completed: false, requiredDocument: true },
      { id: "m-submit", title: "Final submission", tasks: ["Create final PDF", "Check all pages", "Upload or print as required"], completed: false, requiredDocument: true },
    ],
  },
  {
    id: "defense",
    title: "Defense and Graduation",
    shortTitle: "Defense",
    description: "Present your findings and close the academic chapter.",
    weeks: "Weeks 26 to 28",
    milestones: [
      { id: "m-slides", title: "Prepare defense presentation", tasks: ["Create slide deck", "Prepare demo if applicable", "Practice timing"], completed: false, requiredDocument: true },
      { id: "m-defense", title: "Oral defense", tasks: ["Present research", "Answer questions", "Receive preliminary feedback"], completed: false },
      { id: "m-final-rev", title: "Final manuscript corrections", tasks: ["Apply post-defense minor changes", "Submit final version to library"], completed: false },
      { id: "m-grade", title: "Receive final grade", tasks: ["Formal notification of result", "Official registration of grade"], completed: false },
    ],
  },
];

const defaultContext: ThesisContext = {
  topicArea: "",
  researchQuestion: "",
  methodology: "",
  supervisor: "",
  company: "",
  currentPhase: 0,
  degree: "M.Sc.",
  field: "",
  notes: [],
  coSupervisorId: null,
};

interface ThesisStore {
  // Role
  role: UserRole;
  setRole: (role: UserRole) => void;

  // Student profile
  studentId: string;
  studentName: string;
  firstName: string;
  lastName: string;
  email: string;
  degree: Degree;
  skills: string[];
  about: string;

  // Thesis lifecycle
  thesisState: ThesisState;
  setThesisState: (state: ThesisState) => void;

  // Selected topic & Application
  selectedTopicId: string | null;
  applicationMessage: string | null;
  applyForTopic: (topicId: string, message: string) => void;
  
  // Supervisor Registry
  pendingApplications: PendingApplication[];
  activeSupervisions: ManagedSupervision[];
  rejectionHistory: RejectionRecord[];
  
  acceptApplication: (applicationId: string) => void;
  rejectApplication: (applicationId: string) => void;
  clearTopic: () => void;

  // Thesis phases
  currentPhase: number;
  phases: ThesisPhase[];

  // Context accumulation
  thesisContext: ThesisContext;

  // Chat
  chatMessages: ChatMessage[];
  supervisorMessages: SupervisorMessage[];

  // Documents (for current student)
  documents: ThesisDocument[];

  // Dark mode
  isDark: boolean;

  // Actions
  setCurrentPhase: (phase: number) => void;
  toggleMilestone: (phaseIndex: number, milestoneId: string) => void;
  updateContext: (updates: Partial<ThesisContext>) => void;
  addChatMessage: (msg: ChatMessage) => void;
  clearChatMessages: () => void;
  addSupervisorMessage: (text: string, role: "student" | "supervisor") => void;
  toggleDarkMode: () => void;
  getPhaseProgress: (phaseIndex: number) => number;
  getOverallProgress: () => number;
  isPhaseUnlocked: (phaseIndex: number) => boolean;
  getNextAction: () => { label: string; href: string; description: string };

  // Register thesis (advances state)
  registerThesis: () => void;
  advanceToPlanning: () => void;
  advanceToExecuting: () => void;
  advanceToWriting: () => void;
  advanceToDefense: () => void;
  submitThesis: () => void;
  submitFinalGrade: (studentId: string, grade: string) => void;
  finalGrade: string | null;
  
  // Notifications
  notifications: SystemNotification[];

  // EU AI Act compliance
  isOnaListening: boolean;
  setIsOnaListening: (isListening: boolean) => void;
  addNotification: (notification: Omit<SystemNotification, "id" | "read">) => void;
  markNotificationRead: (id: string) => void;

  // Documents & Meetings
  uploadDocument: (studentId: string, doc: Omit<ThesisDocument, "id" | "timestamp" | "status">) => void;
  approveDocument: (studentId: string, docId: string) => void;
  rejectDocument: (studentId: string, docId: string) => void;
  requestMeeting: (studentId: string, date: string, topic: string) => void;
  updateMeetingStatus: (studentId: string, meetingId: string, status: ThesisMeeting["status"], protocol?: string) => void;
  checkProgressHealth: () => void;
  // Supervisor actions on registry
  addSupervisorMessageToStudent: (studentId: string, text: string) => void;
  // Profile actions
  updateProfile: (updates: Partial<{ firstName: string; lastName: string; email: string; about: string; skills: string[]; degree: Degree }>) => void;
  // Supervisor: cancel thesis and reassign
  cancelThesis: (studentId: string, newSupervisorId: string) => void;
}

export const useThesisStore = create<ThesisStore>()(
  persist(
    (set, get) => ({
      role: "student",
      setRole: (role) => set({ role }),

      studentId: "student-01",
      studentName: "Luca Meier",
      firstName: "Luca",
      lastName: "Meier",
      email: "luca.meier@student.ethz.ch",
      degree: "M.Sc.",
      skills: ["Python", "machine learning", "distributed systems", "Kubernetes"],
      about: "M.Sc. Computer Science student at ETH Zurich, specializing in machine learning systems.",

      thesisState: "exploring",
      setThesisState: (state) => set({ thesisState: state }),

      selectedTopicId: null,
      applicationMessage: null,
      applyForTopic: (topicId, message) => set((state) => ({
        selectedTopicId: topicId,
        applicationMessage: message,
        thesisState: "application_pending",
        pendingApplications: [
          ...state.pendingApplications,
          {
            id: Math.random().toString(36).substring(7),
            studentId: state.studentId,
            studentName: state.studentName,
            topicId: topicId,
            message: message,
            timestamp: Date.now()
          }
        ]
      })),
      
      pendingApplications: [],
      activeSupervisions: supervisions.map(s => ({
        ...s,
        topic: s.topic,
        phases: defaultPhases.map((dp, i) => ({
          ...dp,
          milestones: dp.milestones.map((dm, j) => ({
            ...dm,
            completed: s.phases[i]?.milestones[j]?.completed || false
          }))
        })),
        documents: [],
        meetings: [],
        messages: []
      })),
      rejectionHistory: [],
      notifications: [],
      documents: [],

      addNotification: (notif) => set((state) => ({
        notifications: [
          { ...notif, id: Math.random().toString(36).substring(7), read: false },
          ...state.notifications
        ]
      })),

      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),

      acceptApplication: (applicationId) => set((state) => {
        const app = state.pendingApplications.find(a => a.id === applicationId);
        if (!app) return state;
        
        // Trigger Knowledge Injection
        KnowledgeInjectionService.injectPartnerKnowledge(app.topicId, "supervisor-01");

        // Proactive AI Nudge: Ona informs the student about the approval
        const topic = (topics as any[]).find(t => t.id === app.topicId);
        const companyName = topic?.companyId ? (companies as any[]).find(c => c.id === topic.companyId)?.name : null;
        
        const onaMessage: ChatMessage = {
          id: Math.random().toString(36).substring(7),
          role: "assistant",
          content: `Great news! Your topic "${topic?.title}" has been approved. ${companyName ? `I've also unlocked some specific guidelines from ${companyName} in your Knowledge Base to help you get started.` : "I'm ready to help you with the next steps."}`,
          timestamp: Date.now()
        };

        // If it's the current user's application, update their state
        const isMe = app.studentId === state.studentId;
        const company = topic?.companyId ? (companies as any[]).find(c => c.id === topic.companyId)?.name : "University";

        const newSupervision: ManagedSupervision = {
          id: app.studentId,
          name: app.studentName,
          email: "student@example.com",
          degree: "M.Sc.",
          university: "University of St. Gallen",
          topicId: app.topicId,
          topic: topic?.title || "Unknown Topic",
          company: company || "University",
          supervisor: "Prof. Dr. Supervisor",
          startDate: new Date().toISOString().split('T')[0],
          deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          currentPhase: 0,
          phases: defaultPhases,
          progress: 0,
          lastActivity: "Just now",
          needsAttention: false,
          documents: [],
          meetings: [],
          messages: []
        };

        if (isMe) {
          // Add notification for the student
          const notif: SystemNotification = {
            id: Math.random().toString(36).substring(7),
            content: `Topic Approved! Your application for "${topic?.title}" has been accepted.`,
            type: "milestone",
            timestamp: Date.now(),
            read: false
          };
          
          return {
            pendingApplications: state.pendingApplications.filter(a => a.id !== applicationId),
            activeSupervisions: [...state.activeSupervisions, newSupervision],
            thesisState: "topic_selected",
            chatMessages: [...state.chatMessages, onaMessage],
            notifications: [notif, ...state.notifications]
          };
        }

        return {
          pendingApplications: state.pendingApplications.filter(a => a.id !== applicationId),
          activeSupervisions: [...state.activeSupervisions, newSupervision],
          thesisState: state.thesisState
        };
      }),

      rejectApplication: (applicationId) => set((state) => {
        const app = state.pendingApplications.find(a => a.id === applicationId);
        if (!app) return state;

        const isMe = app.studentId === state.studentId;

        return {
          pendingApplications: state.pendingApplications.filter(a => a.id !== applicationId),
          rejectionHistory: [
            ...state.rejectionHistory,
            { topicId: app.topicId, message: app.message, timestamp: Date.now() }
          ],
          thesisState: isMe ? "exploring" : state.thesisState,
          selectedTopicId: isMe ? null : state.selectedTopicId,
          applicationMessage: isMe ? null : state.applicationMessage
        };
      }),

      clearTopic: () => set({ selectedTopicId: null, applicationMessage: null, thesisState: "exploring" }),
      
      currentPhase: 0,
      phases: defaultPhases,
      thesisContext: defaultContext,
      chatMessages: [],
      supervisorMessages: [
        {
          id: "init-msg",
          senderId: "sup-01",
          senderRole: "supervisor",
          text: "Hello! Looking forward to working together on your thesis. Feel free to reach out here if you have any questions.",
          timestamp: Date.now() - 86400000,
        }
      ],
      finalGrade: null,
      isDark: false,
      isOnaListening: true,

      setIsOnaListening: (isListening) => set({ isOnaListening: isListening }),

      setCurrentPhase: (phase) => set((state) => ({ 
        currentPhase: phase,
        activeSupervisions: state.activeSupervisions.map(s => 
          s.id === state.studentId ? { ...s, currentPhase: phase, lastActivity: "Just now" } : s
        )
      })),

      toggleMilestone: (phaseIndex, milestoneId) =>
        set((state) => {
          const phases = [...state.phases];
          const phase = { ...phases[phaseIndex] };
          phase.milestones = phase.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          );
          phases[phaseIndex] = phase;

          // Recalculate progress for sync
          const total = phases.reduce((acc, p) => acc + p.milestones.length, 0);
          const done = phases.reduce(
            (acc, p) => acc + p.milestones.filter((m) => m.completed).length,
            0
          );
          const progress = total > 0 ? Math.round((done / total) * 100) : 0;

          return { 
            phases,
            activeSupervisions: state.activeSupervisions.map(s => 
              s.id === state.studentId ? { ...s, phases, progress, lastActivity: "Just now" } : s
            )
          };
        }),

      updateContext: (updates) =>
        set((state) => ({
          thesisContext: { ...state.thesisContext, ...updates },
        })),

      addChatMessage: (msg) =>
        set((state) => ({
          chatMessages: [...state.chatMessages, msg],
        })),

      clearChatMessages: () => set({ chatMessages: [] }),

      addSupervisorMessage: (text, role) =>
        set((state) => {
          const newMsg: SupervisorMessage = {
            id: Math.random().toString(36).substring(7),
            senderId: role === "student" ? state.studentId : "supervisor-01",
            senderRole: role,
            text,
            timestamp: Date.now(),
          };
          
          return {
            supervisorMessages: [...state.supervisorMessages, newMsg],
            // Push to activeSupervisions registry if it's the student sending
            activeSupervisions: state.activeSupervisions.map(s => 
              s.id === state.studentId 
                ? { ...s, messages: [...s.messages, newMsg], lastActivity: "Just now" }
                : s
            )
          };
        }),

      addSupervisorMessageToStudent: (studentId: string, text: string) =>
        set((state) => {
          const newMsg: SupervisorMessage = { 
            id: Math.random().toString(36).substring(7), 
            senderId: "supervisor-01", 
            senderRole: "supervisor", 
            text, 
            timestamp: Date.now() 
          };
          
          return {
            activeSupervisions: state.activeSupervisions.map(s => 
              s.id === studentId 
                ? { ...s, messages: [...s.messages, newMsg], lastActivity: "Just now" }
                : s
            ),
            // Sync to current user's chat if it's them
            supervisorMessages: studentId === state.studentId 
              ? [...state.supervisorMessages, newMsg]
              : state.supervisorMessages
          };
        }),

      uploadDocument: (studentId, doc) => set((state) => {
        const newDoc: ThesisDocument = {
          ...doc,
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now(),
          status: "pending"
        };

        const isMe = studentId === state.studentId;

        return {
          documents: isMe ? [...state.documents, newDoc] : state.documents,
          activeSupervisions: state.activeSupervisions.map(s => 
            s.id === studentId ? { ...s, documents: [...s.documents, newDoc], lastActivity: "Uploaded " + doc.name } : s
          )
        };
      }),

      approveDocument: (studentId, docId) => set((state) => ({
        activeSupervisions: state.activeSupervisions.map(s => 
          s.id === studentId ? { 
            ...s, 
            documents: s.documents.map(d => d.id === docId ? { ...d, status: "approved" } : d),
            lastActivity: "Document approved"
          } : s
        )
      })),

      rejectDocument: (studentId, docId) => set((state) => ({
        activeSupervisions: state.activeSupervisions.map(s => 
          s.id === studentId ? { 
            ...s, 
            documents: s.documents.map(d => d.id === docId ? { ...d, status: "rejected" } : d),
            lastActivity: "Document rejected"
          } : s
        )
      })),

      requestMeeting: (studentId, date, topic) => set((state) => {
        const newMeeting: ThesisMeeting = {
          id: Math.random().toString(36).substring(7),
          date,
          status: "requested",
          topic
        };
        return {
          activeSupervisions: state.activeSupervisions.map(s => 
            s.id === studentId ? { ...s, meetings: [...s.meetings, newMeeting], lastActivity: "Meeting requested" } : s
          )
        };
      }),

      updateMeetingStatus: (studentId, meetingId, status, protocol) => set((state) => ({
        activeSupervisions: state.activeSupervisions.map(s => 
          s.id === studentId ? { 
            ...s, 
            meetings: s.meetings.map(m => m.id === meetingId ? { ...m, status, protocol } : m),
            lastActivity: "Meeting " + status
          } : s
        )
      })),

      checkProgressHealth: () => {
        const state = get();
        const students = state.activeSupervisions;
        
        students.forEach(s => {
          // Guard: don't send duplicate nudge messages
          const hasRecentNudge = s.messages.some(m => 
            m.senderRole === "supervisor" && m.text.includes("Ona noticed") && 
            Date.now() - m.timestamp < 60000
          );
          if (s.progress < 10 && !hasRecentNudge) {
            state.addSupervisorMessageToStudent(s.id, "Hey " + s.name.split(" ")[0] + ", Ona noticed you haven't updated your progress in a while. Any blockers?");
          }
        });
      },

      toggleDarkMode: () =>
        set((state) => {
          const next = !state.isDark;
          document.documentElement.classList.toggle("dark", next);
          return { isDark: next };
        }),

      getPhaseProgress: (phaseIndex) => {
        const phase = get().phases[phaseIndex];
        if (!phase) return 0;
        const total = phase.milestones.length;
        const done = phase.milestones.filter((m) => m.completed).length;
        return total > 0 ? (done / total) * 100 : 0;
      },

      getOverallProgress: () => {
        const phases = get().phases;
        const total = phases.reduce((acc, p) => acc + p.milestones.length, 0);
        const done = phases.reduce(
          (acc, p) => acc + p.milestones.filter((m) => m.completed).length,
          0
        );
        return total > 0 ? (done / total) * 100 : 0;
      },

      isPhaseUnlocked: (phaseIndex) => {
        const state = get();
        // Phase 0 always unlocked when registered
        if (phaseIndex === 0) return state.thesisState !== "exploring" && state.thesisState !== "topic_selected";
        // Subsequent phases unlock when >=50% of previous phase is done
        const prevProgress = state.getPhaseProgress(phaseIndex - 1);
        return prevProgress >= 50;
      },

      getNextAction: () => {
        const state = get();
        switch (state.thesisState) {
          case "exploring":
            return { label: "Find your topic", href: "/topics", description: "Browse thesis topics from companies and universities" };
          case "application_pending":
            return { label: "Application pending", href: "/", description: "Wait for supervisor approval" };
          case "topic_selected":
            return { label: "Start your journey", href: "/journey", description: "Register your thesis and begin the guided process" };
          case "registered":
          case "planning":
            return { label: "Continue planning", href: "/journey", description: "Complete your orientation milestones" };
          case "executing":
            return { label: "Continue research", href: "/journey", description: "Track your execution progress" };
          case "writing":
            return { label: "Continue writing", href: "/journey", description: "Complete your writing milestones" };
          case "submitted":
            return { label: "Prepare for defense", href: "/journey", description: "Start preparing your presentation" };
          case "defense_prep":
            return { label: "Complete defense", href: "/journey", description: "Final stretch before graduation" };
          case "graded":
            return { label: "View results", href: "/journey", description: "Review your completed thesis and grade" };
          default:
            return { label: "Get started", href: "/topics", description: "Begin your thesis journey" };
        }
      },

      registerThesis: () => set((state) => {
        if (state.selectedTopicId) {
          KnowledgeInjectionService.injectPartnerKnowledge(state.selectedTopicId, "supervisor-01");
        }
        return { thesisState: "registered" };
      }),
      advanceToPlanning: () => set({ thesisState: "planning", currentPhase: 1 }),
      advanceToExecuting: () => set({ thesisState: "executing", currentPhase: 2 }),
      advanceToWriting: () => set({ thesisState: "writing", currentPhase: 3 }),
      submitThesis: () => set({ thesisState: "submitted", currentPhase: 4 }),
      advanceToDefense: () => set({ thesisState: "defense_prep", currentPhase: 5 }),
      submitFinalGrade: (studentId, grade) => set((state) => ({
        activeSupervisions: state.activeSupervisions.map(s => s.id === studentId ? { ...s, progress: 100, needsAttention: false } : s),
        thesisState: studentId === state.studentId ? "graded" : state.thesisState,
        finalGrade: studentId === state.studentId ? grade : state.finalGrade
      })),

      updateProfile: (updates) => set((state) => ({
        ...updates,
        studentName: updates.firstName && updates.lastName ? `${updates.firstName} ${updates.lastName}` : state.studentName
      })),

      cancelThesis: (studentId, newSupervisorId) => set((state) => {
        const isMe = studentId === state.studentId;
        const supervision = state.activeSupervisions.find(s => s.id === studentId);
        if (!supervision) return state;

        // Move supervision to new supervisor
        const updatedSupervisions = state.activeSupervisions.map(s =>
          s.id === studentId
            ? { ...s, supervisor: newSupervisorId, lastActivity: "Reassigned to new supervisor", needsAttention: false }
            : s
        );

        const notif: SystemNotification = {
          id: Math.random().toString(36).substring(7),
          content: `Your thesis supervision has been reassigned. A new supervisor will be in touch shortly.`,
          type: "system" as any,
          timestamp: Date.now(),
          read: false
        };

        return {
          activeSupervisions: updatedSupervisions,
          notifications: isMe ? [notif, ...state.notifications] : state.notifications
        };
      }),
    }),
    {
      name: "studyond-thesis-v2",
    }
  )
);
