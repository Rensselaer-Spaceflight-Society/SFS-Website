'use client'
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import RxpiHero from "../../components/RxpiHero";
import RxpiSubnav from "../../components/RxpiSubnav";
import RxpiButton from "../../components/RxpiButton";
import RxpiScene, { useSceneValue } from "../../components/RxpiScene";
import RxpiSceneItem from "../../components/RxpiSceneItem";
import RxpiReadouts from "../../components/RxpiReadouts";
import RxpiSectionHeader from "../../components/RxpiSectionHeader";
import RxpiSpecTable from "../../components/RxpiSpecTable";
import RxpiCallouts from "../../components/RxpiCallouts";
import RxpiCrosshairs from "../../components/RxpiCrosshairs";
import RxpiTitleBlock from "../../components/RxpiTitleBlock";
import RxpiVideo from "../../components/RxpiVideo";
import RxpiGallery from "../../components/RxpiGallery";
import RxpiDocument from "../../components/RxpiDocument";
import RxpiFooter from "../../components/RxpiFooter";

const heroReadouts = [
  { value: "300", unit: "psi", label: "Design chamber pressure" },
  { value: "10", label: "Sensors" },
  { value: "500+", unit: "ft", label: "Operator standoff" },
];

const testLog = [
  { date: "Jan 2025", event: "Design report first drafted", result: "Complete" },
  { date: "2025", event: "Engine and test stand built", result: "Complete" },
  { date: "Fall 2025", event: "Cold-flow campaign", result: "Complete" },
  { date: "Spring 2026", event: "First hot-fire attempt, field site", result: "Attempted" },
];

// The cold-flow video lives in public/rocket/reliant/ (or set embedUrl to a YouTube or Google Drive embed link
// instead); set both to null to hide its section.
const coldFlowVideo = {
  title: "RPU-1 Reliant cold-flow test 3",
  meta: "Fall 2025",
  src: "/rocket/reliant/rpu1_cold_flow_test3.mp4" as string | null,
  embedUrl: null as string | null,
  poster: "/rocket/reliant/rpu1_cold_flow_test3_poster.jpg",
};

const hotFirePhotos = [
  {
    src: "/rocket/reliant/reliant_hotfire_team.jpg",
    alt: "Thirteen RXPI members standing in a grass field behind the Reliant test stand, a gas cylinder and a white tank frame",
    meta: "Field site · Spring\u00a02026",
    caption: "The team at the field site with the Reliant test stand.",
  },
  {
    src: "/rocket/reliant/reliant_hotfire_crew.jpg",
    alt: "Three RXPI members at the Reliant test stand in the field, with the SendCutSend logo on its blast shield",
    meta: "Field site · Spring\u00a02026",
    caption: "RXPI members at the stand on test day.",
    position: "center 4%",
  },
  {
    src: "/rocket/reliant/reliant_hotfire_1.jpg",
    alt: "RPU-1 Reliant strapped down on its test stand in a grass field",
    meta: "Field site · Spring\u00a02026",
    caption: "Reliant strapped down on its test stand, with the nitrous oxide and nitrogen bottles behind the blast shield.",
  },
  {
    src: "/rocket/reliant/reliant_hotfire_2.jpg",
    alt: "Three RXPI members in face shields and goggles preparing the Reliant test stand in a field",
    meta: "Field site · Spring\u00a02026",
    caption: "RXPI members in face shields and goggles set up the stand before the hot-fire attempt.",
  },
];

const engineCallouts = [
  { title: "Graphite nozzle", detail: "Heat sink, RTV-insulated", x: 50, y: 50, labelX: 30, labelY: 58, side: "left" as const },
  { title: "Injector", detail: "Unlike impinging doublet", x: 40.5, y: 19, labelX: 30, labelY: 12, side: "left" as const },
  { title: "Manifold", detail: "Aluminum 6061", x: 70, y: 25.5, labelX: 78, labelY: 38, side: "right" as const },
];

const reliantSpecs = [
  { label: "Propellants", value: "Liquid kerosene / self-pressurizing nitrous oxide" },
  { label: "Design chamber pressure", value: "300 psi", alt: "20.7 bar" },
  { label: "Nozzle", value: "Graphite heat-sink nozzle, RTV silicone insulation" },
  { label: "Injector", value: "Unlike impinging doublet" },
  { label: "Oxidizer valve", value: "Servo-actuated ball valve" },
  { label: "Shutdown", value: "Nitrogen purge of both propellant lines" },
  { label: "Instrumentation", value: "Load cell, 4 thermocouples, 5 pressure transducers" },
  { label: "Control", value: "Custom engine-computer PCB, RS485 link to a Qt/C++ ground station" },
];

const designPhotos = [
  {
    src: "/rocket/manifold.png",
    alt: "Engineering drawing of the RPU-1 manifold",
    meta: "Drawing",
    caption: "RPU-1 manifold, aluminum 6061",
    fit: "contain" as const,
  },
  {
    src: "/rocket/rocket_pcb.webp",
    alt: "Render of the RPU-1 engine-computer printed circuit board",
    meta: "Electronics",
    caption: "Engine-computer PCB, designed in KiCad",
  },
  {
    src: "/rocket/stand_2.png",
    alt: "CAD render of an early RPU-1 test stand concept with the engine in a box frame beside a gas cylinder",
    meta: "Ground support",
    caption: "Early test stand concept, CAD render",
    fit: "contain" as const,
  },
  {
    src: "/rocket/rocket_fea.webp",
    alt: "Thermal simulation of the RPU-1 inner combustion chamber",
    meta: "Analysis",
    caption: "Inner chamber temperature at 10 s, thermal FEA (°F)",
    fit: "contain" as const,
  },
  {
    src: "/rocket/rocket_pipe_fea.webp",
    alt: "Structural simulation of a stainless steel threaded pipe fitting",
    meta: "Analysis",
    caption: "Von Mises stress in a 304 stainless threaded pipe fitting, static FEA",
    fit: "contain" as const,
  },
];

// The Altair line drawing plots from top to bottom as the Up next band holds, a red plotter line leading the way.
function AltairDrawing() {
  const clipPath = useSceneValue([-0.1, 0.45], ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"]);
  const lineTop = useSceneValue([-0.1, 0.45], ["0%", "100%"]);
  const lineOpacity = useSceneValue([-0.15, -0.1, 0.4, 0.45], [0, 1, 1, 0], 0);

  return (
    <div className="relative aspect-[651/830] w-full">
      <motion.div style={{ clipPath }} className="absolute inset-0">
        <Image
          src="/rocket/aquila/altair_lineart_white.png"
          alt="Line drawing of the RPU-2 Altair thrust chamber assembly"
          fill
          sizes="22rem"
          className="object-contain invert"
        />
      </motion.div>
      <motion.span style={{ top: lineTop, opacity: lineOpacity }} className="absolute inset-x-0 h-px bg-rxpi-red" aria-hidden />
    </div>
  );
}

export default function Reliant() {
  const hasVideo = Boolean(coldFlowVideo.src || coldFlowVideo.embedUrl);

  return (
    <div className="relative min-w-full">
      <RxpiSubnav />

      <main id="main">
        <RxpiHero
          length={0.7}
          kicker="RXPI · RPU-1"
          title="RPU-1 Reliant"
          description="Rensselaer Propulsion Unit One (RPU-1) is RPI's first liquid bipropellant rocket engine, a kerosene and nitrous oxide technology demonstrator designed by undergraduates."
          image={{
            src: "/rocket/reliant/reliant_hotfire_2.jpg",
            alt: "Three RXPI members preparing the Reliant test stand in a field",
            position: "50% 60%",
          }}
          footer={
            <div className="rx-container">
              <RxpiReadouts items={heroReadouts} tone="dark" />
            </div>
          }
        >
          <RxpiButton href="#history" tone="dark" icon={ArrowDown} block>
            Read the test history
          </RxpiButton>
          <RxpiButton href="#design-report" variant="secondary" tone="dark" block>
            Design report
          </RxpiButton>
        </RxpiHero>

        <RxpiScene id="history" length={0.8} until={0.36} className="bg-rxpi-paper">
          <div className="rx-container">
            <RxpiSectionHeader
              sceneAt={-0.5}
              label="01 · Test history"
              title="Reliant test history"
              description="We first drafted the Reliant design report in January 2025, then built the engine and its test stand. We completed cold-flow testing in fall 2025 and took Reliant to a field site for its first hot-fire attempt in spring 2026. Our engineering work has since moved to Project Aquila."
            />
            {/* Stamped once the log below has filled in */}
            <RxpiSceneItem at={0.36} from="fade">
              <p className="mt-5 font-plex-mono text-[11.5px] uppercase tracking-[0.12em] text-rxpi-muted sm:text-xs">Last updated Sep 2026</p>
            </RxpiSceneItem>

            <table className="mt-12 w-full border-collapse text-left compact:mt-6">
              <caption className="sr-only">RPU-1 Reliant test history</caption>
              <thead>
                <RxpiSceneItem
                  as="tr"
                  at={-0.25}
                  from="fade"
                  className="border-y border-rxpi-ink font-plex-mono text-[11.5px] uppercase tracking-[0.12em] text-rxpi-muted sm:text-xs"
                >
                  <th scope="col" className="w-[26%] py-3 pr-4 font-medium sm:w-48">Date</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Event</th>
                  <th scope="col" className="w-24 py-3 text-right font-medium sm:w-28">Result</th>
                </RxpiSceneItem>
              </thead>
              <tbody>
                {/* Each entry is logged in turn, then its result is stamped */}
                {testLog.map((row, i) => (
                  <RxpiSceneItem as="tr" key={row.event} at={-0.12 + i * 0.1} from="left" className="border-b border-rxpi-line">
                    <td className="py-4 pr-4 align-top font-plex-mono text-sm text-rxpi-muted compact:py-3">{row.date}</td>
                    <td className="py-4 pr-4 align-top font-medium text-rxpi-ink compact:py-3">{row.event}</td>
                    <td className="py-4 text-right align-top compact:py-3">
                      <RxpiSceneItem
                        as="span"
                        at={-0.06 + i * 0.1}
                        from="pop"
                        className={`inline-flex items-center gap-2 font-plex-mono text-[11.5px] uppercase tracking-[0.12em] sm:text-xs ${
                          row.result === "Complete" ? "text-rxpi-green" : "text-rxpi-ink"
                        }`}
                      >
                        <span className={`h-2 w-2 ${row.result === "Complete" ? "bg-rxpi-green" : "bg-rxpi-ink"}`} aria-hidden />
                        {row.result}
                      </RxpiSceneItem>
                    </td>
                  </RxpiSceneItem>
                ))}
              </tbody>
            </table>
          </div>
        </RxpiScene>

        {hasVideo && (
          <RxpiScene id="cold-flow" length={0.6} until={0} className="bg-rxpi-night text-rxpi-night-fg" decor={<RxpiCrosshairs />}>
            <div className="rx-container grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-12">
              <RxpiSectionHeader
                tone="dark"
                sceneAt={-0.5}
                label="02 · Cold flow"
                title="Cold-flow campaign"
                description="In a cold flow we run fluid through the feed system and injector without ignition to check valve sequencing and flow rate. We finished Reliant's cold-flow campaign in fall 2025."
              />
              <RxpiSceneItem at={-0.2} from="wipe">
                <RxpiVideo
                  title={coldFlowVideo.title}
                  meta={coldFlowVideo.meta}
                  src={coldFlowVideo.src}
                  embedUrl={coldFlowVideo.embedUrl}
                  poster={coldFlowVideo.poster}
                />
              </RxpiSceneItem>
            </div>
          </RxpiScene>
        )}

        <RxpiScene id="hot-fire" length={0.6} until={0.1} className="bg-rxpi-night text-rxpi-night-fg" decor={<RxpiCrosshairs />}>
          <div className="rx-container">
            <RxpiSectionHeader tone="dark" sceneAt={-0.5} label={hasVideo ? "03 · Hot fire" : "02 · Hot fire"} title="Hot-fire attempt, spring 2026" />
            {/* The four photos rise in one after another as the stage arrives and holds */}
            <div className="mt-10">
              <RxpiGallery photos={hotFirePhotos} columns={4} tone="dark" sceneAt={-0.14} />
            </div>
          </div>
        </RxpiScene>

        <RxpiScene id="design" length={0.8} until={0.3} className="bg-rxpi-paper">
          <div className="rx-container grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
            <RxpiSectionHeader
              sceneAt={-0.5}
              label={hasVideo ? "04 · Engine design" : "03 · Engine design"}
              title="Reliant engine design"
              description="Reliant is designed to burn kerosene and self-pressurizing nitrous oxide at a 300 psi chamber pressure, with no active cooling. Its graphite nozzle, wrapped in RTV silicone insulation, absorbs the heat of a short burn, and our thermal model predicts a peak nozzle wall temperature of 969 K after 5 s."
            />

            {/* The section view wipes in, then its callouts are marked one at a time */}
            <div className="w-full lg:ml-auto lg:max-w-[min(100%,calc((92svh-8rem)*1369/944))]">
              <RxpiSceneItem at={-0.3} from="wipe">
                <div className="relative border border-rxpi-line bg-white p-3 sm:p-4 short:mx-auto short:max-w-md">
                  <RxpiCallouts
                    src="/rocket/engine_cad_1.png"
                    alt="Section view of the RPU-1 engine: graphite nozzle, stainless steel casing and angled injector ports"
                    width={1369}
                    height={944}
                    callouts={engineCallouts}
                    tone="light"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    sceneAt={0}
                  />
                  <RxpiCrosshairs tone="light" inset="inset-3" />
                </div>
              </RxpiSceneItem>
              <RxpiSceneItem at={-0.1} from="fade">
                <p className="mt-3 font-plex-mono text-[11.5px] uppercase tracking-[0.12em] text-rxpi-muted sm:text-xs">
                  RPU-1 section view · Siemens NX
                </p>
              </RxpiSceneItem>
            </div>
          </div>
        </RxpiScene>

        {/* Continues the engine design: the specification sheet fills in row by row */}
        <RxpiScene length={0.5} until={0} className="bg-rxpi-paper">
          <div className="rx-container">
            <div className="mx-auto max-w-[60rem]">
              <RxpiSpecTable title="Reliant specifications" specs={reliantSpecs} sceneAt={-0.4} />
            </div>
          </div>
        </RxpiScene>

        <RxpiScene length={0.5} until={0.05} className="bg-rxpi-paper">
          <div className="rx-container">
            {/* Sized so both gallery rows and their captions fit the pinned stage; laptop-height windows trade a little photo size to keep it pinned */}
            <div className="mx-auto lg:max-w-[max(48rem,calc(184svh-31rem))] compact:lg:max-w-[max(42rem,calc(184svh-33rem))]">
              <RxpiSceneItem at={-0.6} from="fade">
                <p className="font-plex-mono text-xs font-semibold uppercase tracking-[0.14em] text-rxpi-muted sm:text-[13px]">Design and analysis</p>
              </RxpiSceneItem>
              <div className="mt-6 compact:mt-4">
                {/* Each row lands once it is fully on screen */}
                <RxpiGallery photos={designPhotos} sceneAt={-0.45} sceneRowGap={0.42} />
              </div>
            </div>
          </div>
        </RxpiScene>

        <RxpiScene id="design-report" length={0.5} until={0.05} className="border-t border-rxpi-line bg-rxpi-sunken">
          <div className="rx-container">
            <RxpiSectionHeader sceneAt={-0.5} label={hasVideo ? "05 · Documentation" : "04 · Documentation"} title="RPU-1 design report" />
            {/* The cover and text arrive with the card; the links land once the stage holds */}
            <div className="mt-10">
              <RxpiDocument
                title="RPU-1 Reliant design report"
                meta="2025 · PDF · 2.2&nbsp;MB"
                description="Propellants, chamber and injector design, thermal analysis, test stand design, systems and control, and failure operations."
                src="/rocket/RELIANT_DESIGNREPORT_2025.pdf"
                cover="/rocket/covers/reliant_design_report.png"
                sceneAt={-0.2}
              />
            </div>
          </div>
        </RxpiScene>

        <RxpiScene length={0.6} until={0.5} className="border-t border-rxpi-line bg-rxpi-paper">
          <div className="rx-container grid items-center gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
            <div>
              <RxpiSceneItem at={-0.5} from="left">
                <p className="font-plex-mono text-xs font-semibold uppercase tracking-[0.3em] text-rxpi-red sm:text-[13px]">Up next</p>
              </RxpiSceneItem>
              <RxpiSceneItem at={-0.4}>
                <h2 className="mt-5 text-rx-h2 font-semibold tracking-[-0.02em] text-rxpi-ink">Project Aquila</h2>
              </RxpiSceneItem>
              <RxpiSceneItem at={-0.3}>
                <p className="mt-5 max-w-[36rem] text-pretty text-rx-lead text-rxpi-muted">
                  Our current program is the RPU-2 Altair engine and the FV01 Albatross flight vehicle. Albatross has a 60,000 ft AGL
                  target apogee.
                </p>
              </RxpiSceneItem>
              <RxpiSceneItem at={-0.2} className="mt-8 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap">
                <RxpiButton href="/rocket/aquila" icon={ArrowRight} block>
                  See Project Aquila
                </RxpiButton>
                <RxpiButton href="/rocket/sponsors" variant="secondary" block>
                  Sponsor RXPI
                </RxpiButton>
              </RxpiSceneItem>
            </div>
            <figure className="mx-auto w-full max-w-[22rem] lg:mr-0">
              <RxpiSceneItem at={-0.35} from="fade" className="relative border border-rxpi-line bg-rxpi-raised p-6">
                <AltairDrawing />
                <RxpiCrosshairs tone="light" inset="inset-3" />
              </RxpiSceneItem>
              <RxpiSceneItem at={0.5} from="fall">
                <RxpiTitleBlock
                  tone="light"
                  className="mt-4"
                  rows={[
                    ["Article", "RPU-2 Altair"],
                    ["View", "Line drawing"],
                  ]}
                />
              </RxpiSceneItem>
            </figure>
          </div>
        </RxpiScene>
      </main>

      <RxpiFooter />
    </div>
  );
}
