import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Briefcase, Users, ShieldCheck, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const RecruiterDashboard = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [jobData, setJobData] = useState({ role: "", workMode: "", skills: "", description: "", minCgpa: "" });

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['recruiterJobs'],
    queryFn: () => api.get('/jobs')
  });

  const postMutation = useMutation({
    mutationFn: (data: any) => api.post('/jobs', {
      ...data,
      skills: data.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
    }),
    onSuccess: () => {
      setOpen(false);
      setJobData({ role: "", workMode: "", skills: "", description: "", minCgpa: "" });
      toast.success("Role posted! Resumes will be parsed and scored automatically.");
      queryClient.invalidateQueries({ queryKey: ['recruiterJobs'] });
    },
    onError: (err: any) => toast.error(err.message)
  });

  const totalApplicants = jobs.reduce((acc: number, j: any) => acc + (j.applicants || 0), 0);
  const totalQualified = jobs.reduce((acc: number, j: any) => acc + (j.qualified || 0), 0);

  const stats = [
    { l: "ACTIVE ROLES", v: isLoading ? "-" : jobs.length.toString(), icon: Briefcase, color: "text-info" },
    { l: "APPLICANTS", v: isLoading ? "-" : totalApplicants.toString(), icon: Users, color: "text-primary" },
    { l: "QUALIFIED (80%+)", v: isLoading ? "-" : totalQualified.toString(), icon: ShieldCheck, color: "text-success" },
    { l: "OFFER RATE", v: "12%", icon: TrendingUp, color: "text-warning" },
  ];

  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold">Talent Dashboard</h1>
            <p className="text-muted-foreground mt-1">Hiring without bias</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-primary-foreground shadow-glow"><Plus className="mr-1 h-4 w-4" />Post a Role</Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Post a New Role</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => { 
                e.preventDefault(); 
                postMutation.mutate(jobData);
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Role title</Label>
                    <Input className="mt-1.5 bg-secondary" required value={jobData.role} onChange={e => setJobData({...jobData, role: e.target.value})} placeholder="Senior ML Engineer" />
                  </div>
                  <div>
                    <Label>Work mode</Label>
                    <Input className="mt-1.5 bg-secondary" required value={jobData.workMode} onChange={e => setJobData({...jobData, workMode: e.target.value})} placeholder="Remote / Hybrid" />
                  </div>
                </div>
                <div>
                  <Label>Required skills (comma-separated)</Label>
                  <Input className="mt-1.5 bg-secondary" value={jobData.skills} onChange={e => setJobData({...jobData, skills: e.target.value})} placeholder="Python, PyTorch, MLOps" />
                </div>
                <div>
                  <Label>Job description</Label>
                  <Textarea rows={5} className="mt-1.5 bg-secondary" required value={jobData.description} onChange={e => setJobData({...jobData, description: e.target.value})} placeholder="Describe the role, responsibilities, and requirements…" />
                </div>
                <div>
                  <Label>Minimum CGPA (optional)</Label>
                  <Input className="mt-1.5 bg-secondary" value={jobData.minCgpa} onChange={e => setJobData({...jobData, minCgpa: e.target.value})} placeholder="Leave blank to ignore" />
                </div>
                <Button type="submit" disabled={postMutation.isPending} className="w-full bg-gradient-primary text-primary-foreground shadow-glow">
                  {postMutation.isPending ? "Publishing..." : "Publish Role"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.l} className="rounded-2xl bg-gradient-card border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div className={`font-display text-3xl font-bold ${s.color}`}>{s.v}</div>
              <div className="text-[11px] tracking-wider text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="font-semibold mb-4">Your Open Roles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="col-span-full py-12 text-center text-muted-foreground">Loading roles...</div>
            ) : jobs.length === 0 ? (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-2xl text-muted-foreground">No roles posted yet.</div>
            ) : jobs.map((j: any) => {
              const daysAgo = Math.floor((new Date().getTime() - new Date(j.createdAt).getTime()) / (1000 * 3600 * 24));
              
              return (
                <div key={j._id} className="rounded-2xl bg-gradient-card border border-border p-5 hover:border-primary/40 transition-all hover:shadow-elegant group flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg leading-tight truncate">{j.role}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={j.status as "Active" | "Paused"} />
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{j.workMode}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">{j.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(j.skills || []).slice(0, 3).map((s: string) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">{s}</span>
                    ))}
                    {j.skills?.length > 3 && <span className="text-[10px] text-muted-foreground">+{j.skills.length - 3} more</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4 pt-3 border-t border-border/50">
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Applicants</div>
                      <div className="font-semibold">{j.applicants || 0}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Qualified</div>
                      <div className="font-semibold text-success">{j.qualified || 0}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                    <span className="text-[11px] text-muted-foreground">
                      Posted {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                    </span>
                    <Link to={`/recruiter/candidates?jobId=${j._id}`}>
                      <Button size="sm" variant="outline" className="group-hover:border-primary group-hover:text-primary transition-colors">
                        Review Resumes
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterDashboard;
