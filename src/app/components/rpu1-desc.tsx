'use client';

import React from 'react';
import Description from './description';
import { Rocket, Database, Thermometer, BrickWallFire } from 'lucide-react';

type Props = {
  completionDate?: string;
  ctaHref?: string;
};

export default function Rpu1Desc({ completionDate = 'Q4 2025', ctaHref = '/projects/rpu-1' }: Props) {
  return (
    <Description
      badge="RXPI RPU-1"
      badgeIcon={Rocket}
      badgeColor="bg-rose-50 text-rose-700"
      title="RPU‑1 Reliant - RPI's First Liquid Bipropellant Engine"
      description="A static-fire test stand designed and manufactured by RPI students. Reliant uses liquid kerosene and gaseous nitrous oxide as its fuel scheme, an extruded-graphite combustion chamber, a custom feed system, and a custom PCB."
      features={[
        {
          icon: Database,
          title: 'Custom PCB',
          description: 'Designed to control and monitor valves and sensors.',
          color: 'text-sky-600',
        },
        {
          icon: Thermometer,
          title: 'High‑Temp Materials',
          description: 'Extruded graphite combustion chamber',
          color: 'text-orange-600',
        },
        {
          icon: BrickWallFire,
          title: 'Hotfire 2025',
          description: `Projected Date: ${completionDate}`,
          color: 'text-emerald-600',
        },
      ]}
      ctaText="Learn more"
      ctaHref={ctaHref}
      imageSrc="/rocket/engine_cad_1.png"
      imageAlt="RPU-1 Engine CAD"
      imageCaption="Graphite Nozzle + Doublet impingement injector"
      imageDimensions={{
        width: 450,
        height: 320,
        objectFit: 'contain',
        objectPosition: 'center',
      }}
    />
  );
}