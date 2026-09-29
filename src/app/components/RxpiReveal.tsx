'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePrefersReducedMotion } from './RxpiScene';

type Props = {
  children: React.ReactNode;
  className?: string;
};

// Fades content up as it scrolls into view. Anything already on screen when the page loads stays static,
// so nothing flashes on first paint, and the in-view check keeps working if the layout moves under it
// (for example when pinned scroll scenes above it change height).
export default function RxpiReveal({ children, className = '' }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const [startedVisible, setStartedVisible] = useState<boolean | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    setStartedVisible(ref.current.getBoundingClientRect().top < window.innerHeight);
  }, []);

  const show = reduceMotion || startedVisible !== false || inView;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
