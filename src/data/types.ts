// -- Enums --
export type Degree = "B.Sc." | "M.Sc." | "Ph.D.";
export type TopicEmployment = "yes" | "no" | "open";
export type TopicEmploymentType = "internship" | "working_student" | "graduate_program" | "direct_entry";
export type TopicWorkplaceType = "on_site" | "hybrid" | "remote";
export type TopicType = "topic" | "job";
export type ProjectState = "proposed" | "applied" | "withdrawn" | "rejected" | "agreed" | "in_progress" | "canceled" | "completed";
export type StudentObjective = "topic" | "supervision" | "career_start" | "industry_access" | "project_guidance";
export type ExpertObjective = "recruiting" | "fresh_insights" | "research_collaboration" | "education_collaboration" | "brand_visibility";
export type SupervisorObjective = "student_matching" | "research_collaboration" | "network_expansion" | "funding_access" | "project_management";

// -- Entities --
export interface University {
  id: string;
  name: string;
  country: string;
  domains: string[];
  about: string | null;
}

export interface StudyProgram {
  id: string;
  name: string;
  degree: Degree;
  universityId: string;
  about: string | null;
}

export interface Field {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  degree: Degree;
  studyProgramId: string;
  universityId: string;
  skills: string[];
  about: string | null;
  objectives: StudentObjective[];
  fieldIds: string[];
}

export interface Supervisor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  universityId: string;
  researchInterests: string[];
  about: string | null;
  objectives: SupervisorObjective[];
  fieldIds: string[];
}

export interface Company {
  id: string;
  name: string;
  description: string;
  about: string | null;
  size: string;
  domains: string[];
}

export interface Expert {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  companyId: string;
  offerInterviews: boolean;
  about: string | null;
  objectives: ExpertObjective[];
  fieldIds: string[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  type: TopicType;
  employment: TopicEmployment;
  employmentType: TopicEmploymentType | null;
  workplaceType: TopicWorkplaceType | null;
  degrees: Degree[];
  fieldIds: string[];
  companyId: string | null;
  universityId: string | null;
  supervisorIds: string[];
  expertIds: string[];
}

export interface ThesisProject {
  id: string;
  title: string;
  description: string | null;
  motivation: string | null;
  state: ProjectState;
  studentId: string;
  topicId: string | null;
  companyId: string | null;
  universityId: string | null;
  supervisorIds: string[];
  expertIds: string[];
  createdAt: string;
  updatedAt: string;
}

// -- App-specific types --
export interface ThesisPhase {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  weeks: string;
  milestones: ThesisMilestone[];
}

export interface ThesisMilestone {
  id: string;
  title: string;
  tasks: string[];
  completed: boolean;
  requiredDocument?: boolean;
}

export interface ThesisDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  status: "pending" | "approved" | "rejected";
  milestoneId: string;
  timestamp: number;
}

export interface ThesisMeeting {
  id: string;
  date: string;
  status: "requested" | "scheduled" | "completed";
  topic: string;
  protocol?: string;
}

export interface SystemNotification {
  id: string;
  type: "nudge" | "milestone" | "meeting";
  content: string;
  timestamp: number;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  toolCall?: {
    name: string;
    result: string;
  };
}

export interface ThesisContext {
  topicArea: string;
  researchQuestion: string;
  methodology: string;
  supervisor: string;
  company: string;
  currentPhase: number;
  degree: Degree;
  field: string;
  notes: string[];
  coSupervisorId: string | null;
}
