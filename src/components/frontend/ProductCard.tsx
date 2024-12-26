import React from 'react';
import { getImageUrl } from '@/utils/ImageUtils';
import { MdOutlineOfflineBolt } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import MoneyCard from './MoneyCard';
import { PrizeCategory } from '@/interfaces/product';
import NumberFormatter from '../common/NumberFormatter';

const ProductCard = ({ isMall = false, product, className = '' }: any) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (isMall) {
      navigate(`/mallProduct/${product.productCode}`);
    } else {
      const productDetailUrl = `/product/${product.productId}`;
      window.open(productDetailUrl, '_blank');
    }
  };

  return (
    <div className={`productCard ${className}`} onClick={handleClick}>
      <div className="productCard__img">
        {Array.isArray(product?.imageUrls) && product.imageUrls.length > 0 && (
          <img src={getImageUrl(product.imageUrls[0])} />
        )}
        {isMall ? (
          <div className="productCard__moneys">
            <span className="productCard__text">特價</span>
            <MoneyCard
              className="productCard__money--gold"
              logoText="G"
              price={product.price}
            />
            {product?.isSpecialPrice && (
              <MoneyCard
                className="productCard__money--silver"
                logoText="S"
                price={product.specialPrice}
              />
            )}
          </div>
        ) : (
          <div className="productCard__moneys">
            {product?.prizeCategory !== PrizeCategory.BONUS ? (
              <>
                <MoneyCard
                  className="productCard__money--gold"
                  logoText="G"
                  price={product.price}
                  suffixText="/抽"
                />
                <MoneyCard
                  className="productCard__money--silver"
                  logoText="S"
                  price={product.sliverPrice}
                  suffixText="/抽"
                />
              </>
            ) : (
              <MoneyCard
                className="productCard__money--bonus"
                logoText="B"
                price={product.bonusPrice}
                suffixText="/抽"
              />
            )}
          </div>
        )}
      </div>
      <div className="productCard__infos">
        <div className="productCard__infos-status productCard__infos-status--active">
          <p className="productCard__icon">
            <MdOutlineOfflineBolt />
          </p>
          <p className="productCard__text productCard__text--subtitle">
            開抽中
          </p>
          <div className="productCard__stock">
            <p className="productCard__text">剩餘</p>
            <p className="productCard__text">
              <NumberFormatter number={product.stockQuantity} />
            </p>
            <p className="productCard__text">抽</p>
          </div>
        </div>
        <div className="productCard__infos-data">
          <p className="productCard__text productCard__text--title">
            {product.description}
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
