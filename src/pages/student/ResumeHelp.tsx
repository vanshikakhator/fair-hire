import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const ResumeHelp = () => {
  const [analyzed, setAnalyzed] = useState(true);
  const [role, setRole] = useState("data");

  return (
    <DashboardLayout role="student">
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="font-display text-3xl font-bold">AI Resume Refinement</h1>
          <p className="text-muted-foreground mt-1">Powered by Gemini AI — get personalized feedback for your target role</p>
        </div>

        <div className="rounded-2xl bg-gradient-card border border-border p-6 space-y-5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center"><Sparkles className="h-4 w-4 text-primary" /></div>
            <div>
              <h3 className="font-semibold">Analyze My Resume</h3>
              <p className="text-xs text-muted-foreground">Select your target role and let AI review your profile</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Target Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="mt-1.5 bg-secondary"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="data">Data Scientist</SelectItem>
                  <SelectItem value="ai">AI Engineer</SelectItem>
                  <SelectItem value="full">Full Stack Engineer</SelectItem>
                  <SelectItem value="backend">Backend Engineer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Experience Level</Label>
              <Select defaultValue="0-2">
                <SelectTrigger className="mt-1.5 bg-secondary"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">0-2 years</SelectItem>
                  <SelectItem value="2-5">2-5 years</SelectItem>
                  <SelectItem value="5+">5+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Paste your skills / resume summary</Label>
            <Textarea rows={4} className="mt-1.5 bg-secondary" defaultValue="Python, TensorFlow, scikit-learn. 1 year internship building churn prediction models. Final-year project on NLP." />
          </div>
          <Button onClick={() => setAnalyzed(true)} className="bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="mr-2 h-4 w-4" /> Analyze with Gemini AI
          </Button>
        </div>

        {analyzed && (
          <div className="rounded-2xl bg-gradient-card border border-border p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <h3 className="font-semibold">Analysis for Data Scientist</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-5">Personalized recommendations based on your profile</p>

            <div className="rounded-xl bg-secondary/50 border border-border p-5 space-y-4">
              <p className="text-sm leading-relaxed">
                <span className="text-primary font-semibold">Strong foundation in:</span>{" "}
                <span className="text-muted-foreground">Python, statistics, data wrangling</span>
              </p>

              <div>
                <p className="text-warning font-semibold text-sm mb-2">Recommended additions:</p>
                <div className="flex flex-wrap gap-2">
                  {["A/B Testing", "Causal Inference", "Apache Spark", "dbt", "SQL at scale"].map(s => (
                    <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-info font-semibold text-sm mb-2">Suggested project:</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Build an end-to-end recommender system on a public dataset (e.g. MovieLens) and document A/B testing methodology. This single project would meaningfully shift your ATS score for Netflix and Spotify-style roles.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResumeHelp;
