import { ReactNode } from 'react';

interface IBTableHeader {
  text: any;
  className?: string;
}

interface IBTableProps {
  headers: IBTableHeader[];
  children: ReactNode;
  customClass?: string;
}

const BTable: React.FC<IBTableProps> = ({
  headers,
  children,
  customClass = '',
}) => (
  <div className={`bTable ${customClass}`}>
    <div className="bTable__row bTable__header">
      {headers.map((header, index) => (
        <div className={`bTable__cell ${header.className || ''}`} key={index}>
          {header.text}
        </div>
      ))}
    </div>
    {children}
  </div>
);

export default BTable;
