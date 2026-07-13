import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  KeyboardEvent,
} from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useClickOutside } from "../../hooks";
import { OptionObject } from "../../types";
import "./multiSelect.scss";

export type { OptionObject };

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
  isOverflow?: boolean;
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
  isOverflow,
}: MultiSelectInputProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  // When there isn't enough room below the field (e.g. it's near the
  // bottom of the viewport / behind a sticky action bar), open the
  // options list upward instead of downward.
  const [dropUp, setDropUp] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isObjectMode = typeof options[0] === "object";

  // Close dropdown on outside click.
  useClickOutside(wrapperRef, () => {
    setIsOpen(false);
    setFilter("");
  });

  // Decide drop direction whenever the list opens (and keep it in sync
  // with viewport changes — resize/scroll — while it's open).
  useEffect(() => {
    if (!isOpen) return;
    const updateDropDirection = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const estimatedDropdownHeight = 220; // search input + options list
      setDropUp(
        spaceBelow < estimatedDropdownHeight &&
          rect.top > estimatedDropdownHeight,
      );
    };
    updateDropDirection();
    window.addEventListener("resize", updateDropDirection);
    window.addEventListener("scroll", updateDropDirection, true);
    return () => {
      window.removeEventListener("resize", updateDropDirection);
      window.removeEventListener("scroll", updateDropDirection, true);
    };
  }, [isOpen]);

  // ✅ Add option
  const handleSelect = useCallback(
    (option: T) => {
      const exists = value.some((val) =>
        isObjectMode
          ? (val as OptionObject).id === (option as OptionObject).id
          : val === option,
      );
      if (exists) return;
      onChange([...value, option]);
      setFilter("");
    },
    [value, onChange, isObjectMode],
  );

  // ✅ Remove option
  const handleRemove = useCallback(
    (option: T) => {
      const newValue = value.filter((val) =>
        isObjectMode
          ? (val as OptionObject).id !== (option as OptionObject).id
          : val !== option,
      );
      onChange(newValue);
    },
    [value, onChange, isObjectMode],
  );

  // ✅ Filtered options
  const filteredOptions = useMemo(() => {
    return options
      .filter((opt) =>
        isObjectMode
          ? !value.some(
              (sel) => (sel as OptionObject).id === (opt as OptionObject).id,
            )
          : !value.includes(opt as T),
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
      className={`tat-multi-select ${hide ? "d-none" : ""} ${className}`}
      ref={wrapperRef}
    >
      {label && (
        <label className="tat-input-label" htmlFor={id}>
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}

      <div
        className={`tat-multi-select-control ${isOpen ? "is-open" : ""} ${isOpen && dropUp ? "drop-up" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value.length > 0 && (
          <div className={`tat-multi-select-values ${isOverflow ? "is-overflow" : ""}`}>
            {value.map((item, index) => {
              const displayLabel = isObjectMode
                ? (item as OptionObject).label
                : (item as string);
              const key = isObjectMode
                ? (item as OptionObject).id
                : `${item}-${index}`;
              return (
                <span key={key} className="tat-multi-select-chip">
                  <X
                    height="14px"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item);
                    }}
                    className="tat-multi-select-chip-remove"
                  />
                  {displayLabel}
                </span>
              );
            })}
          </div>
        )}

        {value.length === 0 && (
          <span className="tat-multi-select-placeholder">{placeholder}</span>
        )}

        <span className="tat-multi-select-caret">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </div>

      {isOpen && (
        <div className={`tat-multi-select-menu ${dropUp ? "drop-up" : ""}`}>
          <div className="tat-multi-select-search-wrapper">
            <input
              type="text"
              className="tat-multi-select-search"
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <ul className="tat-multi-select-options">
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
              <li className="tat-multi-select-empty">No matches found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MultiSelectInput;
