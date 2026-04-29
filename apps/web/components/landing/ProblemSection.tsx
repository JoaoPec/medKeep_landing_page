import { CalendarX, PhoneOff, TrendingDown } from "lucide-react";
import { Reveal } from "./Reveal";

export function ProblemSection() {
  return (
    <section id="problema" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div>
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-rose-500">
              O problema
            </span>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Cada falta é dinheiro saindo do seu caixa
            </h2>
            <p className="mt-4 text-lg text-brand-muted">
              Pacientes que não aparecem custam caro. Sua equipe gasta horas
              ligando. E mesmo assim, a agenda continua com buracos.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Reveal className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card transition hover:shadow-soft">
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50">
                <CalendarX className="h-6 w-6 text-rose-500" aria-hidden />
              </div>
              <h3 className="mb-2 text-xl font-bold">30% de faltas em média</h3>
              <p className="text-brand-muted">
                Pacientes esquecem, atrasam ou simplesmente não aparecem — sem
                aviso.
              </p>
            </div>
          </Reveal>
          <Reveal className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card transition hover:shadow-soft">
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50">
                <PhoneOff className="h-6 w-6 text-amber-500" aria-hidden />
              </div>
              <h3 className="mb-2 text-xl font-bold">Recepção sobrecarregada</h3>
              <p className="text-brand-muted">
                Horas perdidas ligando paciente por paciente, sem garantia de
                resposta.
              </p>
            </div>
          </Reveal>
          <Reveal className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card transition hover:shadow-soft">
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50">
                <TrendingDown className="h-6 w-6 text-rose-500" aria-hidden />
              </div>
              <h3 className="mb-2 text-xl font-bold">Faturamento em queda</h3>
              <p className="text-brand-muted">
                4 faltas por semana = R$2.400/mês perdidos. Em 1 ano, mais de R$28
                mil.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-12 grid items-center gap-6 rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 to-amber-50 p-8 md:grid-cols-4 md:p-10">
          <>
            <div className="md:col-span-3">
              <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-rose-600">
                Faça as contas
              </div>
              <h3 className="text-2xl font-bold md:text-3xl">
                Quanto sua clínica perde com faltas hoje?
              </h3>
              <p className="mt-2 text-brand-muted">
                Ticket médio de R$150 × 4 faltas/semana ={" "}
                <b className="text-brand-ink">R$2.400/mês perdidos</b>. O MedKeep
                custa R$149.
              </p>
            </div>
            <a
              href="#cta"
              className="rounded-2xl bg-brand-ink px-6 py-4 text-center font-semibold text-white shadow-soft transition hover:bg-slate-800"
            >
              Parar de perder dinheiro
            </a>
          </>
        </Reveal>
      </div>
    </section>
  );
}
