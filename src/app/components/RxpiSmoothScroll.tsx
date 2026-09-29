'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Eases wheel scrolling on screens where the scenes pin, so a mouse wheel's notches glide instead of
// jumping and the scroll-driven animations play smoothly. Touch and keyboard scrolling stay native,
// dialogs (the PDF preview and the photo viewer) scroll on their own, and reduced motion turns it off.
export default function RxpiSmoothScroll() {
  useEffect(() => {
    const roomy = window.matchMedia('(min-width: 768px) and (min-height: 600px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;

    const update = () => {
      const wanted = roomy.matches && !reduce.matches;
      if (wanted && !lenis) {
        lenis = new Lenis({ autoRaf: true, lerp: 0.16, wheelMultiplier: 1.15, anchors: false, prevent: (node) => node.closest('dialog, [role="dialog"]') !== null });
      } else if (!wanted && lenis) {
        lenis.destroy();
        lenis = null;
      }
    };

    update();
    roomy.addEventListener('change', update);
    reduce.addEventListener('change', update);
    return () => {
      roomy.removeEventListener('change', update);
      reduce.removeEventListener('change', update);
      lenis?.destroy();
    };
  }, []);

  return null;
}
