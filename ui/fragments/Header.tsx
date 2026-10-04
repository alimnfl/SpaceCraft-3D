"use client";

import { cn } from "@/tools/cn";
import { RiArrowUpLine } from "@remixicon/react";

export default function Header() {
  return (
    <header
      className={cn(
        "flex items-center justify-between",
        "border-b border-stone-200",
        "bg-[#f8f5ee]",
        "px-6 py-5",
      )}
    >
      <div className="flex flex-col ">
        <h1 className="text-xl font-semibold tracking-tight text-stone-900">
          Space Craft: Build Your Own 3D Scene
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Choose, arrange, and combine objects to build your own 3D scene. Some
          objects use GLB models, while others are generated procedurally with
          Three.js.
        </p>
        <a
          href="https://alimnfl.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 items-center gap-1 text-sm text-blue-600 transition-colors hover:text-blue-700 hover:underline flex-row flex"
        >
          alimnfl.com <RiArrowUpLine size={14} className="rotate-45" />
        </a>
      </div>
    </header>
  );
}
