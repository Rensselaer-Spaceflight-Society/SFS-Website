'use client';

import React from 'react';
import Image from 'next/image';
import { MotionValue, motion, useTransform } from 'framer-motion';

// How the next pinned stage takes the screen from the one before it. Each is drawn from the Flight Log
// sheet: square edges, brand red rules, registration marks and mono labels.
// plotter: a red plotter rule with a ruler edge sweeps up and draws the next stage in behind it
// aperture: a viewfinder with red corner brackets opens from the centre on a crosshair
// columns: the next stage rises in six grid columns, each led by a red cap
// shutter: two red rules part from the centre line
// slate: a full red title sheet with the section number crosses the screen (numbered sections)
export type SceneTransition = 'plotter' | 'aperture' | 'columns' | 'shutter' | 'slate';

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const ease = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

const COLUMNS = 6;
// How far each grid column has risen; the columns start one after another
const columnRise = (reveal: number, index: number) => clamp01(ease(reveal) * 1.6 - index * 0.12);
// The slate covers the screen over the first part of the handover and clears it over the last
const SLATE_IN = 0.42;
const SLATE_OUT = 0.58;
const slateIn = (reveal: number) => ease(reveal / SLATE_IN);
const slateOut = (reveal: number) => ease((reveal - SLATE_OUT) / (1 - SLATE_OUT));

function stageClip(kind: SceneTransition, reveal: number) {
  if (reveal >= 1) return 'none';
  const t = ease(reveal);
  switch (kind) {
    case 'aperture':
      return `inset(${(1 - t) * 50}% ${(1 - t) * 50}% ${(1 - t) * 50}% ${(1 - t) * 50}%)`;
    case 'shutter':
      return `inset(0% ${(1 - t) * 50}% 0% ${(1 - t) * 50}%)`;
    case 'slate':
      // The new stage is laid down under the slate while it covers the screen
      return reveal < SLATE_IN ? 'inset(100% 0% 0% 0%)' : 'none';
    case 'columns': {
      const points = ['0% 100%'];
      for (let i = 0; i < COLUMNS; i++) {
        const top = `${(1 - columnRise(reveal, i)) * 100}%`;
        points.push(`${(i / COLUMNS) * 100}% ${top}`, `${((i + 1) / COLUMNS) * 100}% ${top}`);
      }
      points.push('100% 100%');
      return `polygon(${points.join(', ')})`;
    }
    default:
      return `inset(${(1 - t) * 100}% 0% 0% 0%)`;
  }
}

// Styles for a pinned stage and the layer inside it: how it opens over the previous scene, and how it sinks
// back under a shade while the next one opens over it
export function useStageMotion({ reveal, exit }: { reveal: MotionValue<number>; exit: MotionValue<number> }, kind: SceneTransition) {
  const clipPath = useTransform(reveal, (r) => stageClip(kind, r));
  const pointerEvents = useTransform(reveal, (r) => (r > 0.05 ? 'auto' : 'none'));
  const scale = useTransform([reveal, exit], ([r, x]: number[]) => {
    const t = ease(r);
    const opening = kind === 'aperture' ? 1.18 - 0.18 * t : kind === 'shutter' ? 1.08 - 0.08 * t : 1;
    return opening * (1 - 0.1 * ease(x));
  });
  const y = useTransform([reveal, exit], ([r, x]: number[]) => {
    const rising = kind === 'plotter' ? (1 - ease(r)) * 18 : kind === 'columns' ? (1 - ease(r)) * 10 : 0;
    return `${rising - ease(x) * 8}vh`;
  });
  const shade = useTransform(exit, (x) => ease(x) * 0.75);
  return { stage: { clipPath, pointerEvents }, inner: { scale, y }, shade };
}

type Props = {
  reveal: MotionValue<number>;
  kind: SceneTransition;
  label?: string;
};

// The drawn parts of a handover, laid over both stages while it plays
export default function RxpiHandover({ reveal, kind, label }: Props) {
  const opacity = useTransform(reveal, (r) => (r > 0.001 && r < 0.999 ? 1 : 0));

  return (
    <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden" style={{ opacity }}>
      {kind === 'plotter' && <Plotter reveal={reveal} label={label} />}
      {kind === 'aperture' && <Aperture reveal={reveal} label={label} />}
      {kind === 'columns' && <Columns reveal={reveal} label={label} />}
      {kind === 'shutter' && <Shutter reveal={reveal} label={label} />}
      {kind === 'slate' && <Slate reveal={reveal} label={label} />}
    </motion.div>
  );
}

const chip = 'whitespace-nowrap bg-rxpi-red px-3 py-1.5 font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] text-white';

function Plotter({ reveal, label }: { reveal: MotionValue<number>; label?: string }) {
  const top = useTransform(reveal, (r) => `${(1 - ease(r)) * 100}%`);
  return (
    <motion.div className="absolute inset-x-0" style={{ top }}>
      <div className="absolute inset-x-0 bottom-1 h-3 bg-[repeating-linear-gradient(to_right,var(--color-rxpi-red)_0_1px,transparent_1px_32px)]" />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-[repeating-linear-gradient(to_right,var(--color-rxpi-red)_0_1px,transparent_1px_8px)]" />
      <div className="absolute inset-x-0 top-0 h-2 -translate-y-1/2 bg-rxpi-red" />
      {label && <span className={`${chip} absolute bottom-6 right-[max(var(--rx-gutter),calc((100%-var(--rx-max))/2+var(--rx-gutter)))]`}>▲ {label}</span>}
    </motion.div>
  );
}

function Aperture({ reveal, label }: { reveal: MotionValue<number>; label?: string }) {
  const inset = useTransform(reveal, (r) => `${(1 - ease(r)) * 50}%`);
  const guides = useTransform(reveal, [0, 0.15, 0.75, 1], [0, 1, 1, 0]);
  const bracket = 'absolute h-10 w-10 border-rxpi-red';
  return (
    <>
      <motion.div className="absolute inset-0" style={{ opacity: guides }}>
        <div className="absolute inset-x-0 top-1/2 h-px bg-rxpi-red/70" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-rxpi-red/70" />
      </motion.div>
      <motion.div className="absolute" style={{ top: inset, right: inset, bottom: inset, left: inset }}>
        <span className={`${bracket} -left-1 -top-1 border-l-4 border-t-4`} />
        <span className={`${bracket} -right-1 -top-1 border-r-4 border-t-4`} />
        <span className={`${bracket} -bottom-1 -left-1 border-b-4 border-l-4`} />
        <span className={`${bracket} -bottom-1 -right-1 border-b-4 border-r-4`} />
        {label && <span className={`${chip} absolute -top-4 left-12 -translate-y-full`}>{label}</span>}
      </motion.div>
    </>
  );
}

function ColumnCap({ reveal, index }: { reveal: MotionValue<number>; index: number }) {
  const top = useTransform(reveal, (r) => `${(1 - columnRise(r, index)) * 100}%`);
  const opacity = useTransform(reveal, (r) => {
    const rise = columnRise(r, index);
    return rise > 0 && rise < 1 ? 1 : 0;
  });
  return (
    <motion.div className="absolute" style={{ top, opacity, left: `${(index / COLUMNS) * 100}%`, width: `${100 / COLUMNS}%` }}>
      <div className="h-2 -translate-y-1/2 bg-rxpi-red" />
      <div className="absolute right-0 top-0 h-10 w-px bg-rxpi-red/60" />
    </motion.div>
  );
}

function Columns({ reveal, label }: { reveal: MotionValue<number>; label?: string }) {
  const labelTop = useTransform(reveal, (r) => `${(1 - columnRise(r, 0)) * 100}%`);
  const labelOpacity = useTransform(reveal, (r) => (columnRise(r, 0) < 1 ? 1 : 0));
  return (
    <>
      {Array.from({ length: COLUMNS }, (_, i) => (
        <ColumnCap key={i} reveal={reveal} index={i} />
      ))}
      {label && (
        <motion.span className={`${chip} absolute left-[max(var(--rx-gutter),calc((100%-var(--rx-max))/2+var(--rx-gutter)))] -translate-y-[calc(100%+1rem)]`} style={{ top: labelTop, opacity: labelOpacity }}>
          {label}
        </motion.span>
      )}
    </>
  );
}

function Shutter({ reveal, label }: { reveal: MotionValue<number>; label?: string }) {
  const side = useTransform(reveal, (r) => `${(1 - ease(r)) * 50}%`);
  const labelOpacity = useTransform(reveal, [0, 0.12, 0.5, 0.7], [0, 1, 1, 0]);
  return (
    <>
      <motion.div className="absolute inset-y-0 w-1.5 -translate-x-1/2 bg-rxpi-red" style={{ left: side }} />
      <motion.div className="absolute inset-y-0 w-1.5 translate-x-1/2 bg-rxpi-red" style={{ right: side }} />
      {label && (
        <motion.span className={`${chip} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`} style={{ opacity: labelOpacity }}>
          {label}
        </motion.span>
      )}
    </>
  );
}

function Slate({ reveal, label }: { reveal: MotionValue<number>; label?: string }) {
  const clipPath = useTransform(reveal, (r) => `inset(${(1 - slateIn(r)) * 100}% 0% ${slateOut(r) * 100}% 0%)`);
  const y = useTransform(reveal, [0, SLATE_IN, SLATE_OUT, 1], [120, 0, 0, -120]);
  const [number, ...rest] = (label ?? '').split(' · ');
  const name = rest.join(' · ');
  const mark = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 0v16M0 8h16" />
    </svg>
  );

  return (
    <motion.div className="absolute inset-0 bg-rxpi-red text-white" style={{ clipPath }}>
      <div className="absolute inset-6 text-white/60 sm:inset-8">
        <span className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">{mark}</span>
        <span className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2">{mark}</span>
        <span className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2">{mark}</span>
        <span className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2">{mark}</span>
      </div>
      <motion.div className="rx-container flex h-full flex-col justify-center" style={{ y }}>
        <Image src="/logos/rxpi_mark_white.png" alt="" width={56} height={56} className="h-12 w-12" />
        {name ? (
          <>
            <p className="mt-10 font-plex-mono text-[clamp(5rem,14vw,13rem)] font-semibold leading-[0.85] tracking-[-0.04em]">{number}</p>
            <p className="mt-6 text-balance text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-none tracking-[-0.03em]">{name}</p>
          </>
        ) : (
          <p className="mt-10 text-balance text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-none tracking-[-0.03em]">{label}</p>
        )}
        <div className="mt-12 flex items-center justify-between border-t border-white/50 pt-4 font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
          <span>RXPI · RPI Experimental Propulsion Initiative</span>
          <span>Aim higher</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
