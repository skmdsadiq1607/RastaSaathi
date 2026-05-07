import PropTypes from 'prop-types';
import { Activity, Ambulance, HeartPulse, Languages, MapPinned, Radio, ShieldCheck } from 'lucide-react';

const signalItems = [
  { icon: Radio, label: 'GPS + voice armed', tone: 'text-red-300' },
  { icon: Ambulance, label: 'Responder channel live', tone: 'text-amber-300' },
  { icon: MapPinned, label: 'Hospital routing ready', tone: 'text-emerald-300' }
];

const roleItems = ['Victim', 'Responder', 'Control room'];

export default function AuthFrame({ eyebrow, title, subtitle, children, footer = null }) {
  return (
    <main className="auth-screen relative min-h-screen overflow-hidden bg-dark text-slate-50">
      <div className="auth-grid-surface absolute inset-0 opacity-70" aria-hidden="true" />
      <section className="relative mx-auto grid min-h-screen w-full max-w-7xl items-stretch px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(390px,520px)] lg:gap-8 lg:px-8">
        <div className="hidden min-h-[calc(100vh-3rem)] flex-col justify-between overflow-hidden rounded-lg border border-white/10 bg-slate-950/60 p-8 shadow-2xl shadow-black/30 lg:flex">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-red-600 shadow-lg shadow-red-950/60">
                <HeartPulse className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-200">RoadSoS</p>
                <h2 className="text-3xl font-black tracking-normal text-white">Emergency Network</h2>
              </div>
            </div>

            <div className="mt-12 max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">IIT Madras Road Safety Hackathon 2026</p>
              <h1 className="mt-4 text-5xl font-black leading-tight tracking-normal text-white">
                Fast road accident response for India.
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">
                One workflow for SOS intake, severity reasoning, hospital fit, routing, alerts, and live handoff.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg border border-white/10 bg-slate-900/80 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operational scope</p>
                  <p className="mt-1 text-lg font-bold text-white">Victim to hospital handoff</p>
                </div>
                <ShieldCheck className="h-8 w-8 text-emerald-300" aria-hidden="true" />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {roleItems.map((item) => (
                  <div key={item} className="rounded-md border border-white/10 bg-slate-950/70 px-3 py-3 text-center text-sm font-semibold text-slate-200">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {signalItems.map(({ icon: Icon, label, tone }) => (
                <div key={label} className="rounded-lg border border-white/10 bg-slate-900/70 p-4">
                  <Icon className={`h-6 w-6 ${tone}`} aria-hidden="true" />
                  <p className="mt-3 text-sm font-semibold leading-5 text-slate-200">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-black/40 backdrop-blur sm:p-7">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-red-200">
                  <Activity className="h-4 w-4" aria-hidden="true" />
                  {eyebrow}
                </div>
                <h1 className="mt-5 text-3xl font-black tracking-normal text-white">{title}</h1>
                <p className="mt-2 text-sm leading-6 text-slate-300">{subtitle}</p>
              </div>
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/10 bg-slate-950">
                <Languages className="h-5 w-5 text-amber-200" aria-hidden="true" />
              </div>
            </div>
            <div className="mb-6 grid gap-2 min-[520px]:grid-cols-3 lg:hidden">
              {signalItems.map(({ icon: Icon, label, tone }) => (
                <div key={label} className="flex items-center gap-2 rounded-md border border-white/10 bg-slate-950/70 px-3 py-2">
                  <Icon className={`h-4 w-4 shrink-0 ${tone}`} aria-hidden="true" />
                  <span className="text-xs font-bold leading-4 text-slate-200">{label}</span>
                </div>
              ))}
            </div>
            {children}
            {footer && <div className="mt-6 border-t border-white/10 pt-5">{footer}</div>}
          </div>
        </div>
      </section>
    </main>
  );
}

AuthFrame.propTypes = {
  eyebrow: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node
};
