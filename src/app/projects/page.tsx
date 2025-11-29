'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import Cfooter from "../components/cfooter"

const projectsData = [
  {
    title: "Mars Rover",
    committee: "Rover",
    date: "November 2025",
    image: "/rover/CAD-full.png",
    description: "The Rover Committee aims to design and develop a versatile rover capable of navigating diverse terrains while conducting soil sampling and data collection.",
    details: "Equipped with advanced sensors for temperature and humidity monitoring, an innovative soil collection system, and automated 360º imaging capabilities processed with Python-based photo stitching. Features bogie-rocker suspension, acryllic chassis, and custom differential box.",
    status: "Completed"
  }
];

export default function Projects() {
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
            src="/rover/fea_1.png"
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
            Completed Projects
          </p>
        </div>
      </div>

      <section className="relative bg-white text-slate-800 py-10 sm:py-12 border-b-2 border-gray-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-3">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              Our Projects
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"></div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-3">
          {projectsData.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group mb-8"
            >
              <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
                {project.image && (
                  <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-col justify-between">
                  <div>
                    <div className="inline-block mb-3">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs sm:text-sm font-semibold rounded-full">
                        {project.committee}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-500 mb-4">
                      {project.date}
                    </p>

                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                      {project.description}
                    </p>

                    <p className="text-sm text-gray-700 leading-relaxed mb-6">
                      {project.details}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs sm:text-sm font-semibold text-green-700">
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Cfooter></Cfooter>
    </div>
  )};