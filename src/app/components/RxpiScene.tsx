'use client';

import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  MotionValue,
  motion,
  motionValue,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import RxpiHandover, { SceneTransition, useStageMotion } from './RxpiHandover';

// Height of the sticky RXPI subnav at the default font size (h-14 plus its 1px border). CSS uses --rx-subnav
// and scroll tracking measures the real bar, so larger browser font sizes keep working.
const SUBNAV_HEIGHT = 57;

// The smallest gap a pinned stage keeps above and below its content. The stage centres its content,
// so any spare height is shared evenly around it.
const PINNED_MIN_PADDING = 16;

// Where an in-page link to a scene lands, as a share of its pinned stretch
const ANCHOR_AT = 0.85;

// How far, in screen heights, the reader scrolls while one pinned scene hands the screen to the next.
// Neighbouring pinned scenes overlap by this much, so the screen never scrolls between them: the next
// stage opens over the held one while the held one sinks back.
export const SCENE_HANDOVER = 0.55;

// Scales every scene's pinned stretch, so the whole page can be made quicker or slower to scroll through
// without retiming each scene
export const SCENE_PACE = 0.75;

// Scenes without a numbered section label take these handovers in turn; numbered ones get the slate
const HANDOVER_CYCLE: SceneTransition[] = ['plotter', 'aperture', 'columns', 'shutter'];
const NUMBERED_LABEL = /^\d{2} · \S/;

// index: the scene's place among the scenes around it, which picks its default handover
type Stack = { into: boolean; out: boolean; index: number };
const NO_STACK: Stack = { into: false, out: false, index: 0 };
const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

// Scene modes are chosen before the first paint, so the browser restores Back navigation against the
// real layout. The server has no layout, so it falls back to a normal effect.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

// static: before hydration, or when the reader prefers reduced motion. Everything shows in its final state.
// pinned: the stage holds still on screen while scrolling moves the scene's progress along.
// reveal: phones and short screens, or a stage too tall to fit. Items animate once as they scroll into view.
type SceneMode = 'static' | 'pinned' | 'reveal';

type SceneState = {
  mode: SceneMode;
  // -1 to 0 while the scene scrolls up into view, then 0 onward while its stage is pinned
  progress: MotionValue<number>;
  // The same value, eased with a spring, for effects that follow the scroll continuously
  smooth: MotionValue<number>;
};

const settled = motionValue(1);
const SceneContext = createContext<SceneState>({ mode: 'static', progress: settled, smooth: settled });

export const SceneProvider = SceneContext.Provider;
export const useScene = () => useContext(SceneContext);

// Height of 100svh in px, the height pinned stages are built from. window.innerHeight grows when a
// browser's toolbar retracts, but svh does not, so fit tests use this.
let svhProbe: HTMLDivElement | null = null;
const stageHeight = () => {
  if (!svhProbe || !svhProbe.isConnected) {
    svhProbe = document.createElement('div');
    svhProbe.setAttribute('aria-hidden', 'true');
    svhProbe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none';
    document.body.appendChild(svhProbe);
  }
  return svhProbe.offsetHeight || window.innerHeight;
};

// Keeping the reader's place. Pinned heights depend on the viewport and on each scene's mode, so a resize,
// a zoom or a mode switch can change the page above the reader by thousands of pixels. Every scene
// registers here; where the reader is (in a scene, at the top, or below the last scene) is remembered
// while scrolling and put back after such a change.
type Entry = { el: HTMLElement; top: () => number };
type Saved =
  | { kind: 'top' }
  | { kind: 'bottom'; fromBottom: number; pageHeight: number }
  | { kind: 'scene'; entry: Entry; mode: string; p: number; topShare: number; pageTop: number; height: number };
const entries = new Set<Entry>();
let saved: Saved | null = null;
let restoring = false;
let restoreTimer = 0;
let captureFrame = 0;
let saveTimer = 0;
let detach: (() => void) | null = null;

const pinnedTravel = (entry: Entry, height: number) => Math.max(1, height - (stageHeight() - entry.top()));
const pageBottom = () => document.documentElement.scrollHeight;

function capture() {
  if (restoring) return;
  if (window.scrollY <= 0) {
    saved = { kind: 'top' };
    return;
  }
  const middle = window.innerHeight / 2;
  for (const entry of entries) {
    const r = entry.el.getBoundingClientRect();
    if (r.top > middle || r.bottom <= middle) continue;
    const mode = entry.el.dataset.rxScene ?? 'static';
    // Pinned: progress through the pinned stretch. Otherwise: how far the middle of the screen is through the section.
    const p = mode === 'pinned' ? (entry.top() - r.top) / pinnedTravel(entry, r.height) : (middle - r.top) / r.height;
    // How far the section has scrolled past the top of the screen, as a share of how far it can; this maps back
    // onto pinned progress when a scene pins again
    const topShare = -r.top / Math.max(1, r.height - window.innerHeight);
    saved = { kind: 'scene', entry, mode, p, topShare, pageTop: r.top + window.scrollY, height: r.height };
    return;
  }
  // Past the last scene (the sponsor band or the footer): keep the distance from the page bottom
  saved = { kind: 'bottom', fromBottom: pageBottom() - window.scrollY, pageHeight: pageBottom() };
}

function restore() {
  restoring = false;
  const s = saved;
  if (!s || (s.kind === 'scene' && !s.entry.el.isConnected)) return capture();
  let y: number;
  if (s.kind === 'top') {
    y = 0;
  } else if (s.kind === 'bottom') {
    // The page above did not change (e.g. a browser toolbar showing or hiding): leave the scroll alone
    if (Math.abs(pageBottom() - s.pageHeight) < 1) return capture();
    y = pageBottom() - s.fromBottom;
  } else {
    const r = s.entry.el.getBoundingClientRect();
    const pageTop = r.top + window.scrollY;
    const mode = s.entry.el.dataset.rxScene ?? 'static';
    // Nothing above the reader changed (e.g. a browser toolbar showing or hiding): leave the scroll alone
    if (Math.abs(pageTop - s.pageTop) < 1 && Math.abs(r.height - s.height) < 1 && mode === s.mode) return capture();
    const wasPinned = s.mode === 'pinned';
    const share = Math.min(Math.max(s.p, 0), 1);
    if (mode === 'pinned') {
      // Coming back from an unpinned layout, use how far the section had scrolled by, so a
      // pinned-unpinned-pinned round trip returns to the same progress
      const back = s.height > window.innerHeight ? Math.min(Math.max(s.topShare, 0), 1) : share;
      y = pageTop - s.entry.top() + (wasPinned ? s.p : back) * pinnedTravel(s.entry, r.height);
    } else {
      y = wasPinned
        ? pageTop + share * Math.max(0, r.height - window.innerHeight)
        : pageTop + s.p * r.height - window.innerHeight / 2;
    }
  }
  window.scrollTo({ top: Math.max(0, y), behavior: 'instant' });
  capture();
}

// Waits for the layout to settle (further resizes and mode switches extend the wait), then restores
function scheduleRestore() {
  restoring = true;
  window.clearTimeout(restoreTimer);
  restoreTimer = window.setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(restore)), 200);
}

// Scrolling by hand while a restore is pending wins: the reader's new position becomes the place.
// Zooming (Ctrl or Cmd with the wheel or +/-) and held modifier keys don't scroll, so they don't count.
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);
function onReaderInput(event: Event) {
  if (!restoring) return;
  if (event instanceof WheelEvent && (event.ctrlKey || event.metaKey)) return;
  if (event instanceof KeyboardEvent && (event.ctrlKey || event.metaKey || event.altKey || !SCROLL_KEYS.has(event.key))) return;
  window.clearTimeout(restoreTimer);
  restoring = false;
  capture();
}

function onScroll() {
  cancelAnimationFrame(captureFrame);
  captureFrame = requestAnimationFrame(capture);
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(savePlace, 300);
}

// A real viewport change freezes the saved place. The synthetic resize a mode switch dispatches (for the
// scroll tracking) only extends a restore already under way.
function onResize(event: Event) {
  if (event.isTrusted || restoring) scheduleRestore();
  else onScroll();
}

function register(entry: Entry) {
  if (!entries.size) mountedPath = trimPath(window.location.pathname);
  entries.add(entry);
  if (!detach) {
    const input = { passive: true } as const;
    window.addEventListener('scroll', onScroll, input);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    ['wheel', 'touchmove', 'keydown', 'pointerdown'].forEach((type) => window.addEventListener(type, onReaderInput, input));
    detach = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      ['wheel', 'touchmove', 'keydown', 'pointerdown'].forEach((type) => window.removeEventListener(type, onReaderInput));
    };
  }
  return () => {
    entries.delete(entry);
    if (!entries.size) {
      detach?.();
      detach = null;
      window.clearTimeout(saveTimer);
      if (!restoring) saved = null;
      placeRestored = false;
      mountedPath = null;
    }
  };
}

// Restoring the place on arrival. The server renders every scene unpinned, at about half its pinned
// height, and the browser restores a reloaded page's scroll against that layout. So each history entry
// keeps its place in scene terms (in history.state), which is put back once the scenes have their real
// heights: after a reload or a Back into a fresh document, and after a client-side Back or Forward.
type Place = { path: string; index: number; frac: number };
let arrivalPlace: Place | null = null;
let popPlace: Place | null = null;
let arrivalPrepared = false;
let placeRestored = false;
// The page whose scenes are mounted right now, so a Back to one of its own hash entries restores nothing
let mountedPath: string | null = null;

const trimPath = (path: string) => path.replace(/\/$/, '') || '/';
const movingScenes = () => document.querySelector('[data-rx-scene="pinned"],[data-rx-scene="reveal"]') !== null;

function placeNow(): Place | null {
  const path = trimPath(window.location.pathname);
  if (window.scrollY <= 0) return null;
  const middle = window.innerHeight / 2;
  const scenes = document.querySelectorAll<HTMLElement>('[data-rx-scene]');
  for (let i = 0; i < scenes.length; i++) {
    const r = scenes[i].getBoundingClientRect();
    if (r.top <= middle && r.bottom > middle) return { path, index: i, frac: (middle - r.top) / r.height };
  }
  // Past the last scene: index -1 keeps the distance from the page bottom
  return { path, index: -1, frac: pageBottom() - window.scrollY };
}

function goTo(place: Place) {
  if (place.index === -1) {
    window.scrollTo({ top: Math.max(0, pageBottom() - place.frac), behavior: 'instant' });
    return;
  }
  const el = document.querySelectorAll<HTMLElement>('[data-rx-scene]')[place.index];
  if (!el) return;
  const r = el.getBoundingClientRect();
  window.scrollTo({ top: Math.max(0, window.scrollY + r.top + place.frac * r.height - window.innerHeight / 2), behavior: 'instant' });
}

// Writes the reader's place into the current history entry. Only pages with moving scenes need it.
function savePlace() {
  if (!movingScenes()) return;
  try {
    window.history.replaceState({ ...window.history.state, rxpiPlace: placeNow() }, '');
  } catch {}
}

function prepareArrival() {
  if (arrivalPrepared) return;
  arrivalPrepared = true;
  try {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    // Only when this RXPI page is the document's own first page, and it will actually move
    const initial = !!nav && trimPath(new URL(nav.name).pathname) === trimPath(window.location.pathname);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (initial && !reduce) {
      if (nav.type === 'reload' || nav.type === 'back_forward') arrivalPlace = window.history.state?.rxpiPlace ?? null;
      // A reader who scrolled before the page finished loading keeps that place too
      if (!arrivalPlace && !window.location.hash) arrivalPlace = placeNow();
    }
    window.history.scrollRestoration = 'auto';
  } catch {}
  // Only a real unload of a page with moving scenes switches the browser's own restore off, so client-side
  // Back and every other page keep it
  window.addEventListener('pagehide', () => {
    if (!movingScenes()) return;
    // 'manual' first: after a replaceState inside pagehide, Chrome drops a later scrollRestoration change
    try {
      window.history.scrollRestoration = 'manual';
    } catch {}
    savePlace();
  });
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    try {
      window.history.scrollRestoration = 'auto';
    } catch {}
  });
  window.addEventListener('popstate', (event) => {
    const place = (event.state as { rxpiPlace?: Place | null } | null)?.rxpiPlace ?? null;
    popPlace = place && place.path !== mountedPath ? place : null;
  });
  // If the reader scrolls while the page they went Back to is still loading, their own scrolling wins
  ['wheel', 'touchmove', 'pointerdown'].forEach((type) =>
    window.addEventListener(type, () => (popPlace = null), { passive: true })
  );
}

// Called when a page's scenes first get their modes. Returns whether a place was put back.
function arrive() {
  const place = arrivalPlace ?? popPlace;
  arrivalPlace = null;
  popPlace = null;
  if (!place || place.path !== trimPath(window.location.pathname)) return false;
  goTo(place);
  placeRestored = true;
  return true;
}

// Reduced motion, read live: turning it on or off mid-visit takes effect straight away
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia('(prefers-reduced-motion: reduce)');
      query.addEventListener('change', onChange);
      return () => query.removeEventListener('change', onChange);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  );
}

// The subnav is sized in rem, so its height follows the reader's font size setting
function useSubnavHeight() {
  const [height, setHeight] = useState(SUBNAV_HEIGHT);

  useIsoLayoutEffect(() => {
    const el = document.querySelector<HTMLElement>('nav[aria-label="RXPI"]');
    if (!el) return;
    const update = () => setHeight(Math.round(el.getBoundingClientRect().height));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return height;
}

// Picks the scene mode and tracks scroll progress. `measure` returns the height the stage needs to show
// everything at once; the scene only pins on screens at least 768 by 600 where that height fits.
// Progress moves by 1 per `length` screen heights; the pinned stretch lasts `stretch` screen heights.
export function useSceneSetup(
  wrapperRef: React.RefObject<HTMLElement | null>,
  observeRefs: React.RefObject<HTMLElement | null>[],
  measure: () => number | null,
  top: number,
  length = 1,
  stretch = length
) {
  const [mode, setMode] = useState<SceneMode>('static');
  const measureRef = useRef(measure);
  measureRef.current = measure;
  const topRef = useRef(top);
  topRef.current = top;
  const shape = useRef({ length, stretch });
  shape.current = { length, stretch };
  // Whether a pinned scene sits right before (into) or after (out) this one, so their stages hand over
  const [stack, setStack] = useState<Stack>(NO_STACK);
  const stackRef = useRef(stack);
  stackRef.current = stack;

  useIsoLayoutEffect(() => {
    prepareArrival();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const roomy = window.matchMedia('(min-width: 768px) and (min-height: 600px)');
    const update = () => {
      if (reduce.matches) {
        setMode('static');
        return;
      }
      const needed = measureRef.current();
      const fits = needed !== null && needed <= stageHeight() - top;
      setMode(roomy.matches && fits ? 'pinned' : 'reveal');
    };
    update();
    const observer = new ResizeObserver(update);
    observeRefs.forEach((ref) => ref.current && observer.observe(ref.current));
    window.addEventListener('resize', update);
    roomy.addEventListener('change', update);
    reduce.addEventListener('change', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
      roomy.removeEventListener('change', update);
      reduce.removeEventListener('change', update);
    };
    // observeRefs is a fresh array each render, but the refs inside it are stable, so it stays out of the deps
  }, [top]);

  useEffect(() => {
    if (!wrapperRef.current) return;
    return register({ el: wrapperRef.current, top: () => topRef.current });
  }, [wrapperRef]);

  // The first mode switch after mount replaces the server's layout: put back the place this page arrived
  // with. Any later switch (a resize, zoom or reduced-motion change) keeps the reader where they were.
  const previousMode = useRef<SceneMode>('static');
  const arrived = useRef(false);
  useIsoLayoutEffect(() => {
    if (previousMode.current !== mode) {
      if (!arrived.current) {
        arrived.current = true;
        if (!arrive()) scheduleRestore();
      } else {
        scheduleRestore();
      }
    }
    previousMode.current = mode;
  }, [mode]);

  useIsoLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el || !el.parentElement || mode !== 'pinned') {
      setStack(NO_STACK);
      return;
    }
    const pinnedScene = (node: Element | null) => node instanceof HTMLElement && node.dataset.rxScene === 'pinned';
    const update = () => {
      const into = pinnedScene(el.previousElementSibling);
      const out = pinnedScene(el.nextElementSibling);
      let index = 0;
      for (let node = el.previousElementSibling; node; node = node.previousElementSibling) {
        if (node instanceof HTMLElement && node.dataset.rxScene) index++;
      }
      setStack((current) => {
        if (current.into === into && current.out === out && current.index === index) return current;
        // The overlap changes the page's height above the reader
        if (arrived.current && (current.into !== into || current.out !== out)) scheduleRestore();
        return { into, out, index };
      });
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(el.parentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-rx-scene'] });
    return () => observer.disconnect();
  }, [mode]);

  const { scrollYProgress: entry } = useScroll({ target: wrapperRef, offset: ['start end', `start ${top}px`] });
  const { scrollYProgress: pin } = useScroll({ target: wrapperRef, offset: [`start ${top}px`, 'end end'] });
  const progress = useTransform([entry, pin], ([e, p]: number[]) => {
    const { into, out } = stackRef.current;
    const { length, stretch } = shape.current;
    // A stage that opens over the previous one stays hidden while its section slides up underneath,
    // then plays its whole entry (-1 to 0) while it opens
    if (e < 1) return into ? -1 : e - 1;
    const screens = p * (stretch + (into ? SCENE_HANDOVER : 0) + (out ? SCENE_HANDOVER : 0));
    if (into && screens < SCENE_HANDOVER) return -1 + screens / SCENE_HANDOVER;
    return (screens - (into ? SCENE_HANDOVER : 0)) / length;
  });
  // Tight enough to follow the (already eased) scroll closely, so nothing keeps moving after the reader stops
  const smooth = useSpring(progress, { stiffness: 480, damping: 56, mass: 0.35, restDelta: 0.0005 });
  // 0 to 1 while this stage opens over the previous one, and while the next one opens over this
  const reveal = useTransform([smooth, entry], ([s, e]: number[]) => (!stackRef.current.into ? 1 : e < 1 ? 0 : clamp01(s + 1)));
  const exit = useTransform(smooth, (s) => {
    const { length, stretch } = shape.current;
    return stackRef.current.out ? clamp01(((s - stretch / length) * length) / SCENE_HANDOVER) : 0;
  });

  // Pinning and stacking change the section's height, so have the scroll tracking measure it again
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [mode, stack]);

  return { mode, progress, smooth, reveal, exit, stack };
}

// True once the scene's progress reaches `at`. Outside a pinned scene it is always true.
export function useSceneVisible(at: number) {
  const { mode, progress } = useScene();
  const [reached, setReached] = useState(true);

  useEffect(() => {
    setReached(progress.get() >= at);
  }, [progress, at, mode]);
  useMotionValueEvent(progress, 'change', (value) => setReached(value >= at));

  return mode !== 'pinned' || reached;
}

// Maps the scene's progress to a value while pinned. Otherwise it holds `rest` (by default the last output).
export function useSceneValue<T extends number | string>(input: number[], output: T[], rest?: T): MotionValue<T> {
  const { mode, smooth } = useScene();
  const live = useTransform(smooth, input, output);
  const still = useMotionValue<T>(rest ?? output[output.length - 1]);
  return mode === 'pinned' ? live : still;
}

type Props = {
  id?: string;
  // How far, in screen heights before SCENE_PACE, scrolling moves the scene's progress from 0 to 1 while pinned
  length?: number;
  // Progress at which the last beat lands. The pinned stretch then ends a short hold later instead of at 1.
  until?: number;
  className?: string;
  padded?: boolean;
  // Absolutely positioned decoration (crosshairs, background images) that stays on the stage
  decor?: React.ReactNode;
  // How this stage opens when it follows another pinned scene. By default a scene with a numbered section
  // label ("02 · Team") gets the slate and the others take turns.
  transition?: SceneTransition;
  // The name shown during the handover. By default the numbered label, else the scene's first heading.
  label?: string;
  children: React.ReactNode;
};

// A page section whose content holds still on screen while it animates into place. Next to another
// pinned scene it opens over that one's stage instead of scrolling in, so the screen stays put.
export default function RxpiScene({ id, length = 1, until, className = '', padded = true, decor, transition, label, children }: Props) {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const top = useSubnavHeight();
  // The pinned stretch ends a short hold after the last beat; progress keeps its pace per pixel
  const paced = length * SCENE_PACE;
  const stretch = until === undefined ? paced : Math.min(paced, Math.max(until, 0) * paced + 0.15);
  const scene = useSceneSetup(
    wrapperRef,
    [contentRef],
    () => (contentRef.current ? contentRef.current.offsetHeight + (padded ? 2 * PINNED_MIN_PADDING : 0) : null),
    top,
    paced,
    stretch
  );
  const pinned = scene.mode === 'pinned';
  const into = pinned && scene.stack.into ? SCENE_HANDOVER : 0;
  const out = pinned && scene.stack.out ? SCENE_HANDOVER : 0;
  const [found, setFound] = useState<{ label?: string; numbered: boolean }>({ numbered: false });
  const kind = transition ?? (found.numbered ? 'slate' : HANDOVER_CYCLE[scene.stack.index % HANDOVER_CYCLE.length]);
  const stage = useStageMotion(scene, kind);
  const jumped = useRef(false);

  // Read the handover's name from the content: its numbered section label, else its first heading
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const numbered = Array.from(content.querySelectorAll('p, span')).find((el) => NUMBERED_LABEL.test(el.textContent?.trim() ?? ''));
    const heading = content.querySelector('h2, h3');
    setFound({
      label: (numbered ?? heading)?.textContent?.trim().replace(/\s+/g, ' '),
      numbered: numbered !== undefined,
    });
  }, []);

  // Links that arrive with this scene's hash land where its content has already fallen into place,
  // unless a reload just put the reader back where they were
  useEffect(() => {
    if (!pinned || !id || jumped.current || placeRestored || window.location.hash !== `#${id}`) return;
    jumped.current = true;
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
  }, [pinned, id]);

  return (
    <SceneProvider value={scene}>
      <section
        ref={wrapperRef}
        id={pinned ? undefined : id}
        data-rx-scene={scene.mode}
        // Pinned, the section is only a scroll track (it can overlap its neighbours), and the stage carries the look
        className={pinned ? 'pointer-events-none relative overflow-x-clip' : `relative overflow-x-clip ${className}`}
        style={
          pinned
            ? {
                height: `calc(${(1 + stretch + into + out) * 100}svh - var(--rx-subnav))`,
                marginTop: into ? `calc(var(--rx-subnav) - ${(1 + into) * 100}svh)` : undefined,
              }
            : undefined
        }
      >
        {pinned && id && (
          <span
            id={id}
            className="pointer-events-none absolute left-0 h-px w-px"
            style={{
              top: `${(into + stretch * ANCHOR_AT) * 100}svh`,
              // The page's scroll-padding-top (4.5rem) would stop short; land on the stage top instead
              scrollMarginTop: 'calc(var(--rx-subnav) - 4.5rem)',
            }}
            aria-hidden
          />
        )}
        <div className={pinned ? 'sticky top-[var(--rx-subnav)] h-[calc(100svh-var(--rx-subnav))]' : 'contents'}>
          <motion.div className={pinned ? `relative h-full overflow-hidden ${className}` : 'relative'} style={pinned ? stage.stage : undefined}>
            <motion.div className={pinned ? 'relative flex h-full flex-col justify-center' : 'relative'} style={pinned ? stage.inner : undefined}>
              {decor}
              <div className={padded ? (pinned ? 'py-4' : 'py-[clamp(4rem,9vw,8rem)]') : ''}>
                <div ref={contentRef} className="relative">
                  {children}
                </div>
              </div>
            </motion.div>
            {pinned && <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: stage.shade }} />}
          </motion.div>
          {pinned && scene.stack.into && <RxpiHandover reveal={scene.reveal} kind={kind} label={label ?? found.label} />}
        </div>
      </section>
    </SceneProvider>
  );
}

type TextProps = {
  text: string;
  className?: string;
  // Progress at which the first and the last word start to brighten; each takes three words' worth to finish
  start?: number;
  end?: number;
  dim: string;
  ink: string;
};

// A paragraph whose words brighten one after another as the scene scrolls, like reading along.
export function RxpiSceneText({ text, className = '', start = -0.5, end = 0.35, dim, ink }: TextProps) {
  const words = text.split(' ');
  const step = (end - start) / words.length;

  return (
    <p className={className}>
      {words.map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          {i > 0 && ' '}
          <SceneWord word={word} from={start + step * i} to={start + step * (i + 3)} dim={dim} ink={ink} />
        </React.Fragment>
      ))}
    </p>
  );
}

function SceneWord({ word, from, to, dim, ink }: { word: string; from: number; to: number; dim: string; ink: string }) {
  const { mode, progress } = useScene();
  const color = useTransform(progress, [from, to], [dim, ink]);
  // Outside a pinned scene the word gets its final colour, which also replaces a dimmed colour left inline
  // when a resize or zoom switches the scene out of pinned mode
  return <motion.span style={{ color: mode === 'pinned' ? color : ink }}>{word}</motion.span>;
}
