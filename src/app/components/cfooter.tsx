'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faInstagram, faDiscord } from "@fortawesome/free-brands-svg-icons";

export default function Cfooter({
}: Readonly<{
}>){
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const MotionA = mounted ? motion.a : 'a';
    const MotionDiv = mounted ? motion.div : 'div';

    return (

        <footer className="relative mt-auto w-full font-mono mx-0 md:flex md:justify-between max-w-full p-4 sm:px-6 lg:px-8 bg-red-900">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-700 sm:text-center dark:text-gray-200">
            © 2025 <a href="/" className="hover:underline">Rensselaer Spaceflight Society</a>
          </span>
          <ul className="flex items-center gap-6 mt-3 text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-0">
            <li>
              <MotionA
                href="https://github.com/Rensselaer-Spaceflight-Society"
                {...(mounted ? {
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.95 },
                  transition: { duration: 0.2 }
                } : {})}
              >
                <MotionDiv
                  {...(mounted ? {
                    initial: { color: "#d1d5db" },
                    whileHover: { color: "#ffffff" },
                    transition: { duration: 0.3 }
                  } : {})}
                >
                  <FontAwesomeIcon icon={faGithub} size="2x" />
                </MotionDiv>
              </MotionA>
            </li>

            <li>
              <MotionA
                href="https://www.instagram.com/rensselaer_spaceflight_society/"
                className=""
                {...(mounted ? {
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.95 },
                  transition: { duration: 0.2 }
                } : {})}
              >
                <MotionDiv
                  className=""
                  {...(mounted ? {
                    initial: { color: "#d1d5db" },
                    whileHover: { color: "#E1306C" },
                    transition: { duration: 0.3 }
                  } : {})}
                >
                <FontAwesomeIcon
                  icon={faInstagram} size="2x"
                />
                </MotionDiv>
              </MotionA>
            </li>

            <li>
              <MotionA
                href="https://discord.gg/Y8uVhAqGsQ"
                {...(mounted ? {
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.95 },
                  transition: { duration: 0.2 }
                } : {})}
              >
                <MotionDiv
                  {...(mounted ? {
                    initial: { color: "#d1d5db" },
                    whileHover: { color: "#6366f1" },
                    transition: { duration: 0.3 }
                  } : {})}
                >
                  <FontAwesomeIcon icon={faDiscord} size="2x"/>
                </MotionDiv>
              </MotionA>
            </li>
          </ul>
        </div>
      </footer>

  );
}