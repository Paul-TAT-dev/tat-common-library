/**
 * Shared types used across multiple components.
 */

/**
 * Generic option for selects (Radio, MultiSelect, SearchDropdown).
 * Previously declared three separate times as `OptionObject` / `itemType`.
 */
export interface OptionObject {
  id: string;
  label: string;
}

/** @deprecated Use `OptionObject`. Kept as an alias for backward compat. */
export type ItemType = OptionObject;
