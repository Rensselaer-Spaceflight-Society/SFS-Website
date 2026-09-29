'use client'
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Download, Mail, Plus } from "lucide-react";
import RxpiHero from "../../components/RxpiHero";
import RxpiSubnav from "../../components/RxpiSubnav";
import RxpiButton from "../../components/RxpiButton";
import RxpiScene, { useSceneValue } from "../../components/RxpiScene";
import RxpiSceneItem from "../../components/RxpiSceneItem";
import RxpiReadouts from "../../components/RxpiReadouts";
import RxpiSectionHeader from "../../components/RxpiSectionHeader";
import RxpiCallouts from "../../components/RxpiCallouts";
import RxpiCrosshairs from "../../components/RxpiCrosshairs";
import RxpiFooter from "../../components/RxpiFooter";

const sponsorEmail = "rpi.spaceflight@gmail.com";
const sponsorshipPackage = "/rocket/RXPI_Sponsorship_Package_2026-27.pdf";

// Logos sit on dark tiles, so use white or light artwork. Without a logo, the name is set as a wordmark.
const supporters = [
  {
    name: "Rensselaer School of Engineering",
    logo: "/logos/soe_transparent_640.png",
    logoWidth: 640,
    logoHeight: 170,
    contribution: "Support for the Rensselaer Spaceflight Society",
    href: "https://eng.rpi.edu",
  },
  {
    name: "SEDS-USA",
    logo: "/logos/seds_transparent.png",
    logoWidth: 300,
    logoHeight: 204,
    contribution: "Chapter grant, fall 2025",
    href: "https://seds.org",
  },
  {
    name: "Ansys",
    logo: "/logos/ansys_part_of_synopsys_white.svg",
    logoWidth: 1030,
    logoHeight: 527,
    contribution: "Simulation software licenses",
    href: "https://www.ansys.com",
  },
  {
    name: "SendCutSend",
    logo: "/logos/sendcutsend_logo_white.svg",
    logoWidth: 150,
    logoHeight: 27,
    // A long, low wordmark: give it more of the plate's width so it reads at the same weight as the others
    logoWide: true,
    contribution: "Cut metal parts for RXPI hardware",
    href: "https://sendcutsend.com",
  },
];

const budget = [
  { item: "Feed system", detail: "Concentric tanks, custom valves, hardline tubing", cost: 3570 },
  { item: "Propulsion system", detail: "Thrust chamber assembly, injector components", cost: 2300 },
  { item: "Ground support and testing equipment", detail: "Test stand, remote fill", cost: 4700 },
  { item: "Data acquisition and electronics", detail: "Sensors and custom electronics", cost: 1295 },
  { item: "Recovery and aerostructure", detail: "Recovery avionics and hardware, aerostructure, subscale testing", cost: 2850 },
  { item: "Tools, consumables and propellants", detail: "Shop tools, consumables, propellant", cost: 2400 },
  { item: "Launch and travel", detail: "FAR launch fee, travel, camping, truck rentals", cost: 3700 },
];

const budgetTotal = budget.reduce((sum, line) => sum + line.cost, 0);
const budgetMax = Math.max(...budget.map((line) => line.cost));
const formatUsd = (value: number) => `$${value.toLocaleString("en-US")}`;
const mailto = (subject: string) => `mailto:${sponsorEmail}?subject=${encodeURIComponent(subject)}`;

const heroReadouts = [
  { value: formatUsd(budgetTotal), label: "Project Aquila budget, 2026–27" },
  { value: "$500", label: "Lowest tier, Scarlet" },
  { value: String(supporters.length), label: "Current supporters" },
];

// Lowest tier first. The metal bands follow the tier colors in the sponsorship package.
const tiers = [
  {
    name: "Scarlet",
    subtitle: "Alumni and small business support",
    amount: "$500–$1,000",
    support: "Donation",
    band: "bg-[linear-gradient(135deg,#5e000d,#b3001a_50%,#5e000d)] text-white",
  },
  {
    name: "Titanium",
    subtitle: "Component sponsorship",
    amount: "$1,000–$5,000",
    support: "Donation or material",
    band: "bg-[linear-gradient(135deg,#9aa0a7,#d5d9dd_50%,#9aa0a7)] text-rxpi-ink",
  },
  {
    name: "Inconel",
    subtitle: "Industry partnership",
    amount: "Over $5,000",
    support: "Donation or material",
    band: "bg-[linear-gradient(135deg,#a8977a,#e0d3b0_50%,#a8977a)] text-rxpi-ink",
  },
];

// One value per tier, in the order above: true = included, false = not included,
// or { cell, full } where the benefit differs for that tier (short text for the table, full text for the phone cards).
type TierValue = boolean | { cell: string; full: string };

const tierBenefits: { benefit: string; values: TierValue[] }[] = [
  {
    benefit: "Name or logo on the test stand during hot fire",
    values: [true, true, { cell: "Prominent name placement", full: "Prominent name placement on the test stand during hot fire" }],
  },
  {
    benefit: "Name or logo on Albatross",
    values: [false, true, { cell: "Prominent name or logo placement", full: "Prominent name or logo placement on Albatross" }],
  },
  { benefit: "Sponsorship post on our LinkedIn page", values: [true, true, false] },
  { benefit: "Spotlight posts on our social media", values: [false, false, true] },
  { benefit: "Invitations to Project Aquila design reviews", values: [false, false, true] },
  { benefit: "Direct recruiting access", values: [false, false, true] },
];

// Lead for the tier section: under the heading on phones, in the table's bottom-left corner on larger screens.
const tiersLead =
  "Sponsorship pays for Project Aquila's hardware and for launching Albatross at Friends of Amateur Rocketry (FAR) in the Mojave Desert. Donations and material sponsorships both count toward Titanium and Inconel. Scarlet is for donations.";

// Scene progress at which each row of the tier table fills in: the qualifying support row, then one per benefit.
const tierRowAt = (row: number) => row * 0.06;

// One sponsor on the wall: its logo comes up out of focus with a light passing across it, a red rule draws
// in under it, then its name and contribution. The plate itself stays put so the hairlines between plates
// never show as a block.
function SponsorPlate({ supporter, index, at }: { supporter: (typeof supporters)[number]; index: number; at: number }) {
  return (
    <a
      href={supporter.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex min-h-[15rem] flex-col bg-rxpi-night-raised p-6 transition-colors duration-150 hover:bg-rxpi-night focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rxpi-red sm:p-8 lg:min-h-[24rem] snug:min-h-[20rem] snug:p-6 compact:min-h-[14rem] compact:p-5"
    >
      <RxpiSceneItem at={at} from="fade" className="flex items-center justify-between font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] text-rxpi-night-muted">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 flex-none bg-rxpi-red" aria-hidden />
          Sponsor {String(index + 1).padStart(2, "0")}
        </span>
        <ArrowUpRight className="h-4 w-4 flex-none transition-colors duration-150 group-hover:text-rxpi-night-fg" aria-hidden />
      </RxpiSceneItem>
      <div className="relative flex flex-1 items-center justify-center overflow-hidden py-5 compact:py-2">
        <RxpiSceneItem at={at + 0.04} from="scale" className="flex h-full w-full items-center justify-center">
          {supporter.logo ? (
            <Image
              src={supporter.logo}
              alt=""
              width={supporter.logoWidth}
              height={supporter.logoHeight}
              className={`h-auto max-h-20 sm:max-h-24 lg:max-h-28 compact:max-h-20 ${"logoWide" in supporter ? "w-[92%]" : "w-auto max-w-[80%]"}`}
            />
          ) : (
            <span className="text-2xl font-semibold tracking-[-0.02em] sm:text-4xl" aria-hidden>
              {supporter.name}
            </span>
          )}
        </RxpiSceneItem>
        <RxpiSceneItem as="span" at={at + 0.04} from="fade" className="pointer-events-none absolute inset-0">
          {(shown) => (
            <motion.span
              aria-hidden
              className="absolute inset-y-0 w-1/3 bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.13),transparent)]"
              initial={false}
              animate={{ left: shown ? "115%" : "-45%" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            />
          )}
        </RxpiSceneItem>
      </div>
      <RxpiSceneItem at={at + 0.08} from="grow" className="h-[2px] origin-left bg-rxpi-red" />
      {/* Held to the same height in every plate so the red rules line up across the row */}
      <RxpiSceneItem at={at + 0.1} from="fade" className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 lg:min-h-[4.75rem] compact:mt-3">
        <p className="text-base font-semibold sm:text-lg">{supporter.name}</p>
        <p className="font-plex-mono text-xs uppercase tracking-[0.12em] text-rxpi-night-muted">{supporter.contribution}</p>
      </RxpiSceneItem>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

// Hero photo: the plate pushes in on the SendCutSend logo for the whole time the hero is pinned, while the text lifts away.
// Kept at 1.15 or less so the callout label never reaches the plate's top edge.
function HeroPlate() {
  const scale = useSceneValue([0, 1], [1, 1.15], 1);

  return (
    <div className="mx-auto w-full max-w-[40rem] overflow-hidden border border-rxpi-night-line md:max-w-[28rem] lg:max-w-[min(40rem,calc((100svh-22rem)*4/3))] short:max-w-[15rem] [&_figcaption>ol]:px-4 [&_figcaption>ol]:pb-4">
      <motion.div style={{ scale }} className="origin-[55%_31%]">
        <RxpiCallouts
          src="/rocket/reliant/reliant_hotfire_1.jpg"
          alt="The RPU-1 Reliant test stand in a field, with the SendCutSend logo on its blast shield"
          width={800}
          height={600}
          fit="cover"
          plate
          priority
          sizes="(min-width: 1024px) 40rem, 100vw"
          callouts={[
            {
              title: "SendCutSend logo",
              detail: "On the RPU-1 test stand",
              x: 55,
              y: 31.4,
              labelX: 44,
              labelY: 11,
              side: "left",
              frame: { x: 49.5, y: 28.3, w: 11, h: 6.2 },
            },
          ]}
        />
      </motion.div>
    </div>
  );
}

export default function Sponsors() {
  const benefitCell = (value: TierValue, at: number) => {
    if (value === true) {
      return (
        <>
          <RxpiSceneItem as="span" at={at} from="pop" className="inline-block">
            <span className="block h-2.5 w-2.5 bg-rxpi-ink" aria-hidden />
          </RxpiSceneItem>
          <span className="sr-only">Included</span>
        </>
      );
    }
    if (value === false) {
      return (
        <>
          <RxpiSceneItem as="span" at={at} from="fade">
            <span className="inline-block h-px w-3 bg-rxpi-muted align-middle" aria-hidden />
          </RxpiSceneItem>
          <span className="sr-only">Not included</span>
        </>
      );
    }
    return (
      <RxpiSceneItem as="span" at={at} from="fade" className="block text-sm font-medium leading-snug text-rxpi-ink">
        {value.cell}
      </RxpiSceneItem>
    );
  };

  return (
    <div className="relative min-w-full">
      <RxpiSubnav />

      <main id="main">
        <RxpiHero
          layout="split"
          mediaFirst={false}
          length={0.7}
          logo={
            <Image
              src="/logos/rxpi_lockup_white.png"
              alt="RPI Experimental Propulsion Initiative (RXPI)"
              width={1600}
              height={440}
              priority
              className="h-[clamp(3rem,5vw,5rem)] w-auto short:hidden"
            />
          }
          title="Sponsor RXPI"
          description="The RPI Experimental Propulsion Initiative (RXPI) is the liquid-rocketry team of the Rensselaer Spaceflight Society. Our 2026–27 sponsorship tiers start at $500."
          media={<HeroPlate />}
          footer={
            <div className="rx-container">
              <RxpiReadouts items={heroReadouts} tone="dark" />
            </div>
          }
        >
          <RxpiButton href="#tiers" tone="dark" icon={ArrowDown} block>
            See sponsorship tiers
          </RxpiButton>
          <RxpiButton href={sponsorshipPackage} variant="secondary" tone="dark" icon={Download} download block>
            Sponsorship package (PDF, 3.9&nbsp;MB)
          </RxpiButton>
        </RxpiHero>

        <RxpiScene id="supporters" length={1} until={0.55} className="bg-rxpi-night text-rxpi-night-fg" decor={<RxpiCrosshairs />}>
          <div className="rx-container">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <RxpiSectionHeader tone="dark" sceneAt={-0.75} label="01 · Current sponsors" title="Thank you to our sponsors" />
              <RxpiSceneItem at={-0.45} from="fade" className="flex-none">
                <p className="font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] text-rxpi-night-muted sm:text-[13px]">
                  {supporters.length} organizations support RXPI
                </p>
              </RxpiSceneItem>
            </div>

            <div className="mt-10 grid gap-px border border-rxpi-night-line bg-rxpi-night-line md:grid-cols-2 lg:grid-cols-4 snug:mt-8 compact:mt-6">
              {supporters.map((supporter, i) => (
                <SponsorPlate key={supporter.name} supporter={supporter} index={i} at={-0.32 + i * 0.14} />
              ))}
            </div>

            {/* The open slot on the wall */}
            <a
              href="#tiers"
              className="group flex items-center justify-between gap-6 border border-t-0 border-rxpi-night-line bg-rxpi-red px-6 py-5 text-white transition-colors duration-150 hover:bg-rxpi-red-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white sm:px-8 compact:py-3"
            >
              <RxpiSceneItem at={0.3} from="left" className="min-w-0">
                <p className="text-lg font-semibold sm:text-xl">Put your logo on this wall</p>
                <p className="mt-1 font-plex-mono text-xs uppercase tracking-[0.14em] text-white/80">2026–27 sponsorship tiers from $500</p>
              </RxpiSceneItem>
              <RxpiSceneItem as="span" at={0.36} from="pop" className="flex h-11 w-11 flex-none items-center justify-center border border-white/60 sm:h-12 sm:w-12">
                <Plus className="h-6 w-6" aria-hidden />
              </RxpiSceneItem>
            </a>
          </div>
        </RxpiScene>

        {/* Larger screens: the ruled table stays put while the tier bands rise in and the benefits fill in row by row.
            The heading sits in its empty top-left corner and the lead in the bottom-left one, so links to #tiers land on the filled table. */}
        <RxpiScene id="tiers" length={1} until={0.6} className="bg-rxpi-paper">
          <div className="rx-container">
            {/* Phones get the heading, the lead and one card per tier */}
            <div className="md:hidden">
              <RxpiSectionHeader sceneAt={-0.55} label="02 · Sponsorship tiers" title="2026–27 sponsorship tiers" />
              <RxpiSceneItem at={-0.4}>
                <p className="mt-5 max-w-[42rem] text-pretty text-rx-lead text-rxpi-muted">{tiersLead}</p>
              </RxpiSceneItem>

              <div className="mt-10 grid gap-6">
                {tiers.map((tier, i) => (
                  <RxpiSceneItem key={tier.name} at={-0.3 + i * 0.1}>
                    <div className="border border-rxpi-line bg-rxpi-raised">
                      <div className={`px-5 py-4 ${tier.band}`}>
                        <h3 className="font-plex-mono text-base font-semibold uppercase tracking-[0.16em]">{tier.name}</h3>
                        <p className="mt-1 text-sm leading-snug opacity-90">{tier.subtitle}</p>
                        <p className="mt-4 font-plex-mono text-[1.75rem] font-medium leading-none tracking-[-0.02em] tabular-nums">{tier.amount}</p>
                      </div>
                      <div className="px-5 pb-5">
                        <p className="border-b border-rxpi-line py-3 font-plex-mono text-[11.5px] uppercase tracking-[0.12em] text-rxpi-muted">
                          {tier.support}
                        </p>
                        <ul>
                          {tierBenefits
                            .filter((row) => row.values[i] !== false)
                            .map((row) => {
                              const value = row.values[i];
                              return (
                                <li key={row.benefit} className="border-b border-rxpi-line py-3 text-rx-body leading-snug text-rxpi-ink">
                                  {typeof value === "object" ? value.full : row.benefit}
                                </li>
                              );
                            })}
                        </ul>
                        <div className="mt-5">
                          <RxpiButton href={mailto(`RXPI ${tier.name} sponsorship`)} variant="secondary" icon={Mail} block>
                            Email us about {tier.name}
                          </RxpiButton>
                        </div>
                      </div>
                    </div>
                  </RxpiSceneItem>
                ))}
              </div>
            </div>

            <table className="hidden w-full table-fixed border-collapse text-left md:table">
              <caption className="sr-only">Benefits for each 2026–27 sponsorship tier</caption>
              <colgroup>
                <col className="w-[31%]" />
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <td className="border-b border-rxpi-ink pb-4 pr-6 align-bottom">
                    <RxpiSceneItem at={-0.55}>
                      <p className="flex items-center gap-3 font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] text-rxpi-muted sm:text-[13px]">
                        <span className="h-2 w-2 flex-none bg-rxpi-red" aria-hidden />
                        <span className="min-w-0">02 · Sponsorship tiers</span>
                        <span className="h-px flex-1 bg-rxpi-ink/15" aria-hidden />
                      </p>
                    </RxpiSceneItem>
                    <RxpiSceneItem at={-0.47}>
                      <h2 className="mt-3 text-balance text-[2rem] font-semibold leading-[1.08] tracking-[-0.02em] text-rxpi-ink">
                        2026–27 sponsorship tiers
                      </h2>
                    </RxpiSceneItem>
                  </td>
                  {tiers.map((tier, i) => (
                    <th key={tier.name} scope="col" className="h-px border-b border-rxpi-ink p-0 align-top">
                      {/* Each column rule arrives with its band */}
                      <RxpiSceneItem
                        at={-0.42 + i * 0.08}
                        className={`flex h-full flex-col border-l border-rxpi-ink px-4 py-4 lg:px-5 lg:py-5 compact:py-3.5 ${tier.band}`}
                      >
                        <span className="font-plex-mono text-base font-semibold uppercase tracking-[0.16em] lg:text-lg">{tier.name}</span>
                        <span className="mt-1 text-sm font-normal leading-snug opacity-90">{tier.subtitle}</span>
                        <span className="mt-4 font-plex-mono text-[clamp(1.25rem,0.8rem+1vw,1.75rem)] font-medium leading-none tracking-[-0.02em] tabular-nums compact:mt-3 lg:whitespace-nowrap">
                          {tier.amount}
                        </span>
                      </RxpiSceneItem>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-rxpi-line">
                  <th scope="row" className="py-3.5 pr-4 align-top font-plex-mono text-[11.5px] font-medium uppercase leading-5 tracking-[0.12em] text-rxpi-muted sm:text-xs compact:py-3">
                    <RxpiSceneItem as="span" at={tierRowAt(0)} from="left" className="block">
                      Qualifying support
                    </RxpiSceneItem>
                  </th>
                  {tiers.map((tier, i) => (
                    <td key={tier.name} className="border-l border-rxpi-line px-4 py-3.5 align-top text-sm leading-snug text-rxpi-ink compact:py-3 lg:px-5">
                      <RxpiSceneItem as="span" at={tierRowAt(0) + 0.03 * (i + 1)} from="fade" className="block">
                        {tier.support}
                      </RxpiSceneItem>
                    </td>
                  ))}
                </tr>
                {tierBenefits.map((row, r) => (
                  <tr key={row.benefit} className="border-b border-rxpi-line">
                    <th scope="row" className="py-3.5 pr-4 align-top text-rx-body font-normal leading-snug text-rxpi-ink compact:py-3">
                      <RxpiSceneItem as="span" at={tierRowAt(r + 1)} from="left" className="block">
                        {row.benefit}
                      </RxpiSceneItem>
                    </th>
                    {row.values.map((value, i) => (
                      <td key={tiers[i].name} className="border-l border-rxpi-line px-4 py-3.5 align-top compact:py-3 lg:px-5">
                        {benefitCell(value, tierRowAt(r + 1) + 0.03 * (i + 1))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-b border-rxpi-ink">
                  <td className="pb-4 pr-6 pt-5 align-top compact:pb-3 compact:pt-4">
                    <RxpiSceneItem at={0.3} from="fade">
                      <p className="text-pretty text-sm leading-normal text-rxpi-muted compact:text-[13px] compact:leading-snug">{tiersLead}</p>
                    </RxpiSceneItem>
                  </td>
                  {tiers.map((tier, i) => (
                    <td key={tier.name} className="border-l border-rxpi-line px-4 py-5 align-top lg:px-5">
                      <RxpiSceneItem at={0.5 + i * 0.05}>
                        <a
                          href={mailto(`RXPI ${tier.name} sponsorship`)}
                          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-rxpi-ink underline decoration-rxpi-field underline-offset-4 transition-colors duration-150 hover:decoration-rxpi-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-rxpi-red focus-visible:ring-offset-2"
                        >
                          <Mail className="h-4 w-4 flex-none" aria-hidden />
                          Email us about {tier.name}
                        </a>
                      </RxpiSceneItem>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </RxpiScene>

        <RxpiScene id="budget" length={1} until={0.4} className="border-t border-rxpi-line bg-rxpi-sunken">
          <div className="rx-container grid gap-10 xl:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] xl:gap-16">
            <RxpiSectionHeader
              sceneAt={-0.55}
              label="03 · Budget"
              title="Project Aquila budget, 2026–27"
              description="All figures are 2026–27 estimates in US dollars."
            />

            {/* The ruled rows stay put; each line item is entered in turn, its bar grows to its share, and the total lands last */}
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Project Aquila estimated 2026–27 budget in US dollars</caption>
              <thead>
                <tr className="border-y border-rxpi-ink font-plex-mono text-[11.5px] uppercase tracking-[0.12em] text-rxpi-muted sm:text-xs">
                  <th scope="col" className="py-3 pr-4 font-medium">Budget item</th>
                  <th scope="col" className="hidden w-[28%] py-3 pr-4 font-medium sm:table-cell">Share</th>
                  <th scope="col" className="whitespace-nowrap py-3 text-right font-medium">Cost (USD)</th>
                </tr>
              </thead>
              <tbody>
                {budget.map((line, r) => (
                  <tr key={line.item} className="border-b border-rxpi-line">
                    <td className="py-3.5 pr-4 align-top compact:py-2.5">
                      <RxpiSceneItem at={-0.2 + r * 0.07} from="left">
                        <p className="font-medium text-rxpi-ink">{line.item}</p>
                        <p className="mt-1 text-sm leading-snug text-rxpi-muted compact:mt-0.5">{line.detail}</p>
                      </RxpiSceneItem>
                    </td>
                    <td className="hidden py-3.5 pr-4 align-top sm:table-cell compact:py-2.5">
                      <div className="mt-1.5 flex items-center gap-3">
                        <div className="h-2 flex-1 bg-rxpi-line">
                          <RxpiSceneItem
                            at={-0.17 + r * 0.07}
                            from="grow"
                            className="h-2 origin-left bg-rxpi-ink"
                            style={{ width: `${(line.cost / budgetMax) * 100}%` }}
                          />
                        </div>
                        <RxpiSceneItem
                          as="span"
                          at={-0.12 + r * 0.07}
                          from="fade"
                          className="w-12 text-right font-plex-mono text-xs tabular-nums text-rxpi-muted"
                        >
                          {((line.cost / budgetTotal) * 100).toFixed(1)}%
                        </RxpiSceneItem>
                      </div>
                    </td>
                    <td className="py-3.5 text-right align-top font-plex-mono text-rx-body tabular-nums text-rxpi-ink compact:py-2.5">
                      <RxpiSceneItem as="span" at={-0.12 + r * 0.07} from="fade" className="block">
                        {formatUsd(line.cost)}
                      </RxpiSceneItem>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-b border-rxpi-ink">
                  <th scope="row" className="py-4 pr-4 font-semibold text-rxpi-ink compact:py-3">
                    <RxpiSceneItem as="span" at={0.4} from="fall" className="block">
                      Total
                    </RxpiSceneItem>
                  </th>
                  <td className="hidden sm:table-cell" />
                  <td className="py-4 text-right font-plex-mono text-lg font-semibold tabular-nums text-rxpi-ink compact:py-3">
                    <RxpiSceneItem as="span" at={0.4} from="fall" className="block">
                      {formatUsd(budgetTotal)}
                    </RxpiSceneItem>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </RxpiScene>

        <RxpiScene id="contact" length={0.5} until={0.05} className="bg-rxpi-red text-white">
          <div className="rx-container grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
            <div>
              <RxpiSceneItem at={-0.55} from="left">
                <p className="flex items-center gap-3 font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] text-white sm:text-[13px]">
                  <span className="h-2 w-2 flex-none bg-white" aria-hidden />
                  04 · Contact
                </p>
              </RxpiSceneItem>
              <RxpiSceneItem at={-0.45}>
                <p className="mt-6 font-plex-mono text-rx-h2 font-medium uppercase italic tracking-[-0.04em]">Aim higher.</p>
              </RxpiSceneItem>
              <RxpiSceneItem at={-0.32}>
                <h2 className="mt-8 text-rx-h3 font-semibold">Sponsor contact</h2>
              </RxpiSceneItem>
              <RxpiSceneItem at={-0.24}>
                <p className="mt-3 max-w-[34rem] text-pretty text-rx-lead text-white">
                  Email us with the tier you have in mind, or tell us what material you can supply.
                </p>
              </RxpiSceneItem>
              <RxpiSceneItem at={-0.14}>
                <a
                  href={mailto("RXPI sponsorship")}
                  className="mt-5 inline-flex min-h-11 items-center break-all font-plex-mono text-[clamp(1.125rem,0.9rem+1vw,1.75rem)] text-white underline decoration-white/60 underline-offset-[6px] transition-colors duration-150 hover:decoration-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-rxpi-red"
                >
                  {sponsorEmail}
                </a>
              </RxpiSceneItem>
            </div>
            <RxpiSceneItem at={0.05} className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap lg:justify-end">
              <a
                href={mailto("RXPI sponsorship")}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 bg-white px-5 py-2.5 text-sm font-medium text-rxpi-red transition-colors duration-150 hover:bg-rxpi-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-rxpi-red sm:w-auto"
              >
                Email the team
                <Mail className="h-4 w-4" aria-hidden />
              </a>
              <RxpiButton href={sponsorshipPackage} variant="secondary" tone="dark" icon={Download} download block>
                Sponsorship package (PDF, 3.9&nbsp;MB)
              </RxpiButton>
            </RxpiSceneItem>
          </div>
        </RxpiScene>
      </main>

      <RxpiFooter showTagline={false} />
    </div>
  );
}
