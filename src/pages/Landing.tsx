import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Link } from "react-router-dom";
import { ShieldCheck, Sparkles, BarChart3, ArrowRight, Eye, Brain, Mail } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Eye, title: "Bias-blind parsing", text: "Names, photos, addresses & college pedigree are stripped before recruiters ever see a resume." },
  { icon: Brain, title: "Gemini-powered ATS", text: "Every resume is scored against the JD. Only candidates above 80% reach the recruiter." },
  { icon: Sparkles, title: "AI resume refinement", text: "Students get personalized, role-specific suggestions to close skill gaps." },
  { icon: Mail, title: "Automated feedback loop", text: "Rejected applicants receive Gemini-generated guidance on what skills to build next." },
];

const stats = [
  { v: "40%", l: "more diverse hires" },
  { v: "12x", l: "faster screening" },
  { v: "92%", l: "recruiter satisfaction" },
];

const Landing = () => {
  return (
    <div className="min-h-screen">
      <nav className="container flex h-16 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <Link to="/login/student"><Button variant="ghost" size="sm">Student Login</Button></Link>
          <Link to="/login/recruiter"><Button variant="outline" size="sm">Recruiter Login</Button></Link>
        </div>
      </nav>

      <section className="container pt-16 pb-24 lg:pt-24 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
            <ShieldCheck className="h-3.5 w-3.5" />
            Powered by Gemini · Built for fair hiring
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            Hire on talent.<br />
            <span className="text-gradient">Not on bias.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            FairHire AI strips identity from every resume, scores candidates against the role, and gives recruiters
            a clean, unbiased view — backed by Gemini.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/signup/student">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 group">
                I'm a Student
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/signup/recruiter">
              <Button size="lg" variant="outline">
                I'm a Recruiter
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-6 max-w-md">
            {stats.map((s) => (
              <div key={s.l}>
                <div className="font-display text-3xl font-bold text-gradient">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="container pb-24">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">A complete fair-hiring stack</h2>
        <p className="text-muted-foreground mb-12 max-w-xl">Two dashboards. One mission: remove bias from every step.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative rounded-2xl border-gradient bg-gradient-card p-6 shadow-soft"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container pb-24">
        <div className="rounded-3xl border-gradient bg-gradient-card p-10 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero opacity-50" />
          <div className="relative">
            <BarChart3 className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="font-display text-3xl sm:text-4xl font-bold max-w-2xl mx-auto">Ready to make your next hire your best hire?</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Join hundreds of companies using FairHire AI to build more diverse, more capable teams.</p>
            <Link to="/signup/recruiter">
              <Button size="lg" className="mt-8 bg-gradient-primary text-primary-foreground shadow-glow">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="container py-8 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
        <Logo size="sm" />
        <span>© 2026 FairHire AI · Hiring without prejudice</span>
      </footer>
    </div>
  );
};

export default Landing;
