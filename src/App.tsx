import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import { StudentSignup, StudentLogin, RecruiterSignup, RecruiterLogin } from "./pages/Auth";
import BrowseJobs from "./pages/student/BrowseJobs";
import Applications from "./pages/student/Applications";
import ResumeHelp from "./pages/student/ResumeHelp";
import StudentProfile from "./pages/student/Profile";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import Candidates from "./pages/recruiter/Candidates";
import Analytics from "./pages/recruiter/Analytics";
import CompanyProfile from "./pages/recruiter/CompanyProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup/student" element={<StudentSignup />} />
          <Route path="/login/student" element={<StudentLogin />} />
          <Route path="/signup/recruiter" element={<RecruiterSignup />} />
          <Route path="/login/recruiter" element={<RecruiterLogin />} />

          <Route path="/student" element={<BrowseJobs />} />
          <Route path="/student/applications" element={<Applications />} />
          <Route path="/student/resume" element={<ResumeHelp />} />
          <Route path="/student/profile" element={<StudentProfile />} />

          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="/recruiter/candidates" element={<Candidates />} />
          <Route path="/recruiter/analytics" element={<Analytics />} />
          <Route path="/recruiter/profile" element={<CompanyProfile />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
