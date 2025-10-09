'use client';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faInstagram, faDiscord } from "@fortawesome/free-brands-svg-icons";
//@ts-ignore
import "./globals.css";
import Link from "next/link";
import Dropdown from "./components/Dropdown";
import Image from "next/image";
import { motion } from "framer-motion";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// TODO: flesh out later :/
const CommitteeMenu = () => {
  return (
    <div className="h-auto w-30 bg-white z-10 shadow-xl relative justify-between flex flex-col items-center">
      <Link className="hover:opacity-[0.75]" href="/rocket">Rocket</Link>
      <Link className="hover:opacity-[0.75]" href="/lander">Lander</Link>
      <Link className="hover:opacity-[0.75]" href="/lunar">Lunar</Link>
      <Link className=" hover:opacity-[0.75]" href="/cubesat">CubeSat</Link>
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
        <nav id="home" className="font-sans bg-transparent z-20 relative">

        <Link href="/#home" className="flex z-20">
          <Image
            src="/logos/sfs_no_text.png"
            alt="RPI Spaceflight Society logo"
            width={64}
            height={64}
            className="z-20 mt-4 ms-4 absolute pointer-events-auto"
            priority
          />
        </Link>

        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 relative">

          {/* Title */}
          <div className="absolute mt-4 text-2xl flex items-center z-20 pointer-events-none">
            Rensselaer<br />Spaceflight Society
          </div>

          {/* Navbar links */}
          <div className="relative text-lg flex h-16 items-center justify-end z-30">
            <div className="relative me-12 mt-5">
              <Dropdown href="/#home">Home</Dropdown>
            </div>
            <div className="relative me-12 mt-5">
              <Dropdown href="#" MenuContent={<CommitteeMenu />}>
                Committees
              </Dropdown>
            </div>
            <div className="relative me-12 mt-5">
              <Dropdown href="/about">About</Dropdown>
            </div>
          </div>
        </div>
      </nav>


        <br></br>
        {children}

        <footer className="relative mt-95 w-full font-mono mx-0 md:flex md:justify-between max-w-full p-4 sm:px-6 lg:px-8 bg-red-900">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-700 sm:text-center dark:text-gray-200">
            © 2025 <a href="/" className="hover:underline">Rensselaer Spaceflight Society</a>
          </span>
          <ul className="flex items-center gap-6 mt-3 text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-0">
            <li>
              <motion.a 
                href="https://github.com/Rensselaer-Spaceflight-Society"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  initial={{ color: "#d1d5db" }}
                  whileHover={{ color: "#ffffff" }}
                  transition={{ duration: 0.3 }}
                >
                  <FontAwesomeIcon icon={faGithub} size="2x" />
                </motion.div>
              </motion.a>
            </li>

            <li>
              <motion.a 
                href="https://www.instagram.com/rensselaer_spaceflight_society/"
                className=""
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className=""
                  initial={{ color: "#d1d5db" }}
                  whileHover={{ color: "#E1306C" }}
                  transition={{ duration: 0.3 }}
                >
                <FontAwesomeIcon
                  icon={faInstagram} size="2x"
                />
                </motion.div>
              </motion.a>
            </li>

            <li>
              <motion.a 
                href="https://discord.gg/Y8uVhAqGsQ"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  initial={{ color: "#d1d5db" }}
                  whileHover={{ color: "#6366f1" }}
                  transition={{ duration: 0.3 }}
                >
                  <FontAwesomeIcon icon={faDiscord} size="2x"/>
                </motion.div>
              </motion.a>
            </li>
          </ul>
        </div>
      </footer>
      </body>
    </html>
    
  );
}
