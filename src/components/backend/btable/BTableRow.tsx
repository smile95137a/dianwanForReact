import React from 'react';

interface IBTableCellData {
  className?: string;
  dataTitle?: string;
  content: React.ReactNode;
}

interface IBTableRowProps {
  data: IBTableCellData[];
}

const CTableRow: React.FC<IBTableRowProps> = ({ data }) => (
  <div className="bTable__row">
    {data.map((cell, index) => (
      <div
        className={`bTable__cell ${cell.className || ''}`}
        key={index}
        data-title={cell.dataTitle || ''}
      >
        {cell.content}
      </div>
    ))}
  </div>
);

export default CTableRow;
