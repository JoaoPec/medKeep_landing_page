import { MessageCircle, ShieldCheck, Zap } from "lucide-react";
import { Reveal } from "./Reveal";
import { HeroMockup } from "./HeroMockup";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 hero-blur" />
      <div className="absolute inset-0 grid-pattern opacity-60" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-20 lg:grid-cols-2">
        <Reveal>
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-brand-muted shadow-card">
              <span className="h-2 w-2 animate-pulse-soft rounded-full bg-brand-green" />
              Novo: confirmação automática via WhatsApp
            </div>
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Reduza faltas e mantenha sua agenda{" "}
              <span className="gradient-text">sempre cheia</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-muted md:text-xl">
              Automatize confirmações de consultas e exames no WhatsApp e pare de
              perder dinheiro com pacientes que não aparecem.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#cta"
                className="inline-flex items-center justify-center gap-2 rounded-2xl gradient-bg px-7 py-4 font-semibold text-white shadow-glow transition hover:scale-[1.02]"
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
                Começar teste grátis de 7 dias
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 font-semibold shadow-card transition hover:border-slate-300"
              >
                Ver como funciona
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-brand-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-green" aria-hidden />
                Sem cartão de crédito
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-brand-green" aria-hidden />
                Configuração em 5 minutos
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="relative">
          <HeroMockup />
        </Reveal>
      </div>
    </section>
  );
}
