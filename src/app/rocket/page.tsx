'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import Rpu1Desc from "../components/rpu1-desc";
import Rpu2Desc from "../components/rpu2-desc";
import SubteamDesc from '../components/Subteam_desc';
import Cfooter from "../components/cfooter"

const subteamsJson = [
  {
    title: "Propulsion",
    photo: "/rocket/st-prop.png",
    description: "Responsible for engine design, testing, and performance optimization.",
  },
  {
    title: "Fluids",
    photo: "/rocket/st-fluid.jpg",
    description: "Responsible for feed and fluid system design.",
  },
  {
    title: "Safety",
    photo: "/rocket/rpu-safety.jpg",
    description: "In charge of testing, risk assessment, and systems planning.",
  },
  {
    title: "Systems",
    photo: "/rocket/st-sys.jpg",
    description: "Develops telemetry, control systems, and onboard electronics.",
  },
  {
    title: "Aerostructures",
    photo: "/rocket/st-aero.jpg",
    description: "Responsible for test stand and airframe design, structural simulations, and manufacturing.",
  },
];



export default function Rocket() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const scrollFunc = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", scrollFunc);
    return () => window.removeEventListener("scroll", scrollFunc);
  }, []);

  return (
    <div className="relative min-w-full">
      <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] -mt-[60px] sm:-mt-[80px] md:-mt-[105px] overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            className="w-full h-full object-cover opacity-40"
            alt=""
            src="/rocket/manifold.png"
            width={1321}
            height={864}
            priority
            style={{
              transform: `scale(1.3) translateX(${scrollY * 0.15}px) translateY(${scrollY * 0.1}px)`,
              transition: "transform 0.1s linear",
              transformOrigin: "center center",
            }}
          />
        </div>


        <div className="flex flex-col items-center justify-center h-full text-white text-center px-4">
          <p className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-sans leading-tight">
            RPI Experimental Rocket<br />Propulsion Committee (RXPI)
          </p>
          <hr className="w-2/3 my-3 sm:my-4 md:my-6 border-gray-400 opacity-30" />
        </div>
      </div>


      <section className="relative bg-white text-slate-800 py-10 sm:py-12 border-b-2 border-gray-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-3">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
              Committee Overview
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-red-600 to-orange-500 rounded-full"></div>
          </div>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl">
            The Rensselaer Experimental Propulsion Initiative (RXPI) is currently working on two liquid rocket engine systems. RPU-1 “Reliant” is our static bipropellant engine using kerosene and nitrous oxide, and includes a nitrogen purge system for shutdown. The project has been cold-flow tested and we’re waiting for good conditions for a hot fire. This engine, along with RPU-2, which has recently begun development, are both led and built by students at Rensselaer Polytechnic Institute.
          </p>
        </div>
      </section>

      <section className="relative bg-white text-slate-800 py-6 sm:py-8">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-3">
          <Rpu1Desc completionDate="December 10th 2025" ctaHref="./rocket#design" />
        </div>
      </section>

      <section className="py-6 sm:py-8 bg-gray-50 text-slate-800 text-center">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-3">
          <Rpu2Desc completionDate="TBD" ctaHref="./" />
        </div>
      </section>

      <section id="subteams" className="py-8 sm:py-10 bg-gray-50 text-slate-800 text-center min-h-auto">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 px-4">Subteams</h2>
          <div className="max-w-8xl mx-auto px-4">
              <SubteamDesc data={subteamsJson} />
          </div>
      </section>

      <section className="py-8 sm:py-10 bg-gray-50 text-slate-800 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 px-4">RXPI Documents</h2>
        <p className="max-w-2xl mx-auto text-sm sm:text-base px-4">
          The Rensselaer Experimental Rocket Propulsion Committee continues to
          build propulsion systems through rigorous design,
          testing, and safe engineering practices.
        </p>
      </section>

      <section id="design" className="py-8 sm:py-10 bg-gray-50 text-slate-800 text-center px-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          <a href="/rocket/RELIANT_DESIGNREPORT_2025.pdf">RPU-1 Design Report: January 2025</a>
        </h2>
        <p className="max-w-4xl m-auto mt-auto text-sm sm:text-base">
          <object
            className="border-2 border-gray-300 w-full"
            data="/rocket/RELIANT_DESIGNREPORT_2025.pdf"
            type="application/pdf"
            width="100%"
            height="900px"
          ></object>
        </p>
      </section>

      <Cfooter></Cfooter>
    </div>
  );
}
