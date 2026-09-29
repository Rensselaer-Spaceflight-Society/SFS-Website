'use client';

import React from 'react';
import Image from 'next/image';

type Props = {
  rows: [string, string][];
  tone?: 'light' | 'dark';
  className?: string;
};

// A drawing title block: a small ruled table of label/value cells under the RXPI mark.
export default function RxpiTitleBlock({ rows, tone = 'dark', className = '' }: Props) {
  const dark = tone === 'dark';
  const line = dark ? 'border-rxpi-night-line' : 'border-rxpi-line';

  return (
    <div
      className={`w-fit border font-plex-mono text-[11.5px] uppercase leading-none tracking-[0.12em] ${line} ${
        dark ? 'bg-rxpi-night-sunken/85 text-rxpi-night-fg' : 'bg-rxpi-raised text-rxpi-ink'
      } ${className}`}
    >
      <div className={`flex items-center gap-2 border-b px-3 py-2 ${line}`}>
        <Image
          src={dark ? '/logos/rxpi_mark_white.png' : '/logos/rxpi_mark.png'}
          alt=""
          width={640}
          height={597}
          className="h-4 w-auto"
        />
        <span className="font-semibold">RXPI</span>
      </div>
      <dl className="grid grid-cols-[auto_auto]">
        {rows.map(([label, value], i) => (
          <div key={label} className="contents">
            <dt
              className={`border-r px-3 py-2 ${i < rows.length - 1 ? 'border-b' : ''} ${line} ${
                dark ? 'text-rxpi-night-muted' : 'text-rxpi-muted'
              }`}
            >
              {label}
            </dt>
            <dd className={`px-3 py-2 ${i < rows.length - 1 ? 'border-b' : ''} ${line}`}>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
