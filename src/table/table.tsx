import React, { memo, ReactNode, useEffect, useState } from "react";

import { Pagination } from "./pagination";

import "./table.css";

export enum PaginationPosition {
  TOP = "top",
  BOTTOM = "bottom",
  BOTH = "both",
  NONE = "none",
}

export interface HeaderProps {
  label: ReactNode;
  width?: string;
}

interface TableProps {
  header: HeaderProps[];
  data: ReactNode[][];
  totalPages?: number;
  itemsPerPage: number;
  setItemsPerPage: (itemsPerPage: number) => void;
  currentPage: number;
  setCurrentPage: (pageNumber: number) => void;
  paginationPosition?: PaginationPosition;
  noDataMessage?: string;
}

const Table: React.FC<TableProps> = ({
  header,
  data,
  totalPages = 1,
  itemsPerPage = 10,
  setItemsPerPage,
  currentPage = 1,
  setCurrentPage,
  paginationPosition = PaginationPosition.BOTTOM,
  noDataMessage = "No data found",
}) => {
  const [filteredData, setFilteredData] = useState(data);

  const updateData = (pNumber: number, iPerPage: number) => {
    if (process.env.NODE_ENV === "development") {
      const startIndex = (pNumber - 1) * iPerPage;
      const endIndex = startIndex + iPerPage;
      const paginatedItems = data.slice(startIndex, endIndex);
      setFilteredData(paginatedItems);
    } else {
      setFilteredData(data);
    }
  };

  useEffect(() => {
    updateData(currentPage, itemsPerPage);
  }, [data]);

  return (
    <div>
      {(paginationPosition === PaginationPosition.TOP ||
        paginationPosition === PaginationPosition.BOTH) &&
        filteredData.length > 0 && (
          <Pagination
            totalItems={totalPages}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={(p, i) => {
              updateData(p, i);
            }}
          />
        )}
      <table className="table table-striped table-hover my-3">
        <thead className="table-dark">
          <tr>
            {header.map((item, index) => (
              <th key={index} style={{ width: item?.width || "" }}>
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                {item.map((item, index) => (
                  <td key={index}>{item}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr style={{ textAlign: "center" }}>
              <td colSpan={header.length}>{noDataMessage}</td>
            </tr>
          )}
        </tbody>
      </table>

      {(paginationPosition === PaginationPosition.BOTTOM ||
        paginationPosition === PaginationPosition.BOTH) &&
        filteredData.length > 0 && (
          <Pagination
            totalItems={totalPages}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={(p, i) => {
              updateData(p, i);
            }}
          />
        )}
    </div>
  );
};

export default memo(Table);
