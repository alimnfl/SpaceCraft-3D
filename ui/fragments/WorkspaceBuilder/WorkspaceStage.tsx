import { RefObject } from "react";
import { Catalog } from "@/constants/CatalogRecord";
import { cn } from "@/tools/cn";

type WorkspaceStageProps = {
  stageWrapRef: RefObject<HTMLElement | null>;
  selected: Catalog.PlacedItem | null;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  rotateSelected: (amount: number) => void;
  scaleSelected: (amount: number) => void;
  moveSelected: (x: number, z: number) => void;
  removeSelected: () => void;
};

export function WorkspaceStage({
  stageWrapRef,
  selected,
  handleDragOver,
  handleDrop,
  rotateSelected,
  scaleSelected,
  moveSelected,
  removeSelected,
}: WorkspaceStageProps) {
  return (
    <section
      ref={stageWrapRef}
      id="stageWrap"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn("relative min-w-0 overflow-hidden", "bg-[#e7d9bc]")}
    >
      {selected && (
        <div
          className={cn(
            "absolute left-1/2 top-4 z-20",
            "-translate-x-1/2",
            "flex items-center gap-1",
            "rounded-xl border border-stone-200",
            "bg-white/95 p-1.5",
            "shadow-lg backdrop-blur",
          )}
        >
          <span className="px-3 text-xs font-semibold text-stone-700">
            {selected.def.name}
          </span>

          <button
            type="button"
            onClick={() => rotateSelected(-0.35)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-stone-600 transition hover:bg-stone-100"
          >
            ⟲
          </button>

          <button
            type="button"
            onClick={() => rotateSelected(0.35)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-stone-600 transition hover:bg-stone-100"
          >
            ⟳
          </button>

          <div className="mx-1 h-5 w-px bg-stone-200" />

          <button
            type="button"
            onClick={() => scaleSelected(0.87)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-stone-600 transition hover:bg-stone-100"
          >
            −
          </button>

          <button
            type="button"
            onClick={() => scaleSelected(1.15)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-stone-600 transition hover:bg-stone-100"
          >
            +
          </button>

          <div className="mx-1 h-5 w-px bg-stone-200" />

          <button
            type="button"
            onClick={() => moveSelected(0, 5)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-600 transition hover:bg-stone-100"
          >
            ↑
          </button>

          <button
            type="button"
            onClick={() => moveSelected(0, -5)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-600 transition hover:bg-stone-100"
          >
            ↓
          </button>

          <div className="mx-1 h-5 w-px bg-stone-200" />

          <button
            type="button"
            onClick={removeSelected}
            className="rounded-lg px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      )}
    </section>
  );
}
