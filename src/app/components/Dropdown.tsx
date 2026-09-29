'use client'
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import * as React from "react";

export default function Dropdown({
    children,
    href,
    MenuContent,
    panelClassName = "bg-white text-black",
}: Readonly<{
    children: string,
    href: string,
    MenuContent?: React.ReactNode,
    panelClassName?: string,
}>){

    const [open, setOpen] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const showMenu = open && mounted;


    return(
        <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onTouchStart={() => setOpen(!open)}
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
        }}
        className="relative h-fit w-fit">
            <Link className="relative inline-flex h-11 items-center text-white" href={href}>
                {children}
                <span
                style={{
                    transform: showMenu ? "scaleX(1)" : "scaleX(0)",
                }}
                className="absolute bottom-0.5 -left-2 -right-2 h-1 rounded-full bg-white transition-transform duration-300 ease-out">

                </span>
            </Link>
            <AnimatePresence>
            {showMenu && (
                <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                style={{ x: '-50%' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`absolute left-1/2 z-10 top-12 ${panelClassName}`}>
                    <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent"></div>
                    {MenuContent}
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
}