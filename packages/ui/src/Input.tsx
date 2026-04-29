import type { InputHTMLAttributes } from "react";
import { cn } from "./cn";

const base =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-brand-ink shadow-sm transition placeholder:text-brand-muted focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20 disabled:cursor-not-allowed disabled:opacity-60";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, type = "text", ...props }: InputProps) {
  return <input type={type} className={cn(base, className)} {...props} />;
}
