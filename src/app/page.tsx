import { ReactNode } from "react";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Gallery from "./components/Gallery";

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
    return (
        <div className={`${geistSans.variable} ${geistMono.variable} antialiased h-800`}>
            {/* Big title type stuff */}
            <div className="absolute top-0 overflow-y-hidden z-[-1] h-full w-full">
                <Image className="absolute top-[-95] z-[-1] scale-x-[-1] opacity-50" src={"/rocket/stand_1.png"} alt='' width="1558" height="937"></Image>
                <div className="flex font-sans text-3xl items-center justify-center h-full mt-22 w-full text-white bg-transparent">
                    Some Tagline
                </div>
            </div>
            <div className="relative p-2 bg-amber-50 w-full h-220 mt-169">
                <Gallery>
                    <Image src={"/photos/cad_workshop_1.png"} width={4032} height={3024} alt="MercerX CAD Workshop"></Image>
                    <Image src={"/photos/pcb_workshop_1.png"} width={4032} height={3024} alt="MercerX PCB Design Workshop"></Image>
                    <Image src={"/photos/puckman.png"} width={7008} height={4672} alt=""></Image>
                    <Image src={"/rocket/solder.jpg"} width={3000} height={3000} alt=""></Image>
                    <Image src={"/lunar/moon_molding_1.jpg"} width={3007} height={3124} alt=""></Image>
                    <Image src={"/lunar/moon_molding_2.jpg"} width={3007} height={3124} alt=""></Image>
                </Gallery>
            </div>
        </div>
    );
}