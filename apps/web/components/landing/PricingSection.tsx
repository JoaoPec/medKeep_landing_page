import { Check, MessageSquare } from "lucide-react";
import { Reveal } from "./Reveal";

export function PricingSection() {
  return (
    <section id="precos" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div>
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-brand-greenDark">
              Planos
            </span>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Se você evitar 1 ou 2 faltas por mês,{" "}
              <span className="gradient-text">o sistema já se paga</span>
            </h2>
            <p className="mt-4 text-lg text-brand-muted">
              Escolha o plano ideal para o tamanho da sua clínica. Sem
              fidelidade.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid items-stretch gap-6 md:grid-cols-3">
          <Reveal className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
            <div className="flex flex-1 flex-col">
            <div className="text-xs font-bold uppercase tracking-widest text-brand-muted">
              Essencial
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold">R$149</span>
              <span className="text-brand-muted">/mês</span>
            </div>
            <p className="mt-2 text-sm text-brand-muted">
              Para consultórios pequenos que ainda confirmam manualmente.
            </p>
            <div className="my-6 h-px bg-slate-100" />
            <ul className="flex flex-1 flex-col gap-3 text-sm">
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 flex-shrink-0 text-brand-green" />
                Lembretes automáticos via WhatsApp
              </li>
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 flex-shrink-0 text-brand-green" />
                Confirmação com 1 clique
              </li>
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 flex-shrink-0 text-brand-green" />
                1 lembrete por agendamento (24h antes)
              </li>
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 flex-shrink-0 text-brand-green" />
                Dashboard simples
              </li>
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 flex-shrink-0 text-brand-green" />
                Suporte básico
              </li>
              <li className="flex items-start">
                <MessageSquare className="mr-2 h-5 w-5 flex-shrink-0 text-brand-blueDark" />
                Até 200 mensagens/mês
              </li>
              <li className="pl-7 text-xs text-brand-muted">
                Excedente: R$0,30 por mensagem
              </li>
            </ul>
            <a
              href="#cta"
              className="mt-6 block rounded-2xl bg-slate-100 py-3.5 text-center font-semibold text-brand-ink transition hover:bg-slate-200"
            >
              Começar grátis
            </a>
            </div>
          </Reveal>

          <Reveal className="relative z-10 flex flex-col scale-100 rounded-3xl bg-brand-ink p-8 text-white shadow-soft md:scale-[1.04]">
            <div className="relative flex flex-1 flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-bg px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-glow">
              Mais vendido
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-brand-green">
              Profissional
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold">R$249</span>
              <span className="text-slate-400">/mês</span>
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Para clínicas com volume médio que querem reduzir faltas
              drasticamente.
            </p>
            <div className="my-6 h-px bg-white/10" />
            <ul className="flex flex-1 flex-col gap-3 text-sm">
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 flex-shrink-0 text-brand-green" />
                <b>Tudo do Essencial</b>
              </li>
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 flex-shrink-0 text-brand-green" />
                2 lembretes (24h + no dia)
              </li>
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 flex-shrink-0 text-brand-green" />
                Follow-up automático
              </li>
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 flex-shrink-0 text-brand-green" />
                Remarcação via WhatsApp
              </li>
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 flex-shrink-0 text-brand-green" />
                Relatórios completos
              </li>
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 flex-shrink-0 text-brand-green" />
                Mensagens personalizadas
              </li>
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 flex-shrink-0 text-brand-green" />
                Suporte prioritário
              </li>
              <li className="flex items-start">
                <MessageSquare className="mr-2 h-5 w-5 flex-shrink-0 text-brand-blue" />
                Até 600 mensagens/mês
              </li>
              <li className="pl-7 text-xs text-slate-400">
                Excedente: R$0,25 por mensagem
              </li>
            </ul>
            <a
              href="#cta"
              className="mt-6 block rounded-2xl py-3.5 text-center font-semibold text-white shadow-glow transition gradient-bg hover:scale-[1.02]"
            >
              Testar 7 dias grátis
            </a>
            </div>
          </Reveal>

          <Reveal className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
            <div className="flex flex-1 flex-col">
            <div className="text-xs font-bold uppercase tracking-widest text-brand-blueDark">
              Premium
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold">R$399</span>
              <span className="text-brand-muted">/mês</span>
            </div>
            <p className="mt-2 text-sm text-brand-muted">
              Para clínicas grandes que querem automação completa.
            </p>
            <div className="my-6 h-px bg-slate-100" />
            <ul className="flex flex-1 flex-col gap-3 text-sm">
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 flex-shrink-0 text-brand-green" />
                <b>Tudo do Profissional</b>
              </li>
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 flex-shrink-0 text-brand-green" />
                Lembretes ilimitados por agendamento
              </li>
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 flex-shrink-0 text-brand-green" />
                Fluxos personalizados
              </li>
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 flex-shrink-0 text-brand-green" />
                Múltiplos atendentes
              </li>
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 flex-shrink-0 text-brand-green" />
                Prioridade no envio
              </li>
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 flex-shrink-0 text-brand-green" />
                Integração básica
              </li>
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 flex-shrink-0 text-brand-green" />
                Suporte dedicado
              </li>
              <li className="flex items-start">
                <MessageSquare className="mr-2 h-5 w-5 flex-shrink-0 text-brand-blueDark" />
                Até 1500 mensagens/mês
              </li>
              <li className="pl-7 text-xs text-brand-muted">
                Excedente: R$0,20 por mensagem
              </li>
            </ul>
            <a
              href="#cta"
              className="mt-6 block rounded-2xl bg-slate-100 py-3.5 text-center font-semibold text-brand-ink transition hover:bg-slate-200"
            >
              Falar com vendas
            </a>
            </div>
          </Reveal>
        </div>

        <p className="mt-8 text-center text-sm text-brand-muted">
          🎁 Todos os planos incluem{" "}
          <b className="text-brand-ink">7 dias grátis</b> ou até 50 mensagens
          grátis. Sem cartão de crédito.
        </p>
      </div>
    </section>
  );
}
