export type Job = {
  id: string;
  role: string;
  company: string;
  logo: string;
  location: string;
  workMode: "Remote" | "Hybrid" | "On-site";
  description: string;
  skills: string[];
  postedDays: number;
  badge?: "New" | "Featured" | "Closing Soon" | "AI Role";
  badgeTone?: "success" | "primary" | "warning" | "info";
};

export const jobs: Job[] = [
  {
    id: "j1",
    role: "AI Engineer",
    company: "Google DeepMind",
    logo: "🧠",
    location: "London",
    workMode: "Hybrid",
    description: "Build and deploy ML models at scale. Work on LLM fine-tuning, inference optimization, and MLOps pipelines.",
    skills: ["Python", "PyTorch", "MLOps", "LLMs"],
    postedDays: 2,
    badge: "New",
    badgeTone: "success",
  },
  {
    id: "j2",
    role: "Full Stack Engineer",
    company: "Stripe",
    logo: "💳",
    location: "Remote",
    workMode: "Remote",
    description: "Build the financial infrastructure of the internet. React, Node.js, and distributed systems experience preferred.",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    postedDays: 5,
    badge: "Featured",
    badgeTone: "primary",
  },
  {
    id: "j3",
    role: "Data Scientist",
    company: "Netflix",
    logo: "🎬",
    location: "Los Gatos",
    workMode: "Hybrid",
    description: "Drive personalization algorithms. Experience with A/B testing, causal inference, and recommendation systems.",
    skills: ["Python", "SQL", "Statistics", "Spark"],
    postedDays: 3,
    badge: "Closing Soon",
    badgeTone: "warning",
  },
  {
    id: "j4",
    role: "Backend Engineer",
    company: "Razorpay",
    logo: "💸",
    location: "Bangalore",
    workMode: "On-site",
    description: "Design high-throughput payment APIs. Microservices, Kafka, and Go/Java experience required.",
    skills: ["Go", "Kafka", "Microservices", "gRPC"],
    postedDays: 6,
    badge: "AI Role",
    badgeTone: "info",
  },
  {
    id: "j5",
    role: "ML Research Engineer",
    company: "OpenAI",
    logo: "✨",
    location: "San Francisco",
    workMode: "On-site",
    description: "Push the frontier of large model training. Work alongside researchers on novel architectures.",
    skills: ["PyTorch", "CUDA", "Distributed Training", "Research"],
    postedDays: 1,
    badge: "New",
    badgeTone: "success",
  },
  {
    id: "j6",
    role: "Product Designer",
    company: "Figma",
    logo: "🎨",
    location: "Remote",
    workMode: "Remote",
    description: "Shape the future of design tools. Work on real-time collaboration features used by millions.",
    skills: ["Figma", "Prototyping", "UX Research", "Design Systems"],
    postedDays: 4,
  },
];

export type AppStatus = "Applied" | "Shortlisted" | "Accepted" | "Rejected";

export type Application = {
  id: string;
  role: string;
  company: string;
  logo: string;
  atsScore: number;
  status: AppStatus;
  updated: string;
  feedback?: string;
  missingSkills?: string[];
};

export const applications: Application[] = [
  { id: "a1", role: "AI Engineer", company: "Google DeepMind", logo: "🧠", atsScore: 87, status: "Shortlisted", updated: "Today" },
  { id: "a2", role: "Data Scientist", company: "Netflix", logo: "🎬", atsScore: 92, status: "Accepted", updated: "Yesterday" },
  { id: "a3", role: "Full Stack Engineer", company: "Stripe", logo: "💳", atsScore: 71, status: "Applied", updated: "3 days ago" },
  { id: "a4", role: "Backend Engineer", company: "Razorpay", logo: "💸", atsScore: 58, status: "Rejected", updated: "5 days ago", feedback: "ATS score: 58% — below the 80% threshold. Your resume lacks experience in Go and Kafka which are primary requirements.", missingSkills: ["Apache Kafka", "Go (Golang)", "Microservices", "gRPC"] },
];

export type Candidate = {
  id: string;
  name: string;
  anonId: string;
  atsScore: number;
  experience: string;
  collegeTier: "Tier 1" | "Tier 2" | "Tier 3";
  skills: string[];
  highlights: string[];
  status: "Pending" | "Accepted" | "Rejected";
};

export const candidates: Candidate[] = [
  { id: "c1", name: "Anonymized Candidate #A1", anonId: "FH-A1", atsScore: 96, experience: "3 years", collegeTier: "Tier 1", skills: ["Python", "PyTorch", "LLMs", "MLOps", "Distributed Training"], highlights: ["Shipped fine-tuned 7B model serving 2M req/day", "Open-source contributor — HuggingFace transformers", "Published at NeurIPS workshop"], status: "Pending" },
  { id: "c2", name: "Anonymized Candidate #A2", anonId: "FH-A2", atsScore: 91, experience: "2 years", collegeTier: "Tier 1", skills: ["Python", "PyTorch", "MLOps", "Kubernetes"], highlights: ["Built RAG pipeline for enterprise search", "Reduced inference latency 40%", "Led team of 3 engineers"], status: "Pending" },
  { id: "c3", name: "Anonymized Candidate #A3", anonId: "FH-A3", atsScore: 88, experience: "4 years", collegeTier: "Tier 2", skills: ["Python", "TensorFlow", "LLMs", "Vector DBs"], highlights: ["Deployed recommender system at scale", "AWS ML certified", "Mentored junior engineers"], status: "Accepted" },
  { id: "c4", name: "Anonymized Candidate #A4", anonId: "FH-A4", atsScore: 84, experience: "2 years", collegeTier: "Tier 1", skills: ["Python", "PyTorch", "ONNX"], highlights: ["Optimized inference on edge devices", "Won university hackathon", "Published technical blog series"], status: "Pending" },
  { id: "c5", name: "Anonymized Candidate #A5", anonId: "FH-A5", atsScore: 81, experience: "1 year", collegeTier: "Tier 2", skills: ["Python", "scikit-learn", "MLOps"], highlights: ["Built end-to-end ML platform internship", "Strong fundamentals", "Active Kaggle competitor"], status: "Rejected" },
];

export const recruiterJobs = [
  { id: "rj1", role: "AI Engineer", applicants: 142, qualified: 23, status: "Active" },
  { id: "rj2", role: "Senior ML Researcher", applicants: 87, qualified: 14, status: "Active" },
  { id: "rj3", role: "MLOps Engineer", applicants: 56, qualified: 9, status: "Paused" },
];
