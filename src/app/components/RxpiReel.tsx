'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useTransform } from 'framer-motion';
import { useScene } from './RxpiScene';
import RxpiSceneItem from './RxpiSceneItem';

export type ReelPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type Props = {
  label: string;
  photos: ReelPhoto[];
};

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

// A row of large photos at their own proportions. In a pinned scene the stage holds and scrolling slides the
// row across it, with a frame counter and a red rule that fills as it goes; elsewhere (phones, reduced motion)
// the row scrolls sideways under the reader's finger.
export default function RxpiReel({ label, photos }: Props) {
  const { mode, smooth } = useScene();
  const pinned = mode === 'pinned';
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [travel, setTravel] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    // A swipe row that snapped sideways before the scene pinned would otherwise keep that offset
    if (pinned) viewport.scrollLeft = 0;
    // The frame's side padding puts the row on the page margins, so the row travels until its end meets the right one
    const update = () => {
      const style = getComputedStyle(viewport);
      const inner = viewport.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      setTravel(Math.max(0, track.scrollWidth - inner));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    observer.observe(track);
    return () => observer.disconnect();
  }, [pinned]);

  const x = useTransform(smooth, (p) => (pinned ? -clamp01(p) * travel : 0));
  const fill = useTransform(smooth, (p) => (pinned ? clamp01(p) : 1));
  const frame = useTransform(smooth, (p) =>
    String(Math.min(photos.length, Math.round(clamp01(p) * (photos.length - 1)) + 1)).padStart(2, '0')
  );
  const total = String(photos.length).padStart(2, '0');

  return (
    <div>
      <div className="rx-container">
        <div className="flex items-end justify-between gap-6">
          <RxpiSceneItem at={-0.5} from="fade">
            <p className="font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] text-rxpi-muted sm:text-[13px]">{label}</p>
          </RxpiSceneItem>
          <RxpiSceneItem at={-0.4} from="fade">
            <p className="font-plex-mono text-xs font-semibold uppercase tabular-nums tracking-[0.14em] text-rxpi-muted sm:text-[13px]" aria-hidden>
              {pinned ? <motion.span className="text-rxpi-ink">{frame}</motion.span> : <span className="text-rxpi-ink">{total}</span>}
              {pinned ? ` / ${total}` : ' photos · swipe'}
            </p>
          </RxpiSceneItem>
        </div>
        <div className="relative mt-4 h-px bg-rxpi-line">
          <motion.div className="absolute inset-x-0 -top-px h-[3px] origin-left bg-rxpi-red" style={{ scaleX: fill }} />
        </div>
      </div>

      <div
        ref={viewportRef}
        tabIndex={pinned ? undefined : 0}
        role={pinned ? undefined : 'region'}
        aria-label={pinned ? undefined : label}
        className={`mt-6 px-[max(var(--rx-gutter),calc((100%-var(--rx-max))/2+var(--rx-gutter)))] scroll-px-[max(var(--rx-gutter),calc((100%-var(--rx-max))/2+var(--rx-gutter)))] focus:outline-none focus-visible:ring-2 focus-visible:ring-rxpi-red compact:mt-4 ${
          pinned ? 'overflow-hidden' : 'snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        }`}
      >
        {/* The row starts on the page's left margin and ends on its right margin */}
        <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-3 sm:gap-4">
          {photos.map((photo, i) => (
            <RxpiSceneItem
              key={photo.src}
              at={-0.4 + Math.min(i, 3) * 0.07}
              from="wipe"
              className="flex-none snap-start"
            >
              <div
                className="relative h-[min(56svh,26rem)] overflow-hidden border border-rxpi-line bg-rxpi-sunken md:h-[min(64svh,46rem)] snug:h-[60svh] compact:h-[56svh]"
                style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 90vw"
                  className="object-cover"
                />
              </div>
            </RxpiSceneItem>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
