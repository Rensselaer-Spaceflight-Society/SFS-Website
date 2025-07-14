import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faInstagram, faDiscord } from "@fortawesome/free-brands-svg-icons";
import "./globals.css";
import Link from "next/link";
import Dropdown from "./components/Dropdown";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RPI Spaceflight",
  description: "Rensselaer Spaceflight Society",
};

const CommitteeMenu = () => {

  return (
    <div className="h-25 w-50 bg-white p-6 shadow-xl relative justify-between flex items-center">
      <Link className="absolute top-5 left-5 hover:opacity-[0.75]" href="/rocket">Rocket</Link>
      <Link className="absolute top-5 right-5 hover:opacity-[0.75]" href="/lander">Lander</Link>
      <Link className="absolute bottom-5 left-5 hover:opacity-[0.75]" href="/lunar">Lunar R&D</Link>
      <Link className="absolute bottom-5 right-5 hover:opacity-[0.75]" href="/cubesat">CubeSat</Link>
    </div>
  );

}

const ModelMenu = () => {

  return (
    <div className="h-15 w-35 text-sm bg-white p-6 shadow-xl relative justify-between flex items-center">
      Coming Soon!
    </div>
  );

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Navbar Code */}
        <nav className="font-sans bg-transparent">
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <Image className="absolute left-5 top-4" src={`/logos/sfs_no_text.png`} alt='' width="64" height="64"></Image>
            <div className="relative mt-2 text-lg flex h-16 items-center justify-end">
              <div className="relative me-12">
                {/* Committee Menu is defined above and is just all the links to committee pages */}
                <Dropdown href="#" MenuContent={<CommitteeMenu />}>
                  Committees
                </Dropdown>
              </div>
              <div className="relative me-12">
                {/* just a link- no dropdown menu- but still a dropdown component */}
                <Dropdown href="/about">
                  About
                </Dropdown>
              </div>
              <div className="relative me-12">
                {/* 3D models- to be implemented later (see model menu above) */}
                <Dropdown href="#" MenuContent={<ModelMenu/>}>
                  Models
                </Dropdown>
              </div>
            </div>
          </div>
        </nav>

        <br></br>
        {children}

      
        {/* Footer Code */}
        <footer className="font-mono mx-0 md:flex md:justify-between max-w-full p-4 sm:px-6 lg:px-8 bg-red-900">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
              <span className="text-sm text-gray-700 sm:text-center dark:text-gray-200">© 2025 <a href="/" className="hover:underline">Rensselaer Spaceflight Society</a>
            </span>
            <ul className="flex items-center gap-4 mt-3 text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-0">
                <li>
                  <a href="https://github.com/Rensselaer-Spaceflight-Society"><FontAwesomeIcon icon={faGithub} className="w-6 h-6 hover:text-white" /></a>
                </li>
                <li>
                    <a href="https://www.instagram.com/rensselaer_spaceflight_society/"><FontAwesomeIcon icon={faInstagram} className="w-6 h-6 hover:text-white" /></a>
                </li>
                <li>
                    <a href="https://discord.gg/Y8uVhAqGsQ"><FontAwesomeIcon icon={faDiscord} className="w-6 h-6 hover:text-white" /></a>
                </li>
            </ul>
            </div>
        </footer>
      </body>
    </html>
  );
}
