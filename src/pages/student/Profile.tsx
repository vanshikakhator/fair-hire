import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Github, Linkedin, FileText, ShieldCheck, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, API_BASE_URL } from "@/lib/api";

import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: user, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => api.get('/auth/me')
  });

  const [formData, setFormData] = useState<any>({
    firstName: "",
    lastName: "",
    gender: "",
    phoneNo: "",
    linkedinUrl: "",
    githubUrl: "",
    resumePath: "",
    skills: "",
    experience: "",
    education: {
      degreeType: "",
      institution: "",
      stream: "",
      graduationYear: "",
      isWorking: false
    }
  });
  const [resumePreviewUrl, setResumePreviewUrl] = useState<string>("");

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        gender: user.gender || "",
        phoneNo: user.phoneNo || "",
        linkedinUrl: user.linkedinUrl || "",
        githubUrl: user.githubUrl || "",
        resumePath: user.resumePath || "",
        skills: user.skills?.join(", ") || "",
        experience: user.experience || "",
        education: {
          degreeType: user.education?.degreeType || "",
          institution: user.education?.institution || "",
          stream: user.education?.stream || "",
          graduationYear: user.education?.graduationYear || "",
          isWorking: user.education?.isWorking || false
        }
      });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.put('/auth/me', data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (err: any) => toast.error(err.message)
  });

  if (isLoading) return <DashboardLayout role="student"><div className="p-8 text-center">Loading profile...</div></DashboardLayout>;

  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`;

  return (
    <DashboardLayout role="student">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="font-display text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Complete your profile to automatically autofill job applications.</p>
        </div>

        <div className="rounded-2xl bg-gradient-card border border-border p-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground shadow-glow uppercase">{initials || "ST"}</div>
            <div>
              <h2 className="font-display text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
              <p className="text-sm text-muted-foreground">{formData.education?.institution || "Student"}</p>
            </div>
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-success/15 text-success border border-success/30">
              <ShieldCheck className="h-3 w-3" /> Secure profile
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Personal Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>First name</Label>
                  <Input className="mt-1.5 bg-secondary" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div>
                  <Label>Last name</Label>
                  <Input className="mt-1.5 bg-secondary" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Gender</Label>
                  <Input className="mt-1.5 bg-secondary" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} placeholder="Male/Female/Other" />
                </div>
                <div>
                  <Label>Phone No</Label>
                  <Input className="mt-1.5 bg-secondary" value={formData.phoneNo} onChange={e => setFormData({...formData, phoneNo: e.target.value})} placeholder="+91..." />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input className="mt-1.5 bg-secondary/50" value={user?.email} readOnly disabled />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Professional Links</h3>
              <div>
                <Label className="flex items-center gap-1.5"><Linkedin className="h-3 w-3" />LinkedIn URL</Label>
                <Input className="mt-1.5 bg-secondary" value={formData.linkedinUrl} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} placeholder="linkedin.com/in/..." />
              </div>
              <div>
                <Label className="flex items-center gap-1.5"><Github className="h-3 w-3" />GitHub URL</Label>
                <Input className="mt-1.5 bg-secondary" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} placeholder="github.com/..." />
              </div>
              <div>
                <Label className="flex items-center gap-1.5"><FileText className="h-3 w-3" />Master resume (PDF)</Label>
                {formData.resumePath ? (
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
                              if (!formData.resumePath) return "#";
                              return formData.resumePath.startsWith('http') ? formData.resumePath : `${API_BASE_URL}${encodeURI(formData.resumePath)}`;
                            })()} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm font-medium text-success hover:underline truncate block"
                          >
                            {formData.resumePath.split('/').pop()}
                          </a>
                          <span className="text-[10px] text-success/60 uppercase tracking-tighter font-semibold">Click to view master resume</span>
                        </div>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => document.getElementById('master-resume-upload')?.click()}
                      >
                        Change
                      </Button>
                    </div>
                    <Input 
                      id="master-resume-upload"
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
                            setFormData({...formData, resumePath: filePath});
                            setResumePreviewUrl(`${API_BASE_URL}${filePath}`);
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
                      className="bg-secondary file:text-foreground text-xs h-11"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const formDataFile = new FormData();
                          formDataFile.append('file', file);
                          try {
                            const { filePath } = await api.upload('/upload', formDataFile);
                            setFormData({...formData, resumePath: filePath});
                            setResumePreviewUrl(`${API_BASE_URL}${filePath}`);
                            toast.success("Resume uploaded successfully!");
                          } catch (err) {
                            toast.error("Upload failed");
                          }
                        }
                      }}
                    />
                    <p className="text-[10px] text-muted-foreground mt-1.5">No resume uploaded yet.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-2 space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Education</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isWorking" 
                    checked={formData.education.isWorking} 
                    onCheckedChange={(checked) => setFormData({...formData, education: {...formData.education, isWorking: !!checked}})} 
                  />
                  <label htmlFor="isWorking" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Currently working (skip education)
                  </label>
                </div>
              </div>

              {!formData.education.isWorking && (
                <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <Label>Institution / University</Label>
                    <Input className="mt-1.5 bg-secondary" value={formData.education.institution} onChange={e => setFormData({...formData, education: {...formData.education, institution: e.target.value}})} placeholder="IIT Bombay" />
                  </div>
                  <div>
                    <Label>Degree Type</Label>
                    <Input className="mt-1.5 bg-secondary" value={formData.education.degreeType} onChange={e => setFormData({...formData, education: {...formData.education, degreeType: e.target.value}})} placeholder="B.Tech, MBA, etc." />
                  </div>
                  <div>
                    <Label>Stream / Major</Label>
                    <Input className="mt-1.5 bg-secondary" value={formData.education.stream} onChange={e => setFormData({...formData, education: {...formData.education, stream: e.target.value}})} placeholder="Computer Science" />
                  </div>
                  <div>
                    <Label>Graduation Year</Label>
                    <Input className="mt-1.5 bg-secondary" value={formData.education.graduationYear} onChange={e => setFormData({...formData, education: {...formData.education, graduationYear: e.target.value}})} placeholder="2024" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-8 pt-6 border-t border-border">
            <Button onClick={() => updateMutation.mutate(formData)} disabled={updateMutation.isPending} className="bg-gradient-primary text-primary-foreground shadow-glow h-11 px-8">
              {updateMutation.isPending ? "Saving Profile..." : "Save Changes"}
            </Button>
            <Button variant="outline" className="h-11 px-8" onClick={() => {
               if (user) {
                setFormData({
                  firstName: user.firstName || "",
                  lastName: user.lastName || "",
                  gender: user.gender || "",
                  phoneNo: user.phoneNo || "",
                  linkedinUrl: user.linkedinUrl || "",
                  githubUrl: user.githubUrl || "",
                  education: {
                    degreeType: user.education?.degreeType || "",
                    institution: user.education?.institution || "",
                    stream: user.education?.stream || "",
                    graduationYear: user.education?.graduationYear || "",
                    isWorking: user.education?.isWorking || false
                  }
                });
              }
            }}>Cancel</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
