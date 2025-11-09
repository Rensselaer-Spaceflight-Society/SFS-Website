'use client'
import { useState, useEffect } from "react";
import Image from "next/image";


export default function Rocket(){

    /* TODO: replace with framer motion? not necessary-might bloat */

    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const scrollFunc = () => {
        setScrollY(window.scrollY);
        };
        window.addEventListener("scroll", scrollFunc);
        return () => window.removeEventListener("scroll", scrollFunc);
    }, []);

    return (
        <div className="w-full h-250 mb-0 overflow-hidden">
            <hr className="relative z-0 h-1 my-2 opacity-30 bg-gray-400 border-0 dark:bg-gradient-to-b"></hr>
            <p className="text-white mt-10 text-5xl font-sans align-middle mb-10 text-center w-min-full">
                About Us
            </p>
            <Image
                className="absolute top-[-120] left-0 w-full h-auto z-[-1] opacity-40"
                alt=""
                src="/rocket/manifold.png"
                width={1321}
                height={864}
                style={{
                transform: `scale(1.3) translateX(${scrollY * 0.15}px) translateY(${scrollY * -0.1}px)`,
                transition: "transform 0.1s linear",
                transformOrigin: "center center",
                }}
            />
            <div className="h-full bg-white from-transparent w-full">
                <br />
            </div>
        </div>
    );
}