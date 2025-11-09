'use client';

import { motion } from "framer-motion";
import { cloneElement, isValidElement, useEffect, useState } from "react";

export default function Gallery({
    children
}: Readonly<{
    children: React.ReactElement[]
}>){
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto px-4 py-8">
                {children.map((child, index) => {
                    if (!isValidElement(child)) return null;
                    return (
                        <div key={index} className="overflow-hidden rounded-xl aspect-[4/3] relative">
                            {cloneElement(child as React.ReactElement<any>, {
                                className: `${(child.props as any).className || ""} object-cover w-full h-full`,
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto px-4 py-8">
        {children.map((child, index) => {
          if (!isValidElement(child)) return null;

          return (
            <motion.div
              key={index}
              className="overflow-hidden rounded-xl aspect-[4/3] relative"
              whileHover={{
                scale: 1.04,
                boxShadow: "0 6px 25px rgba(0,0,0,0.25)",
              }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
            >
              {cloneElement(child as React.ReactElement<any>, {
                className: `${
                  (child.props as any).className || ""
                } object-cover w-full h-full`,
              })}
            </motion.div>
          );
        })}
      </div>
    );
}