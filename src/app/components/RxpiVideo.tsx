'use client';

import React from 'react';

type Props = {
  title: string;
  meta?: string;
  src?: string | null;
  embedUrl?: string | null;
  poster?: string;
};

// Plays a video from /public (src) or an embed such as YouTube or Google Drive (embedUrl).
// Renders nothing until one of them is set.
export default function RxpiVideo({ title, meta, src, embedUrl, poster }: Props) {
  if (!src && !embedUrl) return null;

  return (
    <figure className="border border-rxpi-night-line bg-rxpi-night-sunken">
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {embedUrl ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        ) : (
          <video className="absolute inset-0 h-full w-full bg-black object-contain" controls playsInline preload="metadata" poster={poster}>
            <source src={src ?? undefined} type="video/mp4" />
          </video>
        )}
      </div>
      <figcaption className="flex flex-col gap-1 border-t border-rxpi-night-line px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:px-5">
        <span className="text-sm font-medium text-rxpi-night-fg">{title}</span>
        {meta && <span className="font-plex-mono text-[11.5px] uppercase tracking-[0.12em] text-rxpi-night-muted">{meta}</span>}
      </figcaption>
    </figure>
  );
}
