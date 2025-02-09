import React from 'react';
import { getImageUrl } from '@/utils/ImageUtils';
import { MdOutlineOfflineBolt } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import MoneyCard from './MoneyCard';
import { PrizeCategory, ProductType } from '@/interfaces/product';
import NumberFormatter from '../common/NumberFormatter';
import soldOutImg from '@/assets/image/di-soldout.png';
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
        {!isMall && (
          <div className="productCard__stock">
            <p className="productCard__text">
              <NumberFormatter number={~~product.detailQuantity} />
            </p>
            <p className="productCard__text">/</p>
            <p className="productCard__text">
              <NumberFormatter number={~~product.detailStockQuantity} />
            </p>
          </div>
        )}
        {Array.isArray(product?.imageUrls) && product.imageUrls.length > 0 && (
          <img src={getImageUrl(product.imageUrls[0])} />
        )}

        {product.status === 'NOT_AVAILABLE_YET' && (
          <div className="productCard__soldoutImg">
            <img src={soldOutImg} />
          </div>
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
            {product.productType !== ProductType.CUSTMER_PRIZE ? (
              <>
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
              </>
            ) : (
              <></>
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
            {isMall ? '熱賣中' : '開抽中'}
          </p>
        </div>
        <div className="productCard__infos-data">
          <p className="productCard__text productCard__text--title">
            {product.productName}
          </p>
          <p
            className="productCard__text productCard__text--subtitle"
            dangerouslySetInnerHTML={{ __html: product?.description }}
          ></p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
