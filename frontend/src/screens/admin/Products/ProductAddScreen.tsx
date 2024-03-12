import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../../components/Loader';
import FormContainer from '../../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from '../../../redux/query/productsApiSlice';
import { useGetCategoriesQuery } from '../../../redux/query/categorySlice';
import { ICategories } from '@/interfaces/Category';                         
import { PRODUCTLIST } from '../../../constants';
const ProductAddScreen = () => {
  const [name, setName] = useState('');
  const [price,setPrice] = useState('');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const { data: categories, isLoading: loadingCategories } =    useGetCategoriesQuery();
  const [addProduct, { isLoading: loadingAdd }] = useCreateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  const isFormValid = () => {
   
    if (!name || !price || !image || !brand || !category || !description) {
      toast.error('Vui lòng điền đầy đủ thông tin sản phẩm.');
      return false;
    } 
    if (!category.trim()) {
      toast.error('Vui lòng chọn danh mục sản phẩm.');
      return false;
    }
    return true;
  };
  
  const submitHandler = async (product: React.FormEvent<HTMLFormElement>) => {
    product.preventDefault();
    if (!isFormValid()) {
      return;
      
    }

    try {
      const response = await addProduct({
        name,
        image,
        price,
        brand,
        category,
        description,
      }).unwrap();
    
      toast.success('Product added');
     
    } catch (error) {
      toast.error('Error');
    }

  };
 
  const formData = new FormData();

  const uploadFileHandler = async (image: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = image.target;
    if (fileInput.files && fileInput.files.length > 0) {
      formData.append('image', fileInput.files[0]);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
    }
    try {
      const response = await uploadProductImage(formData);
      if ('data' in response) {
        const { message, image: uploadedImg } = response.data;
        toast.success(message);
        setImage(uploadedImg);
      } else {
      }
    } catch (err) {
      toast.error('Error');
    }
  };

  return (
    <>
      <Link to={PRODUCTLIST} className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Add Product</h1>
        {loadingAdd && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='price'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='image'>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type='file'
              aria-label='Choose File'
              onChange={uploadFileHandler}
            ></Form.Control>

            {loadingUpload && <Loader />}
          </Form.Group>

          <Form.Group controlId='brand'>
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter brand'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            ></Form.Control>
          </Form.Group>
          
          <Form.Group controlId='category'>
            <Form.Label>Category</Form.Label>
            {loadingCategories ? (
              <Loader />
            ) : (
              <Form.Control
                as='select'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value=''>Select Category</option>
                {categories?.map((category: ICategories) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            )}
          </Form.Group>

          <Form.Group controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' style={{ marginTop: '1rem' }}>
            Add
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ProductAddScreen;
