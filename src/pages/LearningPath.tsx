import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, BookOpen, ExternalLink, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

interface Analysis {
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

export default function LearningPath() {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      api.get(`/analysis/${user.id}`)
        .then(({ data }) => setAnalysis(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Learning Path</h1>
        <p className="mt-1 text-muted-foreground">Your personalized plan to close skill gaps and level up.</p>
      </div>

      {/* Matched Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <CheckCircle className="h-5 w-5 text-success" />
            Skills You Have
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analysis?.matchedSkills.length ? (
            <div className="flex flex-wrap gap-2">
              {analysis.matchedSkills.map((s) => (
                <span key={s} className="rounded-full bg-success/10 px-3 py-1.5 text-sm font-medium text-success">{s}</span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Upload your resume to see your matched skills.</p>
          )}
        </CardContent>
      </Card>

      {/* Missing Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Target className="h-5 w-5 text-warning" />
            Skills to Learn
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analysis?.missingSkills.length ? (
            <div className="space-y-3">
              {analysis.missingSkills.map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/10 text-sm font-bold text-warning">
                      {i + 1}
                    </div>
                    <span className="font-medium">{skill}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No skill gaps detected yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <BookOpen className="h-5 w-5 text-primary" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analysis?.recommendations.length ? (
            <div className="space-y-3">
              {analysis.recommendations.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 rounded-lg bg-muted/50 p-4"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  <p className="text-sm">{rec}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Recommendations will appear after your resume is analyzed.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
