'use client';

import React from 'react';
import RxpiSceneItem from './RxpiSceneItem';

type Spec = {
  label: string;
  value: string;
  alt?: string;
};

type Props = {
  title?: string;
  specs: Spec[];
  tone?: 'light' | 'dark';
  // Inside a scroll scene: progress at which the first row falls into place; the rest follow in order
  sceneAt?: number;
};

export default function RxpiSpecTable({ title, specs, tone = 'light', sceneAt }: Props) {
  const dark = tone === 'dark';

  return (
    <div>
      {title && (
        <RxpiSceneItem at={sceneAt === undefined ? -1 : sceneAt - 0.05} from="fade">
          <p
            className={`pb-3 font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] sm:text-[13px] ${
              dark ? 'text-rxpi-night-muted' : 'text-rxpi-muted'
            }`}
          >
            {title}
          </p>
        </RxpiSceneItem>
      )}
      {/* The top rule draws across just before the first row */}
      <RxpiSceneItem
        at={sceneAt === undefined ? -1 : sceneAt - 0.03}
        from={sceneAt === undefined ? 'fade' : 'grow'}
        className={`h-px origin-left ${dark ? 'bg-rxpi-night-fg' : 'bg-rxpi-ink'}`}
      />
      <dl>
        {specs.map((spec, i) => (
          <RxpiSceneItem
            key={spec.label}
            at={sceneAt === undefined ? -1 : sceneAt + i * 0.04}
            from={sceneAt === undefined ? 'fade' : 'left'}
            className={`grid grid-cols-1 gap-1 border-b py-3.5 min-[480px]:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] min-[480px]:gap-6 ${
              dark ? 'border-rxpi-night-line' : 'border-rxpi-line'
            }`}
          >
            <dt
              className={`font-plex-mono text-[11.5px] font-medium uppercase leading-5 tracking-[0.12em] sm:text-xs ${
                dark ? 'text-rxpi-night-muted' : 'text-rxpi-muted'
              }`}
            >
              {spec.label}
            </dt>
            <dd className={`text-rx-body leading-snug ${dark ? 'text-rxpi-night-fg' : 'text-rxpi-ink'}`}>
              {spec.value}
              {spec.alt && (
                <span className={`ml-2 font-plex-mono text-[0.8em] ${dark ? 'text-rxpi-night-muted' : 'text-rxpi-muted'}`}>{spec.alt}</span>
              )}
            </dd>
          </RxpiSceneItem>
        ))}
      </dl>
    </div>
  );
}
