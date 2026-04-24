import { Diamond } from "lucide-react";

export const Logo = ({ size = "default" }: { size?: "default" | "sm" | "lg" }) => {
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";
  const icon = size === "lg" ? "h-7 w-7" : size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Diamond className={`${icon} text-primary fill-primary/20`} strokeWidth={2.5} />
        <div className="absolute inset-0 blur-md bg-primary/40 -z-10" />
      </div>
      <span className={`font-display font-bold ${text} tracking-tight`}>
        FairHire <span className="text-gradient">AI</span>
      </span>
    </div>
  );
};
