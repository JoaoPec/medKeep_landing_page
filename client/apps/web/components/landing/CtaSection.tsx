import { CheckCircle2, Rocket, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";

export function CtaSection() {
  return (
    <section id="cta" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl p-12 text-center shadow-glow gradient-bg md:p-16">
            <div className="absolute -right-20 -top-20 hidden h-80 w-80 rounded-full bg-white/10 blur-3xl md:block" />
            <div className="absolute -bottom-20 -left-20 hidden h-80 w-80 rounded-full bg-brand-blue/30 blur-3xl md:block" />
            <div className="relative">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
                <Sparkles className="h-4 w-4" aria-hidden />
                Comece hoje
              </div>
              <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
                Pare de perder dinheiro com agenda vazia
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-white/90 md:text-xl">
                Configure em 5 minutos. Veja resultados na primeira semana.
                Cancele quando quiser.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-brand-ink shadow-soft transition hover:scale-[1.02]"
                >
                  <Rocket className="h-5 w-5" aria-hidden />
                  Começar teste grátis de 7 dias
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white transition hover:bg-white/20"
                >
                  Falar com um especialista
                </a>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  Sem cartão de crédito
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  Sem fidelidade
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  Suporte humano
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
