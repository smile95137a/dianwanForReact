import React from 'react';
import { getImageUrl } from '@/utils/ImageUtils';

const ProductCard = ({ product, className = '' }: any) => {
  return (
    <div className={`productCard ${className}`}>
      <div className="productCard__img">
        <img
          src={getImageUrl(product.imageUrls[0])}
          alt={product.productName}
        />
      </div>
      <div className="productCard__infos">
        <div className="productCard__infos-status productCard__infos-status--active">
          <p className="productCard__text productCard__text--icon"></p>
          <p className="productCard__text productCard__text--subtitle">
            開抽中
          </p>
        </div>
        <div className="productCard__infos-data">
          <p className="productCard__text productCard__text--title">
            {product.productName}
          </p>
          <p className="productCard__text productCard__text--subtitle">
            {product.productName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;