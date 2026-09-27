"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/tools/cn";
import { RiCloseLine } from "@remixicon/react";

export interface DialogAction {
  caption: string;
  onClick?: (options: { close: () => void }) => void;
  variant?: "default" | "primary" | "destructive" | "subtle";
}

export interface DialogProps {
  children?: ReactNode;
  dismissible?: boolean;
  isOpen?: boolean;
  onChange?: (isOpen: boolean) => void;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: DialogAction[];
}

export interface DialogRef {
  open: () => void;
  close: () => void;
}

export const Dialog = forwardRef<DialogRef, DialogProps>(
  (
    {
      children,
      dismissible = true,
      isOpen = false,
      onChange,
      className,
      title,
      subtitle,
      actions = [],
    },
    ref,
  ) => {
    const [mounted, setMounted] = useState(isOpen);
    const [visible, setVisible] = useState(isOpen);

    const open = useCallback(() => {
      setMounted(true);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });

      onChange?.(true);
    }, [onChange]);

    const close = useCallback(() => {
      setVisible(false);
      onChange?.(false);
    }, [onChange]);

    useImperativeHandle(
      ref,
      () => ({
        open,
        close,
      }),
      [open, close],
    );

    /*
     * Sync with controlled state.
     */
    useEffect(() => {
      if (isOpen) {
        setMounted(true);

        requestAnimationFrame(() => {
          setVisible(true);
        });

        return;
      }

      setVisible(false);
    }, [isOpen]);

    /*
     * Unmount after the close animation.
     */
    useEffect(() => {
      if (visible || !mounted) {
        return;
      }

      const timeout = window.setTimeout(() => {
        setMounted(false);
      }, 200);

      return () => {
        window.clearTimeout(timeout);
      };
    }, [visible, mounted]);

    /*
     * Escape.
     */
    useEffect(() => {
      if (!mounted || !dismissible) {
        return;
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          close();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [mounted, dismissible, close]);

    if (!mounted) {
      return null;
    }

    return createPortal(
      <>
        {/* Overlay */}
        <div
          className={cn(
            "fixed inset-0 z-9998",
            "bg-black/50 backdrop-blur-sm",
            "transition-all duration-200 ease-out",
            visible ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          onMouseDown={(event) => {
            if (dismissible && event.target === event.currentTarget) {
              close();
            }
          }}
        />

        {/* Dialog */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title ?? "Dialog"}
          className={cn(
            "fixed left-1/2 top-1/2 z-9999",
            "w-[80vw] max-w-100",
            "overflow-hidden rounded-2xl",
            "border border-white/10",
            "bg-[#f8f5ee] text-white",
            "shadow-2xl",

            "transition-all duration-300",
            "ease-[cubic-bezier(0.16,1,0.3,1)]",

            visible
              ? "-translate-x-1/2 -translate-y-1/2 scale-100 opacity-100"
              : "-translate-x-1/2 translate-y-[-48%] scale-[0.96] opacity-0",

            className,
          )}
        >
          {/* Header */}
          {(title || subtitle) && (
            <div className="px-5 pb-2 pt-6 text-center">
              {title && (
                <h2 className="text-base text-black font-semibold tracking-tight">
                  {title}
                </h2>
              )}

              {subtitle && (
                <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
              )}
            </div>
          )}

          {/* Close */}
          {dismissible && (
            <button
              type="button"
              aria-label="Close dialog"
              onClick={close}
              className={cn(
                "absolute right-3 top-3 z-10",
                "flex h-7 w-7 items-center justify-center",
                "rounded-lg text-zinc-400",
                "transition-all duration-150",
                "hover:bg-white/10 hover:text-white",
                "hover:scale-105",
                "active:scale-95",
              )}
            >
              <RiCloseLine size={16} />
            </button>
          )}

          {/* Content */}
          {children && <div className="px-5 py-4">{children}</div>}

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex flex-col gap-2 px-5 pb-5">
              {actions.map((action, index) => (
                <button
                  key={`${action.caption}-${index}`}
                  type="button"
                  className={cn(
                    "flex h-10 w-full items-center justify-center",
                    "rounded-xl px-4 text-sm font-medium",
                    "transition-all duration-150",

                    "active:scale-[0.98]",

                    action.variant === "primary" &&
                      "bg-white text-black hover:bg-zinc-200",

                    action.variant === "destructive" &&
                      "bg-red-500 text-white hover:bg-red-400",

                    action.variant === "subtle" &&
                      "bg-white/5 text-zinc-300 hover:bg-white/10",

                    (!action.variant || action.variant === "default") &&
                      "bg-zinc-800 text-white hover:bg-zinc-700",
                  )}
                  onClick={() => {
                    action.onClick?.({
                      close,
                    });
                  }}
                >
                  {action.caption}
                </button>
              ))}
            </div>
          )}
        </div>
      </>,
      document.body,
    );
  },
);

Dialog.displayName = "Dialog";
