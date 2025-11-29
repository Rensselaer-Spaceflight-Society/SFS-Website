'use client';

import React from 'react';
import Description from './description';
import { Rocket, Cpu, AirVent, Cloud } from 'lucide-react';

type Props = {
  completionDate?: string;
  ctaHref?: string;
};

export default function Rpu2Desc({ completionDate = 'Q4 2025', ctaHref = '/projects/rpu-1' }: Props) {
  return (
    <Description
      badge="RXPI RPU-2"
      badgeIcon={Rocket}
      badgeColor="bg-rose-50 text-rose-700"
      title="RPU-2 TBD"
      description="TBD"
      features={[
        {
          icon: Cpu,
          title: 'TBD',
          description: 'TBD',
          color: 'text-sky-600',
        },
        {
          icon: AirVent,
          title: 'Regen Cooling',
          description: 'TBD',
          color: 'text-sky-400',
        },
        {
          icon: Cloud,
          title: 'Launch',
          description: `Projected Date: ${completionDate}`,
          color: 'text-emerald-600',
        },
      ]}
      ctaText="Learn more"
      ctaHref={ctaHref}
      imageDimensions={{
        width: 450,
        height: 320,
        objectFit: 'contain',
        objectPosition: 'center',
      }}
    />
  );
}
