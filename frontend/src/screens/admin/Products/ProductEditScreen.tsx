import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message, { IMessageProps } from '../../../components/Message';
import Loader from '../../../components/Loader';
import FormContainer from '../../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../../slices/productsApiSlice';
import {
  useGetCategoriesQuery
} from '../../../slices/categorySlice'
import { ICategories } from '@/interfaces/Category';
const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const { data: categories } = useGetCategoriesQuery();
  const isFormValid = () => {
   
    if (!name || !image || !brand || !category || !description) {
      toast.error('Vui lòng điền đầy đủ thông tin sản phẩm.');
      return false;
    }
    if (!category.trim()) {
      toast.error('Vui lòng chọn danh mục sản phẩm.');
      return false;
    }
    return true;
  };
  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();
  const navigate = useNavigate();
  const submitHandler = async (product: React.FormEvent<HTMLFormElement>) => {
    product.preventDefault();
    if (!isFormValid()) {
      return;
    }
    try {
      await updateProduct({
        productId,
        name,
    
        image,
        brand,
        category,
        description,
      }).unwrap();
      toast.success('Product updated');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error('Error');
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
  
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setDescription(product.description);
    }
  }, [product]);
  const formData = new FormData();
  const uploadFileHandler = async (imageUpload: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = imageUpload.target;
    if (fileInput.files && fileInput.files.length > 0) {
      formData.append('img', fileInput.files[0]);
    }
    try {
      const response = await uploadProductImage(formData);
      if ('data' in response) {
        const { message, img: uploadedImg } = response.data;
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
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{(error as IMessageProps).children}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
         
            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                aria-label='Choose File'
                onChange={uploadFileHandler}
                type='file'
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
        <Form.Control
          as='select'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
   
          {categories?.map((cat:ICategories) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </Form.Control>
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

            <Button
              type='submit'
              variant='primary'
              style={{ marginTop: '1rem' }}
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
