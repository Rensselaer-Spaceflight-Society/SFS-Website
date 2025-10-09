import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, BrickWallFire, Database, Thermometer } from 'lucide-react';

type Props = {
  completionDate?: string;
  ctaHref?: string;
};

export default function Rpu1Desc({ completionDate = 'Q4 2025', ctaHref = '/projects/rpu-1' }: Props) {
  return (
    <section
      aria-labelledby="rpu1-heading"
      className="w-full bg-gradient-to-b from-slate-50 to-white/70 py-12 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <p className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-700">
              <Rocket className="h-4 w-4" aria-hidden />
              RXPI RPU-1
            </p>

            <h1 id="rpu1-heading" className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              RPU‑1 “Reliant” — RPI's First Liquid Bipropellant Engine
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-slate-700">
              A static-fire test stand designed and manufactured by RPI students. Reliant uses liquid kerosene and gaseous nitrous oxide as its fuel scheme, an extruded-graphite combustion chamber, a custom feed system, and a custom PCB. The system collects thrust, pressure, and thermal data for future and current projects.
            </p>

            <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-start gap-3 rounded-lg bg-white/60 p-3 shadow-sm">
                <Database className="h-5 w-5 flex-none text-sky-600" aria-hidden />
                <div>
                  <dt className="text-sm font-medium text-slate-800">Custom PCB</dt>
                  <dd className="mt-0.5 text-sm text-slate-600">Designed to control and monitor valves and sensors.</dd>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-white/60 p-3 shadow-sm">
                <Thermometer className="h-5 w-5 flex-none text-orange-600" aria-hidden />
                <div>
                  <dt className="text-sm font-medium text-slate-800">High‑Temp Materials</dt>
                  <dd className="mt-0.5 text-sm text-slate-600">Extruded graphite combustion chamber</dd>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-white/60 p-3 shadow-sm">
                <BrickWallFire className="h-5 w-5 flex-none text-emerald-600" aria-hidden />
                <div>
                  <dt className="text-sm font-medium text-slate-800">Hotfire 2025</dt>
                  <dd className="mt-0.5 text-sm text-slate-600">Projected Date: {completionDate}</dd>
                </div>
              </div>
            </dl>

            <div className="mt-8 flex gap-3">
              <a
                href={ctaHref}
                className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                Learn more
              </a>
            </div>
          </motion.div>

          <motion.figure
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative col-start-2 row-start-1 md:row-start-auto"
            aria-hidden
          >
            <div className="pointer-events-none hidden h-[360px] w-full overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-800/5 to-sky-50/40 shadow-lg md:block">
              <div className="flex h-full items-center justify-center p-6">
                <svg width="420" height="260" viewBox="0 0 420 260" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="schematic placeholder">
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
                      <stop offset="1" stopColor="#e6f7ff" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                  <g opacity="0.95">
                    <image x={0.5*(420-420*0.8)} href="/rocket/engine_cad_1.png" height={260*0.8} width={420*0.8}></image>
                    <text x="70" y="250" fontFamily="Inter, ui-sans-serif, system-ui" fontSize="11" fill="#0f172a" opacity="0.6">Graphite Nozzle + Doublet impingement injector</text>
                  </g>
                </svg>
              </div>
            </div>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
