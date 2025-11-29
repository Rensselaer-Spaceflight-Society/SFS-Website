'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import SubteamDesc from '../components/Subteam_desc';
import Cfooter from "../components/cfooter"
import Description from "../components/description";
import { Moon, Sun, Anvil, AirVent } from "lucide-react";

const subteamsJson = [
  {
    title: "Testing",
    photo: "lunar/moon_crusher_2.png",
    description: "Using RPI’s Materials Research Center, our testing team is able to get measurements for the stress-strain curve for each of the samples. The tests conducted by the testing team focus on the tensile and compressive properties. The tensile (stretch) tests use dogbones made by the molding team, which are then used in a universal testing machine (UTM) to collect upwards of 10000 points of data. The compressive tests use the same machine, allowing for large and robust datasets.",
  },
  {
    title: "Molding",
    photo: "lunar/moon-molding-3.jpg",
    description: "The molding team of the Lunar R&D Committee focuses on creating the samples of regolith that are used by every other team. Our molding team ensures that each sample of the composite is well mixed, has the correct ratio of regolith to epoxy, and won’t cause additional skew in the data. Molding also handles the organization and the experimental units of the regolith and epoxy.",
  },
  {
    title: "Optics",
    photo: "lunar/moon-optics-2.jpg",
    description: "The optics team is working with a gonioreflectometer in order to measure the reflectivity of each of the lunar regolith-epoxy samples. The gonioreflectometer, along with a light source and photosensor, allows us to measure the reflectivity of light onto a sample over a wide range of angles, allowing for a more approximate measure of albedo with visible light.",
  },
  {
    title: "Documentation",
    photo: "",
    description: "The documentation team is in charge of the overall data analysis, write-up, and publishing of the data from all of the other teams. Through the use of statistical tests and other analysis techniques, the documentation team will be able to interpret the data gathered by the other teams.",
  },
];



export default function Lunar() {
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
            src="/lunar/moon-title.jpg"
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
            Lunar R&D Committee
          </p>
          <hr className="w-2/3 my-3 sm:my-4 md:my-6 border-gray-400 opacity-30" />
        </div>
      </div>

      <section className="relative bg-white text-slate-800 py-10 sm:py-12 border-b-2 border-gray-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-3">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-zinc-500">
              Committee Overview
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-gray-600 to-zinc-500 rounded-full"></div>
          </div>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl">
            The Lunar R&D is researching and writing a paper on the properties of lunar regolith to build structures for a lunar settlement. We are molding regolith mixed with epoxy resin and testing the albedo, impact resistance, and tensile and compressive strengths. All experience levels are welcome and invited to attend!
          </p>
        </div>
      </section>

      <section className="py-6 sm:py-8 bg-gray-50 text-slate-800 text-center">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-3">
          <h2 className="text-2xl font-semibold mb-4">Recent Projects</h2>
          <p className="text-base text-gray-700">
            <Description
                badge="Lunar R&D"
                badgeIcon={Moon}
                badgeColor="#000000"
                title="Regolith Testing"
                description="Using an epoxy resin mixed with lunar regolith simulant, we hope to find a viable material."
                features={[
                    {
                        icon: Anvil,
                        title: "TENS UTM",
                        description: "used for data at RPI's Materials Research Center, courtesy of Craig Pine.",
                        color: "text-gray-800",
                    },
                    {
                        icon: Sun,
                        title: "Gonioreflectometer",
                        description: "used for reflectivity data in our lab, along with a fiber collimating system.",
                        color: "text-gray-800",
                    },
                    {
                        icon: AirVent,
                        title: "Fume Hood",
                        description: "We ensure all work with raw regolith is done inside of a fume hood to minimize risk.",
                        color: "text-gray-800",
                    },
                ]}
                ctaHref="#subteams"
                imageSrc="lunar/moon_crusher_1.png"
                imageDimensions={{
                    width:500,
                    height:300,
                    objectFit: 'cover',
                    objectPosition: 'center',
                }}
            ></Description>

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