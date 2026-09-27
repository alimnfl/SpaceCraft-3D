import { Catalog } from "@/constants/CatalogRecord";
import { cn } from "@/tools/cn";

type WorkspaceSummaryProps = {
  placed: Catalog.PlacedItem[];
  selected: Catalog.PlacedItem | null;
  total: number;
  isReady: boolean;
  onSelect: (item: Catalog.PlacedItem) => void;
  onRemove: (item: Catalog.PlacedItem) => void;
};

export function WorkspaceSummary({
  placed,
  selected,
  total,
  isReady,
  onSelect,
  onRemove,
}: WorkspaceSummaryProps) {
  return (
    <aside
      className={cn(
        "flex min-h-0 flex-col",
        "border-l border-stone-200",
        "bg-[#f8f5ee] p-5",
      )}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
        Your setup
      </h3>

      <div className="mt-3 min-h-0 flex-1 overflow-y-auto">
        {placed.length === 0 ? (
          <div
            className={cn(
              "rounded-xl border border-dashed",
              "border-stone-300 px-4 py-8",
              "text-center text-xs text-stone-400",
            )}
          >
            Nothing added yet.
          </div>
        ) : (
          <div className="space-y-1">
            {placed.map((item, index) => {
              const active = selected === item;

              return (
                <div
                  key={`${item.def.type}-${index}`}
                  className={cn(
                    "flex items-center gap-2",
                    "rounded-lg px-2 py-2",
                    "transition",
                    active
                      ? "bg-white shadow-sm ring-1 ring-stone-200"
                      : "hover:bg-white",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    className={cn(
                      "min-w-0 flex-1 text-left",
                      "text-sm transition",
                      active ? "font-medium text-stone-900" : "text-stone-700",
                    )}
                  >
                    <span className="block truncate">{item.def.name}</span>

                    <span className="mt-0.5 block text-xs font-medium text-stone-500">
                      {Catalog.formatRupiah(item.def.price)}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemove(item)}
                    aria-label={`Remove ${item.def.name}`}
                    className={cn(
                      "shrink-0 rounded-md p-1.5",
                      "text-stone-400",
                      "transition",
                      "hover:bg-stone-100 hover:text-stone-700",
                      "active:scale-95",
                    )}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-stone-200 pt-5">
        <div className="text-2xl font-semibold tracking-tight text-stone-900">
          {Catalog.formatRupiah(total)}
        </div>

        <div className="mt-0.5 text-xs text-stone-400">per month</div>

        <button
          type="button"
          disabled={!isReady}
          className={cn(
            "mt-4 w-full rounded-xl",
            "px-4 py-3",
            "text-sm font-semibold",
            "shadow-sm transition",
            isReady
              ? ["bg-stone-900 text-white", "hover:bg-stone-800"]
              : ["cursor-not-allowed", "bg-stone-300 text-stone-500"],
          )}
        >
          Rent this setup
        </button>

        {!isReady && (
          <div className="mt-2 text-center text-[11px] text-stone-400">
            Add a desk and a chair to continue
          </div>
        )}
      </div>
    </aside>
  );
}
