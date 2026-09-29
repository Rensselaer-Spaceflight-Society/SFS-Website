'use client';

import React from 'react';
import Image from 'next/image';
import RxpiSceneItem from './RxpiSceneItem';

type Frame = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type Callout = {
  title: string;
  detail?: string;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  side: 'left' | 'right';
  frame?: Frame;
};

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  callouts: Callout[];
  tone?: 'light' | 'dark';
  priority?: boolean;
  sizes?: string;
  plate?: boolean;
  fit?: 'contain' | 'cover';
  // Inside a scroll scene: progress at which the first callout appears; the others follow one by one
  sceneAt?: number;
};

// An image with leader-line callouts (large screens) or numbered markers plus a legend (small screens).
// Points are percentages of the image box; the label sits at labelX/labelY and reads toward `side`.
// A callout with a `frame` outlines that area instead of covering it with a marker.
export default function RxpiCallouts({
  src,
  alt,
  width,
  height,
  callouts,
  tone = 'dark',
  priority = false,
  sizes = '(min-width: 1024px) 60vw, 100vw',
  plate = false,
  fit = 'contain',
  sceneAt,
}: Props) {
  const dark = tone === 'dark';
  // On a photo plate the line is red so it stays visible over busy backgrounds.
  const lineColor = plate ? 'text-rxpi-red-bright' : dark ? 'text-rxpi-night-fg' : 'text-rxpi-ink/70';
  // Outside a scene every callout shows from the start
  const calloutAt = (i: number) => (sceneAt === undefined ? -1 : sceneAt + i * 0.12);

  return (
    <figure>
      <div className="relative w-full" style={{ aspectRatio: `${width} / ${height}` }}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={fit === 'cover' ? 'object-cover' : 'object-contain'} />

        {callouts.map((c, i) => (
          <RxpiSceneItem
            key={`line-${c.title}`}
            at={calloutAt(i) + 0.03}
            // The leader line draws outward from its marker toward the label
            clipFrom={[c.frame ? c.frame.x + c.frame.w / 2 : c.x, c.frame ? c.frame.y : c.y]}
            className="pointer-events-none absolute inset-0 hidden lg:block"
          >
            <svg
              className={`h-full w-full ${lineColor} ${plate ? 'drop-shadow-[0_0_1.5px_rgba(0,0,0,0.9)]' : ''}`}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <line
                x1={c.frame ? c.frame.x + c.frame.w / 2 : c.x}
                y1={c.frame ? c.frame.y : c.y}
                x2={c.labelX}
                y2={c.labelY}
                stroke="currentColor"
                strokeWidth={plate ? 1.5 : 1}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </RxpiSceneItem>
        ))}

        {callouts.map((c, i) =>
          c.frame ? (
            <React.Fragment key={c.title}>
              <RxpiSceneItem
                as="span"
                at={calloutAt(i)}
                from="scale"
                className="absolute border border-white shadow-[0_0_0_1px_rgba(0,0,0,0.5)]"
                style={{ left: `${c.frame.x}%`, top: `${c.frame.y}%`, width: `${c.frame.w}%`, height: `${c.frame.h}%` }}
              />
              <span
                className="absolute flex h-5 w-5 -translate-y-full items-center justify-center bg-rxpi-red font-plex-mono text-[10px] font-semibold text-white sm:h-6 sm:w-6 sm:text-xs lg:hidden"
                style={{ left: `${c.frame.x + c.frame.w}%`, top: `${c.frame.y}%` }}
                aria-hidden
              >
                {i + 1}
              </span>
            </React.Fragment>
          ) : (
            <span
              key={c.title}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
              aria-hidden
            >
              <RxpiSceneItem
                as="span"
                at={calloutAt(i)}
                from="pop"
                className="flex h-5 w-5 items-center justify-center border border-rxpi-night-fg bg-rxpi-red font-plex-mono text-[10px] font-semibold text-white sm:h-6 sm:w-6 sm:text-xs lg:h-2.5 lg:w-2.5 lg:text-[0px]"
              >
                {i + 1}
              </RxpiSceneItem>
            </span>
          )
        )}

        {callouts.map((c, i) => (
          <span
            key={c.title}
            className={`absolute hidden max-w-[30%] -translate-y-1/2 lg:block ${c.side === 'left' ? '-translate-x-full pr-3 text-right' : 'pl-3'}`}
            style={{ left: `${c.labelX}%`, top: `${c.labelY}%` }}
            aria-hidden
          >
            <RxpiSceneItem
              as="span"
              at={calloutAt(i) + 0.06}
              from={c.side === 'left' ? 'right' : 'left'}
              className={`block ${plate ? 'bg-rxpi-night-sunken/90 px-3 py-2' : ''}`}
            >
              <span
                className={`block font-plex-mono text-xs font-semibold uppercase tracking-[0.12em] ${
                  dark ? 'text-rxpi-night-fg' : 'text-rxpi-ink'
                }`}
              >
                {c.title}
              </span>
              {c.detail && (
                <span className={`mt-1 block text-sm leading-snug ${dark ? 'text-rxpi-night-muted' : 'text-rxpi-muted'}`}>
                  {c.detail}
                </span>
              )}
            </RxpiSceneItem>
          </span>
        ))}
      </div>

      <figcaption className="lg:sr-only">
        <ol
          className={`mt-4 grid gap-2 border-t pt-4 sm:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] sm:gap-4 ${
            dark ? 'border-rxpi-night-line' : 'border-rxpi-line'
          }`}
        >
          {callouts.map((c, i) => (
            <li key={c.title} className={`flex gap-3 text-sm leading-snug ${dark ? 'text-rxpi-night-fg' : 'text-rxpi-ink'}`}>
              <span className={`font-plex-mono font-semibold ${dark ? 'text-rxpi-red-bright' : 'text-rxpi-red'}`}>{i + 1}</span>
              <span>
                {c.title}
                {c.detail && <span className={`block ${dark ? 'text-rxpi-night-muted' : 'text-rxpi-muted'}`}>{c.detail}</span>}
              </span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
