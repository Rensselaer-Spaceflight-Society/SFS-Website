'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import RxpiSceneItem from './RxpiSceneItem';

type Photo = {
  src: string;
  alt: string;
  caption?: string;
  meta?: string;
  fit?: 'cover' | 'contain';
  // object-position for cropped photos, e.g. 'center 20%' to keep faces in a portrait shot
  position?: string;
};

type Props = {
  photos: Photo[];
  columns?: 2 | 3 | 4;
  tone?: 'light' | 'dark';
  // Inside a scroll scene: progress at which the first photo lands; the rest follow in order
  sceneAt?: number;
  // Optional pause between rows, so a lower row lands once it is fully on screen
  sceneRowGap?: number;
};

export default function RxpiGallery({ photos, columns = 3, tone = 'light', sceneAt, sceneRowGap }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const triggerRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastOpened = useRef<number | null>(null);
  const dark = tone === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => setOpenIdx(null), []);
  const step = useCallback(
    (dir: number) => setOpenIdx((prev) => (prev === null ? prev : (prev + dir + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (openIdx === null) {
      if (lastOpened.current !== null) {
        triggerRefs.current[lastOpened.current]?.focus();
        lastOpened.current = null;
      }
      return;
    }
    lastOpened.current = openIdx;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      // Keep keyboard focus inside the open lightbox
      if (e.key === 'Tab') {
        const buttons = dialogRef.current?.querySelectorAll<HTMLElement>('button');
        if (!buttons?.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [openIdx, close, step]);

  const active = openIdx !== null ? photos[openIdx] : null;

  // Three-column galleries sit on a 4-column (2 across) and 6-column (3 across) grid, so a short last row can be centered.
  const centeredCell = (i: number) => {
    const n = photos.length;
    const small = n % 2 === 1 && i === n - 1 ? 'col-start-2' : '';
    let large = small ? 'lg:col-start-auto' : '';
    if (n % 3 === 1 && i === n - 1) large = 'lg:col-start-3';
    if (n % 3 === 2 && i === n - 2) large = 'lg:col-start-2';
    return `col-span-2 ${small} ${large}`;
  };

  return (
    <>
      <div
        className={`grid gap-x-3 gap-y-6 sm:gap-6 ${
          columns === 4 ? 'grid-cols-2 lg:grid-cols-4' : columns === 3 ? 'grid-cols-4 lg:grid-cols-6' : 'grid-cols-1 sm:grid-cols-2'
        }`}
      >
        {photos.map((photo, i) => (
          <RxpiSceneItem
            as="figure"
            key={photo.src}
            at={
              sceneAt === undefined
                ? -1
                : sceneRowGap === undefined
                  ? sceneAt + i * 0.08
                  : sceneAt + (i % columns) * 0.06 + Math.floor(i / columns) * sceneRowGap
            }
            // Two-up galleries slide in from either side; larger ones rise in order
            from={sceneAt === undefined ? 'fade' : columns === 2 ? (i % 2 === 0 ? 'left' : 'right') : 'up'}
            className={`group ${columns === 3 ? centeredCell(i) : ''}`}
          >
            {/* A real link to the full image, so it still works without JavaScript; a plain click opens the lightbox */}
            <a
              ref={(el) => {
                triggerRefs.current[i] = el;
              }}
              href={photo.src}
              onClick={(e) => {
                // Modified clicks (new tab, new window) open the image as the browser normally would
                if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                setOpenIdx(i);
              }}
              className={`relative block aspect-[4/3] w-full overflow-hidden border focus:outline-none focus-visible:ring-2 focus-visible:ring-rxpi-red focus-visible:ring-offset-2 ${
                dark
                  ? 'border-rxpi-night-line bg-rxpi-night-raised focus-visible:ring-offset-rxpi-night'
                  : 'border-rxpi-line bg-rxpi-raised focus-visible:ring-offset-rxpi-paper'
              }`}
              aria-label={`View larger: ${photo.alt}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={
                  columns === 4
                    ? '(min-width: 1024px) 25vw, 50vw'
                    : columns === 3
                      ? '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
                      : '(min-width: 640px) 50vw, 100vw'
                }
                style={photo.position ? { objectPosition: photo.position } : undefined}
                className={`transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
                  photo.fit === 'contain' ? 'object-contain p-2 sm:p-4' : 'object-cover'
                }`}
              />
              <span
                className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100 pointer-coarse:opacity-100 ${
                  dark ? 'bg-rxpi-night text-rxpi-night-fg' : 'bg-rxpi-paper text-rxpi-ink'
                }`}
                aria-hidden
              >
                <Expand className="h-4 w-4" />
              </span>
            </a>
            {(photo.caption || photo.meta) && (
              <figcaption className="mt-2.5 sm:mt-3">
                {photo.meta && (
                  <p
                    className={`font-plex-mono text-[10px] uppercase tracking-[0.12em] sm:text-xs ${
                      dark ? 'text-rxpi-night-muted' : 'text-rxpi-muted'
                    }`}
                  >
                    {photo.meta}
                  </p>
                )}
                {photo.caption && (
                  <p className={`mt-1 text-pretty text-sm leading-snug sm:leading-relaxed ${dark ? 'text-rxpi-night-fg' : 'text-rxpi-ink'}`}>
                    {photo.caption}
                  </p>
                )}
              </figcaption>
            )}
          </RxpiSceneItem>
        ))}
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {active && openIdx !== null && (
              <motion.div
                key="lightbox"
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={active.alt}
                className="fixed inset-0 z-[60] flex flex-col bg-[#0a0806] font-plex text-rxpi-night-fg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                onClick={close}
              >
                <div className="flex h-14 flex-none items-center justify-between border-b border-rxpi-night-line bg-rxpi-night-sunken px-4 sm:px-6 short:h-11">
                  <span className="font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] text-rxpi-night-muted">
                    {openIdx + 1} / {photos.length}
                  </span>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    className="flex h-11 w-11 items-center justify-center text-rxpi-night-fg transition-colors duration-150 hover:bg-rxpi-night-raised focus:outline-none focus-visible:ring-2 focus-visible:ring-rxpi-red"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" aria-hidden />
                  </button>
                </div>

                <div className="relative min-h-0 flex-1" onClick={(e) => e.stopPropagation()}>
                  <Image
                    key={active.src}
                    src={active.src}
                    alt={active.alt}
                    fill
                    sizes="100vw"
                    className="object-contain p-2 pb-16 sm:p-10 short:p-2"
                  />
                  {photos.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => step(-1)}
                        className="absolute bottom-2 left-2 flex h-12 w-12 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 items-center justify-center border border-rxpi-night-line bg-rxpi-night text-rxpi-night-fg transition-colors duration-150 hover:border-rxpi-night-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-rxpi-red sm:left-6"
                        aria-label="Previous photo"
                      >
                        <ChevronLeft className="h-5 w-5" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => step(1)}
                        className="absolute bottom-2 right-2 flex h-12 w-12 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 items-center justify-center border border-rxpi-night-line bg-rxpi-night text-rxpi-night-fg transition-colors duration-150 hover:border-rxpi-night-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-rxpi-red sm:right-6"
                        aria-label="Next photo"
                      >
                        <ChevronRight className="h-5 w-5" aria-hidden />
                      </button>
                    </>
                  )}
                </div>

                {(active.caption || active.meta) && (
                  <div
                    className="flex-none border-t border-rxpi-night-line bg-rxpi-night-sunken px-4 py-4 sm:px-6 short:py-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {active.meta && (
                      <p className="font-plex-mono text-[11.5px] uppercase tracking-[0.12em] text-rxpi-night-muted">
                        {active.meta}
                      </p>
                    )}
                    {active.caption && <p className="mt-1 max-w-3xl text-sm leading-relaxed">{active.caption}</p>}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.querySelector('[data-rxpi-root]') ?? document.body
        )}
    </>
  );
}
