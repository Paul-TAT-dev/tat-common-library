import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  KeyboardEvent,
} from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import "./multiSelect.scss";

export interface OptionObject {
  id: string;
  label: string;
}

// 🔑 Dynamic Props: options and value must match type T
type MultiSelectInputProps<T extends string | OptionObject> = {
  id: string;
  value: T[]; // value type depends on options
  placeholder?: string;
  label?: string;
  options: T[]; // options and value must match
  onChange: (value: T[]) => void;
  hide?: boolean;
  className?: string;
  required?: boolean;
};

function MultiSelectInput<T extends string | OptionObject>({
  id,
  value,
  placeholder = "-- Select options --",
  label,
  options,
  onChange,
  hide,
  className,
  required,
}: MultiSelectInputProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isObjectMode = typeof options[0] === "object";

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFilter("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Add option
  const handleSelect = useCallback(
    (option: T) => {
      const exists = value.some((val) =>
        isObjectMode
          ? (val as OptionObject).id === (option as OptionObject).id
          : val === option
      );
      if (exists) return;
      onChange([...value, option]);
      setFilter("");
    },
    [value, onChange, isObjectMode]
  );

  // ✅ Remove option
  const handleRemove = useCallback(
    (option: T) => {
      const newValue = value.filter((val) =>
        isObjectMode
          ? (val as OptionObject).id !== (option as OptionObject).id
          : val !== option
      );
      onChange(newValue);
    },
    [value, onChange, isObjectMode]
  );

  // ✅ Filtered options
  const filteredOptions = useMemo(() => {
    return options
      .filter((opt) =>
        isObjectMode
          ? !value.some(
              (sel) => (sel as OptionObject).id === (opt as OptionObject).id
            )
          : !value.includes(opt as T)
      )
      .filter((opt) => {
        const label = isObjectMode
          ? (opt as OptionObject).label
          : (opt as string);
        return label.toLowerCase().includes(filter.toLowerCase());
      });
  }, [options, value, filter, isObjectMode]);

  // ✅ Keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") setIsOpen(false);
    if (e.key === "Enter" && filteredOptions.length > 0) {
      handleSelect(filteredOptions[0]);
    }
  };

  return (
    <div
      className={`multi-select-wrapper ${hide ? "d-none" : ""} ${className}`}
      ref={wrapperRef}
    >
      {label && (
        <label className="tat-input-label" htmlFor={id}>
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}

      <div
        className={`multi-select-default ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value.length > 0 && (
          <div className="multi-select-input">
            {value.map((item, index) => {
              const displayLabel = isObjectMode
                ? (item as OptionObject).label
                : (item as string);
              const key = isObjectMode
                ? (item as OptionObject).id
                : `${item}-${index}`;
              return (
                <span key={key} className="multi-select-chip">
                  <X
                    height="14px"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item);
                    }}
                    className="chip-remove"
                  />
                  {displayLabel}
                </span>
              );
            })}
          </div>
        )}

        {value.length === 0 && (
          <span className="multi-select-placeholder">{placeholder}</span>
        )}

        <span className="caret">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </div>

      {isOpen && (
        <div className="multi-select-dropdown">
          <div className="search-selected-wrapper">
            <input
              type="text"
              className="multi-select-search"
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <ul className="multi-select-options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, index) => {
                const displayLabel = isObjectMode
                  ? (opt as OptionObject).label
                  : (opt as string);
                const key = isObjectMode
                  ? (opt as OptionObject).id
                  : `${opt as string}-${index}`;
                return (
                  <li key={key} onClick={() => handleSelect(opt)}>
                    {displayLabel}
                  </li>
                );
              })
            ) : (
              <li className="empty">No matches found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MultiSelectInput;
