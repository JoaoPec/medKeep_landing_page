import {
  CalendarCheck,
  Send,
  Settings2,
  UploadCloud,
} from "lucide-react";
import { Reveal } from "./Reveal";

const steps = [
  {
    n: "1",
    icon: UploadCloud,
    title: "Conecte sua agenda",
    body: "Importe ou cadastre seus agendamentos (consultas e exames) em segundos.",
  },
  {
    n: "2",
    icon: Settings2,
    title: "Personalize a mensagem",
    body: "Escolha o tom, o horário e a frequência dos lembretes.",
  },
  {
    n: "3",
    icon: Send,
    title: "MedKeep envia tudo",
    body: "Lembretes saem automaticamente pelo WhatsApp.",
  },
  {
    n: "4",
    icon: CalendarCheck,
    title: "Agenda cheia",
    body: "Você acompanha confirmações em tempo real.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div>
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-brand-blueDark">
              Como funciona
            </span>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Pronto em 5 minutos. Funciona para sempre.
            </h2>
            <p className="mt-4 text-lg text-brand-muted">
              Nada de instalações complexas ou treinamento longo.
            </p>
          </div>
        </Reveal>

        <div className="relative mt-16 grid gap-6 md:grid-cols-4">
          <div className="absolute left-[12.5%] right-[12.5%] top-12 hidden h-0.5 bg-gradient-to-r from-brand-green via-brand-blue to-brand-green md:block" />
          {steps.map(({ n, icon: Icon, title, body }) => (
            <Reveal
              key={n}
              className="relative rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-card"
            >
              <div>
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full font-bold text-white shadow-glow gradient-bg">
                  {n}
                </div>
                <Icon
                  className="mx-auto mb-3 h-7 w-7 text-brand-green"
                  aria-hidden
                />
                <h3 className="mb-2 text-lg font-bold">{title}</h3>
                <p className="text-sm text-brand-muted">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
