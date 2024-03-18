import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from '../Rating';
import { IProducts, IVariant } from '../../interfaces/OutShop';
import { ProductStyled } from './styled'; // Import các styled-components đã chuyển đổi

interface IProductProps {
  product: IProducts;
}

const Product: React.FC<IProductProps> = ({ product }) => {
  const totalQuantitySold = product.variants.reduce((total: number, variant: IVariant) => total + variant.quantitySold, 0);

  return (
    <ProductStyled>
      <Card className="my-3 p-3 rounded">
        <Link to={`/product/${product._id}`}>
          <Card.Img className="img-product" src={product.image} alt="Ảnh sản phẩm" variant="top" />
        </Link>

        <Card.Body>
          <Card.Title as="div" className="product-title">
            <Link to={`/product/${product._id}`}>
              <strong className="product-title">{product.productName}</strong>
            </Link>
          </Card.Title>
          <strong className="price-product">Giá: {product.price}</strong>
          {product.variants.some((variant) => variant.discount > 0) && <div className="sale-badge">Sale</div>}

          <Card.Text as="div">
            <Rating valueRating={product.rating} text={`${product.numReviews} reviews`} />{' '}
            <strong className="count">Đã bán:</strong> {totalQuantitySold}
          </Card.Text>
        </Card.Body>
      </Card>
    </ProductStyled>
  );
};

export default Product;
