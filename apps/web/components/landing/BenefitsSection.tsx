import {
  Clock,
  DollarSign,
  LayoutDashboard,
  Lock,
  Smile,
  TrendingUp,
} from "lucide-react";
import { Reveal } from "./Reveal";

const benefits = [
  {
    icon: TrendingUp,
    iconWrap: "bg-emerald-100",
    iconClass: "text-brand-greenDark",
    borderHover: "hover:border-brand-green/40",
    title: "Até 70% menos faltas",
    body: "Lembretes no momento certo aumentam drasticamente o comparecimento.",
  },
  {
    icon: Clock,
    iconWrap: "bg-sky-100",
    iconClass: "text-brand-blueDark",
    borderHover: "hover:border-brand-blue/40",
    title: "Horas economizadas",
    body: "Sua recepção volta a focar em atender — não em ligar.",
  },
  {
    icon: DollarSign,
    iconWrap: "bg-emerald-100",
    iconClass: "text-brand-greenDark",
    borderHover: "hover:border-brand-green/40",
    title: "Faturamento maior",
    body: "Cada horário ocupado é receita real entrando no caixa.",
  },
  {
    icon: Smile,
    iconWrap: "bg-sky-100",
    iconClass: "text-brand-blueDark",
    borderHover: "hover:border-brand-blue/40",
    title: "Paciente satisfeito",
    body: "Comunicação no canal que ele já usa todos os dias.",
  },
  {
    icon: Lock,
    iconWrap: "bg-emerald-100",
    iconClass: "text-brand-greenDark",
    borderHover: "hover:border-brand-green/40",
    title: "Seguro e LGPD",
    body: "Dados criptografados e em conformidade com a legislação.",
  },
  {
    icon: LayoutDashboard,
    iconWrap: "bg-sky-100",
    iconClass: "text-brand-blueDark",
    borderHover: "hover:border-brand-blue/40",
    title: "Painel intuitivo",
    body: "Veja taxa de confirmação, faltas e desempenho num clique.",
  },
] as const;

export function BenefitsSection() {
  return (
    <section id="beneficios" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div>
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-brand-greenDark">
              Benefícios
            </span>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Mais pacientes comparecendo. Menos agenda vazia.
            </h2>
          </div>
        </Reveal>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map(
            ({ icon: Icon, iconWrap, iconClass, borderHover, title, body }) => (
              <Reveal
                key={title}
                className={`rounded-3xl border border-slate-200 bg-brand-bg p-7 transition hover:shadow-soft ${borderHover}`}
              >
                <div>
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${iconWrap}`}
                  >
                    <Icon className={`h-6 w-6 ${iconClass}`} aria-hidden />
                  </div>
                  <h3 className="mb-1 text-lg font-bold">{title}</h3>
                  <p className="text-sm text-brand-muted">{body}</p>
                </div>
              </Reveal>
            )
          )}
        </div>
      </div>
    </section>
  );
}
