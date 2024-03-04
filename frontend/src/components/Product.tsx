import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { Products, Variant } from '@/interfaces/Products';
import '../assets/styles/Product.css';

interface ProductProps {
  product:Products;
}
const Product: React.FC<ProductProps> = ({product}) => {const totalQuantitySold = product.variants.reduce(
    (total: number, variant: Variant) => total + variant.quantitySold,
    0
  );
 
  return (
    <Card className='my-3 p-3 rounded' >
      <Link to={`/product/${product._id}`}>
        <Card.Img style={{height: 250}} src={product.image} alt='Ảnh sản phẩm' variant='top' />
      </Link>

      <Card.Body >
        <Link to={`/product/${product._id}`} style={{textDecoration: 'none'}}>
          <Card.Title as='div' className='product-title'>
            <strong style={{fontFamily:'display'}}>{product.name}</strong>
          
          </Card.Title>
        </Link>
        <strong style={{fontFamily:'serif'}}>Giá: {product.price}</strong>
        {product.variants.some(variant => variant.discount > 0) && (
      <span className='sale-badge'>Sale</span>
    )}

        <Card.Text as='div' >
 
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
            color = '#f8e825'
          /> <strong style={{color: 'red'}}>Đã bán:</strong> {totalQuantitySold}
        </Card.Text>

        <Card.Text as='div'>
         
        </Card.Text> 
      </Card.Body>
    </Card>
  );
};

export default Product;
