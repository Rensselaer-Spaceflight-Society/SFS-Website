'use client'

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Subteam = {
  title: string;
  photo: string;
  description: string;
};

type Props = {
  data: Subteam[];
  activeWeight?: number;
  inactiveWeight?: number;
  minInactiveWidthPx?: number;
};

export default function SubteamDesc({
  data,
  activeWeight = 12,
  inactiveWeight = 1,
  minInactiveWidthPx = 40,
}: Props) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setActiveIdx(null);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="w-full overflow-hidden select-none"
        aria-label="Subteams selector"
      >
        <div className="flex flex-row w-full h-[320px] md:h-[420px] rounded-lg shadow-md">
          {data.map((s, i) => {
            const isActive = activeIdx === i;
            const noActive = activeIdx === null;

            const flexGrow = noActive ? 1 : isActive ? activeWeight : inactiveWeight;
            const showTitle = noActive || isActive;

            return (
              <motion.button
                key={s.title + i}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev === i ? null : i));
                }}
                animate={{ flexGrow }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                className="relative overflow-hidden outline-none border-l first:border-l-0 border-gray-200 group"
                style={{
                  minWidth: isActive || noActive ? undefined : `${minInactiveWidthPx}px`,
                  cursor: 'pointer',
                  display: 'flex',
                  flexBasis: '0%',
                }}
                aria-pressed={isActive}
                aria-label={`Subteam ${s.title}`}
              >
                <div
                  className="absolute inset-0 bg-center bg-cover"
                  style={{
                    backgroundImage: `url(${s.photo})`,
                    filter: isActive ? 'saturate(0.95)' : 'saturate(1)',
                    transform: isActive ? 'scale(1.03)' : 'scale(1)',
                    transition: 'transform 500ms ease, filter 300ms linear',
                  }}
                />

                <motion.div
                  initial={false}
                  animate={{ backgroundColor: isActive ? 'rgba(6,6,10,0.66)' : 'rgba(6,6,10,0.25)' }}
                  transition={{ duration: 0.28 }}
                  className="absolute inset-0"
                />
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-4">
                  <motion.h3
                    initial={false}
                    animate={{ opacity: showTitle ? 1 : 0, scale: showTitle ? 1 : 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="text-white text-xl md:text-2xl font-semibold leading-tight drop-shadow-md pointer-events-none"
                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
                  >
                    {s.title}
                  </motion.h3>
                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        key="desc"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.28 }}
                        className="mt-4 max-w-[80%] text-sm md:text-base text-gray-100 pointer-events-none"
                      >
                        {s.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </div>
        <div className="mt-3 text-xs text-slate-600 text-center">
          <span>Tap a tile to expand. Tap outside or the tile again to collapse.</span>
        </div>
      </div>
    </div>
  );
}