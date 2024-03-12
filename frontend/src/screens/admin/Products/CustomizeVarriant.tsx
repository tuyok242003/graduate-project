import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../../components/Loader';
import FormContainer from '../../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useAddVariantMutation,
  useUploadProductImageMutation,
  useGetProductsQuery
} from '../../../redux/query/productsApiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { displayErrorMessage } from '../../../components/Error';
const CustomizeVariant = () => {
  const { id } = useParams();
  const [variantColor, setVariantColor] = useState('');
  const [variantPrice, setVariantPrice] = useState('');
  const [variantCountInStock, setVariantCountInStock] = useState(0);
  const [variantQuantitySold, setVariantQuantitySold] = useState(0);
  const [variantThumb, setVariantThumb] = useState('');
  const [variantImages, setVariantImages] = useState('');
  const [variantTitle, setVariantTitle] = useState('');
  const [variantDiscount, setVariantDiscount] = useState(0)
  const navigate = useNavigate();
  const [addVariant, { isLoading: loadingAddVariant }] =
    useAddVariantMutation();
  const [uploadVariantImages, { isLoading: loadingUploadVariantImages }] =
    useUploadProductImageMutation();
    
    const isFormValid = () => {
   
      if (!variantColor || !variantPrice || !variantQuantitySold || !variantImages || !variantCountInStock || !variantDiscount || !variantTitle) {
        toast.error('Vui lòng điền đầy đủ thông tin sản phẩm.');
        return false;
      }
    
      
      if (isNaN(Number(variantPrice))) {
        toast.error('Giá sản phẩm phải là số.');
        return false;
      }
      return true;
    };
  const submitHandler = async (varriant: React.FormEvent<HTMLFormElement>) => {
    varriant.preventDefault();
    if (!isFormValid()) {
      return;
    }
    try {
      const {} = await addVariant({
        productId: id,
        variantData: {
          color: variantColor,
          price: variantPrice,
          thumb: variantThumb,
          images: variantImages,
          title: variantTitle,
          countInStock: variantCountInStock,
          quantitySold: variantQuantitySold,
          discount: variantDiscount,
          id: '',
          productId: ''
        },
      }).unwrap();

      toast.success('Variant added');
      navigate(`/admin/productlist`);
    } catch (err) {
      displayErrorMessage(err);
    }
  };
  const formData = new FormData();
  const uploadVariantImagesHandler = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileInput = e.target;

    if (fileInput.files && fileInput.files.length > 0) {
      formData.append('image', fileInput.files[0]);
    }
    try {
      const response = await uploadVariantImages(formData);
      if ('data' in response) {
        const { message, image: uploadedImg } = response.data;
        toast.success(message);
        setVariantImages(uploadedImg);
      } else {
      }
    } catch (err) {
      displayErrorMessage(err);
    }
  };

  return (
    <FormContainer>
      <h1>Add Variant</h1>
      {loadingAddVariant && <Loader />}
      <Form onSubmit={submitHandler}>
        {/* Biến thể */}
        <Form.Group controlId='variantColor'>
          <Form.Label>Color</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter color'
            value={variantColor}
            onChange={(e) => setVariantColor(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='variantPrice'>
          <Form.Label>Price</Form.Label>
          <Form.Control
            type='number'
            placeholder='Enter price'
            value={variantPrice}
            onChange={(e) => setVariantPrice(e.target.value)}
          ></Form.Control>
        </Form.Group>
           <Form.Group controlId='variantDiscount'>
          <Form.Label>Discount</Form.Label>
          <Form.Control
            type='number'
            placeholder='Enter discount'
            value={variantDiscount}
            onChange={(e) => setVariantDiscount(parseInt(e.target.value))}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='variantPrice'>
          <Form.Label>CountInStock</Form.Label>
          <Form.Control
            type='countInStock'
            placeholder='Enter countInStock'
            value={variantCountInStock}
            onChange={(e) => setVariantCountInStock(parseInt(e.target.value))}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='variantThumb'>
          <Form.Label>Thumbnail</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter thumbnail url'
            value={variantThumb}
            onChange={(e) => setVariantThumb(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='variantThumb'>
          <Form.Label>QuantitySold</Form.Label>
          <Form.Control
            type='1'
            placeholder='Enter thumbnail url'
            value={variantQuantitySold}
            onChange={(e) => setVariantQuantitySold(parseInt(e.target.value))}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='variantImages'>
          <Form.Label>Images</Form.Label>
          <Form.Control
            aria-label='Choose File'
            onChange={uploadVariantImagesHandler}
            type='file'
            multiple
          ></Form.Control>
          {loadingUploadVariantImages && <Loader />}
        </Form.Group>

        <Form.Group controlId='variantTitle'>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter title'
            value={variantTitle}
            onChange={(e) => setVariantTitle(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' style={{ marginTop: '1rem' }}>
          Add Variant
        </Button>
      </Form>
    </FormContainer>
  );
};

export default CustomizeVariant;
