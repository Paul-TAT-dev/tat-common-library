import { ChangeEvent, FC, memo, useCallback } from 'react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  setItemsPerPage: (itemsPerPage: number) => void;
  currentPage: number;
  setCurrentPage: (pageNumber: number) => void;
  onPageChange: (pageNumber: number, itemsPerPage: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage,
  onPageChange
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const visiblePageCount = 5;

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    onPageChange(pageNumber, itemsPerPage);
  };

  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setItemsPerPage(newSize);
    onPageChange(1, newSize);
  };

  const getPageRange = useCallback((): number[] => {
    let start = Math.max(1, currentPage - Math.floor(visiblePageCount / 2));
    let end = start + visiblePageCount - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - visiblePageCount + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [totalItems, itemsPerPage]);

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mt-3 gap-3">
      <span className="text-muted">
        Showing {startItem}-{endItem} of {totalItems}
      </span>
      <div className="d-flex align-items-center gap-2">
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                &laquo;
              </button>
            </li>

            {getPageRange().map(page => (
              <li
                key={page}
                className={`page-item ${currentPage === page ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
        <select
          className="form-select form-select-sm w-auto"
          value={itemsPerPage}
          onChange={handlePageSizeChange}
        >
          {[10, 25, 50, 100].map(size => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default memo(Pagination);
