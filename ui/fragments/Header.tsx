"use client";

import { cn } from "@/tools/cn";
import Image from "next/image";

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
      <div
        className={cn(
          "rounded-full ",
          "bg-white px-4 py-2 pb-3",
          "text-xs font-semibold tracking-wide text-stone-700",
        )}
      >
        <Image src={"/icon.png"} width={100} height={100} alt="icon" />
      </div>
      <div className="flex text-end flex-col justify-end items-end w-[60%]">
        <h1 className="text-xl font-semibold tracking-tight text-stone-900">
          Alim Naufal x Desent.io | 3D Models Choose
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Most items use GLB models, while some are procedurally generated with
          Three.js. Drag the empty space to look around and scroll to zoom.
        </p>
        <a
          href="https://alimnfl.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-sm text-blue-600 transition-colors hover:text-blue-700 hover:underline"
        >
          alimnfl.com ↗
        </a>
      </div>
    </header>
  );
}
