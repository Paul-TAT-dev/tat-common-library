import React, { useEffect, useRef, useState } from "react";

import "./SearchableDropdown.scss";

import { ChevronDown, ChevronUp, X } from "lucide-react";

export interface itemType {
  id: string;
  label: string;
}

interface Props {
  id: string;
  value: string;
  options: itemType[];
  placeholder?: string;
  onChange: (id: string, value: itemType) => void;
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

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleDropdown = () => !isLoading && setIsOpen((prev) => !prev);

  useEffect(() => {
    if (value) {
      const item = options.find((opt) => opt.id === value);
      setSelected(item || null);
    }
  }, [value]);

  const selectOption = (option: itemType) => {
    setSelected(option);
    setIsOpen(false);
    setSearch("");
    onChange && onChange(id, option);
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(null);
    setSearch("");
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      id={id}
      className="search-dropdown-wrapper col-12 col-md-12 col-sm-12"
      ref={wrapperRef}
    >
      <div
        className="search-dropdown-input"
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
          <input
            type="text"
            className="search-dropdown-search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <ul className="search-dropdown-options">
            {filteredOptions.length === 0 && (
              <li>{noDataMessage || "No matches found"}</li>
            )}
            {filteredOptions.map((opt) => (
              <li key={opt.id} onClick={() => selectOption(opt)}>
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
