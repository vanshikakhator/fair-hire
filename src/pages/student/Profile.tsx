import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Github, Linkedin, FileText, ShieldCheck } from "lucide-react";

const Profile = () => (
  <DashboardLayout role="student">
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">Your master profile — anonymized before any recruiter sees it.</p>
      </div>

      <div className="rounded-2xl bg-gradient-card border border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground shadow-glow">AC</div>
          <div>
            <h2 className="font-display text-xl font-semibold">Alex Chen</h2>
            <p className="text-sm text-muted-foreground">Final-year CS · State University</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-success/15 text-success border border-success/30">
            <ShieldCheck className="h-3 w-3" /> Anonymized profile
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Full name</Label><Input className="mt-1.5 bg-secondary" defaultValue="Alex Chen" /></div>
          <div><Label>Email</Label><Input className="mt-1.5 bg-secondary" defaultValue="alex@university.edu" /></div>
          <div className="sm:col-span-2"><Label className="flex items-center gap-1.5"><Linkedin className="h-3 w-3" />LinkedIn</Label><Input className="mt-1.5 bg-secondary" defaultValue="linkedin.com/in/alexchen" /></div>
          <div className="sm:col-span-2"><Label className="flex items-center gap-1.5"><Github className="h-3 w-3" />GitHub</Label><Input className="mt-1.5 bg-secondary" defaultValue="github.com/alexchen-dev" /></div>
          <div className="sm:col-span-2">
            <Label>Skills (comma-separated)</Label>
            <Textarea rows={2} className="mt-1.5 bg-secondary" defaultValue="Python, TensorFlow, PyTorch, SQL, scikit-learn, FastAPI" />
          </div>
          <div className="sm:col-span-2">
            <Label className="flex items-center gap-1.5"><FileText className="h-3 w-3" />Master resume</Label>
            <Input type="file" accept=".pdf" className="mt-1.5 bg-secondary file:text-foreground" />
            <p className="text-xs text-muted-foreground mt-1.5">Currently uploaded: Resume-2.pdf · 142 KB</p>
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

export default Profile;
