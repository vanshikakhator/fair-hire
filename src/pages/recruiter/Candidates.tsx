import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { candidates, Candidate } from "@/lib/mockData";
import { ShieldCheck, Sparkles, Check, X, FileText, GraduationCap, Briefcase } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Candidates = () => {
  const [open, setOpen] = useState<Candidate | null>(null);

  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Qualified Candidates</h1>
          <p className="text-muted-foreground mt-1">AI Engineer · {candidates.length} candidates above 80% ATS · sorted by match</p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs text-success">
          <ShieldCheck className="h-3.5 w-3.5" />
          Names, photos, addresses & college names anonymized by Gemini
        </div>

        <div className="grid gap-3">
          {candidates.map((c) => {
            const tier = c.collegeTier === "Tier 1" ? "text-success border-success/30 bg-success/10" : c.collegeTier === "Tier 2" ? "text-info border-info/30 bg-info/10" : "text-muted-foreground border-border bg-secondary";
            return (
              <div key={c.id} className="rounded-2xl bg-gradient-card border border-border p-5 hover:border-primary/40 transition-all">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-secondary border border-border flex items-center justify-center font-display font-bold">
                      {c.anonId.split("-")[1]}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-success" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{c.name}</h3>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${tier}`}>{c.collegeTier} College</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" />{c.experience}</span>
                      <span>·</span>
                      <span className="inline-flex flex-wrap gap-1.5">
                        {c.skills.slice(0, 4).map(s => <span key={s} className="text-primary">#{s}</span>)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-display text-2xl font-bold text-success">{c.atsScore}%</div>
                    <div className="text-[10px] tracking-wider text-muted-foreground">ATS MATCH</div>
                  </div>
                  <Button onClick={() => setOpen(c)} variant="outline" size="sm">Review</Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="bg-card border-border max-w-4xl max-h-[90vh] overflow-y-auto">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl flex items-center gap-2">
                  {open.name}
                  <span className="text-success font-semibold">· {open.atsScore}% match</span>
                </DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <div className="rounded-xl border border-border bg-secondary/40 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-semibold text-sm">Original Resume</h4>
                    <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">Locked</span>
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground/60 italic">
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                    <div className="h-3 bg-muted rounded w-full mt-4" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <p className="pt-3 text-center text-muted-foreground">Original PDF hidden to prevent bias</p>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-sm">Unbiased Resume <span className="text-muted-foreground font-normal">· by Gemini</span></h4>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Education</div>
                      <p className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5 text-primary" />{open.collegeTier} University · CS</p>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Experience</div>
                      <p>{open.experience} · Software Engineering</p>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Skills</div>
                      <div className="flex flex-wrap gap-1.5">
                        {open.skills.map(s => <span key={s} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{s}</span>)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Highlights</div>
                      <ul className="space-y-1.5">
                        {open.highlights.map(h => <li key={h} className="text-sm text-muted-foreground flex gap-2"><span className="text-primary">→</span>{h}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <Button onClick={() => { setOpen(null); toast.success(`Accepted! Congratulations email sent and added to hiring sheet.`); }} className="flex-1 bg-success text-success-foreground hover:bg-success/90">
                  <Check className="mr-1 h-4 w-4" />Accept Candidate
                </Button>
                <Button onClick={() => { setOpen(null); toast(`Rejected. Gemini-generated feedback emailed to candidate.`); }} variant="outline" className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10">
                  <X className="mr-1 h-4 w-4" />Reject
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Candidates;
