import { ChevronDown, ChevronUp, X } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./SearchDropdown.scss";

export interface itemType {
  id: string;
  label: string;
}

type Option = string | itemType;

interface Props<T extends Option> {
  id: string;
  value: string;
  options: T[];
  placeholder?: string;
  label?: string;
  onChange: (id: string, value: T | null) => void;
  noDataMessage?: string;
  isLoading?: boolean;
  loadingMessage?: string;
  hide?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  customOption?: React.ReactNode;

  serverSide?: boolean;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;

  onEndReached?: () => void;
  endReachedThresholdPx?: number;

  itemHeight?: number;
  maxMenuHeight?: number;
}

function isItemType(x: unknown): x is itemType {
  return (
    !!x && typeof x === "object" && "id" in (x as any) && "label" in (x as any)
  );
}

const SearchDropdown = <T extends Option>({
  id,
  value,
  options,
  placeholder = "-- Select an option --",
  label,
  onChange,
  noDataMessage,
  isLoading,
  loadingMessage,
  hide,
  disabled = false,
  required = false,
  className,
  customOption,

  serverSide = false,
  searchValue,
  onSearchValueChange,

  onEndReached,
  endReachedThresholdPx = 80,

  itemHeight = 32,
  maxMenuHeight = 240,
}: Props<T>) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  const actualSearch = searchValue ?? localSearch;
  const isObjectMode = useMemo(() => isItemType(options[0]), [options]);

  const { uniqueOptions, byId, byLabel } = useMemo(() => {
    const uniq: T[] = [];
    const idMap = new Map<string, T>();
    const labelMap = new Map<string, T>();

    if (isObjectMode) {
      for (const opt of options as unknown as itemType[]) {
        if (!idMap.has(opt.id)) {
          const typed = opt as unknown as T;
          idMap.set(opt.id, typed);
          labelMap.set(opt.label, typed);
          uniq.push(typed);
        }
      }
    } else {
      const seen = new Set<string>();
      for (const s of options as unknown as string[]) {
        if (!seen.has(s)) {
          seen.add(s);
          uniq.push(s as unknown as T);
        }
      }
    }

    return { uniqueOptions: uniq, byId: idMap, byLabel: labelMap };
  }, [options, isObjectMode]);

  const selected: T | null = useMemo(() => {
    if (!value) return null;
    if (isObjectMode) {
      return (byId.get(value) ?? byLabel.get(value) ?? null) as T | null;
    }
    return uniqueOptions.includes(value as any)
      ? (value as unknown as T)
      : null;
  }, [value, isObjectMode, byId, byLabel, uniqueOptions]);

  const displayLabel = useMemo(() => {
    if (!selected) return "";
    return isObjectMode
      ? (selected as unknown as itemType).label
      : (selected as unknown as string);
  }, [selected, isObjectMode]);

  const shownOptions = useMemo(() => {
    if (serverSide) return uniqueOptions;

    const q = actualSearch.trim().toLowerCase();
    if (!q) return uniqueOptions;

    if (isObjectMode) {
      return uniqueOptions.filter((opt) =>
        ((opt as unknown as itemType).label || "").toLowerCase().includes(q),
      );
    }
    return uniqueOptions.filter((opt) =>
      (opt as unknown as string).toLowerCase().includes(q),
    );
  }, [serverSide, uniqueOptions, actualSearch, isObjectMode]);

  const toggleDropdown = useCallback(() => {
    if (disabled || isLoading) return;
    setIsOpen((v) => !v);
  }, [disabled, isLoading]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const el = wrapperRef.current;
      if (!el) return;
      if (!el.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const setSearchValueSafe = useCallback(
    (next: string) => {
      if (onSearchValueChange) onSearchValueChange(next);
      else setLocalSearch(next);
    },
    [onSearchValueChange],
  );

  const clearSelection = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(id, null);
      setSearchValueSafe("");
      setIsOpen(true);
      const node = listRef.current;
      if (node) node.scrollTop = 0;
    },
    [id, onChange, setSearchValueSafe],
  );

  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValueSafe(e.target.value);
      if (!disabled && !isLoading) setIsOpen(true);
    },
    [setSearchValueSafe, disabled, isLoading],
  );

  // Virtualization
  const [scrollTop, setScrollTop] = useState(0);

  const onScroll = useCallback(() => {
    const node = listRef.current;
    if (!node) return;

    setScrollTop(node.scrollTop);

    if (onEndReached) {
      const remaining =
        node.scrollHeight - (node.scrollTop + node.clientHeight);
      if (remaining <= endReachedThresholdPx) onEndReached();
    }
  }, [onEndReached, endReachedThresholdPx]);

  const total = shownOptions.length;
  // FIX: always reserve at least one row of height. The previous formula
  // `Math.min(maxMenuHeight, total * itemHeight)` collapsed to 0 when there
  // were no options, which clipped the empty-state / loading <li> because
  // the SCSS sets overflow-y: auto. With Math.max(itemHeight, ...) the
  // empty/loading message is always visible.
  const viewportHeight = Math.max(
    itemHeight,
    Math.min(maxMenuHeight, total * itemHeight),
  );
  const overscan = 6;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(viewportHeight / itemHeight) + overscan * 2;
  const endIndex = Math.min(total, startIndex + visibleCount);

  const visibleOptions = useMemo(
    () => shownOptions.slice(startIndex, endIndex),
    [shownOptions, startIndex, endIndex],
  );

  const topSpacer = startIndex * itemHeight;
  const bottomSpacer = (total - endIndex) * itemHeight;

  const onOptionClick = useCallback(
    (e: React.MouseEvent<HTMLUListElement>) => {
      const target = e.target as HTMLElement;
      const li = target.closest("li[data-idx]") as HTMLLIElement | null;
      if (!li) return;

      const absoluteIdx = Number(li.dataset.idx);
      const opt = shownOptions[absoluteIdx];
      if (!opt) return;

      onChange(id, opt);
      setIsOpen(false);
    },
    [shownOptions, id, onChange],
  );

  useLayoutEffect(() => {
    if (!isOpen) return;
    const node = listRef.current;
    if (node) node.scrollTop = 0;
    setScrollTop(0);
  }, [isOpen]);

  return (
    <div
      className={`search-dropdown-wrapper col-12 col-md-12 col-sm-12 ${
        hide ? "d-none" : ""
      } ${className ?? ""}`}
      ref={wrapperRef}
    >
      {label && (
        <label className="tat-input-label" htmlFor={id}>
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div
        className={`${isOpen ? "active" : ""} search-dropdown-input ${
          disabled ? "disabled" : ""
        }`}
        onClick={toggleDropdown}
        tabIndex={0}
      >
        {isLoading ? (
          <span className="search-loading">
            {loadingMessage || "Loading..."}
          </span>
        ) : (
          <input
            id={id}
            type="text"
            className="search-selected-value"
            value={displayLabel}
            placeholder={placeholder}
            readOnly
            disabled={disabled}
          />
        )}

        {selected && !disabled && <X height="16px" onClick={clearSelection} />}

        {!disabled && (
          <span className="search-caret">
            {isOpen ? (
              <ChevronUp height="16px" />
            ) : (
              <ChevronDown height="16px" />
            )}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="search-dropdown-menu">
          <div className="search-selected-wrapper">
            <input
              type="text"
              className="search-dropdown-search"
              placeholder="Search..."
              value={actualSearch}
              onChange={onSearchChange}
              autoFocus
            />
          </div>

          <ul
            className="search-dropdown-options"
            ref={listRef}
            onScroll={onScroll}
            onClick={onOptionClick}
            style={{ maxHeight: viewportHeight }}
          >
            {customOption && (
              <li
                className="search-dropdown-custom"
                onClick={(e) => e.stopPropagation()}
              >
                {customOption}
              </li>
            )}

            {total === 0 ? (
              <li className="search-dropdown-empty">
                {isLoading
                  ? loadingMessage || "Loading..."
                  : noDataMessage || "No matches found"}
              </li>
            ) : (
              <>
                {topSpacer > 0 && (
                  <li style={{ height: topSpacer, padding: 0 }} aria-hidden />
                )}

                {visibleOptions.map((opt, localIdx) => {
                  const absoluteIdx = startIndex + localIdx;

                  const key = isObjectMode
                    ? (opt as unknown as itemType).id
                    : `${opt as unknown as string}-${absoluteIdx}`;

                  const labelText = isObjectMode
                    ? (opt as unknown as itemType).label
                    : (opt as unknown as string);

                  return (
                    <li key={key} data-idx={absoluteIdx}>
                      {labelText}
                    </li>
                  );
                })}

                {bottomSpacer > 0 && (
                  <li
                    style={{ height: bottomSpacer, padding: 0 }}
                    aria-hidden
                  />
                )}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
