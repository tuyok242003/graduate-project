import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContainer from '../../../components/FormContainer';
import Loader from '../../../components/Footer';
import Message from '../../../components/Message';
import { PRODUCTLIST } from '../../../constants/constants';
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
  const [image, setImage] = useState('');
  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId || '');
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();
  const navigate = useNavigate();

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

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      setState({
        ...state,
        productName: product.productName,
        price: product.price,
        brand: product.brand,
     category: product.category.name,
        description: product.description,
      });
      setImage(product.image);
    }
  }, [product, state]);

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    if (fileInput.files && fileInput.files.length > 0) {
      const formData = new FormData();
      formData.append('image', fileInput.files[0]);
      try {
        const response = await uploadProductImage(formData);
        if ('data' in response) {
          const { message, image: uploadedImg } = response.data;
          toast.success(message);
          setImage(uploadedImg);
        }
      } catch (err) {
        toast.error('Error');
      }
    }
  };

  // Mảng các trường dữ liệu cho biểu mẫu
  const formFields = [
    {
      id: 'name',
      type: 'text',
      label: 'Name',
      placeholder: 'Enter name',
      value: state.productName,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState({ ...state, productName: e.target.value }),
    },
    {
      id: 'price',
      type: 'text',
      label: 'Price',
      placeholder: 'Enter price',
      value: state.price,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState({ ...state, price: e.target.value }),
    },
    {
      id: 'image',
      type: 'file',
      label: 'Image',
      onChange: uploadFileHandler,
    },
    {
      id: 'brand',
      type: 'text',
      label: 'Brand',
      placeholder: 'Enter brand',
      value: state.brand,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState({ ...state, brand: e.target.value }),
    },
    {
      id: 'category',
      type: 'select',
      label: 'Category',
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
        setState({ ...state, category: e.target.value }),
      options: [
        { value: '', label: 'Select Category' },
        // Map categories here
      ],
    },
    {
      id: 'description',
      type: 'text',
      label: 'Description',
      placeholder: 'Enter description',
      value: state.description,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState({ ...state, description: e.target.value }),
    },
  ];

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
            <Message variant='danger'>Đã xảy ra lỗi. Vui lòng thử lại sau</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              {/* Sử dụng map để render các trường dữ liệu */}
              {formFields.map((field) => (
                <Form.Group key={field.id} controlId={field.id}>
                  <Form.Label>{field.label}</Form.Label>
                  {field.type === 'select' ? (
                    <Form.Control as='select' onChange={field.onChange}>
                      {field.options?.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Control>
                  ) : (
                    <Form.Control
                      type={field.type}
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                  {field.type === 'file' && loadingUpload && <Loader />}
                </Form.Group>
              ))}
              <Button type='submit' variant='primary' style={{ marginTop: '1rem' }}>
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
