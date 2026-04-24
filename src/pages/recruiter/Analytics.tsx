import { DashboardLayout } from "@/components/DashboardLayout";
import { TrendingUp, Users, ShieldCheck, Award } from "lucide-react";

const Analytics = () => (
  <DashboardLayout role="recruiter">
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Hiring Analytics</h1>
        <p className="text-muted-foreground mt-1">Bias-detection insights across your pipeline</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { l: "DIVERSITY INDEX", v: "8.4/10", c: "text-success", i: ShieldCheck, sub: "↑ 23% vs last quarter" },
          { l: "AVG TIME TO HIRE", v: "11d", c: "text-info", i: TrendingUp, sub: "↓ 4d vs industry" },
          { l: "QUALIFIED PER ROLE", v: "46", c: "text-primary", i: Users, sub: "Above 80% ATS" },
          { l: "OFFER ACCEPT RATE", v: "94%", c: "text-warning", i: Award, sub: "Industry leading" },
        ].map(s => (
          <div key={s.l} className="rounded-2xl bg-gradient-card border border-border p-5">
            <s.i className={`h-5 w-5 ${s.c} mb-3`} />
            <div className={`font-display text-3xl font-bold ${s.c}`}>{s.v}</div>
            <div className="text-[11px] tracking-wider text-muted-foreground mt-1">{s.l}</div>
            <div className="text-xs text-muted-foreground mt-2">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-gradient-card border border-border p-6">
        <h3 className="font-semibold mb-4">Bias Indicators Removed</h3>
        <div className="space-y-3">
          {[
            { label: "Names & demographic identifiers", count: 285 },
            { label: "Photos", count: 142 },
            { label: "Addresses", count: 285 },
            { label: "College pedigree (replaced with tier)", count: 285 },
            { label: "CGPA (when not in JD)", count: 198 },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary/40">
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-success" />{item.label}
              </div>
              <span className="text-sm font-semibold text-success">{item.count} resumes</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default Analytics;
