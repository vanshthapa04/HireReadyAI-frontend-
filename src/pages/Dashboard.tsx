import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Target, Brain, TrendingUp, Upload, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface SkillAnalysis {
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const [resumeScore, setResumeScore] = useState<number | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<SkillAnalysis | null>(null);

  useEffect(() => {
    if (user?.id) {
      api.get(`/analysis/${user.id}`).then(({ data }) => {
        setAnalysis(data);
      }).catch(() => {});
    }
  }, [user?.id]);

  const radarData = analysis
    ? [
        ...analysis.matchedSkills.slice(0, 5).map((s) => ({ skill: s, value: 85 })),
        ...analysis.missingSkills.slice(0, 3).map((s) => ({ skill: s, value: 30 })),
      ]
    : [
        { skill: "JavaScript", value: 80 },
        { skill: "React", value: 75 },
        { skill: "Node.js", value: 65 },
        { skill: "System Design", value: 35 },
        { skill: "Docker", value: 25 },
        { skill: "TypeScript", value: 70 },
      ];

  const score = resumeScore ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold">
          Welcome back, <span className="gradient-text">{user?.name || "User"}</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Here's an overview of your career readiness.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Resume Score", value: score ? `${score}/100` : "—", icon: FileText, color: "text-primary" },
          { label: "Skills Matched", value: analysis?.matchedSkills.length ?? "—", icon: Target, color: "text-success" },
          { label: "Skill Gaps", value: analysis?.missingSkills.length ?? "—", icon: TrendingUp, color: "text-warning" },
          { label: "Interviews Done", value: "0", icon: Brain, color: "text-accent" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-display text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Resume Score Card */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Resume Score</CardTitle>
          </CardHeader>
          <CardContent>
            {score > 0 ? (
              <div className="space-y-4">
                <div className="text-center">
                  <span className="font-display text-6xl font-bold gradient-text">{score}</span>
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                <Progress value={score} className="h-3" />
                {skills.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium">Extracted Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((s) => (
                        <span key={s} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
                <p className="text-muted-foreground">Upload your resume to get your score</p>
                <Button asChild className="mt-4 gradient-primary border-0">
                  <Link to="/resume">Upload Resume <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skill Radar */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Skill Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Upload Resume", desc: "Get AI-powered resume analysis", to: "/resume", icon: FileText },
          { title: "Practice Interview", desc: "Start a mock interview session", to: "/interview", icon: Brain },
          { title: "Learning Path", desc: "View your personalized plan", to: "/learning", icon: Target },
        ].map((action) => (
          <Link key={action.to} to={action.to}>
            <Card className="group cursor-pointer transition-all hover:border-primary/30 hover:shadow-glow">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                  <action.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{action.title}</p>
                  <p className="text-sm text-muted-foreground">{action.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
