import React, { useState } from 'react';
import { Button, Card, Col, Form, Image, ListGroup, Row } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
import { IOrderItem, IRootState } from '../../interfaces/OutShop';
import { decreaseQty, increaseQty, removeFromCart } from '../../redux/slices/cartSlice';
import { CartScreenStyled } from './styled';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectAll, setSelectAll] = useState(false);
  const handleSelectAll = () => {
    const allItemIds = cart.cartItems.map((item) => item._id);
    setSelectAll(!selectAll);
    setSelectedItems(selectAll ? [] : allItemIds);
  };
  const cart = useSelector((state: IRootState) => state.cart);
  const { cartItems } = cart;
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  console.log(selectedItems);
  const toggleSelectItem = (id: string) => {
    const isSelected = selectedItems.includes(id);
    if (isSelected) {
      setSelectedItems((prevSelected) => prevSelected.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems((prevSelected) => [...prevSelected, id]);
    }
  };
  const removeFromCartHandler = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));

    // Chuyển hướng đến trang Shipping
    navigate(`/shipping?selectedItems=${selectedItems.join(',')}`);
  };
  const increaseQuantity = (item: IOrderItem) => {
    dispatch(increaseQty(item._id)); // Dispatch action to increase quantity
  };

  // Function to decrease quantity
  const decreaseQuantity = (item: IOrderItem) => {
    dispatch(decreaseQty(item._id)); // Dispatch action to decrease quantity
  };

  return (
    <CartScreenStyled>
      <Row>
        <Col md={8}>
          <h1 className="shopping-cart">Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Message>Your cart is empty</Message>
          ) : (
            <ListGroup variant="flush">
              <Col md={1}>
                {/* Add a checkbox for each item */}
                <Form.Check className="select" type="checkbox" checked={selectAll} onChange={handleSelectAll} />
              </Col>
              {cartItems.map((item: IOrderItem) => (
                <ListGroup.Item key={item._id}>
                  <Row>
                    <Col md={1}>
                      {/* Add a checkbox for each item */}
                      <Form.Check
                        type="checkbox"
                        checked={selectedItems.includes(item._id)}
                        onChange={() => toggleSelectItem(item._id)}
                      />
                    </Col>
                    <Col md={2}>
                      <Image src={item.images} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      Phân loại:
                      <Link className="color-cart" to={`/product/${item.productId}`}>
                        {item.color}
                      </Link>
                    </Col>

                    <Col md={1} className="price-cart">
                      ${item.price}
                    </Col>
                    <Col md={3}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => decreaseQuantity(item)} // Decrease quantity
                        disabled={item.qty === 1} // Disable if quantity is already 1
                      >
                        -
                      </Button>
                      <span className="qty-cart">{item.qty}</span>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => increaseQuantity(item)} // Increase quantity
                        disabled={item.qty === item.countInStock} // Disable if quantity reaches stock limit
                      >
                        +
                      </Button>
                    </Col>
                    <Col md={2}>
                      <Button type="button" variant="light" onClick={() => removeFromCartHandler(item._id)}>
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Có ({cartItems.reduce((acc: number, item: IOrderItem) => acc + item.qty, 0)}) sản phẩm</h2>$
                {cartItems.reduce((acc: number, item: IOrderItem) => acc + item.qty * item.price, 0).toFixed(2)}
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cartItems.length === 0 || selectedItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Thanh toán
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </CartScreenStyled>
  );
};

export default CartScreen;
