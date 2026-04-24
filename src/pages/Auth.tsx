import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { api, setAuthToken } from "@/lib/api";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

export const StudentSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", university: "", password: "" });
  
  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/auth/register', { ...data, role: 'student' }),
    onSuccess: (data) => {
      setAuthToken(data.token);
      toast.success("Account created successfully!");
      navigate("/student");
    },
    onError: (error: any) => toast.error(error.message)
  });

  const submit = (e: FormEvent) => { e.preventDefault(); mutation.mutate(formData); };
  
  return (
    <AuthShell
      title="Create your student account"
      subtitle="Apply to roles where you're judged on skill alone."
      accent="For Students"
      footer={<>Already have an account? <Link to="/login/student" className="text-primary hover:underline">Log in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><Label>First name</Label><Input className="mt-1.5" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} /></div>
          <div><Label>Last name</Label><Input className="mt-1.5" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} /></div>
        </div>
        <div><Label>Email</Label><Input className="mt-1.5" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
        <div><Label>University</Label><Input className="mt-1.5" required value={formData.university} onChange={e => setFormData({...formData, university: e.target.value})} /></div>
        <div><Label>Password</Label><Input className="mt-1.5" type="password" required placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} /></div>
        <Button type="submit" disabled={mutation.isPending} className="w-full bg-gradient-primary text-primary-foreground shadow-glow">
          {mutation.isPending ? "Creating..." : "Create account"}
        </Button>
      </form>
      <p className="text-center text-xs text-muted-foreground">Are you hiring? <Link to="/signup/recruiter" className="text-primary hover:underline">Recruiter signup →</Link></p>
    </AuthShell>
  );
};

export const StudentLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/auth/login', data),
    onSuccess: (data) => {
      setAuthToken(data.token);
      toast.success("Welcome back!");
      navigate("/student");
    },
    onError: (error: any) => toast.error(error.message)
  });

  const submit = (e: FormEvent) => { e.preventDefault(); mutation.mutate(formData); };
  
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Track your applications and refine your resume."
      accent="Student Login"
      footer={<>New here? <Link to="/signup/student" className="text-primary hover:underline">Create account</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <div><Label>Email</Label><Input className="mt-1.5" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
        <div><Label>Password</Label><Input className="mt-1.5" type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} /></div>
        <Button type="submit" disabled={mutation.isPending} className="w-full bg-gradient-primary text-primary-foreground shadow-glow">
          {mutation.isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
};

export const RecruiterSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ companyName: "", recruiterName: "", jobTitle: "", email: "", password: "" });

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/auth/register', { ...data, role: 'recruiter' }),
    onSuccess: (data) => {
      setAuthToken(data.token);
      toast.success("Company account created!");
      navigate("/recruiter");
    },
    onError: (error: any) => toast.error(error.message)
  });

  const submit = (e: FormEvent) => { e.preventDefault(); mutation.mutate(formData); };
  
  return (
    <AuthShell
      title="Set up your company"
      subtitle="Post roles and review unbiased candidates."
      accent="For Recruiters"
      footer={<>Already onboarded? <Link to="/login/recruiter" className="text-primary hover:underline">Log in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <div><Label>Company name</Label><Input className="mt-1.5" required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Your name</Label><Input className="mt-1.5" required value={formData.recruiterName} onChange={e => setFormData({...formData, recruiterName: e.target.value})} /></div>
          <div><Label>Job title</Label><Input className="mt-1.5" required value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} /></div>
        </div>
        <div><Label>Work email</Label><Input className="mt-1.5" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
        <div><Label>Password</Label><Input className="mt-1.5" type="password" required placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} /></div>
        <Button type="submit" disabled={mutation.isPending} className="w-full bg-gradient-primary text-primary-foreground shadow-glow">
          {mutation.isPending ? "Creating..." : "Create company account"}
        </Button>
      </form>
      <p className="text-center text-xs text-muted-foreground">Looking for a job? <Link to="/signup/student" className="text-primary hover:underline">Student signup →</Link></p>
    </AuthShell>
  );
};

export const RecruiterLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/auth/login', data),
    onSuccess: (data) => {
      setAuthToken(data.token);
      toast.success("Welcome back!");
      navigate("/recruiter");
    },
    onError: (error: any) => toast.error(error.message)
  });

  const submit = (e: FormEvent) => { e.preventDefault(); mutation.mutate(formData); };
  
  return (
    <AuthShell
      title="Recruiter sign in"
      subtitle="Pick up where you left off with your candidate pipeline."
      accent="Recruiter Login"
      footer={<>New company? <Link to="/signup/recruiter" className="text-primary hover:underline">Create account</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <div><Label>Work email</Label><Input className="mt-1.5" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
        <div><Label>Password</Label><Input className="mt-1.5" type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} /></div>
        <Button type="submit" disabled={mutation.isPending} className="w-full bg-gradient-primary text-primary-foreground shadow-glow">
          {mutation.isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
};

