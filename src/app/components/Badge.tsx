import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "premium" | "verified";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variants = {
    default: "bg-white/10 text-white border-white/20",
    premium: "bg-[#FFD700] text-black border-[#FFD700]",
    verified: "bg-[#00D4FF] text-black border-[#00D4FF]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
