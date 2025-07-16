import { ChevronDown, Search, X } from "lucide-react";
import { FC, memo, useEffect, useRef, useState } from "react";

import "./Dropdown.css";

export interface DropdownType {
  id: string;
  label: string;
}

interface DropdownProps {
  id?: string;
  value?: string;
  isLoading?: boolean;
  list: DropdownType[];
  placeholder: string;
  loadingMessage: string;
  noDataMessage?: string;
  handleOnClick: (dropdownId: string, item: DropdownType) => void;
}

const Dropdown: FC<DropdownProps> = ({
  id = "itemList",
  value,
  isLoading,
  list,
  placeholder,
  loadingMessage,
  noDataMessage = "No matches found",
  handleOnClick,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dropdownList, setDropdownList] = useState<DropdownType[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>(placeholder);
  const [search, setSearch] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearch(value);
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    setIsOpen(!isOpen);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      if (menu.id !== id) {
        menu.classList.remove("show");
      }
    });
  };

  const handleClear = (e: React.MouseEvent) => {
    handleOnClick(id, { id: "", label: "" });
    setSelectedItem(placeholder);
    setIsOpen(false);
    e.stopPropagation();
  };

  useEffect(() => {
    if (search) {
      const filteredList = list.filter((item) =>
        item.label.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      );
      setDropdownList(filteredList);
    } else {
      setDropdownList(list);
    }
  }, [list, search]);

  useEffect(() => {
    if (value) {
      const selectedItem = list.find((item) => item.id === value);
      if (selectedItem) {
        setSelectedItem(selectedItem.label);
      }
    } else {
      setSelectedItem(placeholder);
    }
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const dropdownMenu = document.getElementById(id);
      const target = e.target as Element;
      const toggleButton = target.closest("button");
      const inputElement = document.getElementById("search");
      const searchInput = document.querySelector("#search input");
      if (
        !dropdownMenu?.contains(target) &&
        toggleButton !== target &&
        inputElement?.contains(target) === false &&
        searchInput !== target
      ) {
        setIsOpen(false);
      }
    };

    if (document) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      if (document) {
        document.removeEventListener("click", handleOutsideClick);
      }
    };
  }, [isOpen]);

  return (
    <div className="mb-3">
      <div className="dropdown">
        <button
          className="btn btn-secondary dropdown-toggle btnClass d-flex align-items-center justify-content-between col-md-12 col-sm-12"
          type="button"
          aria-expanded="false"
          data-bs-target={`#${id}`}
          onClick={handleToggleClick}
          disabled={isLoading || (dropdownList.length === 0 && search === "")}
        >
          <span
            id={id}
            className="w-100 d-flex align-items-center justify-content-between"
            onClick={handleToggleClick}
          >
            {isLoading ? (
              <>
                {loadingMessage}
                <div
                  className="spinner-border loadingClass"
                  role="status"
                ></div>
              </>
            ) : dropdownList.length === 0 && search === "" ? (
              noDataMessage
            ) : (
              <span className="text-light">{selectedItem}</span>
            )}
            {selectedItem !== placeholder && (
              <X height="16px" onClick={handleClear} />
            )}
          </span>
        </button>
        {isOpen && (
          <div id={id} className={`${isOpen ? "show" : ""} menu dropdown-menu`}>
            <div id="search" className="px-3 pb-2">
              <input
                className="w-100 small"
                placeholder="Search"
                onChange={handleOnSearch}
                ref={inputRef}
              />
              <Search height="16px" className="search" />
            </div>
            <div className="menu-options overflow-auto ">
              {dropdownList.map((item, index) => (
                <div key={index} className="small">
                  <a
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedItem(item.label);
                      handleOnClick(id, item);
                    }}
                  >
                    {item.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Dropdown);
