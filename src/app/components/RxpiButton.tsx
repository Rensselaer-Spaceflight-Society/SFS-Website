'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  tone?: 'light' | 'dark';
  icon?: LucideIcon;
  external?: boolean;
  download?: boolean;
  block?: boolean;
};

const variantClasses = {
  primary: {
    light: 'bg-rxpi-red text-white hover:bg-rxpi-red-hover active:bg-rxpi-red-deep',
    dark: 'bg-rxpi-red text-white hover:bg-rxpi-red-hover active:bg-rxpi-red-deep',
  },
  secondary: {
    light: 'border border-rxpi-ink text-rxpi-ink hover:bg-rxpi-ink hover:text-rxpi-paper',
    dark: 'border border-rxpi-night-fg/60 text-rxpi-night-fg hover:border-rxpi-night-fg hover:bg-rxpi-night-fg hover:text-rxpi-night',
  },
};

export default function RxpiButton({
  href,
  children,
  variant = 'primary',
  tone = 'light',
  icon: Icon,
  external = false,
  download = false,
  block = false,
}: Props) {
  const ringOffset = tone === 'dark' ? 'focus-visible:ring-offset-rxpi-night' : 'focus-visible:ring-offset-rxpi-paper';
  const className = `inline-flex min-h-11 shrink-0 items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
    variant === 'secondary' && tone === 'dark' ? 'focus-visible:ring-rxpi-night-fg' : 'focus-visible:ring-rxpi-red'
  } ${ringOffset} ${
    block ? 'w-full sm:w-auto' : ''
  } ${variantClasses[variant][tone]}`;

  const content = (
    <>
      {children}
      {Icon && <Icon className="h-4 w-4 flex-none" aria-hidden />}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );

  if (external || download || href.startsWith('mailto:') || href.startsWith('#')) {
    return (
      <a
        href={href}
        className={className}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...(download ? { download: '' } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
