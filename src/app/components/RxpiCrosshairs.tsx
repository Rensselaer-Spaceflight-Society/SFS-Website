'use client';

import React from 'react';

type Props = {
  tone?: 'light' | 'dark';
  inset?: string;
};

// Registration marks in the four corners of a panel, like the corners of a drawing sheet.
export default function RxpiCrosshairs({ tone = 'dark', inset = 'inset-4 sm:inset-6' }: Props) {
  const color = tone === 'dark' ? 'text-rxpi-night-fg/35' : 'text-rxpi-ink/30';
  const mark = (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M6 0v12M0 6h12" />
    </svg>
  );

  return (
    <div className={`pointer-events-none absolute ${inset} ${color}`} aria-hidden>
      <span className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">{mark}</span>
      <span className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2">{mark}</span>
      <span className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2">{mark}</span>
      <span className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2">{mark}</span>
    </div>
  );
}
