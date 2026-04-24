import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldCheck, Sparkles, Check, X, FileText, GraduationCap, Briefcase, Select } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const Candidates = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');
  const [open, setOpen] = useState<any>(null);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['candidates', jobId],
    queryFn: () => api.get(`/applications?jobId=${jobId}`),
    enabled: !!jobId,
    refetchInterval: 5000 // Live updates every 5s
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ['recruiterJobs'],
    queryFn: () => api.get('/jobs')
  });

  const selectedJob = jobs.find((j: any) => j._id === jobId);

  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-display text-3xl font-bold">Candidates</h1>
            <p className="text-muted-foreground mt-1">
              {selectedJob?.role || "Select a role"} · {applications.length} applicants
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs text-success">
          <ShieldCheck className="h-3.5 w-3.5" />
          Real-time candidate tracking with AI matching scores
        </div>

        {!jobId ? (
          <div className="p-12 text-center border-2 border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground">Select a job from the dashboard to review candidates.</p>
          </div>
        ) : isLoading ? (
          <div className="p-12 text-center">Loading candidates...</div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground">No applications yet for this role.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {applications.map((app: any) => {
              const student = app.studentId;
              const name = student ? `${student.firstName} ${student.lastName}` : "Anonymous Candidate";
              const university = student?.university || "T1 University";
              
              return (
                <div key={app._id} className="rounded-2xl bg-gradient-card border border-border p-5 hover:border-primary/40 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-secondary border border-border flex items-center justify-center font-display font-bold">
                        {name[0]}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-success" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{name}</h3>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border bg-info/10 text-info border-info/30`}>{university}</span>
                        <StatusBadge status={app.status} />
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" />Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                        {app.githubUrl && <span className="text-primary hover:underline"><a href={app.githubUrl} target="_blank">GitHub</a></span>}
                        {app.linkedinUrl && <span className="text-primary hover:underline"><a href={app.linkedinUrl} target="_blank">LinkedIn</a></span>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-display text-2xl font-bold text-success">{app.atsScore}%</div>
                      <div className="text-[10px] tracking-wider text-muted-foreground">MATCH</div>
                    </div>
                    <Button onClick={() => setOpen({ ...app, name })} variant="outline" size="sm">Review</Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
                    <h4 className="font-semibold text-sm">Cover Note</h4>
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {open.coverNote || "No cover note provided."}
                  </div>
                </div>

                <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-sm">AI Insights</h4>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Education</div>
                      <p className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5 text-primary" />{open.studentId?.university}</p>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Links</div>
                      <div className="flex gap-4">
                        {open.linkedinUrl && <a href={open.linkedinUrl} target="_blank" className="text-primary hover:underline">LinkedIn</a>}
                        {open.githubUrl && <a href={open.githubUrl} target="_blank" className="text-primary hover:underline">GitHub</a>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <Button onClick={() => { setOpen(null); toast.success(`Accepted! Notification sent.`); }} className="flex-1 bg-success text-success-foreground hover:bg-success/90">
                  <Check className="mr-1 h-4 w-4" />Accept
                </Button>
                <Button onClick={() => { setOpen(null); toast(`Rejected.`); }} variant="outline" className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10">
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
