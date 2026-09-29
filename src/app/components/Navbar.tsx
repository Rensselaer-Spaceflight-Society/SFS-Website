'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Dropdown from "./Dropdown";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const committees = [
  { href: "/rocket", label: "RXPI (Rocket)" },
  { href: "/lunar", label: "Lunar" },
  { href: "/core", label: "CORE" },
  { href: "/cubesat", label: "CubeSat" },
  { href: "/lander", label: "Lander" },
];

const CommitteeMenu = ({ dark = false }: { dark?: boolean }) => {
  if (dark) {
    return (
      <div className="min-w-44 py-2 font-mono text-xs uppercase tracking-[0.12em] flex flex-col">
        {committees.map((committee) => (
          <Link key={committee.href} className="block px-4 py-2.5 hover:bg-rxpi-night focus:outline-none focus-visible:bg-rxpi-night focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rxpi-red" href={committee.href}>{committee.label}</Link>
        ))}
      </div>
    );
  }
  return (
    <div className="h-auto w-30 bg-white z-10 shadow-xl relative justify-between flex flex-col items-center">
      {committees.map((committee) => (
        <Link key={committee.href} className="hover:opacity-[0.75]" href={committee.href}>{committee.label}</Link>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // The RXPI pages carry their own brand bar, so the society title shrinks there
  const compact = usePathname().startsWith("/rocket");

  useEffect(() => {
    setMounted(true);
  }, []);

  const showMenu = open && mounted;
  const TitleTag = compact ? "span" : "h1";
  const SubtitleTag = compact ? "span" : "h2";

  return (
    <nav id="home" aria-label="Site" className="font-sans bg-transparent z-20 relative">
      {/* Keyboard users can jump past both nav bars on the RXPI pages. It slides in on focus instead of
          using sr-only, because FontAwesome's unlayered .sr-only rule overrides focus:not-sr-only. */}
      {compact && (
        <a
          href="#main"
          className="fixed left-4 top-4 z-50 -translate-y-[200%] bg-rxpi-paper px-4 py-3 text-sm font-medium text-rxpi-ink focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-rxpi-red"
        >
          Skip to content
        </a>
      )}
      <div className={`${compact ? "rx-container" : "w-full px-2 sm:px-4"} flex items-center justify-between h-20`}>

        {/* Logo + Title (left side) */}
        <Link
          href="/#home"
          className="flex min-h-11 items-center gap-2 sm:gap-3 md:gap-3 lg:gap-2 xl:gap-1 z-20 pointer-events-auto text-white"
        >
          <Image
            src="/logos/sfs_no_text_128.png"
            alt=""
            width={64}
            height={64}
            priority
            className={compact ? "block w-8 h-8" : "block w-12 h-12 sm:w-16 sm:h-16"}
          />
          <div className={compact ? "leading-tight ms-1 flex flex-wrap gap-x-1.5 text-sm text-white/80" : "leading-tight ms-2 sm:ms-4"}>
            <TitleTag className={compact ? "block" : "font-medium text-lg sm:text-xl md:text-2xl lg:text-3xl"}>
              Rensselaer
            </TitleTag>
            <SubtitleTag className={compact ? "block" : "font-medium text-lg sm:text-xl md:text-2xl lg:text-3xl"}>
              Spaceflight Society
            </SubtitleTag>
          </div>
        </Link>

        {/* Navbar Links (right side) */}
        <div className={`hidden lg:flex items-center z-30 ${compact ? "text-base space-x-8" : "text-lg space-x-10"}`}>
          <Dropdown href="/#home">Home</Dropdown>
          <Dropdown
            href="#"
            MenuContent={<CommitteeMenu dark={compact} />}
            panelClassName={compact ? "border border-rxpi-night-line bg-rxpi-night-raised text-rxpi-night-fg" : undefined}
          >
            Committees
          </Dropdown>
          <Dropdown href="/projects">Projects</Dropdown>
          <Dropdown href="/about">About</Dropdown>
        </div>

        {/* Menu button (small screens) */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="lg:hidden flex flex-none items-center justify-center w-11 h-11 text-white z-30"
          aria-expanded={showMenu}
          aria-controls="mobile-menu"
          aria-label={showMenu ? "Close menu" : "Open menu"}
        >
          {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* The menu button and the Committees dropdown need JavaScript, so without it the links are listed under
          the bar and the dead menu button is hidden. On the RXPI pages the bar turns solid, because the dark hero
          no longer reaches up behind it. */}
      <noscript>
        <style>{`nav#home button[aria-controls="mobile-menu"]{display:none}${compact ? "nav#home{background:#0c0b0a}" : ""}`}</style>
        <div className="flex flex-wrap gap-x-5 gap-y-2 bg-neutral-950 px-4 py-3 text-sm text-white">
          <a href="/#home" className="lg:hidden">Home</a>
          {committees.map((committee) => (
            <a key={committee.href} href={committee.href}>{committee.label}</a>
          ))}
          <a href="/projects" className="lg:hidden">Projects</a>
          <a href="/about" className="lg:hidden">About</a>
        </div>
      </noscript>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="lg:hidden absolute left-0 right-0 top-20 z-40 bg-neutral-950 text-white border-y border-white/10 shadow-xl"
          >
            <div className="flex flex-col px-4 py-2 text-lg">
              <Link href="/#home" onClick={() => setOpen(false)} className="py-3 border-b border-white/10">Home</Link>
              <p className="pt-3 pb-1 text-sm uppercase tracking-wider text-white/50">Committees</p>
              {committees.map((committee) => (
                <Link key={committee.href} href={committee.href} onClick={() => setOpen(false)} className="py-2 pl-4 hover:opacity-[0.75]">
                  {committee.label}
                </Link>
              ))}
              <Link href="/projects" onClick={() => setOpen(false)} className="py-3 mt-2 border-y border-white/10">Projects</Link>
              <Link href="/about" onClick={() => setOpen(false)} className="py-3">About</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
