'use client'

import { ReactNode } from "react";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Gallery from "./components/Gallery";
import Link from "next/link";
import Cfooter from "./components/cfooter"
import { motion, AnimatePresence } from 'framer-motion';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home({
    children,
}:Readonly<{
    children: ReactNode
}>){

    const first_gbm: Date = new Date("August 30, 2025 17:00:00 GMT-4:00");
    const now: Date = new Date();
    let next_sat: Date = new Date(now);
    const days_until: number = (6 - now.getDay() + 7) % 7; 
    next_sat.setDate(now.getDate() + days_until);
    next_sat.setHours(17, 0, 0, 0);
    if (now.getDay() === 6) {
        if (now.getHours() >= 17) {
        next_sat.setDate(next_sat.getDate() + 7);
        }
    }

    const day_diff = Math.floor((+next_sat - +first_gbm) / (1000 * 60 * 60 * 24));
    const wk_diff = Math.floor(
            (next_sat.getTime() - first_gbm.getTime()) / (1000 * 60 * 60 * 24)
    / 7);

    const meeting: Boolean = wk_diff % 2 === 0;
    let leapfrog_day: Date = new Date(next_sat.getTime() + (7 * 24 * 60 * 60 * 1000));

    return (
        <div className={`${geistSans.variable} ${geistMono.variable} antialiased h-550`}>
            {/* Big title type stuff */}
            <div className="absolute top-0 overflow-y-hidden z-[-1] min-h-full min-w-full">
                <Image className="absolute top-[-95] z-[-1] min-w-full min-h-full scale-x-[-1] opacity-50" src={"/rocket/stand_1.png"} alt='' width="1558" height="937"></Image>
                <div className="flex-col p-60 pt-40 font-sans items-center text-center justify-center min-h-full mt-22 min-w-full bg-transparent">
                    <p className="lg:text-7xl md:text-5xl text-white">
                        Interested in Rocket Engines, Satellites, or Space Exploration?
                    </p> 
                    <br />
                    <p className="lg:text-2xl md:text-xl mt-10 text-white">Show up to one of our committee meetings or
                    join us at our General Body Meeting on Saturday {
                        meeting ? `${next_sat.toLocaleString('default', { month: 'long' })} ${next_sat.getDate()}`
                        : `${leapfrog_day.toLocaleString('default', { month: 'long' })} ${leapfrog_day.getDate()}`
                    } at 5:00 in JEC 3207!</p>
                </div>
            </div>
            <div className="relative p-2 pb-0 bg-amber-50 min-w-full h-auto mt-149">
                <Gallery>
                    <Image src={"/photos/cad_workshop_1.png"} width={4032} height={3024} alt="MercerX CAD Workshop"></Image>
                    <Image src={"/photos/pcb_workshop_1.png"} width={4032} height={3024} alt="MercerX PCB Design Workshop"></Image>
                    <Image src={"/photos/puckman.png"} width={7008} height={4672} alt=""></Image>
                    <Image src={"/rocket/solder.jpg"} width={3000} height={3000} alt=""></Image>
                    <Image src={"/lunar/moon_molding_1.jpg"} width={3007} height={3124} alt=""></Image>
                    <Image src={"/lunar/moon_molding_2.jpg"} width={3007} height={3124} alt=""></Image>
                </Gallery>
            </div>

            <div className="flex flex-col items-center justify-center text-center py-20 text-white bg-transparent">
                <p className="text-4xl font-semibold mb-6">Meeting Times</p>
                <div className="flex flex-wrap justify-center gap-6 max-w-4xl">

                    {[
                    { name: "Rocket Engine", href: "./rocket", time: "Sundays 1:00 - 3:00", location: "Ricketts 207", color: "from-red-500 to-orange-500" },
                    { name: "CubeSat", href: "./cubesat", time: "Sundays 11:00 - 1:00", location: "Ricketts 207", color: "from-sky-400 to-blue-600" },
                    { name: "Lunar R&D", href: "./lunar", time: "Fridays 4:00 - 6:00", location: "Ricketts 411", color: "from-gray-400 to-zinc-600" },
                    { name: "Lander", href: "./lander", time: "Saturdays 2:00 - 4:00", location: "Ricketts 411", color: "from-yellow-400 to-amber-600" },
                    { name: "CORE", href: "./core", time: "Sundays 7:00 - 9:00", location: "JEC 3210", color: "from-emerald-400 to-green-600" },
                    { name: "Executive Committee", href: "./about", time: "Sundays 4:30 - 6:00", location: "JEC 3210", color: "from-purple-400 to-indigo-600" },
                    ].map((team, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.97 }}
                        className={`p-[2px] rounded-2xl bg-gradient-to-br ${team.color} transition-all duration-300 shadow-lg hover:shadow-xl`}
                    >
                        <div className="bg-black rounded-2xl px-6 py-5">
                        <Link href={team.href} className="text-2xl font-medium hover:underline">
                            {team.name}
                        </Link>
                        <p className="text-lg text-gray-200 mt-1">{team.time}</p>
                        <p className="text-sm text-gray-400">{team.location}</p>
                        </div>
                    </motion.div>
                    ))}

                </div>
                </div>

            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

            <div className="h-150 bg-black min-w-full text-black flex justify-center"> {
            /* TODO: add google calendar  https://calendar.google.com/calendar/u/0?cid=cnBpLnNwYWNlZmxpZ2h0QGdtYWlsLmNvbQ*/
            }
            <iframe src="https://calendar.google.com/calendar/embed?src=rpi.spaceflight%40gmail.com&ctz=America%2FNew_York" style={{border: 0}} width="800" height="600" frameBorder={0} scrolling="no"></iframe>
            </div>

            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

            {/* Widget - lowk might remove it */}
            <div className="flex pl-10 justify-between pr-10">
                <div className="flex-1 flex-col items-center text-center">
                    <iframe
                        className="block m-auto rounded-lg shadow-lg"
                        src="https://discord.com/widget?id=1280711900111306774&theme=dark"
                        width="500"
                        height="500"
                        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                    ></iframe>
                    <p className="text-2xl mt-10 text-white">
                        Join Our Discord For News, Events, and More!
                    </p>
                </div>
                <div className="flex-1 flex-col items-center text-center gap-6">
                    <p className="text-4xl text-white">
                        Big Thanks to Our Sponsors:
                    </p>
                    <div className="flex flex-col items-center gap-9 pt-10">
                        <Image
                            className="w-80 h-auto"
                            src="/logos/soe_transparent.png"
                            alt=""
                            width={3231}
                            height={858}
                        />
                        <Image
                            className="w-80 h-auto"
                            src="/logos/seds_transparent.png"
                            alt=""
                            width={300}
                            height={204}
                        />
                    </div>
                </div>
            </div>
            <br></br>
            <Cfooter/>
        </div>
        
    );
}