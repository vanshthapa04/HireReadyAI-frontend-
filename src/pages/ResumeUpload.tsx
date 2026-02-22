import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/api";

interface ResumeResult {
  resumeScore: number;
  extractedSkills: string[];
  missingSkills: string[];
}

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeResult | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const { data } = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Resume Analysis</h1>
        <p className="mt-1 text-muted-foreground">Upload your resume for AI-powered scoring and feedback.</p>
      </div>

      {/* Upload Zone */}
      <Card>
        <CardContent className="p-8">
          <div
            onClick={() => inputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-16 transition-colors hover:border-primary/50 hover:bg-muted/30"
          >
            <Upload className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="font-medium">{file ? file.name : "Click to upload your resume"}</p>
            <p className="mt-1 text-sm text-muted-foreground">PDF format, max 5MB</p>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          {file && (
            <div className="mt-6 flex justify-center">
              <Button onClick={handleUpload} disabled={loading} className="gradient-primary border-0 px-8">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                {loading ? "Analyzing..." : "Analyze Resume"}
              </Button>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Score */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Your Resume Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-center">
                <span className="font-display text-7xl font-bold gradient-text">{result.resumeScore}</span>
                <span className="text-3xl text-muted-foreground">/100</span>
              </div>
              <Progress value={result.resumeScore} className="h-3" />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Extracted Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-lg">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Extracted Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.extractedSkills.map((s) => (
                    <span key={s} className="rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">{s}</span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Missing Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-lg">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  Missing Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map((s) => (
                    <span key={s} className="rounded-full bg-warning/10 px-3 py-1 text-sm font-medium text-warning">{s}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}
