import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import "./SearchableDropdown.scss";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useDebounce } from "use-debounce";

export interface itemType {
  id: string;
  label: string;
}

type Option = string | itemType;

interface Props<T extends Option> {
  id: string;
  value: string; // external selected value (string id or string value)
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
  classNames?: string;
}

const SearchableDropdown = <T extends Option>({
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
  classNames,
}: Props<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<T | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [debouncedSearch] = useDebounce(search, 300);

  const isObjectMode = typeof options[0] === "object";

  // ✅ Deduplicate options
  const uniqueOptions = useMemo(() => {
    if (isObjectMode) {
      const seen = new Map<string, itemType>();
      (options as itemType[]).forEach((opt) => {
        if (!seen.has(opt.id)) seen.set(opt.id, opt);
      });
      return Array.from(seen.values()) as T[];
    }
    return Array.from(new Set(options as string[])) as T[];
  }, [options]);

  // ✅ Filter
  const filteredOptions = useMemo(() => {
    if (!debouncedSearch) return uniqueOptions;
    const lower = debouncedSearch.toLowerCase();

    return uniqueOptions.filter((opt) => {
      if (isObjectMode) {
        return (opt as itemType).label.toLowerCase().includes(lower);
      }
      return (opt as string).toLowerCase().includes(lower);
    });
  }, [uniqueOptions, debouncedSearch, isObjectMode]);

  const toggleDropdown = useCallback(() => {
    if (!isLoading && !disabled) setIsOpen((prev) => !prev);
  }, [isLoading, disabled]);

  // ✅ Keep external value in sync
  useEffect(() => {
    if (!value) {
      setSelected(null);
    } else {
      if (isObjectMode) {
        const item = (uniqueOptions as itemType[]).find(
          (opt) => opt.id === value
        );
        setSelected((item as T) || null);
      } else {
        const item = (uniqueOptions as string[]).find((opt) => opt === value);
        setSelected((item as T) || null);
      }
    }
  }, [value, uniqueOptions, isObjectMode]);

  const selectOption = useCallback(
    (option: T) => {
      setSelected(option);
      setIsOpen(false);
      setSearch("");

      const returnId = isObjectMode
        ? (option as itemType).id
        : (option as string);
      onChange?.(id, option);
    },
    [id, onChange, isObjectMode]
  );

  const clearSelection = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelected(null);
      setSearch("");
      onChange?.(id, null);
    },
    [id, onChange]
  );

  // ✅ Outside click
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const displayLabel = selected
    ? isObjectMode
      ? (selected as itemType).label
      : (selected as string)
    : "";

  return (
    <div
      id={id}
      className={`search-dropdown-wrapper col-12 col-md-12 col-sm-12 ${
        hide ? "d-none" : ""
      } ${classNames}`}
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          <ul className="search-dropdown-options">
            {filteredOptions.length === 0 ? (
              <li>{noDataMessage || "No matches found"}</li>
            ) : (
              filteredOptions.map((opt, idx) => {
                const key = isObjectMode
                  ? (opt as itemType).id
                  : `${opt as string}-${idx}`;
                const labelText = isObjectMode
                  ? (opt as itemType).label
                  : (opt as string);

                return (
                  <li key={key} onClick={() => selectOption(opt)}>
                    {labelText}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
