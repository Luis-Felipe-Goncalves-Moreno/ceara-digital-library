import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageHeader({
  title, description, actions,
}: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-display font-semibold tracking-tight"
        >
          {title}
        </motion.h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  children, className = "", hover = false,
}: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div
      className={`rounded-2xl bg-card border border-border shadow-card ${hover ? "transition-all hover:shadow-elegant hover:-translate-y-0.5" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({
  children, tone = "neutral",
}: { children: ReactNode; tone?: "neutral" | "success" | "warning" | "danger" | "info" | "accent" }) {
  const map: Record<string, string> = {
    neutral: "bg-muted text-muted-foreground border-border",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/15 text-warning-foreground border-warning/30",
    danger: "bg-destructive/10 text-destructive border-destructive/20",
    info: "bg-primary/10 text-primary border-primary/20",
    accent: "bg-accent/15 text-accent-foreground border-accent/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${map[tone]}`}>
      {children}
    </span>
  );
}

export function Button({
  children, variant = "primary", size = "md", className = "", ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "accent";
  size?: "sm" | "md" | "lg";
}) {
  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-sm",
  };
  const variants: Record<string, string> = {
    primary: "gradient-ocean text-white shadow-elegant hover:shadow-glow",
    accent: "bg-accent text-accent-foreground hover:brightness-105 shadow-soft",
    secondary: "bg-secondary text-secondary-foreground hover:brightness-110",
    outline: "border border-border bg-card hover:bg-muted",
    ghost: "hover:bg-muted text-foreground",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
