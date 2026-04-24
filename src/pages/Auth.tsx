import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent } from "react";

export const StudentSignup = () => {
  const navigate = useNavigate();
  const submit = (e: FormEvent) => { e.preventDefault(); navigate("/student"); };
  return (
    <AuthShell
      title="Create your student account"
      subtitle="Apply to roles where you're judged on skill alone."
      accent="For Students"
      footer={<>Already have an account? <Link to="/login/student" className="text-primary hover:underline">Log in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><Label>First name</Label><Input className="mt-1.5" defaultValue="Alex" /></div>
          <div><Label>Last name</Label><Input className="mt-1.5" defaultValue="Chen" /></div>
        </div>
        <div><Label>Email</Label><Input className="mt-1.5" type="email" defaultValue="alex@university.edu" /></div>
        <div><Label>University</Label><Input className="mt-1.5" defaultValue="State University" /></div>
        <div><Label>Password</Label><Input className="mt-1.5" type="password" placeholder="••••••••" /></div>
        <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-glow">Create account</Button>
      </form>
      <p className="text-center text-xs text-muted-foreground">Are you hiring? <Link to="/signup/recruiter" className="text-primary hover:underline">Recruiter signup →</Link></p>
    </AuthShell>
  );
};

export const StudentLogin = () => {
  const navigate = useNavigate();
  const submit = (e: FormEvent) => { e.preventDefault(); navigate("/student"); };
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Track your applications and refine your resume."
      accent="Student Login"
      footer={<>New here? <Link to="/signup/student" className="text-primary hover:underline">Create account</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <div><Label>Email</Label><Input className="mt-1.5" type="email" defaultValue="alex@university.edu" /></div>
        <div><Label>Password</Label><Input className="mt-1.5" type="password" defaultValue="demo1234" /></div>
        <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-glow">Sign in</Button>
      </form>
    </AuthShell>
  );
};

export const RecruiterSignup = () => {
  const navigate = useNavigate();
  const submit = (e: FormEvent) => { e.preventDefault(); navigate("/recruiter"); };
  return (
    <AuthShell
      title="Set up your company"
      subtitle="Post roles and review unbiased candidates."
      accent="For Recruiters"
      footer={<>Already onboarded? <Link to="/login/recruiter" className="text-primary hover:underline">Log in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <div><Label>Company name</Label><Input className="mt-1.5" defaultValue="Acme Inc." /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Your name</Label><Input className="mt-1.5" defaultValue="Jamie" /></div>
          <div><Label>Job title</Label><Input className="mt-1.5" defaultValue="Talent Lead" /></div>
        </div>
        <div><Label>Work email</Label><Input className="mt-1.5" type="email" placeholder="you@company.com" /></div>
        <div><Label>Password</Label><Input className="mt-1.5" type="password" placeholder="••••••••" /></div>
        <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-glow">Create company account</Button>
      </form>
      <p className="text-center text-xs text-muted-foreground">Looking for a job? <Link to="/signup/student" className="text-primary hover:underline">Student signup →</Link></p>
    </AuthShell>
  );
};

export const RecruiterLogin = () => {
  const navigate = useNavigate();
  const submit = (e: FormEvent) => { e.preventDefault(); navigate("/recruiter"); };
  return (
    <AuthShell
      title="Recruiter sign in"
      subtitle="Pick up where you left off with your candidate pipeline."
      accent="Recruiter Login"
      footer={<>New company? <Link to="/signup/recruiter" className="text-primary hover:underline">Create account</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <div><Label>Work email</Label><Input className="mt-1.5" type="email" defaultValue="jamie@acme.com" /></div>
        <div><Label>Password</Label><Input className="mt-1.5" type="password" defaultValue="demo1234" /></div>
        <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-glow">Sign in</Button>
      </form>
    </AuthShell>
  );
};
