'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
};

type ImageDimensions = {
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  objectPosition?: string;
};

type Props = {
  badge: string;
  badgeIcon: LucideIcon;
  badgeColor: string;
  title: string;
  description: string;
  features: FeatureItem[];
  ctaText?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageCaption?: string;
  imageDimensions?: ImageDimensions;
};

export default function Description({
  badge,
  badgeIcon: BadgeIcon,
  badgeColor,
  title,
  description,
  features,
  ctaText = 'Learn more',
  ctaHref = '#',
  imageSrc,
  imageAlt = 'Project visualization',
  imageCaption,
  imageDimensions = {},
}: Props) {
  const { width = 420, height = 260, objectFit = 'contain', objectPosition = 'center' } = imageDimensions;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="w-full bg-gradient-to-b from-slate-50 to-white/70 py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className={`inline-flex items-center gap-2 rounded-full ${badgeColor} px-3 py-1 text-sm font-medium`}>
                <BadgeIcon className="h-4 w-4" aria-hidden />
                {badge}
              </p>

              <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                {title}
              </h1>

              <p className="mt-4 max-w-2xl text-lg text-slate-700">
                {description}
              </p>

              <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {features.map((feature, index) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 rounded-lg bg-white/60 p-3 shadow-sm">
                      <FeatureIcon className={`h-5 w-5 flex-none ${feature.color}`} aria-hidden />
                      <div>
                        <dt className="text-sm font-medium text-slate-800">{feature.title}</dt>
                        <dd className="mt-0.5 text-sm text-slate-600">{feature.description}</dd>
                      </div>
                    </div>
                  );
                })}
              </dl>

              <div className="mt-8 flex gap-3">
                <a
                  href={ctaHref}
                  className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                >
                  {ctaText}
                </a>
              </div>
            </div>

            {imageSrc && (
              <figure className="relative col-start-2 row-start-1 md:row-start-auto" aria-hidden>
                <div className="pointer-events-none hidden overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-800/5 to-sky-50/40 shadow-lg md:block" style={{ width: width, height: height }}>
                  <img
                    src={imageSrc}
                    alt={imageAlt}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: objectFit,
                      objectPosition: objectPosition,
                    }}
                  />
                </div>
                {imageCaption && (
                  <figcaption className="mt-2 text-center text-sm text-slate-600">
                    {imageCaption}
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-slate-50 to-white/70 py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <p className={`inline-flex items-center gap-2 rounded-full ${badgeColor} px-3 py-1 text-sm font-medium`}>
              <BadgeIcon className="h-4 w-4" aria-hidden />
              {badge}
            </p>

            <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-slate-700">
              {description}
            </p>

            <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {features.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-3 rounded-lg bg-white/60 p-3 shadow-sm">
                    <FeatureIcon className={`h-5 w-5 flex-none ${feature.color}`} aria-hidden />
                    <div>
                      <dt className="text-sm font-medium text-slate-800">{feature.title}</dt>
                      <dd className="mt-0.5 text-sm text-slate-600">{feature.description}</dd>
                    </div>
                  </div>
                );
              })}
            </dl>

            <div className="mt-8 flex gap-3">
              <a
                href={ctaHref}
                className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                {ctaText}
              </a>
            </div>
          </motion.div>

          {imageSrc && (
            <motion.figure
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative col-start-2 row-start-1 md:row-start-auto"
              aria-hidden
            >
              <div className="pointer-events-none hidden overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-800/5 to-sky-50/40 shadow-lg md:block" style={{ width: width, height: height }}>
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: objectFit,
                    objectPosition: objectPosition,
                  }}
                />
              </div>
              {imageCaption && (
                <figcaption className="mt-2 text-center text-sm text-slate-600">
                  {imageCaption}
                </figcaption>
              )}
            </motion.figure>
          )}
        </div>
      </div>
    </section>
  );
}
