'use client';

import { motion } from "framer-motion";
import { cloneElement, isValidElement } from "react";

export default function Gallery({
    children
}: Readonly<{
    children: React.ReactElement[]
}>){
    
    return (
    <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-auto gap-4 items-start-safe">
      {children.map((child, index) => {
        if (!isValidElement(child)) return null;
        return(
          <motion.div
            key={index}
            className="overflow-hidden rounded-lg"
            whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {cloneElement(child as React.ReactElement<any>, {
                className: `${(child.props as any).className || ''} object-cover`,
            })}
          </motion.div>
        );
    })}
    </div>
  );
}