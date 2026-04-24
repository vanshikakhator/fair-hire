import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { recruiterJobs } from "@/lib/mockData";
import { Plus, Briefcase, Users, ShieldCheck, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const stats = [
  { l: "ACTIVE ROLES", v: "3", icon: Briefcase, color: "text-info" },
  { l: "APPLICANTS", v: "285", icon: Users, color: "text-primary" },
  { l: "QUALIFIED (80%+)", v: "46", icon: ShieldCheck, color: "text-success" },
  { l: "OFFER RATE", v: "12%", icon: TrendingUp, color: "text-warning" },
];

const RecruiterDashboard = () => (
  <DashboardLayout role="recruiter">
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Talent Dashboard</h1>
          <p className="text-muted-foreground mt-1">Acme Inc. · Hiring without bias</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-primary-foreground shadow-glow"><Plus className="mr-1 h-4 w-4" />Post a Role</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Post a New Role</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); toast.success("Role posted! Resumes will be parsed and scored automatically."); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Role title</Label><Input className="mt-1.5 bg-secondary" placeholder="Senior ML Engineer" /></div>
                <div><Label>Work mode</Label><Input className="mt-1.5 bg-secondary" placeholder="Remote / Hybrid" /></div>
              </div>
              <div><Label>Required skills (comma-separated)</Label><Input className="mt-1.5 bg-secondary" placeholder="Python, PyTorch, MLOps" /></div>
              <div><Label>Job description</Label><Textarea rows={5} className="mt-1.5 bg-secondary" placeholder="Describe the role, responsibilities, and requirements…" /></div>
              <div><Label>Minimum CGPA (optional)</Label><Input className="mt-1.5 bg-secondary" placeholder="Leave blank to ignore" /></div>
              <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-glow">Publish Role</Button>
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
        <h2 className="font-semibold mb-3">Your Open Roles</h2>
        <div className="rounded-2xl bg-gradient-card border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr className="text-left text-[11px] tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">ROLE</th>
                <th className="px-5 py-3 font-medium">APPLICANTS</th>
                <th className="px-5 py-3 font-medium">QUALIFIED (80%+)</th>
                <th className="px-5 py-3 font-medium">STATUS</th>
                <th className="px-5 py-3 font-medium text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {recruiterJobs.map(j => (
                <tr key={j.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-4 font-medium">{j.role}</td>
                  <td className="px-5 py-4 text-muted-foreground">{j.applicants}</td>
                  <td className="px-5 py-4"><span className="text-success font-semibold">{j.qualified}</span></td>
                  <td className="px-5 py-4"><StatusBadge status={j.status as "Active" | "Paused"} /></td>
                  <td className="px-5 py-4 text-right">
                    <Link to="/recruiter/candidates"><Button size="sm" variant="outline">Review</Button></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default RecruiterDashboard;
