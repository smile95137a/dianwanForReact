import { useMemo, useState } from 'react';

export interface PaginationProps<T> {
  list: T[];
  pageLimitSize: number;
  initialPage?: number;
}

export interface PaginationRange<T> {
  totalPages: number;
  currentPageItems: T[];
  renderPaginationNums: (number | '...')[];
  currentPage: number;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (pageNum: number) => void;
}

export const usePagination = <T>({
  list,
  pageLimitSize,
  initialPage = 1,
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

    const generatePaginationNums = (): (number | '...')[] => {
      const paginationNums: (number | '...')[] = [];

      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
          paginationNums.push(i);
        }
      } else {
        const leftSide = Math.max(2, currentPage - 1);
        const rightSide = Math.min(totalPages - 1, currentPage + 1);

        paginationNums.push(1);

        if (leftSide > 2) {
          paginationNums.push('...');
        }

        for (let i = leftSide; i <= rightSide; i++) {
          paginationNums.push(i);
        }

        if (rightSide < totalPages - 1) {
          paginationNums.push('...');
        }

        paginationNums.push(totalPages);
      }

      return paginationNums;
    };

    const renderPaginationNums = generatePaginationNums();

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
  }, [list, pageLimitSize, position]);

  return paginationRange;
};
