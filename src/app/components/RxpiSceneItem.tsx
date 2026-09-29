'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, Transition } from 'framer-motion';
import { useScene, useSceneVisible } from './RxpiScene';

type ScenePreset = 'up' | 'fall' | 'left' | 'right' | 'scale' | 'fade' | 'wipe' | 'grow' | 'pop';

// Long, sweeping moves that settle without bouncing; moving pieces come in out of focus
const hidden: Record<ScenePreset, Record<string, number | string>> = {
  up: { opacity: 0, y: 72, filter: 'blur(8px)' },
  fall: { opacity: 0, y: -84, filter: 'blur(8px)' },
  left: { opacity: 0, x: -140, filter: 'blur(8px)' },
  right: { opacity: 0, x: 140, filter: 'blur(8px)' },
  scale: { opacity: 0, scale: 0.82, filter: 'blur(8px)' },
  fade: { opacity: 0 },
  wipe: { clipPath: 'inset(0% 100% 0% 0%)' },
  grow: { scaleX: 0 },
  pop: { opacity: 0, scale: 0.55, filter: 'blur(6px)' },
};

const shown: Record<ScenePreset, Record<string, number | string>> = {
  up: { opacity: 1, y: 0, filter: 'blur(0px)' },
  fall: { opacity: 1, y: 0, filter: 'blur(0px)' },
  left: { opacity: 1, x: 0, filter: 'blur(0px)' },
  right: { opacity: 1, x: 0, filter: 'blur(0px)' },
  scale: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  fade: { opacity: 1 },
  wipe: { clipPath: 'inset(0% 0% 0% 0%)' },
  grow: { scaleX: 1 },
  pop: { opacity: 1, scale: 1, filter: 'blur(0px)' },
};

const ease = [0.22, 1, 0.36, 1] as const;

function transitionFor(preset: ScenePreset, delay: number): Transition {
  if (preset === 'wipe' || preset === 'grow') return { duration: 0.75, ease, delay };
  if (preset === 'fade') return { duration: 0.45, ease: 'easeOut', delay };
  return {
    type: 'spring',
    stiffness: 220,
    damping: 26,
    mass: 0.85,
    delay,
    opacity: { duration: 0.4, ease: 'easeOut', delay },
    filter: { duration: 0.45, ease: 'easeOut', delay },
  };
}

const tags = {
  div: motion.div,
  figure: motion.figure,
  span: motion.span,
  figcaption: motion.figcaption,
  tr: motion.tr,
  dt: motion.dt,
  dd: motion.dd,
};

type Props = {
  // Scene progress at which the item falls into place (-1 to 0 while the scene scrolls in, 0 to 1 while pinned)
  at?: number;
  // By default items rise with the scroll while the scene comes in, and drop into place once it is pinned
  from?: ScenePreset;
  // Draw outward from this point, as [x, y] percentages of the item's box (used for callout leader lines)
  clipFrom?: [number, number];
  as?: keyof typeof tags;
  className?: string;
  style?: React.CSSProperties;
  // Pass a function to know whether the item is currently shown (used to start count-ups)
  children?: React.ReactNode | ((shown: boolean) => React.ReactNode);
};

// One piece of a scene. In a pinned scene it appears once scrolling reaches `at` and leaves again
// when scrolling back; elsewhere it animates in once as it scrolls into view.
export default function RxpiSceneItem({ at = -0.2, from, as = 'div', clipFrom, className, style, children }: Props) {
  const preset: ScenePreset = from ?? (at < 0 ? 'up' : 'fall');
  const clipped = preset === 'wipe' || preset === 'grow' || clipFrom !== undefined;
  const { mode } = useScene();
  const ref = useRef<HTMLElement | null>(null);
  const reached = useSceneVisible(at);
  // A clipped or flat item never counts as partly visible, so any overlap counts. Chrome also clips the
  // observed box by the item's own (or an ancestor's) clip-path, so an item could miss its moment on screen;
  // watching far upward means anything the reader has already scrolled past counts as seen.
  const inView = useInView(ref, {
    once: true,
    amount: clipped ? 'some' : 0.15,
    margin: '100000px 0px 0px 0px',
  });
  // Anything already on screen when the reveal mode starts stays put, so nothing flashes
  const [startedVisible, setStartedVisible] = useState<boolean | null>(null);

  useEffect(() => {
    if (mode !== 'reveal' || !ref.current) return;
    setStartedVisible(ref.current.getBoundingClientRect().top < window.innerHeight);
  }, [mode]);

  const show =
    mode === 'static' ? true : mode === 'pinned' ? reached : startedVisible !== false || inView;
  // Reveal mode staggers items by where they sit in the scene
  const delay = mode === 'reveal' ? Math.min(Math.max(at + 1, 0) * 0.3, 0.45) : 0;
  const Tag = tags[as];
  const states = clipFrom
    ? {
        hidden: { clipPath: `inset(${clipFrom[1]}% ${100 - clipFrom[0]}% ${100 - clipFrom[1]}% ${clipFrom[0]}%)` },
        shown: { clipPath: 'inset(0% 0% 0% 0%)' },
      }
    : { hidden: hidden[preset], shown: shown[preset] };

  return (
    <Tag
      ref={ref as never}
      data-rx-item=""
      className={className}
      style={style}
      initial={false}
      animate={show ? states.shown : states.hidden}
      transition={transitionFor(clipFrom ? 'wipe' : preset, delay)}
    >
      {typeof children === 'function' ? children(show) : children}
    </Tag>
  );
}
