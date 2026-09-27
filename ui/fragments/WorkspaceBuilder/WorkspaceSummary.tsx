import { Catalog } from "@/constants/CatalogRecord";
import { cn } from "@/tools/cn";
import { Dialog } from "@/ui/components/Dialog";
import { useState } from "react";

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
  const [isRentDialogOpen, setIsRentDialogOpen] = useState(false);

  return (
    <>
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
                        active
                          ? "font-medium text-stone-900"
                          : "text-stone-700",
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
            onClick={() => setIsRentDialogOpen(true)}
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

      <Dialog
        isOpen={isRentDialogOpen}
        onChange={setIsRentDialogOpen}
        title="Your workspace"
        subtitle="Review your setup before renting"
        dismissible
      >
        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Selected setup
              </span>

              <span className="text-xs text-stone-400">
                {placed.length} items
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
              {placed.map((item, index) => (
                <div
                  key={`${item.def.type}-${index}`}
                  className={cn(
                    "flex items-center justify-between gap-4",
                    "px-3 py-3",
                    index !== placed.length - 1 && "border-b border-stone-200",
                  )}
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-stone-800">
                      {item.def.name}
                    </div>

                    <div className="mt-0.5 text-xs capitalize text-stone-400">
                      {item.def.type}
                    </div>
                  </div>

                  <div className="shrink-0 text-sm font-medium text-stone-700">
                    {Catalog.formatRupiah(item.def.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-stone-100 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500">Monthly rental</span>

              <span className="text-lg font-semibold text-stone-900">
                {Catalog.formatRupiah(total)}
              </span>
            </div>

            <div className="mt-3 border-t border-stone-200 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400">Delivery</span>

                <span className="font-medium text-stone-600">Bali</span>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-stone-400">Rental period</span>

                <span className="font-medium text-stone-600">Flexible</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={() => {
              // TODO: connect this to the real rental flow
              setIsRentDialogOpen(false);
            }}
            className={cn(
              "w-full rounded-xl",
              "bg-stone-900 px-4 py-3",
              "text-sm font-semibold text-white",
              "shadow-sm transition",
              "hover:bg-stone-800",
              "active:scale-[0.99]",
            )}
          >
            Continue with this setup
          </button>

          <p className="text-center text-[11px] leading-relaxed text-stone-400">
            Final rental details and delivery arrangements will be confirmed
            with you.
          </p>
        </div>
      </Dialog>
    </>
  );
}
