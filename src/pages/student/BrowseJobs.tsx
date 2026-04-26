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
import { Search, MapPin, Calendar, ArrowRight, Briefcase, Check, X, FileText } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const toneClass = (tone?: string) =>
  tone === "success" ? "bg-success/15 text-success border-success/30"
    : tone === "warning" ? "bg-warning/15 text-warning border-warning/30"
      : tone === "info" ? "bg-info/15 text-info border-info/30"
        : "bg-primary/15 text-primary border-primary/30";

const BrowseJobs = () => {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [loc, setLoc] = useState("all");
  const [open, setOpen] = useState<any | null>(null);

  const { data: jobs = [], isLoading, error: jobsError } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => api.get('/jobs')
  });

  const { data: user, error: userError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => api.get('/auth/me')
  });

  const { data: myApplications = [] } = useQuery({
    queryKey: ['myApplications'],
    queryFn: () => api.get('/applications'),
    enabled: !!user
  });

  useEffect(() => {
    if (jobsError) console.error("Jobs fetch error:", jobsError);
    if (userError) console.error("User fetch error:", userError);
    console.log("Current jobs state:", jobs);
  }, [jobs, jobsError, userError]);

  const [appData, setAppData] = useState({ coverNote: "", linkedinUrl: "", githubUrl: "" });
  const [selectedResume, setSelectedResume] = useState<File | null>(null);
  const [resumePreviewUrl, setResumePreviewUrl] = useState<string>("");
  const [uploadedFilePath, setUploadedFilePath] = useState<string>("");

  useEffect(() => {
    if (user && open) {
      setAppData({
        coverNote: "",
        linkedinUrl: user.linkedinUrl || "",
        githubUrl: user.githubUrl || ""
      });
      setSelectedResume(null);
      setResumePreviewUrl("");
      setUploadedFilePath("");
    }
  }, [user, open]);

  const applyMutation = useMutation({
    mutationFn: (data: any) => api.post('/applications', {
      ...data,
      firstName: user?.firstName,
      lastName: user?.lastName,
      gender: user?.gender,
      email: user?.email,
      resumePath: uploadedFilePath || user?.resumePath
    }),
    onSuccess: () => {
      setOpen(null);
      toast.success("Application submitted! We'll parse your resume now.");
      setAppData({ coverNote: "", linkedinUrl: "", githubUrl: "" });
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
    onError: (err: any) => toast.error(err.message)
  });

  const filtered = useMemo(() => {
    if (!Array.isArray(jobs)) return [];
    return jobs.filter((j: any) => {
      const q = query.toLowerCase();
      const skillsString = (j.skills || []).join(" ").toLowerCase();
      const roleMatch = !q || (j.role || "").toLowerCase().includes(q);
      const companyMatch = !q || (j.company || "").toLowerCase().includes(q);
      const skillMatch = !q || skillsString.includes(q);

      const matchQ = roleMatch || companyMatch || skillMatch;
      const matchRole = role === "all" || (j.role || "").toLowerCase().includes(role);
      const matchLoc = loc === "all" || (j.workMode || "").toLowerCase() === loc;

      return matchQ && matchRole && matchLoc;
    });
  }, [query, role, loc, jobs]);

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div className="bg-primary/5 p-2 rounded text-[10px] text-muted-foreground uppercase tracking-widest text-center">
          FairHire Merit Pipeline Active
        </div>
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
          {filtered.length > 0 ? (
            filtered.map((j: any) => (
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
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />Active
                  </span>
                  {user?.resumePath && (
                    <span className="text-[10px] text-success inline-flex items-center gap-1 mt-0.5">
                      <FileText className="h-2.5 w-2.5" /> Resume attached
                    </span>
                  )}
                </div>
                {myApplications.some((app: any) => app.jobId?._id === j._id || app.jobId === j._id) ? (
                  <Button size="sm" variant="secondary" disabled className="bg-success/20 text-success border-success/30">
                    <Check className="mr-1 h-3 w-3" /> Applied
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setOpen(j)} className="group-hover:border-primary group-hover:text-primary">
                    Apply Now <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                )}
              </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-3xl">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No jobs found</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mt-1">
                We couldn't find any active roles matching your current search or filters.
              </p>
              <Button variant="link" onClick={() => { setQuery(""); setRole("all"); setLoc("all"); }} className="mt-2 text-primary">
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Apply for {open?.role}</DialogTitle>
            <DialogDescription>{open?.company} · Confirmed details will be sent.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            applyMutation.mutate({ jobId: open?._id, ...appData });
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Name</Label>
                <div className="mt-1 text-sm font-medium">{user?.firstName} {user?.lastName}</div>
              </div>
              <div>
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Gender</Label>
                <div className="mt-1 text-sm font-medium">{user?.gender || "Not specified"}</div>
              </div>
            </div>

            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">LinkedIn URL</Label>
              <Input
                value={appData.linkedinUrl}
                onChange={e => setAppData({ ...appData, linkedinUrl: e.target.value })}
                className="mt-1.5 bg-secondary" placeholder="linkedin.com/in/alexchen"
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">GitHub URL</Label>
              <Input
                value={appData.githubUrl}
                onChange={e => setAppData({ ...appData, githubUrl: e.target.value })}
                className="mt-1.5 bg-secondary" placeholder="github.com/alexchen-dev"
              />
            </div>

            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Resume (Required)</Label>
              {(user?.resumePath || selectedResume) ? (
                <div className="mt-1.5 space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-success/30 bg-success/5 group/resume hover:bg-success/10 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-success" />
                      </div>
                      <div className="min-w-0">
                        <a 
                          href={(() => {
                            if (resumePreviewUrl) return resumePreviewUrl;
                            if (!user?.resumePath) return "#";
                            return user.resumePath.startsWith('http') ? user.resumePath : `http://localhost:5000${encodeURI(user.resumePath)}`;
                          })()} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm font-medium text-success hover:underline truncate block"
                        >
                          {selectedResume ? selectedResume.name : user?.resumePath?.split('/').pop()}
                        </a>
                        <span className="text-[10px] text-success/60 uppercase tracking-tighter font-semibold">
                          {selectedResume ? "New resume selected" : "Click to view profile resume"}
                        </span>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-transparent"
                      onClick={() => document.getElementById('resume-upload')?.click()}
                    >
                      Change
                    </Button>
                  </div>
                  <Input 
                    id="resume-upload"
                    type="file" 
                    accept=".pdf" 
                    className="hidden" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const formDataFile = new FormData();
                        formDataFile.append('file', file);
                        try {
                          const { filePath } = await api.upload('/upload', formDataFile);
                          setSelectedResume(file); // Keep for name display
                          setResumePreviewUrl(`http://localhost:5000${filePath}`);
                          setUploadedFilePath(filePath);
                          toast.success("Resume uploaded successfully!");
                        } catch (err) {
                          toast.error("Upload failed");
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="mt-1.5">
                  <Input 
                    type="file" 
                    accept=".pdf" 
                    required 
                    className="bg-secondary file:text-foreground text-xs h-11"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const formDataFile = new FormData();
                        formDataFile.append('file', file);
                        try {
                          const { filePath } = await api.upload('/upload', formDataFile);
                          setSelectedResume(file);
                          setResumePreviewUrl(`http://localhost:5000${filePath}`);
                          setUploadedFilePath(filePath);
                          toast.success("Resume uploaded successfully!");
                        } catch (err) {
                          toast.error("Upload failed");
                        }
                      }
                    }}
                  />
                  <p className="text-[10px] text-destructive mt-1.5 flex items-center gap-1">
                    <X className="h-3 w-3" /> No resume found. Please upload one.
                  </p>
                </div>
              )}
            </div>

            <Button type="submit" disabled={applyMutation.isPending} className="w-full bg-gradient-primary text-primary-foreground shadow-glow h-11">
              {applyMutation.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default BrowseJobs;
