'use client';

import React from 'react';
import { Check } from 'lucide-react';
import RxpiSceneItem from './RxpiSceneItem';

export type Gate = {
  id: string;
  name: string;
  date?: string;
  status: 'complete' | 'current' | 'planned';
  statusText?: string;
  milestone?: boolean;
  // What the gate decides, in a line
  purpose?: string;
  // Short figures shown under the status (criteria counts, analyses)
  facts?: string[];
};

type Props = {
  gates: Gate[];
  tone?: 'light' | 'dark';
  // Inside a scroll scene: the progress range over which the gates light up, first to last
  sceneRange?: [number, number];
};

const statusLabel = {
  complete: 'Complete',
  current: 'In work',
  planned: 'Planned',
};

// Vertical list on phones, one row across from md up. Each gate leads with its review code in large type
// and a status chip; the gate in work sits on a raised panel under a red rule. In a scroll scene the gates
// light up one by one and the line between them draws across.
export default function RxpiGateTimeline({ gates, tone = 'light', sceneRange }: Props) {
  const dark = tone === 'dark';
  const ink = dark ? 'text-rxpi-night-fg' : 'text-rxpi-ink';
  const muted = dark ? 'text-rxpi-night-muted' : 'text-rxpi-muted';
  const red = dark ? 'text-rxpi-red-bright' : 'text-rxpi-red';
  const [start, end] = sceneRange ?? [-1, -1];
  const step = (end - start) / gates.length;
  const gateAt = (index: number) => (sceneRange ? start + index * step : -1);

  const marker = (gate: Gate) => {
    if (gate.milestone) {
      return (
        <span className={`flex h-7 w-7 items-center justify-center text-2xl leading-none ${gate.status === 'planned' ? muted : ink}`} aria-hidden>
          ◆
        </span>
      );
    }
    if (gate.status === 'complete') {
      return (
        <span className={`flex h-7 w-7 items-center justify-center ${dark ? 'bg-rxpi-night-green text-rxpi-night' : 'bg-rxpi-green text-white'}`} aria-hidden>
          <Check className="h-4 w-4" strokeWidth={3} />
        </span>
      );
    }
    if (gate.status === 'current') {
      return (
        <span className="flex h-7 w-7 items-center justify-center bg-rxpi-red" aria-hidden>
          <span className="h-2.5 w-2.5 bg-white motion-safe:animate-pulse" />
        </span>
      );
    }
    return (
      <span
        className={`block h-7 w-7 border-2 ${dark ? 'border-rxpi-night-muted bg-rxpi-night' : 'border-rxpi-field bg-rxpi-paper'}`}
        aria-hidden
      />
    );
  };

  const chip = (gate: Gate) => {
    const base = 'inline-block px-2 py-1 font-plex-mono text-xs font-semibold uppercase tracking-[0.12em] sm:text-[13px]';
    if (gate.status === 'complete') {
      return `${base} border ${dark ? 'border-rxpi-night-green text-rxpi-night-green' : 'border-rxpi-green text-rxpi-green'}`;
    }
    if (gate.status === 'current') return `${base} bg-rxpi-red text-white`;
    return `${base} border ${dark ? 'border-rxpi-night-line text-rxpi-night-muted' : 'border-rxpi-line text-rxpi-muted'}`;
  };

  return (
    <ol className="grid grid-cols-1 md:grid-flow-col md:auto-cols-fr">
      {gates.map((gate, index) => (
        <li key={gate.id} className="relative flex gap-5 pb-8 md:flex-col md:gap-0 md:pb-0 md:pr-4 lg:pr-6">
          {gate.status === 'current' && (
            <RxpiSceneItem
              as="span"
              at={gateAt(index)}
              from="fade"
              className={`absolute -inset-x-3 -bottom-4 -top-4 border-t-4 border-rxpi-red md:-left-4 md:right-1 md:-top-6 md:-bottom-6 ${
                dark ? 'bg-rxpi-night-raised' : 'bg-rxpi-raised'
              }`}
            />
          )}
          {index < gates.length - 1 && (
            <RxpiSceneItem
              as="span"
              at={gateAt(index) + step * 0.6}
              from={sceneRange ? 'grow' : 'fade'}
              // Segments up to a gate that is done or in work are a heavy rule (red into the gate in work);
              // the rest are dashed, like a planned line on a drawing
              className={`absolute left-[13px] top-8 bottom-0 origin-left md:left-9 md:right-2 md:top-[13px] md:bottom-auto md:w-auto ${
                gates[index + 1].status === 'planned'
                  ? `w-0 border-l-2 border-dashed md:h-0 md:border-l-0 md:border-t-2 ${dark ? 'border-rxpi-night-subtle' : 'border-rxpi-field'}`
                  : `w-[3px] md:h-[3px] ${gates[index + 1].status === 'current' ? 'bg-rxpi-red' : dark ? 'bg-rxpi-night-fg' : 'bg-rxpi-ink'}`
              }`}
            />
          )}
          <RxpiSceneItem at={gateAt(index)} from={sceneRange ? 'pop' : 'fade'} className="relative flex-none">
            {marker(gate)}
          </RxpiSceneItem>
          <RxpiSceneItem at={gateAt(index) + step * 0.2} from={sceneRange ? 'up' : 'fade'} className="relative min-w-0 md:mt-6">
            <p
              className={`font-plex-mono text-[clamp(1.75rem,1rem+1.5vw,2.75rem)] font-semibold leading-none tracking-[-0.02em] ${
                gate.status === 'current' ? red : gate.status === 'planned' ? muted : ink
              }`}
            >
              {gate.id}
            </p>
            <p className={`mt-3 text-pretty text-base leading-snug lg:text-[17px] ${gate.status === 'planned' ? muted : ink}`}>{gate.name}</p>
            {gate.purpose && <p className={`mt-2 text-pretty text-[15px] leading-snug ${muted}`}>{gate.purpose}</p>}
            <p className="mt-4">
              <span className={chip(gate)}>{gate.statusText ?? statusLabel[gate.status]}</span>
            </p>
            {gate.date && <p className={`mt-2 font-plex-mono text-xs uppercase tracking-[0.12em] ${muted}`}>{gate.date}</p>}
            {gate.facts && (
              <ul className={`mt-3 space-y-1.5 font-plex-mono text-[11.5px] uppercase leading-snug tracking-[0.1em] ${muted}`}>
                {gate.facts.map((fact) => (
                  <li key={fact} className="flex gap-2">
                    <span className="mt-[0.5em] h-px w-2.5 flex-none bg-rxpi-red" aria-hidden />
                    {fact}
                  </li>
                ))}
              </ul>
            )}
          </RxpiSceneItem>
        </li>
      ))}
    </ol>
  );
}
