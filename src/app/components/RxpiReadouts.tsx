'use client';

import React, { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';
import RxpiSceneItem from './RxpiSceneItem';

type Readout = {
  prefix?: string;
  value: string;
  unit?: string;
  label: string;
};

type Props = {
  items: Readout[];
  tone?: 'light' | 'dark';
  // Inside a scroll scene: progress at which the first readout falls into place and counts up; the rest follow
  sceneAt?: number;
};

// Row of big mono numbers. The first cell of each row sits flush with the page column.
export default function RxpiReadouts({ items, tone = 'light', sceneAt }: Props) {
  const dark = tone === 'dark';
  const four = items.length >= 4;
  const two = items.length === 2;
  const grid = four ? 'grid-cols-2 md:grid-cols-4' : two ? 'grid-cols-2' : 'grid-cols-1 min-[420px]:grid-cols-3';
  const flush = four
    ? 'max-md:odd:pl-0 md:first:pl-0'
    : two
      ? 'first:pl-0'
      : 'max-[419px]:pl-0 min-[420px]:first:pl-0';
  const cellClass = `flex min-w-0 flex-col-reverse justify-end gap-2 py-5 pl-4 pr-3 sm:py-6 sm:pl-6 compact:py-4 ${flush} ${
    dark ? 'bg-rxpi-night' : 'bg-rxpi-paper'
  }`;
  const labelClass = `font-plex-mono text-[11.5px] font-medium uppercase leading-snug tracking-[0.12em] sm:text-xs ${
    dark ? 'text-rxpi-night-muted' : 'text-rxpi-muted'
  }`;
  const valueClass = `flex flex-wrap items-baseline gap-x-1.5 font-plex-mono font-medium tracking-[-0.02em] tabular-nums text-rx-readout ${
    dark ? 'text-rxpi-night-fg' : 'text-rxpi-ink'
  }`;
  const unitClass = `text-[0.45em] tracking-normal ${dark ? 'text-rxpi-night-muted' : 'text-rxpi-muted'}`;

  const value = (item: Readout, shown: boolean) => (
    <>
      {item.prefix && <span className={unitClass}>{item.prefix}</span>}
      <span className="whitespace-nowrap">
        <CountUp value={item.value} shown={shown} />
      </span>
      {item.unit && <span className={unitClass}>{item.unit}</span>}
    </>
  );

  return (
    <dl className={`grid gap-px ${grid} ${dark ? 'bg-rxpi-night-line' : 'bg-rxpi-line'}`}>
      {/* The cells stay put so the hairlines between them never show as a block; the label and value animate */}
      {items.map((item, i) =>
        sceneAt === undefined ? (
          <div key={item.label} className={cellClass}>
            <dt className={labelClass}>{item.label}</dt>
            <dd className={valueClass}>{value(item, true)}</dd>
          </div>
        ) : (
          <div key={item.label} className={cellClass}>
            <RxpiSceneItem as="dt" at={sceneAt + i * 0.06 + 0.03} from="fade" className={labelClass}>
              {item.label}
            </RxpiSceneItem>
            <RxpiSceneItem as="dd" at={sceneAt + i * 0.06} className={valueClass}>
              {(shown) => value(item, shown)}
            </RxpiSceneItem>
          </div>
        )
      )}
    </dl>
  );
}

// Counts a numeric readout up from zero each time it appears. Values without a number show as they are.
// Screen readers always get the real figure; only the visible copy counts.
function CountUp({ value, shown }: { value: string; shown: boolean }) {
  const [text, setText] = useState(value);
  const wasShown = useRef(shown);

  useEffect(() => {
    const match = value.match(/^([^0-9]*)([0-9][0-9,]*(?:\.[0-9]+)?)(.*)$/);
    if (!match) return;
    const [, before, digits, after] = match;
    const target = parseFloat(digits.replace(/,/g, ''));
    const decimals = digits.includes('.') ? digits.split('.')[1].length : 0;
    const format = (n: number) =>
      `${before}${n.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: digits.includes(','),
      })}${after}`;

    // While hidden the readout keeps its real value; the next appearance counts up from zero again
    if (!shown) {
      wasShown.current = false;
      setText(value);
      return;
    }
    if (wasShown.current) {
      setText(value);
      return;
    }
    wasShown.current = true;
    const controls = animate(0, target, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => setText(format(decimals ? n : Math.round(n))),
      onComplete: () => setText(value),
    });
    return () => controls.stop();
  }, [shown, value]);

  return (
    <>
      <span aria-hidden>{text}</span>
      <span className="sr-only">{value}</span>
    </>
  );
}
