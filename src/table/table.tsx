import React, { memo, ReactNode, useMemo } from "react";

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
  // Derived view: if totalPages is provided (server-side pagination), trust
  // the parent and show `data` as-is. Otherwise slice client-side.
  const isServerPaginated = totalPages > 0 && totalPages !== data.length;
  const filteredData = useMemo(() => {
    if (isServerPaginated) return data;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage, isServerPaginated]);

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
            onPageChange={() => {
              /* page state is owned by parent; slicing reacts via useMemo */
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
            filteredData.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx}>{cell}</td>
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
            onPageChange={() => {
              /* page state is owned by parent; slicing reacts via useMemo */
            }}
          />
        )}
    </div>
  );
};

export default memo(Table);
