import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CompanyProfile = () => (
  <DashboardLayout role="recruiter">
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-bold">Company Profile</h1>
        <p className="text-muted-foreground mt-1">How your company appears to candidates</p>
      </div>

      <div className="rounded-2xl bg-gradient-card border border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-info to-primary flex items-center justify-center text-2xl shadow-glow">🏢</div>
          <div>
            <h2 className="font-display text-xl font-semibold">Acme Inc.</h2>
            <p className="text-sm text-muted-foreground">Recruiter: Jamie · Talent Lead</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Company name</Label><Input className="mt-1.5 bg-secondary" defaultValue="Acme Inc." /></div>
          <div><Label>Industry</Label><Input className="mt-1.5 bg-secondary" defaultValue="Software" /></div>
          <div><Label>Work email</Label><Input className="mt-1.5 bg-secondary" defaultValue="jamie@acme.com" /></div>
          <div><Label>Company size</Label><Input className="mt-1.5 bg-secondary" defaultValue="500-1000" /></div>
          <div className="sm:col-span-2"><Label>Website</Label><Input className="mt-1.5 bg-secondary" defaultValue="https://acme.com" /></div>
          <div className="sm:col-span-2"><Label>About</Label><Textarea rows={3} className="mt-1.5 bg-secondary" defaultValue="We build modern infrastructure for high-growth teams." /></div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button className="bg-gradient-primary text-primary-foreground shadow-glow">Save Changes</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default CompanyProfile;
