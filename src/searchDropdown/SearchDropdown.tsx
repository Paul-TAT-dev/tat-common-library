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

interface Props {
  id: string;
  value: string;
  options: itemType[];
  placeholder?: string;
  onChange: (id: string, value: itemType | null) => void;
  noDataMessage?: string;
  isLoading?: boolean;
  loadingMessage?: string;
}

const SearchableDropdown: React.FC<Props> = ({
  id,
  value,
  options,
  placeholder = "-- Select an option --",
  onChange,
  noDataMessage,
  isLoading,
  loadingMessage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<itemType | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [debouncedSearch] = useDebounce(search, 300);

  // ✅ Deduplicate options once
  const uniqueOptions = useMemo(() => {
    const seen = new Map<string, itemType>();
    options.forEach((opt) => {
      if (!seen.has(opt.id)) seen.set(opt.id, opt);
    });
    return Array.from(seen.values());
  }, [options]);

  // ✅ Filter efficiently (O(n))
  const filteredOptions = useMemo(() => {
    if (!debouncedSearch) return uniqueOptions;
    const lower = debouncedSearch.toLowerCase();
    return uniqueOptions.filter((opt) =>
      opt.label.toLowerCase().includes(lower)
    );
  }, [uniqueOptions, debouncedSearch]);

  const toggleDropdown = useCallback(() => {
    if (!isLoading) setIsOpen((prev) => !prev);
  }, [isLoading]);

  // ✅ Keep selection in sync with external `value`
  useEffect(() => {
    if (!value) {
      setSelected(null);
    } else {
      const item = uniqueOptions.find((opt) => opt.id === value);
      setSelected(item || null);
    }
  }, [value, uniqueOptions]);

  const selectOption = useCallback(
    (option: itemType) => {
      setSelected(option);
      setIsOpen(false);
      setSearch("");
      onChange?.(id, option);
    },
    [id, onChange]
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

  // ✅ Lightweight outside click listener
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

  return (
    <div
      id={id}
      className="search-dropdown-wrapper col-12 col-md-12 col-sm-12"
      ref={wrapperRef}
    >
      <div
        className={`${isOpen ? "active" : ""} search-dropdown-input`}
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
            value={selected ? selected.label : ""}
            placeholder={placeholder}
            readOnly
          />
        )}
        {selected && <X height="16px" onClick={clearSelection} />}
        <span className="search-caret">
          {isOpen ? <ChevronUp height="16px" /> : <ChevronDown height="16px" />}
        </span>
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
              filteredOptions.map((opt) => (
                <li key={opt.id} onClick={() => selectOption(opt)}>
                  {opt.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
