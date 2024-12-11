import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from 'react-icons/fa';

interface IPaginationComponentProps {
  totalPages: number;
  currentPage: number;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (pageNum: number) => void;
  visiblePages?: number; // Number of pages to show at a time
}

const Pagination = ({
  previousPage,
  currentPage,
  goToPage,
  nextPage,
  totalPages,
  visiblePages = 5, // Default to showing 5 pages at a time
}: IPaginationComponentProps) => {
  const generatePaginationNums = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (startPage > 1) pages.push(1, '...'); // Add leading ellipsis if needed
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    if (endPage < totalPages) pages.push('...', totalPages); // Add trailing ellipsis if needed

    return pages;
  };

  const renderPaginationNums = generatePaginationNums();

  return (
    <div className="fPagination">
      {/* First Page Button */}
      <button
        type="button"
        className="fPagination__btn"
        onClick={() => goToPage(1)}
        disabled={currentPage === 1}
      >
        <FaAngleDoubleLeft />
      </button>

      {/* Previous Page Button */}
      <button
        type="button"
        className="fPagination__btn"
        onClick={previousPage}
        disabled={currentPage === 1}
      >
        <FaAngleLeft />
      </button>

      {/* Page Numbers */}
      <div className="fPagination__items">
        {renderPaginationNums.map((pageNum, index) =>
          pageNum === '...' ? (
            <span key={`ellipsis-${index}`} className="fPagination__ellipsis">
              ...
            </span>
          ) : (
            <div
              key={pageNum}
              onClick={() => goToPage(pageNum as number)}
              className="fPagination__item"
            >
              <button
                type="button"
                className={`fPagination__btn ${
                  pageNum === currentPage ? 'fPagination__btn--active' : ''
                }`}
              >
                {pageNum}
              </button>
            </div>
          )
        )}
      </div>

      {/* Next Page Button */}
      <button
        type="button"
        className="fPagination__btn"
        onClick={nextPage}
        disabled={currentPage === totalPages}
      >
        <FaAngleRight />
      </button>

      {/* Last Page Button */}
      <button
        type="button"
        className="fPagination__btn"
        onClick={() => goToPage(totalPages)}
        disabled={currentPage === totalPages}
      >
        <FaAngleDoubleRight />
      </button>
    </div>
  );
};

export default Pagination;
