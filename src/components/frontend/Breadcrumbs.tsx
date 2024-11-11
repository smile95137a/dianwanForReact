import React from 'react';

interface BreadcrumbItem {
  name: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <div className="breadcrumbs">
      <div className="breadcrumbs__items">
        {items.map((item, index) => (
          <div
            key={index}
            className={`breadcrumbs__item ${
              item.isActive ? 'breadcrumbs__item--active' : ''
            }`}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumbs;
