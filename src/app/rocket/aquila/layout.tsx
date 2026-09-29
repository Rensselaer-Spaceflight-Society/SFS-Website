import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Aquila",
  description:
    "RXPI's Project Aquila: RPU-2 Altair, a regeneratively cooled nitrous oxide and ethanol engine, and FV01 Albatross, a flight vehicle with a 60,000 ft AGL target apogee.",
};

export default function AquilaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
