'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/rocket', label: 'Overview', shortLabel: 'Overview' },
  { href: '/rocket/aquila', label: 'Project Aquila', shortLabel: 'Aquila' },
  { href: '/rocket/reliant', label: 'RPU-1 Reliant', shortLabel: 'Reliant' },
  { href: '/rocket/sponsors', label: 'Sponsors', shortLabel: 'Sponsors' },
];

// Sits directly under the site navbar at the top of every RXPI page (over the hero),
// then sticks to the top of the screen once the site navbar scrolls away.
export default function RxpiSubnav() {
  const pathname = usePathname().replace(/\/$/, '') || '/';
  const [stuck, setStuck] = useState(false);
  const activeRef = useRef<HTMLAnchorElement | null>(null);
  const onSponsors = pathname === '/rocket/sponsors';
  const ctaClass =
    'hidden h-11 flex-none items-center bg-rxpi-red px-4 font-plex text-sm font-medium text-white transition-colors duration-150 hover:bg-rxpi-red-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:inline-flex';

  useEffect(() => {
    const scrollFunc = () => setStuck(window.scrollY > 72);
    scrollFunc();
    window.addEventListener('scroll', scrollFunc, { passive: true });
    return () => window.removeEventListener('scroll', scrollFunc);
  }, []);

  // Scroll the tab strip (not the page) so the current tab is in view on narrow screens.
  useEffect(() => {
    const el = activeRef.current;
    const strip = el?.parentElement;
    if (!el || !strip) return;
    const overflow = el.getBoundingClientRect().right - strip.getBoundingClientRect().right;
    if (overflow > 0) strip.scrollLeft += overflow + 24;
  }, [pathname]);

  return (
    <nav
      aria-label="RXPI"
      className={`sticky top-0 z-[15] -mt-6 border-b font-plex-mono transition-colors duration-200 ${
        stuck ? 'border-rxpi-night-line bg-rxpi-night-sunken' : 'border-rxpi-night-fg/15 bg-rxpi-night-sunken/60'
      }`}
    >
      <div className="rx-container flex h-14 items-center gap-2 sm:gap-5">
        <Link
          href="/rocket"
          aria-label="RXPI home"
          className="flex h-11 min-w-11 flex-none items-center gap-3 text-rxpi-night-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-rxpi-red"
        >
          <Image src="/logos/rxpi_mark_white.png" alt="" width={640} height={597} className="h-9 w-auto sm:h-10" />
          <span className="hidden text-[15px] font-semibold tracking-[0.2em] sm:inline">RXPI</span>
        </Link>

        <span className="hidden h-6 w-px bg-rxpi-night-fg/20 sm:block" aria-hidden />

        <div className="flex min-w-0 flex-1 items-stretch overflow-x-auto pr-6 [scrollbar-width:none] [mask-image:linear-gradient(to_right,#000_calc(100%-24px),transparent)] lg:pr-0 lg:[mask-image:none] [&::-webkit-scrollbar]:hidden">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                ref={active ? activeRef : undefined}
                aria-current={active ? 'page' : undefined}
                className={`relative flex h-14 flex-none items-center whitespace-nowrap px-2 text-xs uppercase tracking-[0.12em] transition-colors duration-150 focus:outline-none focus-visible:bg-rxpi-night-raised focus-visible:text-rxpi-night-fg focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rxpi-red min-[360px]:px-2.5 sm:px-3 sm:text-[13px] ${
                  active ? 'font-semibold text-rxpi-night-fg' : 'text-rxpi-night-muted hover:text-rxpi-night-fg'
                } ${link.href === '/rocket' ? 'max-[399px]:hidden' : ''}`}
              >
                <span className="lg:hidden">{link.shortLabel}</span>
                <span className="hidden lg:inline">{link.label}</span>
                {active && <span className="absolute inset-x-2 bottom-0 h-0.5 bg-rxpi-red min-[360px]:inset-x-2.5 sm:inset-x-3" aria-hidden />}
              </Link>
            );
          })}
        </div>

        {pathname === '/rocket/aquila' && (
          <a
            href="#status"
            className="hidden min-h-11 items-center gap-2 text-xs uppercase tracking-[0.12em] text-rxpi-night-muted transition-colors duration-150 hover:text-rxpi-night-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-rxpi-red xl:flex"
          >
            <span className="h-2 w-2 bg-rxpi-red" aria-hidden />
            Current gate · CDR
          </a>
        )}

        {onSponsors ? (
          <a href="mailto:rpi.spaceflight@gmail.com?subject=RXPI%20sponsorship" className={ctaClass}>
            Email us
          </a>
        ) : (
          <Link href="/rocket/sponsors#tiers" className={ctaClass}>
            Sponsor RXPI
          </Link>
        )}
      </div>
    </nav>
  );
}
