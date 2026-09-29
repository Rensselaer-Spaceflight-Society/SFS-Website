'use client'
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import RxpiHero from "../../components/RxpiHero";
import RxpiSubnav from "../../components/RxpiSubnav";
import RxpiButton from "../../components/RxpiButton";
import RxpiScene, { useSceneValue } from "../../components/RxpiScene";
import RxpiSceneItem from "../../components/RxpiSceneItem";
import RxpiReadouts from "../../components/RxpiReadouts";
import RxpiSectionHeader from "../../components/RxpiSectionHeader";
import RxpiGateTimeline, { Gate } from "../../components/RxpiGateTimeline";
import RxpiSpecTable from "../../components/RxpiSpecTable";
import RxpiCallouts from "../../components/RxpiCallouts";
import RxpiCrosshairs from "../../components/RxpiCrosshairs";
import RxpiTitleBlock from "../../components/RxpiTitleBlock";
import RxpiDocument from "../../components/RxpiDocument";
import RxpiSponsorCta from "../../components/RxpiSponsorCta";
import RxpiFooter from "../../components/RxpiFooter";

const heroReadouts = [
  { value: "7", unit: "kN", label: "Altair design thrust" },
  { value: "340", unit: "psi", label: "Design chamber pressure" },
  { value: "60,000", unit: "ft", label: "Target apogee (AGL)" },
  { prefix: "Mach", value: "2.08", label: "Predicted max velocity" },
];

// Update status and dates here as the program moves through its gates.
const gates: Gate[] = [
  { id: "SRR", name: "System Requirements Review", purpose: "Defined what Aquila will build.", date: "Feb 2026", status: "complete", statusText: "Passed" },
  { id: "PDR", name: "Preliminary Design Review", purpose: "Showed the concept works at 30% design.", date: "Spring 2026", status: "complete", statusText: "Passed" },
  { id: "CDR", name: "Critical Design Review", purpose: "Freezes the design and clears it for manufacturing.", status: "current" },
  { id: "TRR", name: "Test Readiness Review", purpose: "Safety gate before any hazardous test.", status: "planned" },
  { id: "FRR", name: "Flight Readiness Review", purpose: "Final go for launch.", status: "planned" },
  { id: "FLIGHT", name: "Albatross launch, Mojave Desert", status: "planned", milestone: true },
];

const testCampaign = [
  { test: "Hydrostatic proof test", purpose: "Pressure vessels and feed lines held at 1.5× maximum expected operating pressure." },
  { test: "Cold flow", purpose: "Nitrogen and water through the feed system and injector to check valves, flow rates and instrumentation." },
  { test: "Valve and injector characterization", purpose: "Servo-actuated ball valve sweeps to set the mixture ratio and characterize the pintle injector." },
  { test: "Igniter testing", purpose: "Head-end cartridge igniter qualified before the first engine start." },
  { test: "Hot fire", purpose: "Full-duration hot fire of Altair on the test stand." },
  { test: "Flight", purpose: "Albatross launch at Friends of Amateur Rocketry (FAR) in the Mojave Desert, California." },
];

const altairCallouts = [
  { title: "Injector manifold", detail: "Stainless 316", x: 58.6, y: 36.8, labelX: 40, labelY: 10, side: "left" as const },
  { title: "Pintle injector", detail: "Copper 110", x: 69.4, y: 25.6, labelX: 72, labelY: 52, side: "right" as const },
  { title: "Combustion chamber", detail: "DMLS-printed AlSi10Mg", x: 32.3, y: 62.5, labelX: 55, labelY: 86, side: "right" as const },
];

const altairSpecs = [
  { label: "Design thrust", value: "7 kN", alt: "~1,570 lbf" },
  { label: "Propellants", value: "Nitrous oxide / ethanol" },
  { label: "Feed system", value: "Pressure-fed, dual-acting vapor pressurization" },
  { label: "Design chamber pressure", value: "340 psi", alt: "23.4 bar" },
  { label: "Cooling", value: "Regenerative ethanol jacket with film cooling" },
  { label: "Injector", value: "Copper 110 slot pintle" },
  { label: "Injector manifold", value: "Stainless 316" },
  { label: "Combustion chamber", value: "DMLS-printed AlSi10Mg, post-machined" },
  { label: "Ignition", value: "Head-end cartridge igniter" },
];

const altairAnalysis = [
  { title: "Cooling solver", description: "We wrote our own regenerative cooling solver to check the jacket design." },
  { title: "Flow model", description: "We use a multiphase flow tool to predict how the engine performs away from its design point." },
  { title: "Change from RPU-1", description: "RPU-1 Reliant has no active cooling. Its graphite nozzle absorbs heat during a short burn." },
];

const albatrossGroups = [
  {
    side: "left",
    title: "Mission",
    rows: [
      { label: "Target apogee", value: "60,000 ft AGL", alt: "18.3 km" },
      { label: "Predicted max velocity", value: "Mach 2.08" },
      { label: "Planned launch site", value: "FAR, Mojave Desert" },
    ],
  },
  {
    side: "left",
    title: "Recovery",
    rows: [
      { label: "Deployment", value: "Dual: drogue at apogee" },
      { label: "Main parachute", value: "~1,000 ft AGL", alt: "305 m" },
    ],
  },
  {
    side: "right",
    title: "Propulsion",
    rows: [
      { label: "Engine", value: "RPU-2 Altair" },
      { label: "Design thrust", value: "7 kN", alt: "~1,570 lbf" },
      { label: "Propellants", value: "Nitrous oxide / ethanol" },
    ],
  },
  {
    side: "right",
    title: "Feed and control",
    rows: [
      { label: "Tanks", value: "Concentric propellant tanks" },
      { label: "Pressurization", value: "Dual-acting vapor pressurization" },
      { label: "Valves", value: "Custom servo-actuated ball valves" },
      { label: "Electronics", value: "Custom PCB control hardware" },
    ],
  },
];

// Groups fall in one after another, left side first
const groupAt = (title: string) => albatrossGroups.findIndex((g) => g.title === title) * 0.1;

// The PDR deck lives in public/rocket/aquila/; set src to null to hide its section.
const pdrPresentation = {
  title: "Project Aquila Preliminary Design Review",
  meta: "PDR · April 2026 · PDF · 4.9\u00a0MB",
  src: "/rocket/aquila/aquila_pdr_presentation_2026-04-19.pdf" as string | null,
  cover: "/rocket/covers/aquila_pdr_presentation.png",
};

// Hero background: the Project Aquila mission patch, faint behind the title. It sits farther back than the
// engine, so while the hero is pinned it drifts up less and fades back as the text lifts away.
function HeroBackdrop() {
  const y = useSceneValue([0, 1], ["0%", "-3%"], "0%");
  const scale = useSceneValue([0, 1], [1, 1.03], 1);
  const fade = useSceneValue([0, 0.5, 1], [1, 1, 0.4], 1);

  return (
    <>
      <div className="absolute inset-x-0 bottom-[clamp(6rem,14svh,8rem)] top-[var(--rx-bars)] flex items-center justify-center short:hidden" aria-hidden>
        <motion.div style={{ scale, y, opacity: fade }} className="relative aspect-[382/377] w-[min(78vw,56svh,40rem)]">
          <Image src="/rocket/aquila/aquila_patch.png" alt="" fill sizes="40rem" className="object-contain opacity-[0.1] md:opacity-[0.16]" />
        </motion.div>
      </div>
      <div className="absolute inset-x-0 bottom-0 top-[var(--rx-bars)]">
        <div className="rx-container relative h-full">
          <RxpiCrosshairs />
        </div>
      </div>
    </>
  );
}

// Hero media: the camera pushes in slowly on the Altair render and it rises a little over the pinned stretch,
// closer than the patch behind it. It stays on stage while the hero text lifts away, then leaves with the
// hero; its drawing title block does not move.
function HeroEngine() {
  const scale = useSceneValue([0, 1], [1, 1.07], 1);
  const y = useSceneValue([0, 1], ["0%", "-5%"], "0%");

  return (
    <div className="relative mx-auto w-full max-w-[min(44rem,60svh)] 3xl:max-w-[min(877px,60svh)] short:max-w-[15rem]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_50%_80%,rgba(255,255,255,0.09),transparent_70%)]" aria-hidden />
      <motion.div style={{ scale, y }} className="relative aspect-[877/755] w-full">
        <Image
          src="/rocket/aquila/altair_exploded.png"
          alt="Exploded render of the RPU-2 Altair engine"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain"
        />
      </motion.div>
      <RxpiTitleBlock
        className="absolute bottom-2 right-0 hidden lg:block short:hidden"
        rows={[
          ["Article", "RPU-2 Altair"],
          ["Program", "Project Aquila"],
        ]}
      />
    </div>
  );
}

// The exploded render settles to full size as the engine scene arrives; its callouts then appear one by one.
function AltairDrawing() {
  const scale = useSceneValue([-0.9, 0], [0.88, 1]);

  return (
    <motion.div
      style={{ scale }}
      className="relative mx-auto w-full max-w-[min(100%,calc((100svh-10rem)*877/755))] short:max-w-[22rem]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_50%_80%,rgba(255,255,255,0.08),transparent_70%)]" aria-hidden />
      <RxpiCallouts
        src="/rocket/aquila/altair_exploded.png"
        alt="Exploded render of the Altair engine: injector manifold, pintle injector, and regeneratively cooled combustion chamber"
        width={877}
        height={755}
        callouts={altairCallouts}
        sceneAt={0.02}
      />
    </motion.div>
  );
}

// Albatross rises into place from below as its scene arrives.
function AlbatrossRocket() {
  const y = useSceneValue([-1, 0.1], ["40%", "0%"]);

  return (
    <motion.div style={{ y }} className="h-full">
      <Image
        src="/rocket/aquila/albatross_vertical.png"
        alt="Side view of the Albatross rocket in its red, white and black livery"
        width={146}
        height={1864}
        className="mx-auto h-full w-auto"
      />
    </motion.div>
  );
}

// One Albatross spec group: the rule draws out from its red tick, then the heading and each row drop into place.
function AlbatrossGroup({ group, at }: { group: (typeof albatrossGroups)[number]; at: number }) {
  return (
    <div>
      <RxpiSceneItem at={at} from="grow" className="relative h-px origin-left bg-rxpi-night-fg/25">
        <span className="absolute left-0 top-0 h-px w-8 bg-rxpi-red" aria-hidden />
      </RxpiSceneItem>
      <RxpiSceneItem at={at + 0.02} from="fade">
        <h3 className="pt-3 font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] text-rxpi-night-fg">{group.title}</h3>
      </RxpiSceneItem>
      <dl className="mt-4 space-y-4 compact:mt-3 compact:space-y-3">
        {group.rows.map((row, i) => (
          <div key={row.label}>
            <RxpiSceneItem
              as="dt"
              at={at + 0.03 + i * 0.035}
              from="fade"
              className="font-plex-mono text-[11.5px] uppercase tracking-[0.12em] text-rxpi-night-muted sm:text-xs"
            >
              {row.label}
            </RxpiSceneItem>
            <RxpiSceneItem as="dd" at={at + 0.03 + i * 0.035} from="fall" className="mt-1 text-rx-h3 leading-tight text-rxpi-night-fg">
              {row.value}
              {row.alt && <span className="ml-2 font-plex-mono text-[0.55em] text-rxpi-night-muted">{row.alt}</span>}
            </RxpiSceneItem>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function Aquila() {
  const leftGroups = albatrossGroups.filter((g) => g.side === "left");
  const rightGroups = albatrossGroups.filter((g) => g.side === "right");

  return (
    <div className="relative min-w-full">
      <RxpiSubnav />

      <main id="main">
        <RxpiHero
          layout="split"
          length={0.8}
          kicker="RXPI · Current program"
          title="Project Aquila"
          description="RPU-2 Altair is a regeneratively cooled nitrous oxide and ethanol engine. FV01 Albatross is the flight vehicle we are designing to carry it to a 60,000 ft AGL target apogee."
          background={<HeroBackdrop />}
          media={<HeroEngine />}
          footer={
            <div className="rx-container">
              <RxpiReadouts items={heroReadouts} tone="dark" />
            </div>
          }
        >
          <RxpiButton href="#status" tone="dark" icon={ArrowDown} block>
            Program status
          </RxpiButton>
          <RxpiButton href="/rocket/sponsors" variant="secondary" tone="dark" block>
            Sponsor RXPI
          </RxpiButton>
        </RxpiHero>

        <RxpiScene id="status" length={0.8} until={0.45} className="bg-rxpi-paper">
          <div className="rx-container">
            {/* Starts early so the band coming up under the hero shows its label as soon as it is on screen */}
            <RxpiSectionHeader
              sceneAt={-0.75}
              label="01 · Program status"
              title="Aquila review gates"
              description="We completed SRR in February 2026 and passed PDR in spring 2026. CDR is in work. We freeze the Altair and Albatross designs for fabrication at CDR. After that, any design change needs an engineering change request approved by the chief engineer and program manager."
            />

            <div className="mt-12 sm:mt-14 compact:mt-6">
              <RxpiSceneItem at={-0.32} from="grow" className="h-px origin-left bg-rxpi-ink" />
              <div className="pt-8 compact:pt-5">
                <RxpiGateTimeline gates={gates} sceneRange={[-0.25, 0.45]} />
              </div>
            </div>
          </div>
        </RxpiScene>

        <RxpiScene length={0.7} until={0.2} className="bg-rxpi-paper">
          <div className="rx-container">
            <RxpiSceneItem at={-0.45} from="fade">
              <p className="font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] text-rxpi-muted sm:text-[13px]">Test campaign · planned</p>
            </RxpiSceneItem>
            <table className="mt-4 w-full border-collapse text-left">
              <caption className="sr-only">Project Aquila test campaign, in order</caption>
              <thead className="max-sm:sr-only">
                <tr className="border-y border-rxpi-ink font-plex-mono text-[11.5px] uppercase tracking-[0.12em] text-rxpi-muted sm:text-xs">
                  <th scope="col" className="w-12 py-3 pr-4 font-medium">No.</th>
                  <th scope="col" className="w-[30%] py-3 pr-4 font-medium">Test</th>
                  <th scope="col" className="py-3 font-medium">Purpose</th>
                </tr>
              </thead>
              <tbody className="border-t border-rxpi-ink sm:border-t-0">
                {/* Each test is logged in turn, first to flight */}
                {testCampaign.map((row, i) => (
                  <RxpiSceneItem
                    as="tr"
                    key={row.test}
                    at={-0.3 + i * 0.1}
                    from="left"
                    className="grid grid-cols-[2.5rem_1fr] border-b border-rxpi-line py-4 sm:table-row sm:py-0"
                  >
                    <td className="row-span-2 font-plex-mono text-sm text-rxpi-muted sm:py-4 sm:pr-4 sm:align-top">{String(i + 1).padStart(2, "0")}</td>
                    <td className="font-medium text-rxpi-ink sm:py-4 sm:pr-4 sm:align-top">{row.test}</td>
                    <td className="mt-1 text-pretty text-rx-body text-rxpi-muted sm:mt-0 sm:py-4 sm:align-top">{row.purpose}</td>
                  </RxpiSceneItem>
                ))}
              </tbody>
            </table>
          </div>
        </RxpiScene>

        <RxpiScene id="altair" length={0.9} until={0.45} className="bg-rxpi-night text-rxpi-night-fg" decor={<RxpiCrosshairs />}>
          {/* Large screens: the drawing on the left, the header above its title block on the right */}
          <div className="rx-container grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:grid-rows-[auto_1fr_auto] lg:gap-x-16 lg:gap-y-0">
            <div className="lg:col-start-2 lg:row-start-1">
              <RxpiSectionHeader
                tone="dark"
                sceneAt={-0.5}
                label="02 · Engine"
                title="RPU-2 Altair"
                description="Ethanol flows through a regenerative jacket in the printed chamber wall before it reaches the injector, and a film of fuel cools the inner wall."
              />
            </div>

            <RxpiSceneItem at={-0.55} from="fade" className="lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:self-center">
              <AltairDrawing />
            </RxpiSceneItem>

            <RxpiSceneItem at={0.45} from="fall" className="max-lg:-mt-4 lg:col-start-2 lg:row-start-3">
              <RxpiTitleBlock
                rows={[
                  ["Article", "RPU-2 Altair"],
                  ["View", "Exploded render"],
                ]}
              />
            </RxpiSceneItem>
          </div>
        </RxpiScene>

        <RxpiScene length={0.7} until={0.24} className="bg-rxpi-night text-rxpi-night-fg" decor={<RxpiCrosshairs />}>
          <div className="rx-container grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16">
            <RxpiSpecTable title="Altair specifications" specs={altairSpecs} tone="dark" sceneAt={-0.4} />

            <div className="grid gap-px border-y border-rxpi-night-line bg-rxpi-night-line md:grid-cols-3 lg:grid-cols-1">
              {altairAnalysis.map((item, i) => (
                <div key={item.title} className="bg-rxpi-night py-6 md:px-6 md:first:pl-0 lg:px-0">
                  <RxpiSceneItem at={0.08 + i * 0.08} from="fall">
                    <h3 className="font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] text-rxpi-night-fg sm:text-[13px]">{item.title}</h3>
                    <p className="mt-3 text-pretty text-rx-body text-rxpi-night-muted">{item.description}</p>
                  </RxpiSceneItem>
                </div>
              ))}
            </div>
          </div>
        </RxpiScene>

        <RxpiScene
          id="albatross"
          length={0.9}
          until={0.44}
          className="bg-[#111010] text-rxpi-night-fg"
          decor={
            <>
              {/* The hatching sits on the stage so it holds still with the content */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.03)_0_1px,transparent_1px_8px)]" aria-hidden />
              <RxpiCrosshairs />
            </>
          }
        >
          {/* Large screens: header and the left groups, the rocket, then the right groups, all on one sheet */}
          <div className="rx-container grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-6 sm:grid-cols-[3rem_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-[clamp(2rem,5vw,6rem)]">
            <div className="col-span-2 mb-14 lg:col-span-1 lg:col-start-1 lg:row-start-1 lg:mb-0">
              <RxpiSectionHeader
                tone="dark"
                sceneAt={-0.5}
                label="03 · Flight vehicle"
                title="FV01 Albatross"
                description="Albatross is our first liquid-propellant flight vehicle: a single-stage rocket powered by Altair, with concentric propellant tanks. We sized it for a 60,000 ft AGL target apogee and plan to fly it at FAR."
              />
            </div>

            <div className="hidden gap-x-8 gap-y-12 pt-10 lg:col-start-1 lg:row-start-2 lg:grid lg:self-end xl:grid-cols-2">
              {leftGroups.map((group) => (
                <AlbatrossGroup key={group.title} group={group} at={groupAt(group.title)} />
              ))}
            </div>

            <div className="relative lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <div className="sticky top-20 h-[min(70svh,34rem)] lg:static lg:h-[min(calc(100svh-9rem),56rem)]">
                <AlbatrossRocket />
              </div>
            </div>

            <div className="space-y-12 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:flex lg:flex-col lg:justify-between lg:gap-6 lg:space-y-0">
              <div className="space-y-12 lg:hidden">
                {leftGroups.map((group) => (
                  <AlbatrossGroup key={group.title} group={group} at={groupAt(group.title)} />
                ))}
              </div>
              {rightGroups.map((group) => (
                <AlbatrossGroup key={group.title} group={group} at={groupAt(group.title)} />
              ))}
            </div>
          </div>
        </RxpiScene>

        {pdrPresentation.src && (
          <RxpiScene id="pdr" length={0.5} until={0.05} className="border-t border-rxpi-line bg-rxpi-sunken">
            <div className="rx-container">
              <RxpiSectionHeader
                sceneAt={-0.5}
                label="04 · Design review"
                title="Preliminary Design Review"
                description="The slides we presented at the Aquila Preliminary Design Review, which we passed in April 2026."
              />
              {/* The cover and text arrive with the card; the links land once the stage holds */}
              <div className="mt-10">
                <RxpiDocument
                  title={pdrPresentation.title}
                  meta={pdrPresentation.meta}
                  description="Trade studies, interface control documents, the preliminary drawing tree and component failure-mode analysis for Altair and Albatross."
                  src={pdrPresentation.src}
                  cover={pdrPresentation.cover}
                  coverShape="slide"
                  sceneAt={-0.2}
                />
              </div>
            </div>
          </RxpiScene>
        )}

        <RxpiSponsorCta />
      </main>

      <RxpiFooter />
    </div>
  );
}
