import { Catalog } from "@/constants/CatalogRecord";
import { cn } from "@/tools/cn";

type WorkspaceSummaryProps = {
  placed: Catalog.PlacedItem[];
  total: number;
  isReady: boolean;
};

export function WorkspaceSummary({
  placed,
  total,
  isReady,
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
            {placed.map((item, index) => (
              <div
                key={`${item.def.type}-${index}`}
                className={cn(
                  "flex items-center justify-between",
                  "rounded-lg px-2 py-2.5",
                  "text-sm transition",
                  "hover:bg-white",
                )}
              >
                <span className="truncate pr-3 text-stone-700">
                  {item.def.name}
                </span>

                <span className="shrink-0 text-xs font-medium text-stone-500">
                  {Catalog.formatRupiah(item.def.price)}
                </span>
              </div>
            ))}
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
          // onClick={handleRent}
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
