import { Container } from "@repo/ui";
import {
  ArrowRight,
  HeartPulse,
} from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/95">
      <Container className="flex items-center justify-between py-4">
        <a href="#" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg shadow-glow">
            <HeartPulse className="h-5 w-5 text-white" aria-hidden />
          </div>
          <span className="text-xl font-bold tracking-tight">MedKeep</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-brand-muted md:flex">
          <a href="#problema" className="transition hover:text-brand-ink">
            Problema
          </a>
          <a href="#como-funciona" className="transition hover:text-brand-ink">
            Como funciona
          </a>
          <a href="#beneficios" className="transition hover:text-brand-ink">
            Benefícios
          </a>
          <a href="#precos" className="transition hover:text-brand-ink">
            Preços
          </a>
        </nav>
        <a
          href="#cta"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-ink px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-slate-800"
        >
          Teste grátis <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </Container>
    </header>
  );
}
