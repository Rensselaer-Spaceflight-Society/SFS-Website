'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import SubteamDesc from '../components/Subteam_desc';
import Cfooter from "../components/cfooter"

const subteamsJson = [
  {
    title: "Payload",
    photo: "",
    description: "Designs and tests FPGA boards and TEG arrays for space environment performance.",
  },
  {
    title: "ADCS",
    photo: "",
    description: "Develops attitude determination and control systems for orientation/positioning.",
  },
  {
    title: "Computing",
    photo: "",
    description: "Manages flight software, data processing, and onboard computing systems.",
  },
  {
    title: "Electrical",
    photo: "",
    description: "Designs power systems, solar panels, and electrical integration for the satellite.",
  },
  {
    title: "Safety",
    photo: "",
    description: "Designs and simulates the mission plan and ensures satelite safety.",
  },
  {
    title: "Integration/Structures",
    photo: "",
    description: "Designs the CubeSat structure and integrates all subsystems into the final vehicle.",
  },
  {
    title: "Communication",
    photo: "",
    description: "Develops communication systems for the cubesat and communicates with the ground station.",
  },
];



export default function CubeSat() {
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
            src="/cubesat/csli.jpg"
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
            CubeSat Committee
          </p>
          <hr className="w-2/3 my-3 sm:my-4 md:my-6 border-gray-400 opacity-30" />
        </div>
      </div>

      <section className="relative bg-white text-slate-800 py-10 sm:py-12 border-b-2 border-gray-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-3">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-500">
              Committee Overview
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-sky-600 to-blue-500 rounded-full"></div>
          </div>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl">
            The CubeSat committee is participating in NASA's CubeSat Launch Initiative (CSLI) to design, build, and launch a 1-3U Cubesat, carrying a payload of FPGA boards and a TEG array to measure the performance of both components in the vacuum of space and under intense radiation exposure.
          </p>
        </div>
      </section>

      <section className="py-6 sm:py-8 bg-gray-50 text-slate-800 text-center">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-3">
          <h2 className="text-2xl font-semibold mb-4">Recent Projects</h2>
          <p className="text-base text-gray-700">
            Nothing here for now!
          </p>
        </div>
      </section>

      <section id="subteams" className="py-8 sm:py-10 bg-gray-50 text-slate-800 text-center min-h-auto">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 px-4">Subteams</h2>
          <div className="max-w-8xl mx-auto px-4">
              <SubteamDesc data={subteamsJson} />
          </div>
      </section>

      <section className="py-8 sm:py-10 bg-gray-50 text-slate-800 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 px-4">Resources</h2>
        <p className="max-w-2xl mx-auto text-sm sm:text-base px-4">
          Nothing here for now!
        </p>
      </section>

      <Cfooter></Cfooter>
    </div>
  );
}