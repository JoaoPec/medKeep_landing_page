import { MessageCircleMore } from "lucide-react";

export function HeroMockup() {
  return (
    <div className="relative">
      <div className="absolute -right-8 -top-8 hidden h-72 w-72 rounded-full bg-brand-green/20 blur-3xl lg:block" />
      <div className="absolute -bottom-8 -left-8 hidden h-72 w-72 rounded-full bg-brand-blue/20 blur-3xl lg:block" />
      <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-bg text-sm font-bold text-white">
            M
          </div>
          <div>
            <div className="text-sm font-semibold">MedKeep • Clínica Vida</div>
            <div className="flex items-center gap-1 text-xs text-brand-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
              online
            </div>
          </div>
          <MessageCircleMore
            className="ml-auto h-5 w-5 text-brand-green"
            aria-hidden
          />
        </div>
        <div className="mt-4 space-y-3">
          <div className="chat-bubble max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-100 p-3 text-sm">
            Olá Maria! 👋 Lembrete da sua consulta com <b>Dr. Silva</b> amanhã às{" "}
            <b>14:30</b>. Confirma sua presença?
          </div>
          <div
            className="chat-bubble flex justify-end gap-2"
            style={{ animationDelay: "0.4s" }}
          >
            <button
              type="button"
              className="rounded-xl bg-brand-green px-3 py-2 text-xs font-semibold text-white shadow-soft"
            >
              ✓ Sim, confirmo
            </button>
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold"
            >
              Remarcar
            </button>
          </div>
          <div
            className="chat-bubble ml-auto max-w-[85%] rounded-2xl rounded-tr-sm border border-emerald-100 bg-emerald-50 p-3 text-sm"
            style={{ animationDelay: "0.8s" }}
          >
            Sim, confirmo! ✅
          </div>
          <div
            className="chat-bubble max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-100 p-3 text-sm"
            style={{ animationDelay: "1.2s" }}
          >
            Perfeito! Te esperamos amanhã 💚
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-emerald-50 p-3">
            <div className="text-xl font-bold text-brand-greenDark">94%</div>
            <div className="text-[10px] uppercase tracking-wide text-brand-muted">
              Confirmadas
            </div>
          </div>
          <div className="rounded-xl bg-sky-50 p-3">
            <div className="text-xl font-bold text-brand-blueDark">+38%</div>
            <div className="text-[10px] uppercase tracking-wide text-brand-muted">
              Comparecimento
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="text-xl font-bold text-brand-ink">-72%</div>
            <div className="text-[10px] uppercase tracking-wide text-brand-muted">
              Faltas
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
