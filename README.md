# Studyond — AI Thesis Journey

[![Deployed on Railway](https://img.shields.io/badge/Deployed%20on-Railway-0b0d0e?style=for-the-badge&logo=railway)](https://railway.app)
[![Start Hack 2026](https://img.shields.io/badge/Start%20Hack-2026-ffdd00?style=for-the-badge)](https://starthack.eu)

> **"From 'I'm starting' to 'I'm submitting'"** — Your AI-powered companion for the academic milestone.

---

## 🌟 The Vision

**Studyond** is a comprehensive platform designed to streamline the complex process of writing an academic thesis. Built during **Start Hack 2026** for the **Studyond Challenge**, our solution bridges the gap between students, supervisors, and industry partners, transforming a stressful academic milestone into a structured and rewarding journey.

---

## 🏆 The Challenge: Studyond @ Start Hack 2026

The "Studyond Challenge" at Start Hack 2026 tasked participants with reimagining the academic thesis experience. Our research identified key pain points:
- **Fragmentation**: Students struggle to find topics across disparate portals.
- **Opacity**: The registration process is manual and progress is often invisible to supervisors.
- **Isolation**: A long writing phase with infrequent feedback loops.
- **Communication Friction**: Students are frequently frustrated with the **style, frequency, and consistency** of supervisor communication.

### Our Solution
We built an end-to-end journey tracker that addresses these through:
- **Smart Discovery**: Filter topics by **Field** and **Source** (Industry/Company vs. University).
- **10-Stage Lifecycle**: A visual timeline spanning `exploring` → `application_pending` → `registered` → `planning` → `executing` → `writing` → `submitted` → `defense_prep` → `graded`.
- **Proactive AI (Ona)**: An integrated copilot providing **contextual prompts**, **health checks**, and **proactive nudges** if progress plateaus.
- **Unified Supervisor Dashboard**: A portal for **Prof. Dr. Sibylle Hechberger** and colleagues to manage approvals, track health scores, and maintain a **Dual-Scope Knowledge Base** (Global vs. Topic-specific).

---

## 🛠 Technical Documentation & Design Decisions

### The Tech Stack
- **Frontend**: [React 19](https://react.dev/) with [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (using the Oxide engine and OKLCH colors)
- **State Management**: [Zustand 5](https://github.com/pmndrs/zustand) for reactive global state
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Animations**: [Framer Motion 11](https://www.framer.com/motion/)
- **Data Persistence**: In-memory store with **Zustand** and a robust JSON-based mock layer representing **ETH Zurich** and **University of St. Gallen**.

### Key Design Decisions
1. **Adaptive Role Architecture**: A seamless **Instant Role Switcher** allows toggling between Student and Supervisor perspectives for immediate verification.
2. **Context-Aware UI**: The sidebar, navigation, and Ona's suggestions morph dynamically based on the current thesis state.
3. **Internal Notification Engine**: A custom system for tracking system-level nudges, milestone completions, and meeting requests.
4. **Modern Aesthetics**: A premium design system using **OKLCH-based color tokens** and **Backdrop Blur** accents for a high-end SaaS feel.
5. **Standardized Logistics**: Built around a core **180-day (6-month)** thesis duration with automated deadline calculation.

### 📖 Reference Information (Knowledge Base)
To ensure academic consistency, the platform includes a supervisor-managed **Knowledge Base**. This system grounds the AI assistant's responses and provides students with a single source of truth for:
- **Requirements**: Formalities like **APA 7th Edition** citation, formatting rules, and mandatory deliverables.
- **Guidelines**: Logic for structuring literature reviews, methodology design, and meeting etiquette.
- **Templates**: Structured **Expose Templates** and timeline samples.
- **FAQ**: Standard grading criteria and common mistakes to avoid.
- **Resources**: Topic-specific data links (e.g., Nestle sales data, ABB prototype requirements).

---

### 🎨 Design Guideline (Studyond System)
The application follows a strict, premium design system to ensure a cohesive and high-end academic experience:

- **Typography**: Uses **Avenir Next** as the primary typeface for its modern, clean legibility.
- **Type Scale**: A standardized scale ranging from `ds-caption` (12px) for metadata to `ds-title-xl` (36px) for headers.
- **Layout Patterns**: 
    - **Adaptive Grids**: Responsive 3-column and 4-column layouts for topic discovery and dashboards.
    - **Narrow Focus**: Content areas restricted to `ds-layout-narrow` (3xl) to maximize readability during writing and reading phases.
- **Color Strategy**: Fully implemented using **OKLCH color tokens**, enabling future-proof dynamic themes and seamless dark mode transitions.
- **Glassmorphism Accents**: Subtle use of `backdrop-blur` for high-priority overlays and modals.

---

## 🚀 Deployment Guide (Railway)

We've chosen **Railway** for its superior DX and reliability. **Note: We explicitly do not use Vercel for this project.**

### Prerequisites
- A [Railway](https://railway.app/) account and a linked GitHub repository.

### Step-by-Step Deployment
1. **Create Project**: `+ New Project` > `Deploy from GitHub repo`.
2. **Configure Build Settings**:
   - **Build Command**: `npm run build` (runs `tsc -b && vite build`)
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. **Add Custom Domain**: Under the `Settings` tab, click `Generate Domain`.

---

## 👥 The Team

Created at **Start Hack 2026** for the **Studyond Challenge**.

- **Niclas** (Developer) & Team
- Special thanks to the **Studyond** mentors for the challenge insights.

---

> [!NOTE]
> This project is a prototype built for the Start Hack 2026 hackathon.
