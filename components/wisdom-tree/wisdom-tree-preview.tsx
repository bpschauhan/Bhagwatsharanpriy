"use client";

import { motion } from "framer-motion";
import { wisdomBranches } from "@/lib/content/home";
import { cn } from "@/lib/utils/cn";

const positions = [
  "left-[8%] top-[18%]",
  "left-[40%] top-[8%]",
  "right-[8%] top-[20%]",
  "left-[13%] bottom-[18%]",
  "left-[43%] bottom-[8%]",
  "right-[10%] bottom-[20%]",
] as const;

export function WisdomTreePreview() {
  return (
    <div id="wisdom" className="relative min-h-[360px] overflow-hidden rounded-lg border border-border bg-card p-5 shadow-soft">
      <div className="absolute inset-0 bg-wisdom-radial opacity-80" />
      <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/25 bg-background/80 shadow-inner-calm backdrop-blur">
        <div className="flex size-full items-center justify-center text-center font-serif text-sm font-semibold">
          Wisdom
        </div>
      </div>
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        {positions.map((position, index) => {
          const x = index % 3 === 0 ? "20%" : index % 3 === 1 ? "50%" : "80%";
          const y = index < 3 ? "28%" : "72%";
          return (
            <motion.line
              key={position}
              x1="50%"
              y1="50%"
              x2={x}
              y2={y}
              stroke="currentColor"
              className="text-primary/25"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: index * 0.08 }}
            />
          );
        })}
      </svg>
      {wisdomBranches.map((branch, index) => (
        <motion.div
          key={branch}
          className={cn(
            "absolute rounded-lg border border-border bg-background/82 px-4 py-3 text-sm font-medium shadow-soft backdrop-blur",
            positions[index],
          )}
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 + index * 0.07 }}
        >
          {branch}
        </motion.div>
      ))}
    </div>
  );
}
