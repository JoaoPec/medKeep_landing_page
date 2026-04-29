import { HeartPulse } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
            <HeartPulse className="h-4 w-4 text-white" aria-hidden />
          </div>
          <span className="font-bold">MedKeep</span>
          <span className="ml-2 text-sm text-brand-muted">
            © 2026 — Todos os direitos reservados
          </span>
        </div>
        <div className="flex gap-6 text-sm text-brand-muted">
          <a href="#" className="transition hover:text-brand-ink">
            Termos
          </a>
          <a href="#" className="transition hover:text-brand-ink">
            Privacidade
          </a>
          <a href="#" className="transition hover:text-brand-ink">
            Contato
          </a>
        </div>
      </div>
    </footer>
  );
}
