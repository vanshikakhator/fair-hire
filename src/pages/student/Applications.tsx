import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { applications } from "@/lib/mockData";
import { Lock } from "lucide-react";

const stats = [
  { l: "APPLIED", v: applications.length, color: "text-info" },
  { l: "SHORTLISTED", v: applications.filter(a => a.status === "Shortlisted").length, color: "text-warning" },
  { l: "ACCEPTED", v: applications.filter(a => a.status === "Accepted").length, color: "text-success" },
  { l: "REJECTED", v: applications.filter(a => a.status === "Rejected").length, color: "text-destructive" },
];

const Applications = () => {
  const rejected = applications.find(a => a.status === "Rejected" && a.feedback);
  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">My Applications</h1>
          <p className="text-muted-foreground mt-1">Track where each application stands in real-time</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.l} className="rounded-2xl bg-gradient-card border border-border p-5">
              <div className={`font-display text-3xl font-bold ${s.color}`}>{s.v}</div>
              <div className="text-[11px] tracking-wider text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-gradient-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr className="text-left text-[11px] tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">ROLE</th>
                  <th className="px-5 py-3 font-medium">COMPANY</th>
                  <th className="px-5 py-3 font-medium">ATS SCORE</th>
                  <th className="px-5 py-3 font-medium">STATUS</th>
                  <th className="px-5 py-3 font-medium">UPDATED</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(a => (
                  <tr key={a.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-4 font-medium">{a.role}</td>
                    <td className="px-5 py-4 text-muted-foreground"><span className="mr-1.5">{a.logo}</span>{a.company}</td>
                    <td className="px-5 py-4">
                      <span className={a.atsScore >= 80 ? "text-success font-semibold" : "text-muted-foreground font-semibold"}>{a.atsScore}%</span>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={a.status} /></td>
                    <td className="px-5 py-4 text-muted-foreground">{a.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {rejected && (
          <div className="rounded-2xl bg-gradient-card border border-border p-6 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-4 w-4 text-warning" />
              <h3 className="font-semibold">Application for {rejected.role} — {rejected.company}</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Automated feedback sent to your email</p>
            <p className="text-sm leading-relaxed">
              <span className="text-destructive font-semibold">{rejected.feedback?.split(".")[0]}.</span>{" "}
              <span className="text-muted-foreground">{rejected.feedback?.split(".").slice(1).join(".")}</span>
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {rejected.missingSkills?.map(s => (
                <span key={s} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{s}</span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">We've sent a detailed improvement guide to your registered email address.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Applications;
