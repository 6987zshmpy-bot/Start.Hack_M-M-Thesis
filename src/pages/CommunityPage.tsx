import React from "react";
import { useThesisStore } from "@/stores/thesisStore";
import { Users, Search, GraduationCap, MapPin, MessageCircle, ExternalLink } from "lucide-react";
import studentsData from "@/data/students.json";

export function CommunityPage() {
  const { isDark } = useThesisStore();

  return (
    <div className="scroll-area bg-background min-h-screen font-website">
      <div className="scroll-area-content ds-layout-narrow mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="ds-title-lg text-foreground flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Research Community
          </h1>
          <p className="ds-body text-muted-foreground">
            Connect with 40+ researchers across ETH Zurich and University of St. Gallen.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by topic, university, or name..."
            className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-3.5 ds-body focus:outline-none focus:ring-1 focus:ring-ring transition-all"
          />
        </div>

        {/* Community Grid */}
        <div className="grid grid-cols-1 gap-6">
          {studentsData.map((student) => (
            <div 
              key={student.id} 
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all group relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border">
                  <GraduationCap className="w-8 h-8 text-muted-foreground" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="ds-title-sm text-foreground group-hover:text-primary transition-colors">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="ds-caption text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {student.universityId === "uni-01" ? "ETH Zurich" : student.universityId === "uni-03" ? "University of St. Gallen" : "University Hub"} • {student.degree}
                      </p>
                    </div>
                    <button className="p-2 rounded-xl bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <p className="ds-caption text-muted-foreground uppercase tracking-wider font-semibold">Active Research</p>
                    <p className="ds-body text-foreground leading-relaxed">
                      Transforming supply chain logistics using autonomous LLM agents in production environments.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {["Supply Chain", "LLMs", "Optimization"].map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-lg bg-muted text-muted-foreground ds-badge">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;
