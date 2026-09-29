'use client'
import Image from "next/image";
import { MotionValue, motion, useTransform } from "framer-motion";
import { ArrowRight, ExternalLink, Mail } from "lucide-react";
import RxpiHero from "../components/RxpiHero";
import RxpiSubnav from "../components/RxpiSubnav";
import RxpiButton from "../components/RxpiButton";
import RxpiScene, { RxpiSceneText, useSceneValue } from "../components/RxpiScene";
import RxpiSceneItem from "../components/RxpiSceneItem";
import RxpiReadouts from "../components/RxpiReadouts";
import RxpiSectionHeader from "../components/RxpiSectionHeader";
import RxpiGateTimeline, { Gate } from "../components/RxpiGateTimeline";
import RxpiCrosshairs from "../components/RxpiCrosshairs";
import RxpiTitleBlock from "../components/RxpiTitleBlock";
import RxpiSponsorCta from "../components/RxpiSponsorCta";
import RxpiFooter from "../components/RxpiFooter";
import RxpiReel, { ReelPhoto } from "../components/RxpiReel";

const heroReadouts = [
  { value: "60,000", unit: "ft", label: "Albatross target apogee (AGL)" },
  { value: "7", unit: "kN", label: "Altair design thrust" },
  { value: "5", label: "Technical subteams" },
  { value: "CDR", label: "Aquila review in work" },
];

const facts = [
  { label: "Parent organization", value: "Rensselaer Spaceflight Society" },
  { label: "Current program", value: "Project Aquila" },
  { label: "Subteams", value: "5 technical, plus test operations and systems engineering" },
  { label: "Planned launch site", value: "Friends of Amateur Rocketry (FAR), Mojave Desert" },
];

// Update status and dates here as Aquila moves through its gates.
// Purposes, criteria counts and analyses come from the charter's lifecycle table, the SRR, PDR and CDR gate
// criteria sheets and the SRR and PDR review decks. CDR also covers manufacturing readiness (formerly FDR).
const gates: Gate[] = [
  {
    id: "SRR",
    name: "System Requirements Review",
    purpose: "Defined what Aquila will build.",
    date: "Feb 2026",
    status: "complete",
    statusText: "Passed",
    facts: ["34 gate criteria", "60 hazards rated"],
  },
  {
    id: "PDR",
    name: "Preliminary Design Review",
    purpose: "Showed the concept works at 30% design.",
    date: "Spring 2026",
    status: "complete",
    statusText: "Passed",
    facts: ["48 gate criteria", "ICDs baselined"],
  },
  {
    id: "CDR",
    name: "Critical Design Review",
    purpose: "Freezes the design at 90% and clears it for manufacturing.",
    status: "current",
    facts: ["37 gate criteria", "Includes manufacturing readiness"],
  },
  {
    id: "TRR",
    name: "Test Readiness Review",
    purpose: "Safety gate before any high-pressure or cryogenic test.",
    status: "planned",
  },
  {
    id: "FRR",
    name: "Flight Readiness Review",
    purpose: "Final go for launch, based on hot-fire and recovery test data.",
    status: "planned",
  },
  {
    id: "FLIGHT",
    name: "Albatross launch at FAR",
    purpose: "60,000 ft target apogee with dual-deploy recovery.",
    status: "planned",
    milestone: true,
  },
];

const practices = [
  {
    title: "System model",
    description: "We keep Aquila's structure, interfaces, requirements and behavior in one SysML model.",
  },
  {
    title: "Responsible engineers",
    description: "Each major part has one named responsible engineer.",
  },
  {
    title: "Test operations",
    description: "Test Operations writes each procedure and its go/no-go criteria, then runs the test. Any member can call a stop.",
  },
];

const processReadouts = [
  { value: "184", label: "Tracked requirements · Sep 2026" },
  { value: "252", label: "Scheduled tasks · Sep 2026" },
];

const subteamsJson = [
  { title: "Propulsion", lead: "Max Slavik" },
  { title: "Fluids", lead: "Ty Hollis" },
  { title: "Ground Support", lead: "Jasper Heymann" },
  { title: "Airframe & Recovery", lead: "Riley Dunn" },
  { title: "Electronics & Software", lead: "Sydney Howell" },
];

const leadership = [
  { name: "Brian Witanowski", role: "Program Manager" },
  { name: "Max Slavik", role: "Chief Engineer" },
  { name: "Clara Madison", role: "Systems Engineering & Integration" },
  { name: "Roberto Ribay", role: "Test Operations & Validation" },
];

// Lab photos for the reel, shown without captions at their own proportions
const labPhotos: ReelPhoto[] = [
  {
    src: "/rocket/lab/lab_injector_plate.jpg",
    width: 1333,
    height: 2000,
    alt: "Gloved hands holding a drilled injector plate in front of a chalkboard of equations",
  },
  {
    src: "/rocket/lab/lab_stand_wiring_1.jpg",
    width: 2000,
    height: 1500,
    alt: "Two members reach into a metal frame to wire a green relay board while others stand around them",
  },
  {
    src: "/rocket/lab/lab_feed_assembly.jpg",
    width: 1746,
    height: 2000,
    alt: "Two members in the lab. One holds a black tube fitted with a brass valve, pressure gauges, a braided hose and red wires",
  },
  {
    src: "/rocket/st-aero.jpg",
    width: 2000,
    height: 1500,
    alt: "Member in safety glasses cutting metal stock on a horizontal band saw",
  },
  {
    src: "/rocket/lab/lab_reliant_engine.jpg",
    width: 1333,
    height: 2000,
    alt: "The RPU-1 Reliant engine, nozzle end toward the camera, in front of a chalkboard",
  },
  {
    src: "/rocket/lab/lab_stand_wiring_2.jpg",
    width: 2000,
    height: 1500,
    alt: "Three members crouched around a metal frame. One wires a green relay board mounted on its side panel",
  },
  {
    src: "/rocket/rxpi_soldering.jpg",
    width: 1800,
    height: 1792,
    alt: "Member in goggles soldering a small circuit board",
  },
  {
    src: "/rocket/st-sys.jpg",
    width: 2000,
    height: 1500,
    alt: "Two members at a lab bench fitting a cable connector with a small screwdriver, next to a relay circuit board and a spool of solder",
  },
  {
    src: "/rocket/st-fluid.jpg",
    width: 2000,
    height: 1500,
    alt: "Member sorting brass and steel fittings for a propellant tank assembly",
  },
];

// Hero background: a launch played by scrolling. The engine lights with a glow and a rumble, smoke rolls
// off the pad, then Albatross climbs away faster and faster on its flame and exhaust column while a
// readout counts up to the target apogee and the Altair drawing behind tilts away.
function HeroLaunch() {
  const artScale = useSceneValue([0, 1], [1, 1.2], 1);
  const artRotate = useSceneValue([0, 1], [0, -8], 0);
  const artY = useSceneValue([0.15, 1], ["0%", "8%"], "0%");
  // Held down while it lights, then an accelerating climb out of frame
  const rocketY = useSceneValue(
    [0, 0.12, 0.2, 0.35, 0.5, 0.65, 0.8, 1],
    ["0%", "0%", "-2%", "-10%", "-24%", "-44%", "-70%", "-125%"],
    "0%"
  );
  const flame = useSceneValue([0, 0.05, 0.14, 0.6, 1], [0, 0.7, 1, 1.5, 1.8], 0);
  const column = useSceneValue([0.1, 0.25, 1], [0, 1, 1], 0);
  const glow = useSceneValue([0, 0.07, 0.35, 0.85], [0, 1, 0.75, 0], 0);
  const shake = useSceneValue([0.01, 0.08, 0.3, 0.5], [0, 3, 1.5, 0], 0);
  const hud = useSceneValue([0, 0.04, 0.9, 1.05], [0, 1, 1, 0], 0);
  const phase = useSceneValue<string>([0, 0.06, 0.14, 0.97], ["Ignition", "Ignition", "Liftoff", "Ascent"], "Ignition");
  const altitude = useSceneValue<number>([0, 0.12, 0.3, 0.5, 0.7, 0.85, 1], [0, 0, 1800, 8400, 21000, 36000, 60000], 0);

  return (
    <>
      <div className="absolute inset-x-0 bottom-0 top-[var(--rx-bars)]">
        <div className="rx-container flex h-full items-center justify-end">
          <motion.div
            style={{ scale: artScale, rotate: artRotate, y: artY }}
            className="mr-[8%] w-[min(40rem,70vw)] md:mr-[14%] md:w-[min(40rem,46vw)] 3xl:w-[651px] short:hidden"
          >
            <Image
              src="/rocket/aquila/altair_lineart_white.png"
              alt=""
              width={651}
              height={830}
              priority
              className="h-auto max-h-full w-full object-contain opacity-[0.12] md:opacity-[0.2]"
            />
          </motion.div>
        </div>
      </div>
      <motion.div
        style={{ "--rx-shake": shake } as unknown as React.ComponentProps<typeof motion.div>["style"]}
        className="absolute inset-x-0 bottom-[clamp(5rem,12svh,9rem)] top-[calc(var(--rx-bars)+2rem)] hidden animate-rx-shake sm:block short:hidden"
      >
        <div className="rx-container flex h-full justify-end">
          <div className="relative h-full">
            {/* Light from the engine on everything around the pad */}
            <motion.div
              style={{ opacity: glow }}
              className="pointer-events-none absolute bottom-0 left-1/2 h-[90svh] w-[90svh] -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,150,70,0.4),rgba(214,0,28,0.22)_32%,transparent_66%)]"
            />
            {Array.from({ length: 7 }, (_, i) => (
              <PadSmoke key={i} index={i} />
            ))}
            {/* Launch rail */}
            <div className="absolute bottom-0 right-[calc(100%+0.75rem)] h-[38%] w-px bg-rxpi-night-fg/25">
              <div className="absolute inset-y-0 left-0 w-2 bg-[repeating-linear-gradient(to_bottom,rgba(242,239,233,0.3)_0_1px,transparent_1px_18px)]" />
            </div>
            <motion.div style={{ y: rocketY }} className="relative h-full">
              <Image src="/rocket/aquila/albatross_vertical.png" alt="" width={146} height={1864} priority className="relative z-10 h-full w-auto" />
              {/* Exhaust column: it widens and cools to smoke as it trails away */}
              <motion.div
                style={{ opacity: column }}
                className="absolute left-1/2 top-[99%] h-[160svh] w-[min(18vw,16rem)] -translate-x-1/2 bg-[linear-gradient(to_bottom,rgba(255,170,110,0.55),rgba(214,0,28,0.3)_12%,rgba(170,160,150,0.2)_40%,rgba(120,115,110,0.1)_75%,transparent)] blur-md [clip-path:polygon(46%_0,54%_0,100%_100%,0_100%)]"
              />
              {/* Flame: a white core through gold to red, flickering */}
              <motion.div style={{ scaleY: flame, opacity: flame }} className="absolute left-1/2 top-[98%] w-[340%] -translate-x-1/2 origin-top">
                <div className="absolute inset-x-[-40%] top-0 h-[30svh] bg-[radial-gradient(ellipse_50%_100%_at_50%_0%,rgba(255,170,90,0.5),rgba(214,0,28,0.22)_45%,transparent_75%)] blur-xl" />
                <div className="relative h-[24svh] w-full animate-rx-flicker bg-[radial-gradient(ellipse_32%_100%_at_50%_0%,rgba(255,150,70,0.95),rgba(230,40,30,0.7)_45%,rgba(214,0,28,0.25)_70%,transparent_85%)] blur-[3px]" />
                <div className="absolute left-1/2 top-0 h-[15svh] w-[38%] -translate-x-1/2 animate-rx-flicker bg-[radial-gradient(ellipse_50%_100%_at_50%_0%,#fff,#fff3cf_30%,rgba(255,190,110,0.7)_60%,transparent_85%)] blur-[1px]" />
              </motion.div>
            </motion.div>
            {/* Flight readout */}
            <motion.div
              style={{ opacity: hud }}
              className="absolute bottom-[6%] right-[calc(100%+2.5rem)] z-20 w-60 border-l-2 border-rxpi-red bg-rxpi-night/80 py-3 pl-4 pr-3 font-plex-mono uppercase text-rxpi-night-fg backdrop-blur-sm max-lg:hidden"
              aria-hidden
            >
              <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-rxpi-night-muted">
                <span className="h-2 w-2 flex-none bg-rxpi-red motion-safe:animate-pulse" />
                FV01 Albatross
              </p>
              <p className="mt-3 text-[2rem] font-semibold leading-none tracking-[-0.02em] tabular-nums">
                <AltitudeText value={altitude} />
                <span className="ml-1.5 text-sm font-medium text-rxpi-night-muted">ft</span>
              </p>
              <p className="mt-2 text-xs font-semibold tracking-[0.14em] text-rxpi-red-bright">
                <motion.span>{phase}</motion.span>
              </p>
              <p className="mt-3 border-t border-rxpi-night-line pt-2 text-[11.5px] tracking-[0.12em] text-rxpi-night-muted">Target apogee 60,000 ft</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 top-[var(--rx-bars)]">
        <div className="rx-container relative h-full">
          <RxpiCrosshairs />
        </div>
      </div>
    </>
  );
}

// Altitude with thousands separators, rounded to the nearest 100 ft
function AltitudeText({ value }: { value: MotionValue<number> }) {
  const text = useTransform(value, (v) => (Math.round(v / 100) * 100).toLocaleString("en-US"));
  return <motion.span>{text}</motion.span>;
}

// One cloud of pad smoke: it rolls outward along the ground and rises while the engine runs
function PadSmoke({ index }: { index: number }) {
  const side = index % 2 === 0 ? -1 : 1;
  const reach = 40 + index * 38;
  const x = useSceneValue([0.02, 0.7], [0, side * reach], 0);
  const y = useSceneValue([0.02, 0.7], [0, -(30 + index * 22)], 0);
  const scale = useSceneValue([0.02, 0.18, 0.7], [0.3, 1.3 + index * 0.15, 2.2 + index * 0.3], 0.3);
  const opacity = useSceneValue([0.02, 0.1, 0.6, 1], [0, 1, 0.8, 0], 0);
  return (
    <motion.div
      style={{ x, y, scale, opacity }}
      className="pointer-events-none absolute bottom-[-1rem] left-1/2 -ml-24 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(240,234,226,0.7),rgba(180,170,160,0.35)_42%,transparent_70%)] blur-md"
    />
  );
}

// The exploded Altair render swings into its final angle as the Aquila scene arrives.
function AquilaRender() {
  const scale = useSceneValue([-0.35, 0.45], [0.86, 1]);
  const rotate = useSceneValue([-0.35, 0.45], [-8, 0]);

  return (
    <motion.div
      style={{ scale, rotate }}
      className="relative mx-auto aspect-[877/755] w-full max-w-[min(100%,calc((100svh-14rem)*877/755))] short:max-w-[22rem]"
    >
      <Image
        src="/rocket/aquila/altair_exploded.png"
        alt="Exploded render of the RPU-2 Altair engine: injector manifold, copper pintle injector and printed combustion chamber"
        fill
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="object-contain"
      />
    </motion.div>
  );
}

// The lab photo behind the Join band settles from a slight zoom as the band scrolls in.
function JoinBackdrop() {
  const scale = useSceneValue([-1, 0.4], [1.18, 1]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image src="/rocket/rxpi_lab_electronics.jpg" alt="" fill sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(12,11,10,0.92)_0%,rgba(12,11,10,0.75)_45%,rgba(12,11,10,0.35)_100%)] max-md:bg-none max-md:bg-rxpi-night-sunken/80" />
    </div>
  );
}

export default function Rocket() {
  return (
    <div className="relative min-w-full">
      <RxpiSubnav />

      <main id="main">
        <RxpiHero
          size="full"
          length={1.2}
          logoIsHeading
          logo={
            <Image
              src="/logos/rxpi_lockup_white.png"
              alt="RPI Experimental Propulsion Initiative (RXPI)"
              width={1600}
              height={440}
              priority
              className="h-[min(clamp(4.5rem,7.5vw,8.5rem),11svh)] w-auto short:h-10"
            />
          }
          title="Aim higher."
          titleClassName="font-plex-mono text-rx-display font-medium uppercase italic tracking-[-0.04em] short:text-[2.75rem]"
          description="We are RPI's student liquid-rocketry team. We built the RPU-1 Reliant engine and are designing Project Aquila: the Altair engine and the Albatross flight vehicle."
          background={<HeroLaunch />}
          footer={
            <div className="rx-container">
              <RxpiReadouts items={heroReadouts} tone="dark" />
            </div>
          }
        >
          <RxpiButton href="/rocket/aquila" tone="dark" icon={ArrowRight} block>
            See Project Aquila
          </RxpiButton>
          <RxpiButton href="#join" variant="secondary" tone="dark" block>
            Join RXPI
          </RxpiButton>
        </RxpiHero>

        <RxpiScene id="about" length={1} until={0.6} transition="plotter" className="bg-rxpi-paper">
          <div className="rx-container">
            <h2 className="sr-only">About RXPI</h2>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16">
              <div>
                <RxpiSceneItem at={-0.55} from="fade">
                  <p className="flex items-center gap-3 font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] text-rxpi-muted sm:text-[13px]">
                    <span className="h-2 w-2 flex-none bg-rxpi-red" aria-hidden />
                    <span className="flex-none">01 · About</span>
                    <span className="h-px flex-1 bg-rxpi-ink/15" aria-hidden />
                  </p>
                </RxpiSceneItem>
                <RxpiSceneText
                  className="mt-6 max-w-[30ch] text-balance text-rx-statement font-medium tracking-[-0.015em] text-rxpi-ink snug:mt-4 compact:mt-4 compact:max-w-[36ch] compact:text-[length:min(var(--text-rx-statement),5svh)]"
                  dim="rgba(22,19,15,0.5)"
                  ink="#16130f"
                  start={-0.4}
                  end={0.3}
                  text="We started RXPI to build a student-designed liquid rocket engine at RPI. We finished cold-flow testing on RPU-1 Reliant in fall 2025 and took it to a field site for its first hot-fire attempt in spring 2026."
                />
                <RxpiSceneItem at={0.32}>
                  <p className="mt-6 max-w-[42rem] text-pretty text-rx-lead text-rxpi-muted snug:mt-4 compact:mt-4">
                    Each active member is responsible for the design and testing of a flight or ground-support component. Our
                    current program is Project Aquila: the Altair engine and Albatross, our first liquid-propellant flight
                    vehicle. The program is in Critical Design Review.
                  </p>
                </RxpiSceneItem>
              </div>
              <RxpiSceneItem
                as="figure"
                at={-0.25}
                from="wipe"
                className="mx-auto w-full max-w-[min(50rem,calc((100svh-10rem)*4/3))] lg:mx-0 lg:compact:max-w-[calc((100svh-18rem)*4/3)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden border border-rxpi-line bg-rxpi-sunken">
                  <Image
                    src="/rocket/rxpi_team.jpg"
                    alt="RXPI members in lab coats with the RPU-1 Reliant test stand"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 font-plex-mono text-[11.5px] uppercase tracking-[0.12em] text-rxpi-muted sm:text-xs">
                  RXPI members with the RPU-1 Reliant test stand
                </figcaption>
              </RxpiSceneItem>
            </div>

            <dl className="mt-10 grid gap-px border-y border-rxpi-ink bg-rxpi-line sm:grid-cols-2 xl:grid-cols-4 snug:mt-7 compact:mt-6">
              {facts.map((fact, i) => (
                <div key={fact.label} className="bg-rxpi-paper py-5 sm:px-6 sm:max-xl:odd:pl-0 xl:first:pl-0">
                  <RxpiSceneItem as="dt" at={0.42 + i * 0.06} from="fade" className="font-plex-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-rxpi-muted sm:text-xs">
                    {fact.label}
                  </RxpiSceneItem>
                  <RxpiSceneItem as="dd" at={0.42 + i * 0.06} from="fall" className="mt-2 text-rx-body font-medium text-rxpi-ink">
                    {fact.value}
                  </RxpiSceneItem>
                </div>
              ))}
            </dl>
          </div>
        </RxpiScene>

        <RxpiScene id="aquila" length={0.7} until={0.52} padded={false} transition="aperture" label="Project Aquila" className="bg-rxpi-night text-rxpi-night-fg" decor={<RxpiCrosshairs />}>
          <div className="grid items-center lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:rx-pad-start">
            <div className="rx-container order-2 pb-[clamp(3.5rem,8vw,6rem)] pt-4 lg:order-1 lg:mx-0 lg:max-w-none lg:px-0 lg:py-12 lg:pr-4">
              <RxpiSceneItem at={-0.5} from="left">
                <p className="font-plex-mono text-xs font-semibold uppercase tracking-[0.3em] text-rxpi-red-bright sm:text-[13px]">Project Aquila</p>
              </RxpiSceneItem>
              <RxpiSceneItem at={-0.4}>
                <h2 className="mt-5 text-balance text-rx-h2 font-semibold tracking-[-0.02em]">RPU-2 Altair and FV01 Albatross</h2>
              </RxpiSceneItem>
              <RxpiSceneItem at={-0.25}>
                <p className="mt-5 max-w-[36rem] text-pretty text-rx-lead text-rxpi-night-muted">
                  Altair burns nitrous oxide and ethanol in a DMLS-printed aluminum combustion chamber cooled by the ethanol.
                  Albatross is the flight vehicle we are designing around it, with a 60,000 ft AGL target apogee.
                </p>
              </RxpiSceneItem>
              <RxpiSceneItem at={0.3} from="pop" className="mt-6 w-fit">
                <p className="inline-flex items-center gap-2 border border-rxpi-night-fg/40 px-2.5 py-1.5 font-plex-mono text-[11.5px] uppercase tracking-[0.12em]">
                  <span className="h-2 w-2 bg-rxpi-red" aria-hidden />
                  SRR passed · PDR passed · CDR in work
                </p>
              </RxpiSceneItem>
              <RxpiSceneItem at={0.4} className="mt-8">
                <RxpiButton href="/rocket/aquila" variant="secondary" tone="dark" icon={ArrowRight}>
                  See Project Aquila
                </RxpiButton>
              </RxpiSceneItem>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="relative mx-auto w-full max-w-[60rem] px-[var(--rx-gutter)] pb-6 pt-14 lg:px-12 lg:py-14">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_50%_78%,rgba(255,255,255,0.08),transparent_70%)]" aria-hidden />
                <AquilaRender />
                <RxpiSceneItem at={0.52} from="fall" className="relative mt-4 hidden sm:block lg:absolute lg:bottom-8 lg:right-8 lg:mt-0">
                  <RxpiTitleBlock
                    rows={[
                      ["Article", "RPU-2 Altair"],
                      ["View", "Exploded render"],
                    ]}
                  />
                </RxpiSceneItem>
              </div>
            </div>
          </div>
        </RxpiScene>

        <RxpiScene id="reliant" length={0.8} until={0.38} transition="columns" label="RPU-1 Reliant" className="bg-rxpi-paper">
          <div className="rx-container grid items-center gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
            <RxpiSceneItem
              as="figure"
              at={-0.45}
              from="wipe"
              className="mx-auto w-full max-w-[min(50rem,calc((100svh-10rem)*4/3))] lg:mx-0"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-rxpi-line bg-rxpi-sunken">
                <Image
                  src="/rocket/reliant/reliant_hotfire_1.jpg"
                  alt="RPU-1 Reliant strapped down on its test stand in a grass field"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 font-plex-mono text-[11.5px] uppercase tracking-[0.12em] text-rxpi-muted sm:text-xs">
                RPU-1 Reliant at the field site · spring 2026
              </figcaption>
            </RxpiSceneItem>

            <div>
              <RxpiSceneItem at={-0.35} from="right">
                <p className="font-plex-mono text-xs font-semibold uppercase tracking-[0.3em] text-rxpi-red sm:text-[13px]">RPU-1 Reliant</p>
              </RxpiSceneItem>
              <RxpiSceneItem at={-0.25}>
                <h2 className="mt-5 text-balance text-rx-h2 font-semibold tracking-[-0.02em] text-rxpi-ink">Our first liquid rocket engine</h2>
              </RxpiSceneItem>
              <RxpiSceneItem at={-0.1}>
                <p className="mt-5 text-pretty text-rx-lead text-rxpi-muted">
                  Reliant is designed for a 300 psi chamber pressure. It burns kerosene and self-pressurizing nitrous oxide, with
                  a graphite nozzle in a stainless steel casing.
                </p>
              </RxpiSceneItem>
              <RxpiSceneItem at={0.1} from="fade">
                <p className="mt-6 font-plex-mono text-xs uppercase tracking-[0.12em] text-rxpi-ink">10 sensors · 500+ ft operator standoff</p>
              </RxpiSceneItem>
              <div className="mt-4 flex flex-wrap gap-2 font-plex-mono text-[11.5px] uppercase tracking-[0.12em] text-rxpi-ink">
                <RxpiSceneItem as="span" at={0.2} from="pop" className="inline-flex items-center gap-2 border border-rxpi-ink/40 px-2.5 py-1.5">
                  <span className="h-2 w-2 bg-rxpi-green" aria-hidden />
                  Cold flow · fall 2025
                </RxpiSceneItem>
                <RxpiSceneItem as="span" at={0.28} from="pop" className="inline-flex items-center gap-2 border border-rxpi-ink/40 px-2.5 py-1.5">
                  <span className="h-2 w-2 bg-rxpi-ink" aria-hidden />
                  Hot-fire attempt · spring 2026
                </RxpiSceneItem>
              </div>
              <RxpiSceneItem at={0.38} className="mt-8">
                <RxpiButton href="/rocket/reliant" variant="secondary" icon={ArrowRight}>
                  See Reliant test history
                </RxpiButton>
              </RxpiSceneItem>
            </div>
          </div>
        </RxpiScene>

        <RxpiScene id="process" length={0.6} until={0.05} className="bg-rxpi-night text-rxpi-night-fg">
          <div className="rx-container grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-end lg:gap-16">
            <RxpiSectionHeader
              tone="dark"
              sceneAt={-0.5}
              label="02 · How we work"
              title="Review gates and requirements"
              description="We run Project Aquila on a lifecycle adapted from NASA's systems engineering standard, NPR 7123.1."
            />
            <figure className="mx-auto w-full max-w-[min(100%,calc((100svh-12rem)*4/3))] lg:mx-0">
              <RxpiSceneItem at={-0.15} from="wipe" className="relative aspect-[4/3] w-full overflow-hidden border border-rxpi-night-line bg-rxpi-night-raised">
                <Image
                  src="/rocket/rpu-safety.jpg"
                  alt="Member at a Rensselaer lectern presenting a Safety & Testing slide that maps RPU-1 and RPU-2 documentation"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </RxpiSceneItem>
              {/* The caption lands once the stage holds */}
              <RxpiSceneItem as="figcaption" at={0.05} from="fade" className="mt-3 font-plex-mono text-[11.5px] uppercase tracking-[0.12em] text-rxpi-night-muted sm:text-xs">
                Safety and testing presentation
              </RxpiSceneItem>
            </figure>
          </div>
        </RxpiScene>

        <RxpiScene length={1} until={0.5} transition="shutter" label="Review gates" className="bg-rxpi-night text-rxpi-night-fg" decor={<RxpiCrosshairs />}>
          <div className="rx-container">
            <RxpiSceneItem at={-0.5} from="left">
              <p className="font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] text-rxpi-night-muted sm:text-[13px]">
                Project Aquila
              </p>
            </RxpiSceneItem>
            <RxpiSceneItem at={-0.4}>
              <h2 className="mt-3 text-rx-h2 font-semibold tracking-[-0.02em]">Review gates</h2>
            </RxpiSceneItem>
            <RxpiSceneItem at={-0.3} from="fade">
              <p className="mt-4 max-w-[46rem] text-pretty text-rx-body text-rxpi-night-muted">
                Each review has written entrance and exit criteria. Closing them opens the next phase of work.
              </p>
            </RxpiSceneItem>
            <div className="mt-8 border-t-2 border-rxpi-night-fg pt-12 compact:mt-5 compact:pt-8">
              <RxpiGateTimeline gates={gates} tone="dark" sceneRange={[-0.25, 0.45]} />
            </div>
          </div>
        </RxpiScene>

        <RxpiScene length={0.8} until={0.45} transition="plotter" label="How we run Project Aquila" className="bg-rxpi-night text-rxpi-night-fg">
          <div className="rx-container">
            <RxpiSceneItem at={-0.5} from="fade">
              <p className="font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] text-rxpi-night-muted sm:text-[13px]">
                How we run Project Aquila
              </p>
            </RxpiSceneItem>

            <div className="mt-8 grid gap-px border-y border-rxpi-night-line bg-rxpi-night-line md:grid-cols-3">
              {practices.map((practice, i) => (
                <div key={practice.title} className="bg-rxpi-night py-8 md:px-8 md:first:pl-0">
                  <RxpiSceneItem at={-0.3 + i * 0.1} from="fall">
                    <h3 className="text-rx-h3 font-semibold tracking-[-0.01em] text-rxpi-night-fg">{practice.title}</h3>
                    <p className="mt-3 text-pretty text-rx-body text-rxpi-night-muted">{practice.description}</p>
                  </RxpiSceneItem>
                </div>
              ))}
            </div>

            <div className="mt-12 compact:mt-6">
              <RxpiReadouts items={processReadouts} tone="dark" sceneAt={0.2} />
            </div>
          </div>
        </RxpiScene>

        <RxpiScene id="team" length={1} until={0.63} className="bg-rxpi-paper">
          <div className="rx-container">
            <RxpiSectionHeader
              sceneAt={-0.5}
              label="03 · Team"
              title="Subteams and leads"
              description="Five technical subteams design and build the hardware. Test Operations runs hazardous tests, and Systems Engineering maintains the SysML model."
            />

            <div className="mt-12 grid grid-cols-2 gap-2 sm:mt-14 sm:gap-3 lg:grid-cols-5 compact:mt-10">
              {subteamsJson.map((subteam, i) => (
                <RxpiSceneItem
                  key={subteam.title}
                  at={-0.1 + i * 0.08}
                  from="fall"
                  className="flex flex-col border border-rxpi-line bg-rxpi-raised max-lg:last:col-span-2"
                >
                  <h3 className="bg-rxpi-red px-3 py-3 font-plex-mono text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white sm:px-4 sm:text-[13px] sm:tracking-[0.14em]">
                    {subteam.title}
                  </h3>
                  <div className="flex flex-1 flex-col p-3 sm:p-4">
                    <p className="font-plex-mono text-[11.5px] uppercase tracking-[0.12em] text-rxpi-muted">Lead</p>
                    <p className="mt-1 text-sm font-medium text-rxpi-ink sm:text-base">{subteam.lead}</p>
                  </div>
                </RxpiSceneItem>
              ))}
            </div>

            <div className="mt-14 compact:mt-10">
              <RxpiSceneItem at={0.4} from="fade">
                <p className="font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] text-rxpi-muted sm:text-[13px]">Program leadership</p>
              </RxpiSceneItem>
              <dl className="mt-4 grid gap-px border-y border-rxpi-ink bg-rxpi-line sm:grid-cols-2 lg:grid-cols-4">
                {leadership.map((person, i) => (
                  <div key={person.name} className="flex flex-col-reverse justify-end bg-rxpi-paper py-4 sm:px-5 sm:max-lg:odd:pl-0 lg:first:pl-0">
                    <RxpiSceneItem as="dt" at={0.45 + i * 0.06} from="fade" className="mt-1 font-plex-mono text-[11.5px] uppercase tracking-[0.12em] text-rxpi-muted sm:text-xs">
                      {person.role}
                    </RxpiSceneItem>
                    <RxpiSceneItem as="dd" at={0.45 + i * 0.06} className="font-medium text-rxpi-ink">
                      {person.name}
                    </RxpiSceneItem>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </RxpiScene>

        {/* The stage holds while scrolling slides the row of lab photos across it */}
        <RxpiScene length={3} transition="columns" label="In the lab" className="bg-rxpi-paper">
          <RxpiReel label="In the lab" photos={labPhotos} />
        </RxpiScene>

        <RxpiScene id="join" length={0.6} until={0.4} className="isolate bg-rxpi-night text-rxpi-night-fg" decor={<JoinBackdrop />}>
          <div className="rx-container flex min-h-[clamp(14rem,40svh,28rem)] flex-col justify-center">
            <RxpiSceneItem at={-0.45} from="left">
              <p className="flex items-center gap-3 font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] text-rxpi-night-fg sm:text-[13px]">
                <span className="h-2 w-2 flex-none bg-rxpi-red" aria-hidden />
                04 · Join
              </p>
            </RxpiSceneItem>
            <RxpiSceneItem at={-0.35}>
              <h2 className="mt-5 text-rx-h2 font-semibold tracking-[-0.02em]">Join RXPI</h2>
            </RxpiSceneItem>
            <RxpiSceneItem at={-0.2}>
              <p className="mt-5 max-w-[34rem] text-pretty text-rx-lead text-rxpi-night-fg/90">
                RXPI is open to RPI students. We meet Sundays from 2:00 to 4:00 pm in Ricketts 207, and new members join one of
                the five subteams.
              </p>
            </RxpiSceneItem>
            <RxpiSceneItem at={0.05} className="mt-8 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap">
              <RxpiButton href="https://discord.gg/Y8uVhAqGsQ" tone="dark" icon={ExternalLink} external block>
                Join the Spaceflight Society Discord
              </RxpiButton>
              <RxpiButton href="mailto:rpi.spaceflight@gmail.com?subject=Joining%20RXPI" variant="secondary" tone="dark" icon={Mail} block>
                Email the team
              </RxpiButton>
            </RxpiSceneItem>
          </div>
        </RxpiScene>

        <RxpiSponsorCta />
      </main>

      <RxpiFooter showTagline={false} />
    </div>
  );
}
