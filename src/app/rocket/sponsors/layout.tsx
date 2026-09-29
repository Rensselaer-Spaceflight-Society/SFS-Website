import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "2026–27 sponsorship tiers for the RPI Experimental Propulsion Initiative (RXPI), from $500, and the $20,815 Project Aquila budget.",
};

export default function SponsorsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
