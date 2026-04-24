import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, MapPin, Calendar, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useQuery, useMutation } from "@tanstack/react-query";

const toneClass = (tone?: string) =>
  tone === "success" ? "bg-success/15 text-success border-success/30"
  : tone === "warning" ? "bg-warning/15 text-warning border-warning/30"
  : tone === "info" ? "bg-info/15 text-info border-info/30"
  : "bg-primary/15 text-primary border-primary/30";

const BrowseJobs = () => {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [loc, setLoc] = useState("all");
  const [open, setOpen] = useState<any | null>(null);
  
  const [appData, setAppData] = useState({ coverNote: "", linkedinUrl: "", githubUrl: "" });

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => api.get('/jobs')
  });

  const applyMutation = useMutation({
    mutationFn: (data: any) => api.post('/applications', data),
    onSuccess: () => {
      setOpen(null);
      toast.success("Application submitted! We'll parse your resume now.");
      setAppData({ coverNote: "", linkedinUrl: "", githubUrl: "" });
    },
    onError: (err: any) => toast.error(err.message)
  });

  const filtered = useMemo(() => jobs.filter((j: any) => {
    const q = query.toLowerCase();
    const skillsString = j.skills ? j.skills.join(" ").toLowerCase() : "";
    const matchQ = !q || j.role.toLowerCase().includes(q) || (j.company && j.company.toLowerCase().includes(q)) || skillsString.includes(q);
    const matchRole = role === "all" || j.role.toLowerCase().includes(role);
    const matchLoc = loc === "all" || (j.workMode && j.workMode.toLowerCase() === loc);
    return matchQ && matchRole && matchLoc;
  }), [query, role, loc, jobs]);

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Browse Openings</h1>
          <p className="text-muted-foreground mt-1">
            {isLoading ? "Loading..." : `${filtered.length} active roles matching your profile`}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search roles, companies, skills…" className="pl-9 h-11 bg-card" />
          </div>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full md:w-44 h-11 bg-card"><SelectValue placeholder="All Roles" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="engineer">Engineering</SelectItem>
              <SelectItem value="data">Data</SelectItem>
              <SelectItem value="design">Design</SelectItem>
            </SelectContent>
          </Select>
          <Select value={loc} onValueChange={setLoc}>
            <SelectTrigger className="w-full md:w-44 h-11 bg-card"><SelectValue placeholder="Any Location" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Location</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="on-site">On-site</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((j: any) => (
            <div key={j._id} className="rounded-2xl bg-gradient-card border border-border p-5 hover:border-primary/40 transition-all hover:shadow-elegant group">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-xl shrink-0">{j.logo || "💼"}</div>
                  <div className="min-w-0">
                    <h3 className="font-semibold leading-tight truncate">{j.role}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{j.company || "Company"}</p>
                  </div>
                </div>
                {j.badge && (
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap", toneClass(j.badgeTone))}>
                    {j.badge}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{j.location || j.workMode}</span>
                <span>·</span>
                <span>{j.workMode}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4 min-h-[60px]">{j.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(j.skills || []).slice(0, 4).map((s: string) => (
                  <span key={s} className="text-[11px] px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{s}</span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />Active
                </span>
                <Button size="sm" variant="outline" onClick={() => setOpen(j)} className="group-hover:border-primary group-hover:text-primary">
                  Apply Now <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Apply for {open?.role}</DialogTitle>
            <DialogDescription>{open?.company} · Your profile will be anonymized before sharing.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            applyMutation.mutate({ jobId: open?._id, ...appData });
          }} className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Cover note (optional)</Label>
              <Textarea 
                value={appData.coverNote}
                onChange={e => setAppData({...appData, coverNote: e.target.value})}
                className="mt-1.5 bg-secondary" placeholder="What excites you about this role?" rows={3} 
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Resume (PDF)</Label>
              <Input type="file" accept=".pdf" className="mt-1.5 bg-secondary file:text-foreground" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">LinkedIn URL</Label>
              <Input 
                value={appData.linkedinUrl}
                onChange={e => setAppData({...appData, linkedinUrl: e.target.value})}
                className="mt-1.5 bg-secondary" placeholder="linkedin.com/in/alexchen" 
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">GitHub URL</Label>
              <Input 
                value={appData.githubUrl}
                onChange={e => setAppData({...appData, githubUrl: e.target.value})}
                className="mt-1.5 bg-secondary" placeholder="github.com/alexchen-dev" 
              />
            </div>
            <Button type="submit" disabled={applyMutation.isPending} className="w-full bg-gradient-primary text-primary-foreground shadow-glow">
              {applyMutation.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default BrowseJobs;
