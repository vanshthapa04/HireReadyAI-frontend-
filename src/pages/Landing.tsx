import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Brain, FileText, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: FileText,
    title: "AI Resume Analysis",
    description: "Get instant feedback on your resume with AI-powered scoring and skill extraction.",
  },
  {
    icon: Target,
    title: "Skill Gap Detection",
    description: "Identify missing skills and get personalized recommendations to close the gap.",
  },
  {
    icon: Brain,
    title: "Mock Interviews",
    description: "Practice with AI-generated interview questions tailored to your target role.",
  },
  {
    icon: Sparkles,
    title: "Learning Paths",
    description: "Get curated learning recommendations based on your skill gaps and career goals.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">HireReadyAI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild className="gradient-primary border-0">
              <Link to="/register">Get Started <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />
        
        <div className="container relative mx-auto px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Career Readiness
              </div>
              <h1 className="font-display text-5xl font-bold leading-tight tracking-tight lg:text-6xl">
                Ace Your Next
                <span className="gradient-text block">Job Interview</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg text-muted-foreground">
                Upload your resume, identify skill gaps, practice with AI-generated interviews, and get a personalized learning path to land your dream job.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" asChild className="gradient-primary border-0 px-8 text-base shadow-glow">
                  <Link to="/register">Start Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-base">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-2xl gradient-primary opacity-20 blur-2xl" />
                <img
                  src={heroBg}
                  alt="AI-powered career readiness platform"
                  className="relative rounded-2xl border border-border/50 shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="font-display text-3xl font-bold lg:text-4xl">
              Everything You Need to <span className="gradient-text">Get Hired</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our AI-powered tools help you prepare for every stage of the hiring process.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-glow"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg gradient-primary">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto flex items-center justify-between px-6 text-sm text-muted-foreground">
          <span>© 2026 HireReadyAI. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="font-display font-semibold text-foreground">HireReadyAI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
