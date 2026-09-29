'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faInstagram, faDiscord } from '@fortawesome/free-brands-svg-icons';

const columns = [
  {
    title: 'RXPI',
    links: [
      { href: '/rocket', label: 'Overview' },
      { href: '/rocket/aquila', label: 'Project Aquila' },
      { href: '/rocket/reliant', label: 'RPU-1 Reliant' },
      { href: '/rocket/sponsors', label: 'Sponsors' },
    ],
  },
  {
    title: 'Documents',
    links: [
      { href: '/rocket/RELIANT_DESIGNREPORT_2025.pdf', label: 'Reliant design report', plain: true },
      { href: '/rocket/RXPI_Sponsorship_Package_2026-27.pdf', label: 'Sponsorship package', plain: true },
    ],
  },
  {
    title: 'Society',
    links: [
      { href: '/', label: 'Rensselaer Spaceflight Society' },
      { href: '/about', label: 'About the society' },
      { href: 'mailto:rpi.spaceflight@gmail.com', label: 'rpi.spaceflight@gmail.com', plain: true },
    ],
  },
];

const socials = [
  { href: 'https://github.com/Rensselaer-Spaceflight-Society', label: 'GitHub', icon: faGithub },
  { href: 'https://www.instagram.com/rensselaer_spaceflight_society/', label: 'Instagram', icon: faInstagram },
  { href: 'https://discord.gg/Y8uVhAqGsQ', label: 'Discord', icon: faDiscord },
];

type Props = {
  showTagline?: boolean;
};

export default function RxpiFooter({ showTagline = true }: Props) {
  const linkClass =
    'inline-flex min-h-11 items-center text-sm text-rxpi-night-fg/85 transition-colors duration-150 hover:text-rxpi-night-fg focus:outline-none focus-visible:underline';

  return (
    <footer className="border-t-2 border-rxpi-red bg-rxpi-night-sunken font-plex text-rxpi-night-fg">
      <div className="rx-container grid gap-12 py-[clamp(3rem,7vw,6rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <Link href="/rocket" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-rxpi-red">
            <Image
              src="/logos/rxpi_lockup_white.png"
              alt="RPI Experimental Propulsion Initiative"
              width={1600}
              height={440}
              className="h-auto w-[min(78vw,26rem)]"
            />
          </Link>
          {showTagline && (
            <p className="mt-6 font-plex-mono text-sm font-medium uppercase italic tracking-[-0.01em] text-rxpi-night-fg">Aim higher.</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title} className={column.title === 'Society' ? 'col-span-2 sm:col-span-1' : ''}>
              <p className="font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] text-rxpi-night-muted">{column.title}</p>
              <ul className="mt-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    {'plain' in link ? (
                      <a href={link.href} className={`${linkClass} break-all`}>
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-rxpi-night-line">
        <div className="rx-container flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-plex-mono text-xs uppercase tracking-[0.12em] text-rxpi-night-muted">
            © 2026 RXPI · A Rensselaer Spaceflight Society team · Troy, NY
          </p>
          <ul className="-ml-3 flex items-center sm:ml-0 sm:-mr-3">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center text-rxpi-night-muted transition-colors duration-150 hover:text-rxpi-night-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-rxpi-red"
                >
                  <FontAwesomeIcon icon={social.icon} className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
