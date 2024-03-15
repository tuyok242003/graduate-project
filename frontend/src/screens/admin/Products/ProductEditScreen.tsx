import { ICategories } from '@/interfaces/Category';
import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContainer from '../../../components/FormContainer';
import Loader from '../../../components/Footer'
import Message from '../../../components/Message';
import { PRODUCTLIST } from '../../../constants/constants';
import {
  useGetCategoriesQuery
} from '../../../redux/query/categorySlice';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../../redux/query/productsApiSlice';
import { IProductState } from './ProductAddScreen';
import { ProductAdminStyled } from './styled';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const [state, setState] = useState<IProductState>({
    productName: '',
    price: '',
    brand: '',
    category: '',
    description: '',
  });
  console.log(state);
  
  const [image, setImage] = useState('');
  const { data: categories } = useGetCategoriesQuery();
  const isFormValid = () => {
   
    if (!state.productName || !state.price || !image || !state.brand || !state.category || !state.description) {
      toast.error('Vui lòng điền đầy đủ thông tin sản phẩm.');
      return false;
    } 
    if (!state.category.trim()) {
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
  } = useGetProductDetailsQuery(productId || '');
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
        productName: state.productName,
        image,
          price: state.price,
          brand: state.brand,
          category: state.category,
          description: state.description,
      }).unwrap();
      toast.success('Product updated');
      refetch();
      navigate(PRODUCTLIST);
    } catch (err) {
      toast.error('Error');
    }
  };

  useEffect(() => {
    if (product) {
      setState({...state,
        productName: product.productName,
        price:product.price,
        brand:product.brand,
        category:product.category.name,
        description:product.description
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);
  const formData = new FormData();
  const uploadFileHandler = async (imageUpload: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = imageUpload.target;
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
   <ProductAdminStyled>
     <>
    <Link to={PRODUCTLIST} className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={state.productName}
              onChange={(e) =>
                setState({ ...state, productName: e.target.value })
              }
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='price'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter price'
              value={state.price}
              onChange={(e) => setState({ ...state, price: e.target.value })}
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
                value={state.brand}
                onChange={(e) => setState({ ...state, brand: e.target.value })}
              ></Form.Control>
</Form.Group>

            <Form.Group controlId='category'>
        <Form.Label>Category</Form.Label>
        <Form.Control
          as='select'
          onChange={(e) =>
            setState({ ...state, category: e.target.value })
          }
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
                onChange={(e) =>
                  setState({ ...state, description: e.target.value })
                }
              ></Form.Control>
            </Form.Group>

            <Button
              type='submit'
              variant='primary'
              className='button-product'
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
   </ProductAdminStyled>
  );
};

export default ProductEditScreen;
