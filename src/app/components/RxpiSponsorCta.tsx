'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Download } from 'lucide-react';
import RxpiButton from './RxpiButton';
import RxpiReveal from './RxpiReveal';

type Props = {
  title?: string;
  description?: string;
};

const supporterNames = ['Rensselaer School of Engineering', 'SEDS-USA', 'Ansys', 'SendCutSend'];

export default function RxpiSponsorCta({
  title = 'Sponsor RXPI in 2026–27',
  description = 'Sponsors who donate $500 or more get their name or logo on our test stand during hot fire. From $1,000, donated or in material, it also goes on Albatross, and sponsors over $5,000 are invited to our design reviews.',
}: Props) {
  return (
    <section className="bg-rxpi-red text-white">
      <RxpiReveal className="rx-container py-[clamp(3.5rem,7vw,6rem)]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-end">
          <div>
            <p className="font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] text-white sm:text-[13px]">Sponsorship</p>
            <h2 className="mt-4 max-w-[20ch] text-balance text-rx-h2 font-semibold tracking-[-0.02em]">{title}</h2>
            <p className="mt-5 max-w-[42rem] text-pretty text-rx-lead text-white">{description}</p>
          </div>
          <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap lg:justify-end">
            <Link
              href="/rocket/sponsors#tiers"
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-white px-5 py-2.5 text-sm font-medium text-rxpi-red transition-colors duration-150 hover:bg-rxpi-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-rxpi-red"
            >
              See sponsorship tiers
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <RxpiButton href="/rocket/RXPI_Sponsorship_Package_2026-27.pdf" variant="secondary" tone="dark" icon={Download} download>
              Sponsorship package (PDF, 3.9&nbsp;MB)
            </RxpiButton>
          </div>
        </div>
        <p className="mt-10 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/25 pt-5 font-plex-mono text-xs uppercase tracking-[0.12em] text-white">
          <span className="font-semibold">Supported by</span>
          {supporterNames.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </p>
      </RxpiReveal>
    </section>
  );
}
