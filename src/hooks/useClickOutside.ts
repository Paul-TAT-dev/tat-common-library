import { RefObject, useEffect } from "react";

/**
 * Fires `handler` when a pointer event happens outside the element pointed to
 * by `ref`. Pass `enabled = false` to skip the listener (e.g. when the popover
 * is closed and you don't need to listen).
 *
 * Uses `pointerdown` so it fires for both mouse and touch on a single listener,
 * and {passive: true} so it never blocks scrolling.
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: PointerEvent) => void,
  enabled: boolean = true,
): void {
  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (event: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      if (el.contains(event.target as Node)) return;
      handler(event);
    };

    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () =>
      document.removeEventListener("pointerdown", onPointerDown);
  }, [ref, handler, enabled]);
}
