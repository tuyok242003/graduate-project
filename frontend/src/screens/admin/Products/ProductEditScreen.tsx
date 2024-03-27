import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContainer from '../../../components/FormContainer';
import Loader from '../../../components/Loader';
import Message from '../../../components/Message';
import { PRODUCTLIST } from '../../../constants/constants';
import {
  useGetCategoriesQuery,
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../../redux/query/apiSlice';
import { IProductState } from '../../../interfaces/OutShop';
import { ProductAdminStyled } from './styled';
import { ICategories } from '@/interfaces/OutShop';

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
  const { data: categories, isLoading: loadingCategories } = useGetCategoriesQuery();
  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId || '');
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();
  const navigate = useNavigate();

  const ValidateForm = () => {
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
    if (!ValidateForm()) {
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
      navigate(PRODUCTLIST);
    } catch (err) {
      toast.error('Error');
    }
  };

  useEffect(() => {
    if (product) {
      setState({
        productName: product.productName,
        price: product.price,
        brand: product.brand,
        category: product.category.name,
        description: product.description,
      });
      setImage(product.image);
    }
  }, [product]);

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
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, productName: e.target.value }),
    },
    {
      id: 'price',
      type: 'text',
      label: 'Price',
      placeholder: 'Enter price',
      value: state.price,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, price: e.target.value }),
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
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, brand: e.target.value }),
    },
    {
      id: 'category',
      type: 'select',
      label: 'Category',
      value: state.category,
      children: loadingCategories ? (
        <Loader />
      ) : (
        <Form.Control
          as="select"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setState({ ...state, category: e.target.value });
          }}
        >
          <option value="">Select Category</option>
          {categories?.map((category: ICategories) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </Form.Control>
      ),
    },
    {
      id: 'description',
      type: 'text',
      label: 'Description',
      placeholder: 'Enter description',
      value: state.description,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, description: e.target.value }),
    },
  ];

  return (
    <ProductAdminStyled>
      <>
        <Link to={PRODUCTLIST} className="btn btn-light my-3">
          Go Back
        </Link>
        <FormContainer>
          <h1>Edit Product</h1>
          {isLoading || loadingUpdate ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">Đã xảy ra lỗi. Vui lòng thử lại sau</Message>
          ) : (
            <Form className="input-add" onSubmit={submitHandler}>
              {/* Sử dụng map để render các trường dữ liệu */}
              {formFields.map((field) => (
                <Form.Group key={field.id} controlId={field.id}>
                  <Form.Label>{field.label}</Form.Label>
                  {field.type === 'file' ? (
                    <>
                      <Form.Control type={field.type} aria-label="Choose File" onChange={field.onChange} />
                      {loadingUpload && <Loader />}
                    </>
                  ) : (
                    <Form.Control type="text" placeholder={field.placeholder} value={field.value} onChange={field.onChange} />
                  )}
                  {field.children}
                </Form.Group>
              ))}
              <Button type="submit" variant="primary" className="button-product">
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
