import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Github, Linkedin, FileText, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const Profile = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => api.get('/auth/me')
  });

  if (isLoading) return <DashboardLayout role="student"><div className="p-8 text-center">Loading profile...</div></DashboardLayout>;

  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`;

  return (
    <DashboardLayout role="student">
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="font-display text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Your master profile — anonymized before any recruiter sees it.</p>
        </div>

        <div className="rounded-2xl bg-gradient-card border border-border p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground shadow-glow uppercase">{initials || "ST"}</div>
            <div>
              <h2 className="font-display text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
              <p className="text-sm text-muted-foreground">{user?.university || "Student"}</p>
            </div>
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-success/15 text-success border border-success/30">
              <ShieldCheck className="h-3 w-3" /> Anonymized profile
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>First name</Label><Input className="mt-1.5 bg-secondary" defaultValue={user?.firstName} readOnly /></div>
            <div><Label>Last name</Label><Input className="mt-1.5 bg-secondary" defaultValue={user?.lastName} readOnly /></div>
            <div className="sm:col-span-2"><Label>Email</Label><Input className="mt-1.5 bg-secondary" defaultValue={user?.email} readOnly /></div>
            <div className="sm:col-span-2"><Label>University</Label><Input className="mt-1.5 bg-secondary" defaultValue={user?.university} readOnly /></div>
            <div className="sm:col-span-2"><Label className="flex items-center gap-1.5"><Linkedin className="h-3 w-3" />LinkedIn</Label><Input className="mt-1.5 bg-secondary" defaultValue={user?.linkedinUrl || ""} placeholder="https://linkedin.com/in/..." /></div>
            <div className="sm:col-span-2"><Label className="flex items-center gap-1.5"><Github className="h-3 w-3" />GitHub</Label><Input className="mt-1.5 bg-secondary" defaultValue={user?.githubUrl || ""} placeholder="https://github.com/..." /></div>
            
            <div className="sm:col-span-2">
              <Label className="flex items-center gap-1.5"><FileText className="h-3 w-3" />Master resume</Label>
              <Input type="file" accept=".pdf" className="mt-1.5 bg-secondary file:text-foreground" />
              {user?.resumePath && <p className="text-xs text-muted-foreground mt-1.5">Currently uploaded: {user.resumePath.split('/').pop()}</p>}
            </div>
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

export default Profile;
