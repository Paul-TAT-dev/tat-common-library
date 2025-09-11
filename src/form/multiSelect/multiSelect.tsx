import React, { FC, useState, useRef, useEffect } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

import "./multiSelect.scss";

interface OptionObject {
  id: string;
  label: string;
}

type ValueType = string[] | OptionObject[];
type OptionsType = string[] | OptionObject[];

interface InputProps {
  id: string;
  value: ValueType;
  placeholder?: string;
  label?: string;
  options: OptionsType;
  onChange: (value: ValueType) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const MultiSelectInput: FC<InputProps> = ({
  id,
  value,
  placeholder = "-- Select options --",
  label,
  options,
  onChange,
  onKeyDown,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [showInput, setShowInput] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isObjectMode =
    Array.isArray(options) &&
    options.length > 0 &&
    typeof options[0] === "object";

  const selected = value as any[];

  // ✅ Outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFilter("");
        if (selected.length > 0) setShowInput(false);
      } else {
        setShowInput(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selected]);

  const handleSelect = (option: any) => {
    const exists = selected.some((val) =>
      isObjectMode ? val.id === option.id : val === option
    );
    if (exists) return;
    onChange([...selected, option]);
    setFilter("");
    setShowInput(true);
  };

  const handleRemove = (option: any) => {
    const newValue = selected.filter((val) =>
      isObjectMode ? val.id !== option.id : val !== option
    );
    onChange(newValue);
    if (newValue.length === 0) setShowInput(true);
  };

  // ✅ Filtered options
  const filteredOptions = (options as any[])
    .filter((opt) =>
      isObjectMode
        ? !selected.some((sel) => sel.id === opt.id)
        : !selected.includes(opt)
    )
    .filter((opt) => {
      const label = isObjectMode
        ? (opt as OptionObject).label
        : (opt as string);
      return label.toLowerCase().includes(filter.toLowerCase());
    });

  return (
    <div className="multi-select-wrapper mb-3" ref={wrapperRef}>
      {label && (
        <label className="tat-input-label" htmlFor={id}>
          {label}
        </label>
      )}

      <div
        className={`multi-select-default ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(true)}
      >
        {selected.length > 0 && (
          <div className="multi-select-input">
            {selected.map((item, index) => {
              const displayLabel = isObjectMode
                ? (item as OptionObject).label
                : (item as string);
              return (
                <span
                  key={
                    isObjectMode
                      ? (item as OptionObject).id
                      : `${item}-${index}`
                  }
                  className="multi-select-chip"
                >
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

        {showInput && (
          <span className="multi-select-placeholder">
            {selected.length > 0 ? "" : placeholder}
          </span>
        )}
        {showInput && (
          <span className="caret">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        )}
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
                  : `${opt}-${index}`;
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
};

export default MultiSelectInput;
