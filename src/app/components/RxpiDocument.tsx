'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Download, ExternalLink, X } from 'lucide-react';
import RxpiSceneItem from './RxpiSceneItem';

type Props = {
  title: string;
  meta?: string;
  description?: string;
  src?: string | null;
  cover?: string;
  // A report's cover is a portrait page; a slide deck's is a 16:9 slide
  coverShape?: 'page' | 'slide';
  // Inside a scroll scene: progress at which the cover wipes in; the text and then the links follow
  sceneAt?: number;
};

// A PDF with its cover page and open/download links. Large screens with a mouse can also preview it in a
// dialog; touch browsers only render the first page of an embedded PDF, so they get the links alone.
// The preview opens over the page instead of expanding in place, so a pinned scroll scene keeps its size.
export default function RxpiDocument({ title, meta, description, src, cover, coverShape = 'page', sceneAt }: Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [previewing, setPreviewing] = useState(false);
  // The preview needs JavaScript; without it the Open and Download links cover the same ground
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!src) return null;

  const actionClass =
    'inline-flex min-h-11 items-center gap-2 border border-rxpi-field px-4 text-sm font-medium text-rxpi-ink transition-colors duration-150 hover:border-rxpi-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-rxpi-red focus-visible:ring-offset-2';

  // Outside a scene everything shows from the start
  const at = (offset: number) => (sceneAt === undefined ? -1 : sceneAt + offset);

  const openPreview = () => {
    setPreviewing(true);
    dialogRef.current?.showModal();
  };

  return (
    <div className="border border-rxpi-line bg-rxpi-raised">
      <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:p-6">
        {cover && (
          <RxpiSceneItem at={at(0)} from={sceneAt === undefined ? 'fade' : 'wipe'} className="flex-none">
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative block border border-rxpi-line bg-white ${
                coverShape === 'slide' ? 'aspect-video w-44 sm:w-64' : 'aspect-[600/777] w-28 sm:w-36'
              }`}
              aria-label={`Open ${title} (opens in a new tab)`}
            >
              <Image src={cover} alt="" fill sizes={coverShape === 'slide' ? '256px' : '144px'} className="object-cover" />
            </a>
          </RxpiSceneItem>
        )}
        <div className="min-w-0 flex-1">
          <RxpiSceneItem at={at(0.06)} from={sceneAt === undefined ? 'fade' : 'up'}>
            {meta && <p className="font-plex-mono text-[11.5px] uppercase tracking-[0.12em] text-rxpi-muted sm:text-xs">{meta}</p>}
            <p className="mt-2 text-rx-h3 font-semibold tracking-[-0.01em] text-rxpi-ink">{title}</p>
            {description && <p className="mt-3 max-w-[40rem] text-pretty text-rx-body text-rxpi-muted">{description}</p>}
          </RxpiSceneItem>
          <RxpiSceneItem at={at(0.25)} from={sceneAt === undefined ? 'fade' : 'fall'} className="mt-5 flex flex-wrap gap-2">
            <a href={src} target="_blank" rel="noopener noreferrer" className={actionClass}>
              Open PDF
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href={src} download className={actionClass}>
              Download PDF
              <Download className="h-3.5 w-3.5" aria-hidden />
            </a>
          </RxpiSceneItem>
        </div>
      </div>

      {mounted && (
        <div className="hidden border-t border-rxpi-line lg:pointer-fine:block">
          <button
            type="button"
            onClick={openPreview}
            aria-haspopup="dialog"
            className="flex min-h-11 w-full items-center gap-2 px-6 font-plex-mono text-xs font-semibold uppercase tracking-[0.12em] text-rxpi-muted transition-colors duration-150 hover:text-rxpi-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rxpi-red"
          >
            <span aria-hidden>▸</span>
            Preview the PDF
          </button>
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-label={`${title} preview`}
        onClose={() => setPreviewing(false)}
        onClick={(e) => {
          // A click on the backdrop (the dialog element itself, outside its panel) closes the preview
          if (e.target === dialogRef.current) dialogRef.current.close();
        }}
        className="m-auto h-[min(92svh,60rem)] max-h-none w-[min(92vw,75rem)] max-w-none border border-rxpi-night-line bg-rxpi-night p-0 text-rxpi-night-fg backdrop:bg-black/80"
      >
        <div className="flex h-full flex-col">
          <div className="flex flex-none items-center justify-between gap-4 border-b border-rxpi-night-line py-1.5 pl-5 pr-1.5">
            <p className="min-w-0 truncate font-plex-mono text-xs font-semibold uppercase tracking-[0.12em]">{title}</p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close preview"
              className="flex h-11 w-11 flex-none items-center justify-center text-rxpi-night-fg transition-colors duration-150 hover:bg-rxpi-night-raised focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rxpi-red"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          {/* The PDF only loads once the preview is opened */}
          {previewing && (
            <object className="block min-h-0 w-full flex-1 bg-rxpi-sunken" data={src} type="application/pdf" aria-label={title}>
              <p className="p-6 text-sm text-rxpi-night-fg">
                This browser can&apos;t show PDFs inline.{' '}
                <a href={src} className="font-medium underline underline-offset-4">
                  Open the PDF
                </a>
                .
              </p>
            </object>
          )}
          {/* Escape can't reach the dialog from inside the browser's PDF viewer, so a close control follows it */}
          <div className="flex flex-none items-center justify-end gap-1 border-t border-rxpi-night-line py-1.5 pl-5 pr-1.5">
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 px-4 font-plex-mono text-xs font-semibold uppercase tracking-[0.12em] text-rxpi-night-fg transition-colors duration-150 hover:bg-rxpi-night-raised focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rxpi-red"
            >
              Open in new tab
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="inline-flex min-h-11 items-center gap-2 px-4 font-plex-mono text-xs font-semibold uppercase tracking-[0.12em] text-rxpi-night-fg transition-colors duration-150 hover:bg-rxpi-night-raised focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rxpi-red"
            >
              Close preview
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
