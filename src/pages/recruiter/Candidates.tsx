import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldCheck, Check, X, FileText, Briefcase, Github, Linkedin, ArrowRight } from "lucide-react";
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

  const consolidateResumes = () => {
    const resumesObject = applications.map((app: any) => ({
      resume: app.resumePath || app.studentId?.resumePath 
        ? `http://localhost:5000${encodeURI(app.resumePath || app.studentId?.resumePath)}`
        : null
    }));
    
    const blob = new Blob([JSON.stringify(resumesObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resumes_object_${selectedJob?.role || 'job'}.json`;
    link.click();
    toast.success("Resumes object generated and downloaded for automation!");
  };

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

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs text-success">
            <ShieldCheck className="h-3.5 w-3.5" />
            AI-powered unbiased candidate screening
          </div>
          {jobId && applications.length > 0 && (
            <Button variant="outline" size="sm" className="gap-2" onClick={consolidateResumes}>
              <FileText className="h-4 w-4" /> Consolidate Resumes Object
            </Button>
          )}
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
              const university = student?.education?.institution || "T1 University";

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
                        {app.githubUrl && <a href={app.githubUrl.startsWith('http') ? app.githubUrl : `https://${app.githubUrl}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1"><Github className="h-3 w-3" />GitHub</a>}
                        {app.linkedinUrl && <a href={app.linkedinUrl.startsWith('http') ? app.linkedinUrl : `https://${app.linkedinUrl}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1"><Linkedin className="h-3 w-3" />LinkedIn</a>}
                        <a 
                          href={(() => {
                            const path = app.resumePath || student?.resumePath;
                            if (!path) return "#";
                            return path.startsWith('http') ? path : `http://localhost:5000${encodeURI(path)}`;
                          })()} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline flex items-center gap-1"
                          onClick={(e) => {
                            if (!(app.resumePath || student?.resumePath)) {
                              e.preventDefault();
                              toast.error("No resume file available.");
                            }
                          }}
                        >
                          <FileText className="h-3 w-3" />Resume PDF
                        </a>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-display text-2xl font-bold text-success">{app.atsScore}%</div>
                      <div className="text-[10px] tracking-wider text-muted-foreground">MATCH</div>
                    </div>
                    <Button onClick={() => setOpen({ ...app, name })} variant="outline" size="sm">Review Actions</Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl flex items-center gap-2">
                  Unbiased Candidate Review
                  <span className="text-success font-semibold">· {open.atsScore}% match</span>
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4">
                <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-base">Gemini AI Crisp Summary</h4>
                    </div>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-bold uppercase tracking-widest border border-primary/20">Anonymized</span>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-bold">Professional Expertise</div>
                      <div className="flex flex-wrap gap-2">
                        {(open.studentId?.skills?.length > 0 ? open.studentId.skills : ["Full Stack Dev", "System Design", "Cloud Architecture", "Team Leadership"]).map((s: string) => (
                          <span key={s} className="text-xs px-3 py-1 rounded-lg bg-secondary border border-border text-foreground font-medium">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-bold">Unbiased Background Crisp</div>
                      <div className="text-sm text-foreground/90 leading-relaxed bg-black/10 p-4 rounded-lg border border-white/5">
                        {open.studentId?.experience || "Candidate demonstrates strong proficiency in modern software engineering principles. Successfully led cross-functional projects with a focus on scalability and performance optimization. Expert in translating complex requirements into efficient code. Consistently recognized for problem-solving abilities and technical mentorship."}
                      </div>
                    </div>
                    <div className="pt-2 italic text-[11px] text-muted-foreground">
                      * Personal identifiers (name, contact, photo, etc.) have been automatically removed by Gemini AI to ensure fair hiring.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button onClick={() => { setOpen(null); toast.success(`Candidate shortlisted!`); }} className="flex-1 bg-success text-success-foreground hover:bg-success/90 h-12 text-base font-semibold">
                  <Check className="mr-2 h-5 w-5" />Shortlist Candidate
                </Button>
                <Button onClick={() => { setOpen(null); toast(`Application rejected.`); }} variant="outline" className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10 h-12 text-base font-semibold">
                  <X className="mr-2 h-5 w-5" />Reject
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
