'use client'
import { ReactNode, useState, useEffect } from "react";
import Image from "next/image";
import Rpu1Desc from "../components/rpu1-desc";
import Rpu2Desc from "../components/rpu2-desc";

export default function Rocket({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const scrollFunc = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", scrollFunc);
    return () => window.removeEventListener("scroll", scrollFunc);
  }, []);

  return (
    <div className="relative min-w-full">
      <div className="relative h-[70vh] -mt-[90px] overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            className="w-full h-full object-cover opacity-40"
            alt=""
            src="/rocket/manifold.png"
            width={1321}
            height={864}
            priority
            style={{
              transform: `translateY(${scrollY * -0.2}px)`,
              transition: "transform 0.1s linear",
            }}
          />
        </div>

        {/* Foreground text */}
        <div className="flex flex-col items-center justify-center h-full text-white text-center">
          <p className="text-5xl font-sans leading-tight">
            RPI Experimental Rocket<br />Propulsion Committee (RXPI)
          </p>
          <hr className="w-2/3 my-6 border-gray-400 opacity-30" />
        </div>
      </div>

      {/* === Sections Below === */}
      <section className="relative bg-white text-slate-800 py-16">
        <div className="max-w-8xl mx-auto px-3">
          <Rpu1Desc completionDate="November 15th-16th 2025" ctaHref="./rocket#design" />
        </div>
      </section>

      <section className="py-16 bg-gray-50 text-slate-800 text-center">
        <div className="max-w-8xl mx-auto px-3">
          <Rpu2Desc completionDate="TBD" ctaHref="./" />
        </div>
      </section>

      <section className="py-5 bg-gray-50 text-slate-800 text-center">
        <h2 className="text-2xl font-semibold mb-4">RXPI Documents</h2>
        <p className="max-w-2xl mx-auto text-base">
          The Rensselaer Experimental Rocket Propulsion Committee continues to
          build propulsion systems through rigorous design,
          testing, and safe engineering practices.
        </p>
      </section>

      <section id="design" className="py-10 bg-gray-50 text-slate-800 text-center">
        <h2 className="text-xl font-semibold mb-4">
          <a href="/rocket/RELIANT_DESIGNREPORT_2025.pdf">RPU-1 Design Report: January 2025</a>
        </h2>
        <p className="max-w-2xl m-auto mt-auto text-base">
          <object
            className="border-2 border-gray-300"
            data="/rocket/RELIANT_DESIGNREPORT_2025.pdf"
            type="application/pdf"
            width="100%"
            height="500px"
          ></object>
        </p>
      </section>
    </div>
  );
}
