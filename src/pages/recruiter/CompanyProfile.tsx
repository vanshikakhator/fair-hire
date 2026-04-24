import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const CompanyProfile = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => api.get('/auth/me')
  });

  if (isLoading) return <DashboardLayout role="recruiter"><div className="p-8 text-center">Loading profile...</div></DashboardLayout>;

  return (
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
              <h2 className="font-display text-xl font-semibold">{user?.companyName}</h2>
              <p className="text-sm text-muted-foreground">Recruiter: {user?.recruiterName} · {user?.jobTitle}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Company name</Label><Input className="mt-1.5 bg-secondary" defaultValue={user?.companyName} readOnly /></div>
            <div><Label>Work email</Label><Input className="mt-1.5 bg-secondary" defaultValue={user?.email} readOnly /></div>
            <div><Label>Recruiter name</Label><Input className="mt-1.5 bg-secondary" defaultValue={user?.recruiterName} readOnly /></div>
            <div><Label>Job title</Label><Input className="mt-1.5 bg-secondary" defaultValue={user?.jobTitle} readOnly /></div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button className="bg-gradient-primary text-primary-foreground shadow-glow">Save Changes</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyProfile;
