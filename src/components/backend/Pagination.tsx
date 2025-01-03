import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from 'react-icons/fa';

interface IPaginationComponentProps {
  totalPages: number;
  renderPaginationNums: (number | '...')[];
  currentPage: number;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (pageNum: number) => void;
}

const Pagination = ({
  previousPage,
  currentPage,
  renderPaginationNums,
  goToPage,
  nextPage,
  totalPages,
}: IPaginationComponentProps) => {
  return (
    <>
      <div className="bPagination">
        <button
          type="button"
          className="bPagination__btn"
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
        >
          <FaAngleDoubleLeft />
        </button>

        <button
          type="button"
          className="bPagination__btn"
          onClick={previousPage}
          disabled={currentPage === 1}
        >
          <FaAngleLeft />
        </button>

        <div className="bPagination__items">
          {renderPaginationNums.map((pageNum, index) =>
            pageNum === '...' ? (
              <span key={`ellipsis-${index}`} className="bPagination__ellipsis">
                ...
              </span>
            ) : (
              <div
                key={pageNum}
                onClick={() => goToPage(pageNum as number)}
                className="bPagination__item"
              >
                <button
                  type="button"
                  className={`bPagination__btn ${
                    pageNum === currentPage ? 'bPagination__btn--active' : ''
                  }`}
                >
                  {pageNum}
                </button>
              </div>
            )
          )}
        </div>

        <button
          type="button"
          className="bPagination__btn"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          <FaAngleRight />
        </button>

        <button
          type="button"
          className="bPagination__btn"
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          <FaAngleDoubleRight />
        </button>
      </div>
    </>
  );
};

export default Pagination;
