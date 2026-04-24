import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

export const AuthShell = ({
  title,
  subtitle,
  accent,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  accent: string;
  children: ReactNode;
  footer: ReactNode;
}) => (
  <div className="min-h-screen grid lg:grid-cols-2">
    <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-card border-r border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-60" />
      <div className="relative">
        <Link to="/"><Logo /></Link>
      </div>
      <div className="relative">
        <div className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
          {accent}
        </div>
        <h2 className="font-display text-4xl font-bold leading-tight max-w-md">
          Talent has no <span className="text-gradient">color, gender, or pedigree.</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-md">
          Every resume on FairHire is anonymized, parsed by Gemini, and scored on skill — not on identity.
        </p>
      </div>
      <div className="relative text-xs text-muted-foreground">© 2026 FairHire AI</div>
    </div>

    <div className="flex flex-col justify-center p-6 sm:p-12">
      <div className="lg:hidden mb-8"><Link to="/"><Logo /></Link></div>
      <div className="w-full max-w-md mx-auto">
        <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-2">{subtitle}</p>
        <div className="mt-8 space-y-4">{children}</div>
        <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
      </div>
    </div>
  </div>
);
