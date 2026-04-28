import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldCheck, Check, X, FileText, Briefcase, Github, Linkedin, Download, Table, Sparkles, AlertCircle, Bug, Terminal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const KEY_MAP: Record<string, string> = {
    "candidate":            "Candidate Name",
    "candidate_name":       "Candidate Name",
    "name":                 "Candidate Name",
    "candidate_email":      "Candidate Email",
    "email":                "Candidate Email",
    "score":                "Score",
    "ats_score":            "Score",
    "match_score":          "Score",
    "strengths":            "Strengths",
    "strength":             "Strengths",
    "gaps":                 "Gaps",
    "gap":                  "Gaps",
};

const normalise = (d: any): any => {
    if (!d || typeof d !== 'object' || Array.isArray(d)) return d;
    const out: any = {};
    for (const k in d) {
        const canon = KEY_MAP[k.trim().toLowerCase()] || k;
        out[canon] = d[k];
    }
    return out;
};

const extractCandidatesRaw = (raw: any): any[] => {
    if (!raw) return [];
    if (typeof raw === 'string') {
        try { return extractCandidatesRaw(JSON.parse(raw.trim())); } catch (e) { return []; }
    }
    if (Array.isArray(raw)) return raw.flatMap(item => extractCandidatesRaw(item));
    if (typeof raw === 'object' && raw !== null) {
        const norm = normalise(raw);
        if (norm["Candidate Name"] || norm["Score"]) return [norm];
        const results: any[] = [];
        for (const key in raw) {
            if (raw[key] && typeof raw[key] === 'object') results.push(...extractCandidatesRaw(raw[key]));
        }
        return results;
    }
    return [];
};

const Candidates = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');
  const [open, setOpen] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [screeningResults, setScreeningResults] = useState<any[] | null>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['candidates', jobId],
    queryFn: () => api.get(`/applications?jobId=${jobId}`),
    enabled: !!jobId,
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ['recruiterJobs'],
    queryFn: () => api.get('/jobs')
  });

  const selectedJob = jobs.find((j: any) => j._id === jobId);

  const runAIAnalysis = async () => {
    if (!jobId) return;
    setIsAnalyzing(true);
    setScreeningResults(null);
    const toastId = toast.loading("AI is analyzing resumes...");
    
    try {
      const response = await api.post(`/jobs/${jobId}/analyze`, {});
      setRawResponse(response);
      const extracted = extractCandidatesRaw(response);
      
      // SMART MERGING: Match AI results back to our known candidates
      const merged = applications.map((app: any) => {
        const student = app.studentId || {};
        const localName = `${student.firstName || app.firstName || "Anonymous"} ${student.lastName || app.lastName || "Candidate"}`;
        const localEmail = student.email || app.email;
        
        // Find if n8n returned a result for this specific email or name
        const aiResult = extracted.find(res => 
          (res["Candidate Email"]?.toLowerCase() === localEmail?.toLowerCase()) ||
          (res["Candidate Name"]?.toLowerCase() === localName?.toLowerCase())
        );

        if (aiResult) {
          return {
            ...aiResult,
            "Candidate Name": localName, // Override "N/A" with real name
            "Candidate Email": localEmail,
            "Score": aiResult.Score || 0,
            "isAi": true
          };
        }

        // Default if AI missed this person or they have a bad PDF
        return {
          "Candidate Name": localName,
          "Candidate Email": localEmail,
          "Score": 0,
          "Strengths": ["N/A"],
          "Gaps": ["Invalid or Missing Resume Content"],
          "isAi": false
        };
      });

      setScreeningResults(merged.sort((a, b) => (Number(b.Score) || 0) - (Number(a.Score) || 0)));
      toast.success(`Analysis synced for ${merged.length} applicants.`, { id: toastId });
    } catch (error: any) {
      const msg = error.message || "Analysis failed";
      toast.error(`${msg}. Please check your n8n workflow status.`, { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-display text-3xl font-bold">Candidates</h1>
            <p className="text-muted-foreground mt-1">{selectedJob?.role} · {applications.length} applicants</p>
          </div>
          <div className="flex gap-2">
            {rawResponse && (
              <Button variant="ghost" size="sm" onClick={() => setShowDebug(!showDebug)} className="text-[10px] gap-1.5">
                <Bug className="h-3 w-3" /> {showDebug ? "Hide Debug" : "Show Raw n8n Data"}
              </Button>
            )}
          </div>
        </div>

        {showDebug && rawResponse && (
          <div className="rounded-xl border border-warning/30 bg-black/40 p-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-warning uppercase"><Terminal className="h-3 w-3" /> Raw Webhook Output</div>
            <pre className="text-[10px] overflow-auto max-h-40 font-mono text-warning/80">{JSON.stringify(rawResponse, null, 2)}</pre>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs text-primary">
            <Sparkles className="h-3.5 w-3.5" /> ResumeIQ Ready
          </div>
          {jobId && applications.length > 0 && (
            <Button 
              variant="default" size="sm" 
              className="gap-2 bg-gradient-to-r from-[#c8ff6e] to-[#00e5c8] text-black font-bold" 
              onClick={runAIAnalysis} disabled={isAnalyzing}
            >
              <ShieldCheck className="h-4 w-4" /> {isAnalyzing ? "Processing..." : "🚀 Run AI Screening"}
            </Button>
          )}
        </div>

        {screeningResults && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <Table className="h-5 w-5 text-primary" /> 📊 AI Screening Results
            </h2>
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/50">
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 font-semibold text-[10px] uppercase text-muted-foreground text-center">Score</th>
                    <th className="px-4 py-3 font-semibold text-[10px] uppercase text-muted-foreground">Candidate</th>
                    <th className="px-4 py-3 font-semibold text-[10px] uppercase text-muted-foreground">Strengths</th>
                    <th className="px-4 py-3 font-semibold text-[10px] uppercase text-muted-foreground">Gaps</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {screeningResults.map((c, i) => (
                    <tr key={i} className="hover:bg-primary/5 transition-colors">
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center justify-center h-10 w-10 rounded-full font-bold ${
                          Number(c.Score) >= 80 ? 'bg-success/20 text-success' :
                          Number(c.Score) >= 50 ? 'bg-warning/20 text-warning' : 'bg-destructive/20 text-destructive'
                        }`}>
                          {c.Score}%
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold">{c["Candidate Name"]}</div>
                        <div className="text-[10px] text-muted-foreground">{c["Candidate Email"]}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(c.Strengths) ? c.Strengths : [c.Strengths]).map((s: any, idx: number) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-success/10 text-success border border-success/20">{String(s)}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(c.Gaps) ? c.Gaps : [c.Gaps]).map((g: any, idx: number) => (
                            <span key={idx} className={`text-[10px] px-2 py-0.5 rounded border ${c.Score === 0 ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                              {String(g)}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2"><Briefcase className="h-5 w-5 text-muted-foreground" /> All Applicants</h2>
          <div className="grid gap-3">
            {applications.map((app: any) => {
              const student = app.studentId;
              const name = student ? `${student.firstName} ${student.lastName}` : (app.firstName ? `${app.firstName} ${app.lastName}` : "Anonymous");
              return (
                <div key={app._id} className="rounded-2xl bg-gradient-card border border-border p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center font-bold">{name[0]}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{name}</h3>
                    <div className="text-xs text-muted-foreground">Applied {new Date(app.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-success">{app.atsScore}%</div>
                    <div className="text-[10px] text-muted-foreground uppercase">ATS Match</div>
                  </div>
                  <Button onClick={() => setOpen({ ...app, name })} variant="outline" size="sm">Review</Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="bg-card border-border max-w-2xl">
          {open && (
            <>
              <DialogHeader><DialogTitle>Candidate Review · {open.atsScore}% match</DialogTitle></DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="rounded-xl bg-primary/5 p-6 border border-primary/20">
                  <h4 className="font-semibold mb-2">Experience Summary</h4>
                  <p className="text-sm text-muted-foreground">{open.studentId?.experience || "No details provided."}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Candidates;
