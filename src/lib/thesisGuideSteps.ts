export type GuidePhaseId =
  | "phase-1-formalities"
  | "phase-2-planning"
  | "phase-3-research"
  | "phase-4-writing"
  | "phase-5-submission";

export type GuideStep = {
  id: string;
  phaseId: GuidePhaseId;
  title: string;
  result: string;
  tasks: string[];
  optional?: boolean;
  /** Kurze Erklärung, warum dieser Schritt wichtig ist. */
  intro?: string;
  /** Hinweise zur Kommunikation (z.B. Mails, Fragen, Do/Don'ts). */
  communicationTips?: string[];
  /** Nützliche Links oder Link-Vorlagen. */
  resources?: { label: string; url: string }[];
  /** Zusätzliche Detail-Erklärungen zu jeder Task. */
  taskGuidance?: Record<string, string>;
  /** Beispiel-Abschlussarbeiten aus dem gleichen Themenbereich. */
  relatedWorks?: {
    title: string;
    author: string;
    year: number;
    url?: string;
    subtitle?: string;
  }[];
};

export type GuidePhase = {
  id: GuidePhaseId;
  title: string;
  description: string;
};

export const phases: GuidePhase[] = [
  {
    id: "phase-1-formalities",
    title: "Phase 1: Setup & Formalities",
    description: "Make sure all rules, deadlines, and supervision are clarified.",
  },
  {
    id: "phase-2-planning",
    title: "Phase 2: Academic Planning",
    description: "Turn an idea into a researchable, doable thesis plan.",
  },
  {
    id: "phase-3-research",
    title: "Phase 3: Research & Execution",
    description: "Build the scientific foundation and produce the actual work.",
  },
  {
    id: "phase-4-writing",
    title: "Phase 4: Writing",
    description: "Draft the thesis sections with a clear argument and evidence.",
  },
  {
    id: "phase-5-submission",
    title: "Phase 5: Revision & Submission",
    description: "Polish, validate, and submit with confidence.",
  },
];

export const steps: GuideStep[] = [
  {
    id: "formal-requirements",
    phaseId: "phase-1-formalities",
    title: "Check the formal requirements",
    tasks: [
      "Read the university guidelines, thesis handbook, or examination regulations",
      "Check the submission deadline",
      "Check the required length or word count",
      "Check the required citation style",
      "Check formatting requirements",
      "Clarify mandatory elements: declaration of authorship, abstract, appendix, confidentiality notice, title page format",
      "Clarify how the thesis must be submitted: digital, printed, or both",
    ],
    result: "You know the formal rules and submission requirements.",
    intro:
      "Bevor du mit dem Inhalt startest, musst du verstehen, nach welchen Regeln deine Arbeit bewertet und abgegeben wird. Viele Probleme entstehen, weil formale Vorgaben zu spät gelesen werden.",
    resources: [
      {
        label: "Beispiel: Google-Suche nach deiner Prüfungsordnung",
        url: "https://www.google.com/search?q=thesis+guidelines+your+university",
      },
    ],
    taskGuidance: {
      "Read the university guidelines, thesis handbook, or examination regulations":
        "Suche auf der Uni-Webseite nach dem aktuellen Prüfungsordnungs- und Betreuungsleitfaden. Speichere das PDF / die Seite lokal und markiere alle relevanten Fristen.",
      "Check the submission deadline":
        "Trage den Abgabetermin in deinen Kalender ein. Frage beim Prüfungsamt nach, ob es Nachfristregelungen gibt.",
      "Check the required length or word count":
        "Notiere die Seiten- oder Wörterbegrenzung (inkl. Anhänge). Plane Puffer ein für Überarbeitungen.",
      "Check the required citation style":
        "Erfahre, ob DIN 1505, APA, Harvard, MLA o.a. gefordert sind und lade entsprechende Zitierkarten herunter.",
      "Check formatting requirements":
        "Hol dir die Vorlage der Uni (Word/LaTeX) und teste Seitenränder, Schriftgröße, Zeilenabstand und Fußnotenstil.",
      "Clarify mandatory elements: declaration of authorship, abstract, appendix, confidentiality notice, title page format":
        "Die meisten Unis stellen Vorlagen für Titelblatt und eidesstattliche Erklärung bereit. Verwende diese strikt.",
      "Clarify how the thesis must be submitted: digital, printed, or both":
        "Klare Abgabevorgaben notieren (z.B. 2 gedruckte Exemplare + PDF über Uni-Portal) und eine Checkliste anlegen.",
    },
  },
  {
    id: "supervisor-contact",
    phaseId: "phase-1-formalities",
    title: "Identify and contact the supervisor",
    tasks: [
      "Identify a suitable supervisor",
      "Prepare a short description of your topic interest",
      "Contact the supervisor",
      "Ask whether they are available to supervise the thesis",
      "Clarify expectations for communication, meetings, and feedback",
    ],
    result: "You have a confirmed or potential supervisor and a first academic contact point.",
    intro:
      "Der Betreuer oder die Betreuerin ist deine wichtigste Ansprechperson. Eine klare, strukturierte erste Kontaktaufnahme macht einen professionellen Eindruck und erhöht die Chance auf Zusage.",
    communicationTips: [
      "Halte die erste Mail kurz, höflich und konkret (3–6 Sätze).",
      "Formuliere ein bis zwei mögliche Themenrichtungen statt eines fertigen Titels.",
      "Schlage 2–3 Terminvorschläge für ein kurzes Gespräch vor.",
    ],
    resources: [
      {
        label: "Vorlage: erste E‑Mail an potenziellen Betreuer (Google Docs)",
        url: "https://docs.google.com/document/u/0/create",
      },
    ],
  },
  {
    id: "first-discussion",
    phaseId: "phase-1-formalities",
    title: "Hold the first discussion with the supervisor",
    tasks: [
      "Present your broad topic area or initial ideas",
      "Discuss whether the area is suitable",
      "Ask whether the topic fits the chair, institute, or program",
      "Clarify whether the scope is realistic",
      "Note down the supervisor’s suggestions and restrictions",
    ],
    result: "You have first guidance on whether the direction is suitable and feasible.",
    intro:
      "Das erste Gespräch dient dazu, Erwartungshaltungen abzugleichen: Passt dein Themenwunsch, wie stark soll die Arbeit theoretisch oder praktisch sein, und wie läuft die Zusammenarbeit?",
    communicationTips: [
      "Bereite 3–5 konkrete Fragen vor (z.B. Umfang, Methodik, Relevanz).",
      "Notiere dir live Stichpunkte im Notes-Bereich dieses Schritts.",
      "Frage am Ende explizit nach den nächsten Schritten und Fristen.",
    ],
  },
  {
    id: "registration",
    phaseId: "phase-1-formalities",
    title: "Complete the official registration steps",
    tasks: [
      "Check whether an official registration form is required",
      "Clarify whether signatures are needed",
      "Clarify when the official working period begins",
      "Register the thesis topic if required",
      "Store all administrative documents in one place",
    ],
    result: "The thesis is formally registered or all registration requirements are clear.",
    intro:
      "Die offizielle Anmeldung legt oft Start- und Enddatum fest. Hier passieren leicht Fehler (z.B. falsches Formular oder fehlende Unterschrift). Nimm dir Zeit, alles sauber zu klären.",
  },

  {
    id: "general-topic",
    phaseId: "phase-2-planning",
    title: "Define the general topic area",
    tasks: [
      "Choose an area of interest",
      "Check whether the topic fits your study program",
      "Write down first topic ideas",
      "Discuss possible directions if needed",
    ],
    result: "You have a broad topic area.",
    relatedWorks: [
      {
        title: "Digitalisierung im Mittelstand: Herausforderungen und Chancen",
        author: "M. Weber",
        year: 2023,
        url: "https://example.com/thesis-digitalisierung",
        subtitle: "Qualitative Analyse deutscher KMU",
      },
      {
        title: "Künstliche Intelligenz in der Hochschullehre",
        author: "L. Schmidt",
        year: 2024,
        url: "https://example.com/thesis-ki-lehre",
        subtitle: "Fallstudie zu Didaktik und Akzeptanz",
      },
    ],
  },
  {
    id: "narrow-topic",
    phaseId: "phase-2-planning",
    title: "Narrow the topic",
    tasks: [
      "Make the topic smaller and more specific",
      "Remove side aspects",
      "Check whether the topic is realistic in terms of time, data, and scope",
      "Check whether sufficient literature exists",
    ],
    result: "You have a clearly defined and manageable topic.",
    relatedWorks: [
      {
        title: "Analyse von Chatbot‑Einsatz in sozialen Medien",
        author: "A. Meier",
        year: 2025,
        url: "https://example.com/thesis-chatbot",
        subtitle: "Fokus auf NLP-Strategien und Kundenzufriedenheit",
      },
      {
        title: "Effektiver Einsatz agiler Methoden in Masterprojekten",
        author: "S. Klein",
        year: 2024,
        url: "https://example.com/thesis-agile",
        subtitle: "Empirische Studie an fünf Hochschulen",
      },
    ],
  },
  {
    id: "problem-statement",
    phaseId: "phase-2-planning",
    title: "Formulate the problem statement",
    tasks: [
      "Identify what is unclear, inefficient, missing, or insufficiently solved",
      "Explain why the issue is relevant",
      "Define the scientific or practical importance",
    ],
    result: "You can explain why the thesis is necessary.",
  },
  {
    id: "objective",
    phaseId: "phase-2-planning",
    title: "Define the objective",
    tasks: [
      "Decide what exactly the thesis should achieve",
      "Formulate the goal clearly",
      "Check whether it is realistic and specific",
    ],
    result: "You have a clear objective statement.",
  },
  {
    id: "research-question",
    phaseId: "phase-2-planning",
    title: "Formulate the research question",
    tasks: [
      "Write one main research question",
      "Derive sub-questions if useful",
      "Check whether the question is precise and answerable",
      "Align it with the objective",
    ],
    result: "You have the central research question of the thesis.",
  },
  {
    id: "initial-literature",
    phaseId: "phase-2-planning",
    title: "Conduct an initial literature search",
    tasks: [
      "Search in suitable databases",
      "Collect the first relevant sources",
      "Identify key concepts, methods, and models",
      "Save and organize sources in a reference manager",
    ],
    result: "You have an initial overview of the field.",
    intro:
      "Mit einer ersten, breiten Literatursuche verstehst du, was es schon gibt und wo typische Lücken oder offene Fragen liegen. Das schützt dich vor Themen, die schon tausendmal bearbeitet wurden.",
    resources: [
      {
        label: "Google Scholar",
        url: "https://scholar.google.com/",
      },
      {
        label: "Connected Papers (Paper‑Graph)",
        url: "https://www.connectedpapers.com/",
      },
      {
        label: "Semantic Scholar",
        url: "https://www.semanticscholar.org/",
      },
    ],
  },
  {
    id: "expose-plan",
    phaseId: "phase-2-planning",
    title: "Prepare an exposé or work plan",
    tasks: [
      "Summarize topic, problem, objective, and research question",
      "Define the rough methodology",
      "Create a first outline",
      "Create a rough timeline",
      "Add first literature",
    ],
    result: "You have a structured academic plan for the thesis.",
  },
  {
    id: "methodology",
    phaseId: "phase-2-planning",
    title: "Define the methodology",
    tasks: [
      "Decide whether the thesis is theoretical, qualitative, quantitative, technical, experimental, or mixed",
      "Define the data basis",
      "Choose tools, procedures, and evaluation criteria",
      "Clarify ethics, privacy, or permissions if needed",
    ],
    result: "You know how the research question will be answered methodologically.",
  },
  {
    id: "outline-timeline",
    phaseId: "phase-2-planning",
    title: "Create the detailed outline and timeline",
    tasks: [
      "Define chapters and subchapters",
      "Assign a purpose to each chapter",
      "Create internal deadlines",
      "Build in time buffers",
    ],
    result: "You have a full structural and temporal plan.",
  },

  {
    id: "literature-review",
    phaseId: "phase-3-research",
    title: "Conduct the detailed literature review",
    tasks: [
      "Read key sources in full",
      "Take structured notes",
      "Extract definitions, theories, methods, and findings",
      "Assign literature to the relevant thesis chapters",
    ],
    result: "You have the scientific foundation of the thesis.",
    intro:
      "Die detaillierte Literaturarbeit ist das Rückgrat deiner Thesis. Ziel ist ein roter Faden durch wichtige Begriffe, Theorien und bisherige Ergebnisse – keine bloße Aufzählung von Quellen.",
  },
  {
    id: "setup-materials",
    phaseId: "phase-3-research",
    title: "Prepare materials, data, or technical setup",
    tasks: [
      "Gather data or datasets",
      "Prepare interviews, experiments, or software",
      "Create folder structures",
      "Introduce version control if relevant",
      "Organize figures, tables, and notes",
    ],
    result: "You are ready to carry out the practical work.",
  },
  {
    id: "execution",
    phaseId: "phase-3-research",
    title: "Conduct the investigation, development, or analysis",
    tasks: [
      "Collect, clean, and analyze data",
      "Implement the model, experiment, prototype, or concept",
      "Document intermediate results",
      "Document decisions, changes, and problems",
    ],
    result: "You produce the actual material and findings of the thesis.",
  },

  {
    id: "write-methodology",
    phaseId: "phase-4-writing",
    title: "Write the methodology chapter",
    tasks: [
      "Explain the procedure",
      "Describe the data basis",
      "Justify the chosen methods",
      "Define the evaluation criteria",
    ],
    result: "The reader understands how you worked.",
  },
  {
    id: "write-implementation",
    phaseId: "phase-4-writing",
    title: "Write the implementation or analysis chapter",
    tasks: [
      "Describe what you actually did",
      "Explain the technical or analytical workflow",
      "Include key work steps, decisions, and structure",
    ],
    result: "The execution of the thesis is documented clearly.",
  },
  {
    id: "write-results",
    phaseId: "phase-4-writing",
    title: "Write the results chapter",
    tasks: [
      "Present the findings objectively",
      "Use tables and figures where appropriate",
      "Focus only on relevant results",
      "Link the results to the research question",
    ],
    result: "The reader sees what your work produced.",
  },
  {
    id: "write-theory",
    phaseId: "phase-4-writing",
    title: "Write the theory or background chapter",
    tasks: [
      "Define central concepts",
      "Explain relevant theories and models",
      "Describe the current state of research",
      "Integrate citations correctly",
    ],
    result: "The thesis has a clear academic foundation.",
  },
  {
    id: "write-discussion",
    phaseId: "phase-4-writing",
    title: "Write the discussion",
    tasks: [
      "Interpret the findings",
      "Compare them with the literature",
      "Explain strengths, weaknesses, and limitations",
      "Discuss scientific or practical relevance",
    ],
    result: "The reader understands what the findings mean.",
  },
  {
    id: "write-intro",
    phaseId: "phase-4-writing",
    title: "Write the introduction",
    tasks: [
      "Introduce the topic",
      "Explain the problem and relevance",
      "Present the objective and research question",
      "Explain the structure of the thesis",
    ],
    result: "The thesis begins with a clear and logical entry point.",
    relatedWorks: [
      {
        title: "Einleitung stabil gestalten: Ein Praxisleitfaden",
        author: "J. Fischer",
        year: 2022,
        url: "https://example.com/thesis-intro-guide",
        subtitle: "Aufsatz mit Vorlagen für verschiedene Fächer",
      },
    ],
  },
  {
    id: "write-conclusion",
    phaseId: "phase-4-writing",
    title: "Write the conclusion and outlook",
    tasks: [
      "Answer the research question",
      "Summarize the main findings",
      "Explain the contribution of the thesis",
      "Suggest future work if appropriate",
    ],
    result: "The thesis closes with a clear final statement.",
  },
  {
    id: "write-abstract",
    phaseId: "phase-4-writing",
    title: "Write the abstract",
    tasks: [
      "Summarize topic, problem, objective, method, results, and conclusion",
      "Keep the wording short and precise",
    ],
    result: "You have a compact summary of the thesis.",
  },

  {
    id: "citations-check",
    phaseId: "phase-5-submission",
    title: "Check sources and citations",
    tasks: [
      "Check all references and quotations",
      "Ensure all cited sources are in the bibliography",
      "Ensure the citation style is consistent",
    ],
    result: "The thesis is academically clean in terms of source work.",
  },
  {
    id: "formal-revision",
    phaseId: "phase-5-submission",
    title: "Perform the formal revision",
    tasks: [
      "Check spelling and grammar",
      "Improve clarity and phrasing",
      "Check formatting, numbering, and lists",
      "Check title page and mandatory declarations",
    ],
    result: "The thesis is formally correct.",
  },
  {
    id: "content-review",
    phaseId: "phase-5-submission",
    title: "Perform the final content review",
    tasks: [
      "Check the logical flow",
      "Remove repetitions",
      "Close argument gaps",
      "Confirm that the research question is actually answered",
    ],
    result: "The thesis is coherent and internally consistent.",
  },
  {
    id: "feedback",
    phaseId: "phase-5-submission",
    title: "Obtain feedback and revise",
    tasks: [
      "Send the thesis to your supervisor or test readers",
      "Collect comments",
      "Revise unclear or weak sections",
      "Save the final corrected version",
    ],
    result: "The thesis is improved through external review.",
  },
  {
    id: "submission",
    phaseId: "phase-5-submission",
    title: "Prepare and complete submission",
    tasks: [
      "Create the final PDF",
      "Check all pages and appendices",
      "Name the file correctly",
      "Upload or print as required",
      "Save proof of submission",
    ],
    result: "The thesis is fully submitted.",
  },

  // Extra (optional but commonly needed)
  {
    id: "tooling-setup",
    phaseId: "phase-1-formalities",
    title: "Set up your writing & reference tools",
    tasks: [
      "Pick a writing tool (Word/Google Docs/LaTeX) and agree on a template",
      "Set up a reference manager (Zotero/Mendeley/EndNote) and a shared folder/backup",
      "Decide where you store notes, PDFs, and figures so everything is reproducible",
    ],
    result: "Your toolchain is ready and organized.",
    intro:
      "Eine stabile Schreib- und Literatur-Umgebung spart dir später enorm viel Zeit und Nerven. Lieber einmal sauber aufsetzen als während der heißen Phase Tools zu wechseln.",
    resources: [
      {
        label: "Zotero (kostenloser Literaturmanager)",
        url: "https://www.zotero.org/",
      },
      {
        label: "Mendeley",
        url: "https://www.mendeley.com/",
      },
    ],
    optional: true,
  },
];

