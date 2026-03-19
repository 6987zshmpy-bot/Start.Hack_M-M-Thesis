import { useThesisStore } from "@/stores/thesisStore";
import { Link } from "react-router-dom";
import { 
  Users, 
  TrendingUp, 
  Lightbulb, 
  Search, 
  ArrowRight, 
  UserPlus, 
  ShieldCheck, 
  Briefcase,
  ExternalLink,
  Star,
  Zap
} from "lucide-react";
import companies from "@/data/companies.json";

export function CompanyDashboardPage() {
  const { activeSupervisions } = useThesisStore();
  
  // For this mock, we assume the user is "Nestlé" (company-01)
  const myCompanyId = "company-01";
  const myCompany = companies.find(c => c.id === myCompanyId);
  
  // Filter students based on this company
  const companyStudents = activeSupervisions.filter(s => s.company === "Nestle" || s.company === "Nestlé");
  const averageProgress = companyStudents.reduce((acc, s) => acc + s.progress, 0) / (companyStudents.length || 1);
  
  const highPotentialStudents = companyStudents.filter(s => s.progress > 30);

  return (
    <div className="scroll-area">
      <div className="scroll-area-content max-w-6xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="ds-badge bg-primary/10 text-primary px-2 py-1 rounded">Corporate Partner</span>
              <span className="text-muted-foreground">•</span>
              <span className="ds-body text-muted-foreground">{myCompany?.name} HQ</span>
            </div>
            <h1 className="ds-title-lg text-foreground">Innovation Portfolio</h1>
          </div>
          <div className="flex gap-4">
             <div className="bg-card border border-border rounded-lg px-4 py-2 text-center">
                <p className="ds-caption text-muted-foreground">Active Projects</p>
                <p className="ds-title-md text-foreground">{companyStudents.length}</p>
             </div>
             <div className="bg-card border border-border rounded-lg px-4 py-2 text-center">
                <p className="ds-caption text-muted-foreground">Portfolio Health</p>
                <p className="ds-title-md text-primary">{Math.round(averageProgress)}%</p>
             </div>
          </div>
        </div>

        {/* Talent Discovery Section (The High ROI Feature) */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="ds-title-sm text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              Talent Discovery Signals
            </h3>
            <span className="ds-caption text-muted-foreground">AI-driven recruitment matched to your skills needs</span>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {highPotentialStudents.length > 0 ? (
              highPotentialStudents.map(student => (
                <div key={student.id} className="group relative rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 p-3">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-lg font-medium text-foreground">
                      {student.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h4 className="ds-label text-foreground">{student.name}</h4>
                      <p className="ds-caption text-muted-foreground">{student.degree} • {student.university}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="ds-caption text-muted-foreground mb-1.5 uppercase tracking-tighter">Skill Signals</p>
                    <div className="flex flex-wrap gap-1">
                      {["Advanced Data Modeling", "Perishable Supply Chains", "Machine Learning"].map(skill => (
                        <span key={skill} className="px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] whitespace-nowrap border border-primary/10">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="w-full py-2 rounded-lg bg-secondary ds-small font-medium text-foreground hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2">
                    <UserPlus className="h-4 w-4" /> Shortlist for Interview
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full py-10 text-center border border-dashed border-border rounded-xl">
                 <p className="ds-body text-muted-foreground">No talent signals detected yet. Students are in early orientation phases.</p>
              </div>
            )}
          </div>
        </div>

        {/* Global Overview Tabs */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Workflows */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="border-b border-border bg-muted/30 px-5 py-4 flex items-center justify-between">
                <h3 className="ds-label text-foreground font-semibold">Active Research Pipeline</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="ds-caption text-muted-foreground">On track</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="ds-caption text-muted-foreground">Attention</span>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-border">
                {companyStudents.map(student => (
                  <div key={student.id} className="p-5 hover:bg-muted/10 transition-colors group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 pr-4">
                        <h4 className="ds-label text-foreground truncate group-hover:text-primary transition-colors">{student.topic}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="ds-caption text-muted-foreground">{student.name}</p>
                          <span className="text-muted-foreground/30">•</span>
                          <p className="ds-caption text-muted-foreground">Prof. {student.supervisor.split(" ").pop()}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="ds-label text-foreground">{student.progress}%</span>
                        <div className="w-24 h-1.5 bg-border rounded-full mt-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${student.needsAttention ? 'bg-amber-500' : 'bg-primary'}`}
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                       <div className="flex gap-4">
                          <div className="flex items-center gap-1.5 ds-caption text-muted-foreground">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {student.progress > 80 ? "IP Check Ready" : "WIP"}
                          </div>
                          <div className="flex items-center gap-1.5 ds-caption text-muted-foreground">
                            <TrendingUp className="h-3.5 w-3.5" />
                            High ROI
                          </div>
                       </div>
                       <Link to={`/supervisor`} className="ds-small text-muted-foreground hover:text-foreground flex items-center gap-1">
                         Contact Academic Lead <ExternalLink className="h-3 w-3" />
                       </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Business Insights Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="ds-label text-foreground font-semibold mb-4">Innovation Benchmarks</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="ds-caption text-muted-foreground uppercase tracking-tight">Recruiting Bridge</p>
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <p className="ds-title-sm text-foreground mb-1">2 Candidates</p>
                  <p className="ds-small text-muted-foreground">Identified as "High Technical Fit" for Q3 graduate intake.</p>
                </div>
                
                <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="ds-caption text-muted-foreground uppercase tracking-tight">Research IP</p>
                    <Lightbulb className="h-4 w-4 text-primary" />
                  </div>
                  <p className="ds-title-sm text-foreground mb-1">3 Prototypes</p>
                  <p className="ds-small text-muted-foreground">Early-stage PoCs generated in sponsored theses.</p>
                </div>
              </div>
              <button className="w-full mt-6 py-2 rounded-lg border border-border ds-small text-muted-foreground hover:text-foreground transition-colors">
                Export Quarterly ROI Report
              </button>
            </div>

            <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-transparent p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <h3 className="ds-label text-foreground font-semibold">Partner Support</h3>
              </div>
              <p className="ds-small text-muted-foreground mb-4">Need to update your corporate guidelines or intellectual property protocols?</p>
              <button className="w-full py-2 rounded-lg bg-primary text-white ds-small font-medium hover:bg-primary/90 transition-colors">
                Contact University Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
