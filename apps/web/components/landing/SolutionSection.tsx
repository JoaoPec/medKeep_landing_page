import {
  BarChart3,
  CheckCheck,
  MessageSquareText,
  Repeat,
} from "lucide-react";
import { Reveal } from "./Reveal";

const featureCards = [
  {
    icon: MessageSquareText,
    title: "Lembrete enviado",
    subtitle: "Hoje, 09:00",
    iconClass: "text-brand-green",
  },
  {
    icon: CheckCheck,
    title: "Confirmação 1-clique",
    subtitle: "Resposta automática",
    iconClass: "text-brand-blueDark",
  },
  {
    icon: Repeat,
    title: "Remarcação fácil",
    subtitle: "Direto pelo WhatsApp",
    iconClass: "text-brand-green",
  },
  {
    icon: BarChart3,
    title: "Dashboard claro",
    subtitle: "Tudo em tempo real",
    iconClass: "text-brand-blueDark",
  },
] as const;

const checklist = [
  "Mensagens automáticas 24h antes de consultas e exames",
  "Paciente confirma ou remarca sem instalar nada",
  "Sua agenda atualizada em tempo real",
  "Personalize o tom de voz da clínica",
];

export function SolutionSection() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <div className="relative">
            <div className="absolute inset-0 rounded-4xl opacity-20 blur-2xl gradient-bg" />
            <div className="relative rounded-4xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-sky-50 p-8">
              <div className="grid grid-cols-2 gap-4">
                {featureCards.map(({ icon: Icon, title, subtitle, iconClass }) => (
                  <div
                    key={title}
                    className="rounded-2xl bg-white p-5 shadow-card"
                  >
                    <Icon className={`mb-3 h-8 w-8 ${iconClass}`} aria-hidden />
                    <div className="font-semibold">{title}</div>
                    <div className="mt-1 text-xs text-brand-muted">{subtitle}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal className="order-1 lg:order-2">
          <div>
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-brand-greenDark">
              A solução
            </span>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Confirmações automáticas no canal que o paciente já usa
            </h2>
            <p className="mt-5 text-lg text-brand-muted">
              O MedKeep envia lembretes inteligentes pelo WhatsApp, recebe a
              confirmação com 1 clique e organiza tudo num painel simples — sem
              você precisar levantar o telefone.
            </p>
            <ul className="mt-8 space-y-4 text-base">
              {checklist.map((item) => (
                <li key={item} className="flex items-center">
                  <span className="check-bullet" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
