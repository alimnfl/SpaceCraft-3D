import { Catalog } from "@/constants/CatalogRecord";
import { cn } from "@/tools/cn";
import Image from "next/image";

type WorkspacePaletteProps = {
  activeCategory: Catalog.Type;
  setActiveCategory: (category: Catalog.Type) => void;
  categoryItems: Catalog.Item[];
  glbLoading: boolean;
  handleDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    item: Catalog.Item,
  ) => void;
};

export function WorkspacePalette({
  activeCategory,
  setActiveCategory,
  categoryItems,
  glbLoading,
  handleDragStart,
}: WorkspacePaletteProps) {
  const categories = Object.values(Catalog.Type);

  return (
    <aside
      className={cn(
        "flex min-h-0 flex-col",
        "border-r border-stone-200",
        "bg-[#f8f5ee]",
      )}
    >
      <div className="border-b border-stone-200 p-4">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
          Categories
        </div>

        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => {
            const active = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "cursor-pointer",
                  "rounded-xl border px-3 py-2.5",
                  "text-left text-xs font-medium",
                  "transition-all duration-150",
                  "hover:shadow-sm",
                  "active:translate-y-0 active:scale-[0.98]",
                  active
                    ? [
                        "border-stone-900",
                        "bg-stone-900",
                        "text-white",
                        "shadow-sm",
                        "hover:border-stone-900",
                        "hover:bg-stone-800",
                        "hover:shadow-md",
                      ]
                    : [
                        "border-stone-200",
                        "bg-white",
                        "text-stone-600",
                        "hover:border-stone-300",
                        "hover:bg-stone-50",
                        "hover:text-stone-900",
                      ],
                )}
              >
                {Catalog.buildName(category)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-stone-800">
            {Catalog.buildName(activeCategory)}
          </div>

          <div className="text-[11px] text-stone-400">
            {categoryItems.length} item
            {categoryItems.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="space-y-2">
          {categoryItems.map((item) => {
            const isGlb = item.kind === "glb";
            const disabled = isGlb && glbLoading;

            return (
              <div
                key={item.name}
                draggable={!disabled}
                onDragStart={(event) => handleDragStart(event, item)}
                className={cn(
                  "group rounded-xl border",
                  "bg-white p-3",
                  "transition-all duration-150",
                  disabled
                    ? ["cursor-not-allowed", "border-stone-200", "opacity-50"]
                    : [
                        "cursor-grab",
                        "border-stone-200",
                        "shadow-sm",
                        "hover:-translate-y-0.5",
                        "hover:border-stone-300",
                        "hover:shadow-md",
                        "active:cursor-grabbing",
                      ],
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "relative h-11 w-11 shrink-0",
                      "overflow-hidden rounded-lg border border-black/5",
                      "shadow-inner",
                    )}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-stone-900">
                      {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    </div>

                    <div className="mt-0.5 text-xs text-stone-500">
                      {Catalog.formatRupiah(item.price)}/mo
                    </div>
                  </div>
                </div>

                {isGlb && glbLoading && (
                  <div
                    className={cn(
                      "mt-2 rounded-md",
                      "bg-stone-100 px-2 py-1",
                      "text-[10px] font-medium",
                      "text-stone-500",
                    )}
                  >
                    Loading real 3D model…
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-stone-200 p-4">
        <div
          className={cn(
            "rounded-xl bg-stone-100 p-3",
            "text-xs leading-relaxed text-stone-500",
          )}
        >
          Drag a piece onto the floor. Click a placed piece to rotate, resize,
          or remove it.
        </div>
      </div>
    </aside>
  );
}
