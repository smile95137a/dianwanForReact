import React from 'react';
import { getImageUrl } from '@/utils/ImageUtils';
import { MdOutlineOfflineBolt } from 'react-icons/md';

const ProductCard = ({ isMall = false, product, className = '' }: any) => {
  const handleClick = () => {
    console.log(product);

    const productDetailUrl = `/product/${product.productId}`;
    window.open(productDetailUrl, '_blank');
  };
  return (
    <div className={`productCard ${className}`} onClick={handleClick}>
      <div className="productCard__img">
        <img
          src={getImageUrl(product.imageUrls[0])}
          alt={product.productName}
        />
      </div>
      <div className="productCard__infos">
        <div className="productCard__infos-status productCard__infos-status--active">
          <p className="productCard__icon">
            <MdOutlineOfflineBolt />
          </p>
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
