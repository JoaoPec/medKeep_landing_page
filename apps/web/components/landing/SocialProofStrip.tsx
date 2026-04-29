import { ShieldCheck, Star, Users } from "lucide-react";

export function SocialProofStrip() {
  return (
    <section className="border-y border-slate-200 bg-white/60">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 py-8 text-sm text-brand-muted">
        <span className="font-medium">
          Usado por clínicas e consultórios em todo o Brasil
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4 fill-amber-400 text-amber-400"
              aria-hidden
            />
          ))}
          <span className="ml-2 font-semibold text-brand-ink">4.9/5</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-brand-green" aria-hidden />
          LGPD compliant
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-brand-blueDark" aria-hidden />
          +500 profissionais ativos
        </div>
      </div>
    </section>
  );
}
