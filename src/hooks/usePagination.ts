import { useMemo, useState } from 'react';

const DEFAULT_SHOW_PAGINATION_PAGE_NUM = 3;

export interface PaginationProps<T> {
  list: T[];
  pageLimitSize: number;
  initialPage?: number;
  showPaginationPageNum?: number;
}

export interface PaginationRange<T> {
  totalPages: number;
  currentPageItems: T[];
  renderPaginationNums: number[];
  currentPage: number;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (pageNum: number) => void;
}

export const usePagination = <T>({
  list,
  pageLimitSize,
  initialPage = 1,
  showPaginationPageNum = DEFAULT_SHOW_PAGINATION_PAGE_NUM,
}: PaginationProps<T>): PaginationRange<T> => {
  const initialPosition = (initialPage - 1) * pageLimitSize;
  const [position, setPosition] = useState(initialPosition);

  const paginationRange = useMemo((): PaginationRange<T> => {
    const totalCount = list.length;

    if (totalCount <= 0 || pageLimitSize < 1 || position < 0) {
      return {
        totalPages: 0,
        currentPageItems: [],
        renderPaginationNums: [],
        currentPage: 0,
        nextPage: () => {},
        previousPage: () => {},
        goToPage: () => {},
      };
    }

    const totalPages = Math.ceil(totalCount / pageLimitSize);
    const currentPage =
      position >= totalCount
        ? totalPages
        : Math.floor(position / pageLimitSize) + 1;

    const showPageNum =
      showPaginationPageNum > totalPages ? totalPages : showPaginationPageNum;
    const centerIndex = Math.ceil(showPageNum / 2);
    const diff = showPageNum - centerIndex;
    const firstIndex =
      centerIndex >= currentPage
        ? 1
        : currentPage + diff >= totalPages
        ? totalPages - showPageNum + 1
        : currentPage - diff;

    const renderPaginationNums = Array.from(
      { length: showPageNum },
      (_, i) => i + firstIndex
    );

    const start = (currentPage - 1) * pageLimitSize;
    const end = start + pageLimitSize;
    const currentPageItems = list.slice(start, end);

    const nextPage = () => {
      if (currentPage < totalPages) {
        setPosition(position + pageLimitSize);
      }
    };

    const previousPage = () => {
      if (currentPage > 1) {
        setPosition(position - pageLimitSize);
      }
    };

    const goToPage = (pageNum: number) => {
      const newPosition = (pageNum - 1) * pageLimitSize;
      setPosition(newPosition);
    };

    return {
      totalPages,
      currentPageItems,
      renderPaginationNums,
      currentPage,
      nextPage,
      previousPage,
      goToPage,
    };
  }, [list, pageLimitSize, position, showPaginationPageNum]);

  return paginationRange;
};
