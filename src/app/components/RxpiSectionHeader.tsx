'use client';

import React from 'react';
import RxpiSceneItem from './RxpiSceneItem';

type Props = {
  label: string;
  title: string;
  description?: React.ReactNode;
  tone?: 'light' | 'dark';
  as?: 'h1' | 'h2';
  // Inside a scroll scene: progress at which the label, title and description fall into place, one after another
  sceneAt?: number;
};

export default function RxpiSectionHeader({ label, title, description, tone = 'light', as: Heading = 'h2', sceneAt }: Props) {
  const dark = tone === 'dark';
  const step = (index: number, node: React.ReactNode) =>
    sceneAt === undefined ? node : <RxpiSceneItem at={sceneAt + index * 0.08}>{node}</RxpiSceneItem>;

  return (
    <div>
      {step(
        0,
        <p
          className={`flex items-center gap-3 font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] sm:text-[13px] ${
            dark ? 'text-rxpi-night-muted' : 'text-rxpi-muted'
          }`}
        >
          <span className="h-2 w-2 flex-none bg-rxpi-red" aria-hidden />
          <span className="flex-none">{label}</span>
          <span className={`h-px flex-1 ${dark ? 'bg-rxpi-night-fg/15' : 'bg-rxpi-ink/15'}`} aria-hidden />
        </p>
      )}
      {step(
        1,
        <Heading
          className={`mt-5 max-w-[22ch] text-balance text-rx-h2 font-semibold tracking-[-0.02em] ${dark ? 'text-rxpi-night-fg' : 'text-rxpi-ink'}`}
        >
          {title}
        </Heading>
      )}
      {description &&
        step(
          2,
          <p className={`mt-5 max-w-[42rem] text-pretty text-rx-lead ${dark ? 'text-rxpi-night-muted' : 'text-rxpi-muted'}`}>{description}</p>
        )}
    </div>
  );
}
