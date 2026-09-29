'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SCENE_HANDOVER, SCENE_PACE, SceneProvider, useSceneSetup, useSceneValue } from './RxpiScene';
import { useStageMotion } from './RxpiHandover';

type HeroImage = {
  src: string;
  alt?: string;
  position?: string;
};

type Props = {
  kicker?: string;
  title: React.ReactNode;
  titleClassName?: string;
  description?: React.ReactNode;
  logo?: React.ReactNode;
  logoIsHeading?: boolean;
  layout?: 'overlay' | 'split';
  image?: HeroImage;
  media?: React.ReactNode;
  mediaFirst?: boolean;
  background?: React.ReactNode;
  size?: 'full' | 'page';
  // How far, in screen heights before SCENE_PACE, the hero stays pinned while its scroll animation plays
  length?: number;
  children?: React.ReactNode;
  footer?: React.ReactNode;
};

// Dark page header for the RXPI pages. It runs up under the site navbar and the RXPI subnav
// (together --rx-bars tall), so that much is kept clear at the top. On large screens it fills the screen
// and stays pinned for a short stretch of scrolling: the photo zooms and the text lifts away.
export default function RxpiHero({
  kicker,
  title,
  titleClassName = 'text-rx-h1 font-semibold tracking-[-0.025em]',
  description,
  logo,
  logoIsHeading = false,
  layout = 'overlay',
  image,
  media,
  mediaFirst = true,
  background,
  size = 'page',
  length = 0.7,
  children,
  footer,
}: Props) {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const spacerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const scene = useSceneSetup(
    wrapperRef,
    [textRef, footerRef],
    () => {
      const content = textRef.current?.parentElement;
      if (!textRef.current || !content) return null;
      // The clear area under the bars, the content's bottom padding (a pinned hero has no top padding),
      // the text and the readout strip
      return (
        (spacerRef.current?.offsetHeight ?? 137) +
        parseFloat(getComputedStyle(content).paddingBottom) +
        textRef.current.offsetHeight +
        (footerRef.current?.offsetHeight ?? 0)
      );
    },
    0,
    length * SCENE_PACE
  );
  const pinned = scene.mode === 'pinned';
  const stage = useStageMotion(scene, 'plotter');
  const heights =
    size === 'full'
      ? 'min-h-[clamp(560px,calc(100svh-7.5rem),980px)]'
      : 'min-h-[clamp(480px,78svh,880px)]';
  const TitleTag = logoIsHeading ? 'p' : 'h1';

  const text = (
    <div className="min-w-0">
      {logo &&
        (logoIsHeading ? (
          <h1 className="mb-8 sm:mb-10 compact:mb-5 short:mb-4">{logo}</h1>
        ) : (
          <div className="mb-8 sm:mb-10 compact:mb-5 short:mb-4">{logo}</div>
        ))}
      {kicker && (
        <p
          className={`mb-4 flex items-center gap-3 font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] sm:mb-5 sm:text-[13px] short:hidden ${
            image ? 'text-rxpi-night-fg' : 'text-rxpi-night-muted'
          }`}
        >
          <span className="h-2 w-2 flex-none bg-rxpi-red" aria-hidden />
          {kicker}
        </p>
      )}
      <TitleTag className={`text-balance ${titleClassName}`}>{title}</TitleTag>
      {description && (
        <p className="mt-6 max-w-[38rem] text-pretty text-rx-lead text-rxpi-night-fg/85 compact:mt-3 short:mt-3 short:text-base">{description}</p>
      )}
      {children && <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap compact:mt-5 short:mt-5">{children}</div>}
    </div>
  );

  return (
    <SceneProvider value={scene}>
      <header
        ref={wrapperRef}
        data-rx-scene={scene.mode}
        className="relative isolate -mt-[var(--rx-bars)] overflow-x-clip bg-rxpi-night text-rxpi-night-fg"
        style={pinned ? { height: `${(1 + length * SCENE_PACE + (scene.stack.out ? SCENE_HANDOVER : 0)) * 100}svh` } : undefined}
      >
        <div className={pinned ? 'sticky top-0 h-svh overflow-hidden' : 'relative flex flex-col md:min-h-svh'}>
          <motion.div className={pinned ? 'relative isolate flex h-full flex-col' : 'contents'} style={pinned ? stage.inner : undefined}>
            {image && (
              <div className="absolute inset-0 -z-10 hidden overflow-hidden md:block" aria-hidden>
                <HeroZoom className="relative mx-auto h-full max-w-[1440px] min-[1440px]:[mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 1440px) 1440px, 100vw"
                    className="object-cover"
                    style={{ objectPosition: image.position ?? 'center' }}
                  />
                </HeroZoom>
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(12,11,10,0.94)_0%,rgba(12,11,10,0.75)_42%,rgba(12,11,10,0.45)_72%,rgba(12,11,10,0.8)_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(12,11,10,0.8)_0%,rgba(12,11,10,0.45)_40%,transparent_70%)]" />
              </div>
            )}

            {background && (
              <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
                {background}
              </div>
            )}

            <div className={`relative flex flex-1 flex-col ${pinned ? '' : `${heights} md:min-h-0 short:min-h-0`}`}>
              <div ref={spacerRef} className="h-[var(--rx-bars)] flex-none" aria-hidden />

              {image && (
                <div className="relative aspect-[4/3] w-full md:hidden short:hidden">
                  <Image
                    src={image.src}
                    alt={image.alt ?? ''}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                    style={{ objectPosition: image.position ?? 'center' }}
                  />
                </div>
              )}

              <div
                className={`rx-container flex flex-1 flex-col justify-end pb-[clamp(2rem,6svh,4.5rem)] compact:pb-6 short:pb-6 short:pt-4 ${
                  pinned ? 'pt-0' : 'pt-8'
                }`}
              >
                <div ref={textRef}>
                  {layout === 'split' ? (
                    <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 short:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] short:items-center short:gap-6">
                      <HeroLift className="min-w-0">{text}</HeroLift>
                      <div className={mediaFirst ? 'order-first lg:order-none short:order-none' : ''}>{media}</div>
                    </div>
                  ) : (
                    <HeroLift>{text}</HeroLift>
                  )}
                </div>
              </div>
            </div>

            {footer && (
              <div ref={footerRef} className="relative border-t border-rxpi-night-line bg-rxpi-night">
                {footer}
              </div>
            )}
          </motion.div>
          {pinned && <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-10 bg-black" style={{ opacity: stage.shade }} />}
        </div>
      </header>
    </SceneProvider>
  );
}

// The hero text rises and fades out over the last 40% of the pinned stretch; split-layout media stays
// on stage and scrolls out with the hero. data-rx-item lets the focus rule in globals.css show the text
// again whenever one of its links has keyboard focus.
function HeroLift({ className, children }: { className?: string; children: React.ReactNode }) {
  const y = useSceneValue([0.6, 1], [0, -64], 0);
  const opacity = useSceneValue([0.6, 1], [1, 0], 1);
  return (
    <motion.div data-rx-item="" className={className} style={{ y, opacity }}>
      {children}
    </motion.div>
  );
}

// The background photo pushes in slowly while the hero is pinned
function HeroZoom({ className, children }: { className: string; children: React.ReactNode }) {
  const scale = useSceneValue([0, 1], [1, 1.12], 1);
  return (
    <motion.div className={className} style={{ scale }}>
      {children}
    </motion.div>
  );
}
