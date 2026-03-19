import React, { useState } from "react";
import { useThesisStore } from "@/stores/thesisStore";
import { 
  User, 
  Mail, 
  GraduationCap, 
  BadgeCheck, 
  Tag, 
  Save, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Upload,
  FileText,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const { 
    firstName, 
    lastName, 
    email, 
    degree, 
    skills, 
    about, 
    updateProfile 
  } = useThesisStore();

  const [formData, setFormData] = useState({
    firstName,
    lastName,
    email,
    degree,
    about,
    skills: [...skills]
  });

  const [newSkill, setNewSkill] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeWizard, setActiveWizard] = useState<"none" | "cv" | "quiz">("none");
  const [quizStep, setQuizStep] = useState(0);
  const [quizData, setQuizData] = useState({ interest: "", tools: "", goal: "" });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateProfile(formData);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const simulateCVUpload = () => {
    setIsSaving(true);
    setTimeout(() => {
      setFormData({
        ...formData,
        about: "M.Sc. Computer Science student at ETH Zurich. Expert in distributed systems and LLMOps. Previously researched autonomous agents at Google Zurich.",
        skills: ["Python", "Go", "Kubernetes", "Next.js", "PyTorch"]
      });
      setIsSaving(false);
      setActiveWizard("none");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const handleQuizNext = () => {
    if (quizStep < 2) {
      setQuizStep(quizStep + 1);
    } else {
      // Finalize quiz
      setFormData({
        ...formData,
        about: `Passionate about ${quizData.interest}. I am focused on ${quizData.goal} using modern technologies.`,
        skills: [...new Set([...formData.skills, ...quizData.tools.split(",").map(s => s.trim())])]
      });
      setActiveWizard("none");
      setQuizStep(0);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  return (
    <div className="scroll-area bg-background min-h-screen">
      <div className="scroll-area-content ds-layout-narrow mx-auto space-y-8">
        {/* Magic Setup Options */}
        {activeWizard === "none" && (
          <div className="p-6 rounded-2xl bg-ai/5 border border-ai/20 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-ai flex items-center justify-center shrink-0 shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="ds-title-sm text-foreground">Magic Setup</h3>
                <p className="ds-small text-muted-foreground">Save time! Pre-fill your profile in seconds.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setActiveWizard("cv")}
                className="flex items-center gap-2 px-4 py-2 bg-background border border-border hover:bg-accent rounded-xl transition-all ds-label"
              >
                <Upload className="w-4 h-4" />
                Upload CV
              </button>
              <button 
                onClick={() => setActiveWizard("quiz")}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-xl transition-all ds-label shadow-sm"
              >
                <FileText className="w-4 h-4" />
                Quick Quiz
              </button>
            </div>
          </div>
        )}

        {/* CV Upload Wizard */}
        {activeWizard === "cv" && (
          <div className="p-10 rounded-2xl bg-card border-2 border-dashed border-ai/30 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-ai/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-ai" />
            </div>
            <div className="space-y-2">
              <h3 className="ds-title-md text-foreground">Import from CV</h3>
              <p className="ds-body text-muted-foreground max-w-sm mx-auto">
                Drag your PDF here or click to browse. We'll automatically identify your skills and bio.
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={simulateCVUpload}
                disabled={isSaving}
                className="px-8 py-3 bg-ai text-white rounded-xl ds-label font-bold hover:scale-105 transition-transform disabled:opacity-50"
              >
                {isSaving ? "Parsing document..." : "Select PDF File"}
              </button>
              <button onClick={() => setActiveWizard("none")} className="px-6 py-3 text-muted-foreground hover:text-foreground ds-label">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Quiz Wizard */}
        {activeWizard === "quiz" && (
          <div className="p-10 rounded-2xl bg-card border border-border shadow-xl space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-ai">
                <Sparkles className="w-5 h-5" />
                <span className="ds-badge font-bold uppercase tracking-wider">Step {quizStep + 1} of 3</span>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i <= quizStep ? "bg-ai" : "bg-muted"}`} />
                ))}
              </div>
            </div>

            <div className="space-y-6 min-h-[200px] flex flex-col justify-center">
              {quizStep === 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h3 className="ds-title-lg text-foreground">What research area fuels your curiosity?</h3>
                  <input 
                    type="text" 
                    placeholder="e.g. Sustainable AI, Quantum Computing..."
                    value={quizData.interest}
                    onChange={e => setQuizData({...quizData, interest: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl px-6 py-4 ds-title-cards focus:outline-none focus:ring-2 focus:ring-ai/50"
                  />
                </div>
              )}
              {quizStep === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h3 className="ds-title-lg text-foreground">Which tools do you live in?</h3>
                  <input 
                    type="text" 
                    placeholder="e.g. Python, SQL, Figma (comma separated)..."
                    value={quizData.tools}
                    onChange={e => setQuizData({...quizData, tools: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl px-6 py-4 ds-title-cards focus:outline-none focus:ring-2 focus:ring-ai/50"
                  />
                </div>
              )}
              {quizStep === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h3 className="ds-title-lg text-foreground">What's your ultimate thesis goal?</h3>
                  <input 
                    type="text" 
                    placeholder="e.g. Solving climate logistics, Launching a startup..."
                    value={quizData.goal}
                    onChange={e => setQuizData({...quizData, goal: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl px-6 py-4 ds-title-cards focus:outline-none focus:ring-2 focus:ring-ai/50"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-border">
              <button 
                onClick={() => quizStep === 0 ? setActiveWizard("none") : setQuizStep(quizStep - 1)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground ds-label transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                {quizStep === 0 ? "Cancel" : "Back"}
              </button>
              <button 
                onClick={handleQuizNext}
                disabled={!(quizStep === 0 ? quizData.interest : quizStep === 1 ? quizData.tools : quizData.goal)}
                className="flex items-center gap-2 px-8 py-3 bg-ai text-white rounded-xl ds-label font-bold hover:scale-105 transition-transform disabled:opacity-50"
              >
                {quizStep === 2 ? "Magic Finish" : "Next Question"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header (Existing) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="ds-title-lg text-foreground">
              Academic Profile
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all duration-300 ds-label ${
              showSuccess 
                ? "bg-green-600 text-white" 
                : "bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
            }`}
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : showSuccess ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Saving..." : showSuccess ? "Changes Saved" : "Save Changes"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {/* Main Form Area */}
          <div className="space-y-8">
            {/* Essential Identity Card */}
            <div className="p-8 rounded-2xl bg-card border border-border shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center border border-border">
                    <User className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-lg border-2 border-card flex items-center justify-center">
                    <BadgeCheck className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <h2 className="ds-title-md text-foreground">{firstName} {lastName}</h2>
                  <p className="ds-small text-muted-foreground flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    Verified ETH Zurich Student
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="ds-label text-muted-foreground">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 ds-body focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="ds-label text-muted-foreground">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 ds-body focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <label className="ds-label text-muted-foreground">Academic Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-2.5 ds-body focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Academic Track Card */}
            <div className="p-8 rounded-2xl bg-card border border-border shadow-sm">
              <h3 className="ds-title-sm text-foreground mb-6">Academic Track</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="ds-label text-muted-foreground">Current Degree</label>
                  <select
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value as any })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 ds-body focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                  >
                    <option value="B.Sc.">B.Sc. - Bachelor of Science</option>
                    <option value="M.Sc.">M.Sc. - Master of Science</option>
                    <option value="Ph.D.">Ph.D. - Doctor of Philosophy</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="ds-label text-muted-foreground">Research Biography</label>
                  <textarea
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    rows={4}
                    placeholder="Describe your research interests..."
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 ds-body focus:outline-none focus:ring-1 focus:ring-ring transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Expertise Tags */}
            <div className="p-8 rounded-2xl bg-card border border-border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="ds-title-sm text-foreground">Expertise & Skills</h3>
                <span className="ds-badge bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                  {formData.skills.length} skills
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {formData.skills.map((skill) => (
                  <span 
                    key={skill}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground ds-small"
                  >
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-destructive transition-colors">
                      <Tag className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  placeholder="e.g. LLMOps, LaTeX, PyTorch..."
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-2 ds-small focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                />
                <button 
                  onClick={addSkill}
                  className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl transition-colors ds-label"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Contextual Nudge */}
            <div className="p-6 rounded-2xl bg-ai/5 border border-ai/20 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-ai flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="ds-label text-foreground">Ona's Smart Hint</h4>
                <p className="ds-small text-muted-foreground leading-relaxed">
                  Based on your interest in "LLMs", I found three matching topics from Nestle and ABB. Ensuring your profile is complete will increase your chances of direct approval by 45%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
