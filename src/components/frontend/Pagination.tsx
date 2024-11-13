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
      <div className="fPagination">
        <button
          type="button"
          className="fPagination__btn"
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
        >
          <FaAngleDoubleLeft />
        </button>

        <button
          type="button"
          className="fPagination__btn"
          onClick={previousPage}
          disabled={currentPage === 1}
        >
          <FaAngleLeft />
        </button>

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

        <button
          type="button"
          className="fPagination__btn"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          <FaAngleRight />
        </button>

        <button
          type="button"
          className="fPagination__btn"
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
