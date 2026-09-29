import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RPU-1 Reliant",
  description:
    "RPU-1 Reliant is RPI's first liquid bipropellant rocket engine, a 300 psi kerosene and nitrous oxide technology demonstrator designed by RXPI undergraduates.",
};

export default function ReliantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
