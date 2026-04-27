import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Send, Loader2, CheckCircle, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";

interface Feedback {
  score: number;
  feedback: string;
}

export default function InterviewPractice() {
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const generateQuestions = async () => {
    if (!role) return;
    setLoading(true);
    try {
      const { data } = await api.post("/ai/mock-interview", { role, difficulty });
      setQuestions(data.questions);
      setCurrentQ(0);
      setFeedbacks([]);
      setAnswer("");
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    console.log("Answer submitted:", answer);
  };

  const completed = feedbacks.length > 0 && feedbacks.length === questions.length;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Interview Practice</h1>
        <p className="mt-1 text-muted-foreground">Practice with AI-generated questions tailored to your target role.</p>
      </div>

      {/* Generate */}
      {questions.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Set Up Your Interview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Target Role</Label>
              <Input placeholder="e.g. Frontend Developer" value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generateQuestions} disabled={loading || !role} className="gradient-primary border-0">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
              Generate Questions
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Questions */}
      {questions.length > 0 && !completed && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-display">
                  Question {currentQ + 1} of {questions.length}
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  {feedbacks.length}/{questions.length} answered
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="font-medium">{questions[currentQ]}</p>
                </div>
              </div>
              <Textarea
                placeholder="Type your answer here..."
                rows={5}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <Button onClick={submitAnswer} disabled={submitting || !answer.trim()} className="gradient-primary border-0">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Submit Answer
              </Button>

              {/* Previous feedbacks */}
              {feedbacks.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <p className="text-sm font-medium text-muted-foreground">Previous Feedback</p>
                  {feedbacks.map((fb, i) => (
                    <div key={i} className="rounded-lg bg-muted/50 p-3 text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">Q{i + 1} Score: {fb.score}/10</span>
                      </div>
                      <p className="text-muted-foreground">{fb.feedback}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Completed */}
      {completed && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="mx-auto mb-4 h-16 w-16 text-success" />
              <h2 className="font-display text-2xl font-bold">Interview Complete!</h2>
              <p className="mt-2 text-muted-foreground">
                Average Score:{" "}
                <span className="font-bold text-foreground">
                  {(feedbacks.reduce((a, b) => a + b.score, 0) / feedbacks.length).toFixed(1)}/10
                </span>
              </p>
              <div className="mt-6 space-y-3">
                {feedbacks.map((fb, i) => (
                  <div key={i} className="rounded-lg border border-border p-4 text-left">
                    <p className="mb-1 text-sm font-semibold">Q{i + 1}: {questions[i]}</p>
                    <p className="text-sm text-muted-foreground">Score: {fb.score}/10 — {fb.feedback}</p>
                  </div>
                ))}
              </div>
              <Button onClick={() => { setQuestions([]); setFeedbacks([]); }} className="mt-6 gradient-primary border-0">
                Start New Interview
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
