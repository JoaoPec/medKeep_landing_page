import { Plus } from "lucide-react";
import { Reveal } from "./Reveal";

const faqs = [
  {
    q: "Preciso instalar algum aplicativo?",
    a: "Não. O MedKeep funciona 100% no navegador, e o paciente recebe as mensagens no WhatsApp que ele já usa.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim. Sem fidelidade, sem multa. Você cancela direto no painel quando quiser.",
  },
  {
    q: "Como funciona o teste grátis?",
    a: "Você tem 7 dias para usar todas as funcionalidades, ou até 50 mensagens — o que vier primeiro. Sem cartão de crédito.",
  },
  {
    q: "É seguro e está em conformidade com a LGPD?",
    a: "Sim. Os dados dos pacientes são criptografados e tratados conforme as exigências da LGPD.",
  },
] as const;

export function FaqSection() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Perguntas frequentes
          </h2>
        </Reveal>
        <div className="mt-12 space-y-4">
          {faqs.map(({ q, a }) => (
            <Reveal key={q}>
              <details className="group rounded-2xl border border-slate-200 bg-brand-bg p-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between font-semibold">
                  {q}
                  <Plus
                    className="h-5 w-5 transition group-open:rotate-45"
                    aria-hidden
                  />
                </summary>
                <p className="mt-3 text-sm text-brand-muted">{a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
