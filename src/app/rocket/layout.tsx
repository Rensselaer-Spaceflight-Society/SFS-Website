import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import RxpiSmoothScroll from "../components/RxpiSmoothScroll";

const plexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  // The default Arial-based fallback is much wider than Plex Mono, so labels re-wrap when the font loads.
  // "RXPI Mono Fallback" (globals.css) matches Plex Mono's width and vertical metrics instead.
  adjustFontFallback: false,
  fallback: ["RXPI Mono Fallback", "monospace"],
});

export const metadata: Metadata = {
  title: {
    default: "RXPI | RPI Experimental Propulsion Initiative",
    template: "%s | RXPI",
  },
  description:
    "RXPI is the liquid-rocketry team of the Rensselaer Spaceflight Society at RPI. We built the RPU-1 Reliant engine and are designing Project Aquila: the Altair engine and the Albatross flight vehicle.",
};

export default function RocketLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      data-rxpi-root
      className={`${plexSans.variable} ${plexMono.variable} font-plex bg-rxpi-paper text-rxpi-ink antialiased`}
    >
      <RxpiSmoothScroll />
      {children}
    </div>
  );
}
