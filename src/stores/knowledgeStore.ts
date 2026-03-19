import { create } from "zustand";

export type KBCategory = "requirements" | "faq" | "guidelines" | "templates" | "resources";
export type KBScope = "global" | "topic";

export interface KBItem {
  id: string;
  title: string;
  content: string;
  category: KBCategory;
  scope: KBScope;
  topicId?: string;
  createdBy: string;
}

interface KnowledgeStore {
  items: KBItem[];
  addItem: (item: KBItem) => void;
  updateItem: (id: string, updates: Partial<KBItem>) => void;
  removeItem: (id: string) => void;
  getItemsByScope: (scope: KBScope, topicId?: string) => KBItem[];
  getItemsByCategory: (category: KBCategory) => KBItem[];
  getAllRelevantItems: (topicId?: string) => KBItem[];
}

// Pre-populated with realistic supervisor knowledge base items
const defaultItems: KBItem[] = [
  {
    id: "kb-1",
    title: "Citation style",
    content: "All theses must use APA 7th edition citation style. In-text citations should use author-date format. The reference list must include DOIs where available. For online sources without DOIs, include the URL.",
    category: "requirements",
    scope: "global",
    createdBy: "supervisor-01",
  },
  {
    id: "kb-2",
    title: "Thesis formatting requirements",
    content: "Page margins: 2.5 cm on all sides. Font: 11pt for body text, 12pt for headings. Line spacing: 1.5. Page numbers in footer, centered. Title page must include: student name, matriculation number, supervisor name, submission date, university and department.",
    category: "requirements",
    scope: "global",
    createdBy: "supervisor-01",
  },
  {
    id: "kb-3",
    title: "How to structure a literature review",
    content: "A good literature review is not a list of summaries. Organize by themes or concepts, not chronologically. Start with the broadest context, then narrow to your specific research gap. Each paragraph should have a clear argument. Always connect back to your research question. Aim for 15 to 25 sources for a Master's thesis.",
    category: "guidelines",
    scope: "global",
    createdBy: "supervisor-01",
  },
  {
    id: "kb-4",
    title: "Supervisor meeting expectations",
    content: "Schedule meetings every two weeks during the planning phase, every three weeks during execution and writing. Come prepared with a short written update (3 to 5 bullet points). Send the update 24 hours before the meeting. If you are stuck, say so early rather than waiting until the next scheduled meeting.",
    category: "guidelines",
    scope: "global",
    createdBy: "supervisor-01",
  },
  {
    id: "kb-5",
    title: "Methodology guidelines for empirical work",
    content: "If your thesis involves data collection (surveys, interviews, experiments), you must submit a data protection concept before starting. Describe: what data you collect, how you store it, who has access, when you delete it. For interviews, prepare an informed consent form. For surveys, aim for a minimum sample size of 30.",
    category: "guidelines",
    scope: "global",
    createdBy: "supervisor-01",
  },
  {
    id: "kb-6",
    title: "Data access for Nestle demand forecasting project",
    content: "The dataset will be provided via a secure link after registration is confirmed. It includes 18 months of anonymized sales data across 3 European distribution centers. Data format: CSV with columns for date, product_id, region, volume, weather_data. You will need to sign an NDA before access is granted.",
    category: "resources",
    scope: "topic",
    topicId: "topic-01",
    createdBy: "supervisor-01",
  },
  {
    id: "kb-7",
    title: "Required deliverables for ABB collaboration",
    content: "The ABB collaboration requires three deliverables beyond the thesis document: (1) A working prototype or proof of concept, (2) A 15-minute presentation to the ABB team at project conclusion, (3) A one-page executive summary for the non-academic audience. Timeline: prototype due by week 18.",
    category: "requirements",
    scope: "topic",
    topicId: "topic-09",
    createdBy: "supervisor-01",
  },
  {
    id: "kb-8",
    title: "Common mistakes to avoid",
    content: "These are the most common issues I see in thesis drafts: (1) Research question is too broad or too vague, (2) Literature review reads like a list instead of a narrative, (3) Methodology is described but not justified, (4) Results and discussion are mixed together, (5) The conclusion introduces new arguments. Address these early.",
    category: "faq",
    scope: "global",
    createdBy: "supervisor-01",
  },
  {
    id: "kb-9",
    title: "Expose template",
    content: "Your expose should be 3 to 5 pages and cover: (1) Problem statement (what and why), (2) Research question and sub-questions, (3) Preliminary literature overview (5 to 8 key sources), (4) Proposed methodology, (5) Expected contribution, (6) Preliminary timeline with milestones. Submit the expose for review before starting execution.",
    category: "templates",
    scope: "global",
    createdBy: "supervisor-01",
  },
  {
    id: "kb-10",
    title: "Grading criteria",
    content: "Theses are evaluated on five dimensions: (1) Scientific rigor, 30%, (2) Methodology and analysis quality, 25%, (3) Writing clarity and structure, 20%, (4) Practical relevance and contribution, 15%, (5) Independence and initiative, 10%. Focus on rigor and methodology; these carry the most weight.",
    category: "faq",
    scope: "global",
    createdBy: "supervisor-01",
  },
  {
    id: "kb-11",
    title: "Thesis handbook",
    content: "The official thesis handbook covers all formal requirements including: formatting rules, page margins, font sizes, citation styles, title page layout, declaration of authorship, submission procedure, and grading criteria. Students should read this document before starting any writing. Available on the university thesis portal under 'Regulations and Forms'.",
    category: "requirements",
    scope: "global",
    createdBy: "supervisor-01",
  },
  {
    id: "kb-12",
    title: "Submission deadline and extensions",
    content: "The submission deadline is set at thesis registration and is typically 6 months from the start date. Extension requests must be filed at least 2 weeks before the deadline with written justification and supervisor approval. Late submissions without an approved extension will result in a grade deduction. The final document must be submitted both digitally (PDF via thesis portal) and in print (2 bound copies to the examination office).",
    category: "requirements",
    scope: "global",
    createdBy: "supervisor-01",
  },
];

export const useKnowledgeStore = create<KnowledgeStore>((set, get) => ({
  items: defaultItems,

  addItem: (item) =>
    set((state) => ({ items: [...state.items, item] })),

  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  getItemsByScope: (scope, topicId) => {
    const items = get().items;
    if (scope === "global") return items.filter((i) => i.scope === "global");
    return items.filter((i) => i.scope === "topic" && i.topicId === topicId);
  },

  getItemsByCategory: (category) => {
    return get().items.filter((i) => i.category === category);
  },

  getAllRelevantItems: (topicId) => {
    const items = get().items;
    return items.filter((i) => i.scope === "global" || (i.scope === "topic" && i.topicId === topicId));
  },
}));
