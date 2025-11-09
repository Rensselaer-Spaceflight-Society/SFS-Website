'use client';

import Link from "next/link";
import Dropdown from "./Dropdown";
import Image from "next/image";

const CommitteeMenu = () => {
  return (
    <div className="h-auto w-30 bg-white z-10 shadow-xl relative justify-between flex flex-col items-center">
      <Link className="hover:opacity-[0.75]" href="/rocket">Rocket</Link>
      <Link className="hover:opacity-[0.75]" href="/lander">Lander</Link>
      <Link className="hover:opacity-[0.75]" href="/lunar">Lunar</Link>
      <Link className=" hover:opacity-[0.75]" href="/cubesat">CubeSat</Link>
      <Link className=" hover:opacity-[0.75]" href="/core">CORE</Link>
    </div>
  );
}

export default function Navbar() {
  return (
    <nav id="home" className="font-sans bg-transparent z-20 relative">
      <div className="w-full flex items-center justify-between h-20 px-2 sm:px-4">

        {/* Logo + Title (left side) */}
        <Link
          href="/#home"
          className="flex items-center gap-2 sm:gap-3 md:gap-3 lg:gap-2 xl:gap-1 z-20 pointer-events-auto"
        >
          <Image
            src="/logos/sfs_no_text.png"
            alt="RPI Spaceflight Society logo"
            width={64}
            height={64}
            priority
            className="block"
          />
          <div className="leading-tight ms-4">
            <h1 className="font-medium text-lg sm:text-xl md:text-2xl lg:text-3xl">
              Rensselaer
            </h1>
            <h2 className="font-medium text-lg sm:text-xl md:text-2xl lg:text-3xl">
              Spaceflight Society
            </h2>
          </div>
        </Link>

        {/* Navbar Links (right side) */}
        <div className="flex items-center text-lg space-x-10 z-30">
          <Dropdown href="/#home">Home</Dropdown>
          <Dropdown href="#" MenuContent={<CommitteeMenu />}>
            Committees
          </Dropdown>
          <Dropdown href="/archive">Archive</Dropdown>
          <Dropdown href="/about">About</Dropdown>
        </div>
      </div>
    </nav>
  );
}

