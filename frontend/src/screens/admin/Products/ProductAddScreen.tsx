import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../../components/Footer';
import FormContainer from '../../../components/FormContainer';
import { toast } from 'react-toastify';
import { useCreateProductMutation, useUploadProductImageMutation, useGetCategoriesQuery } from '../../../redux/query/apiSlice';
import { ICategories } from '../../../interfaces/OutShop';
import { PRODUCTLIST } from '../../../constants/constants';
import { ProductAdminStyled } from './styled';

export interface IProductState {
  productName: string;
  price: string;
  brand: string;
  category: string;
  description: string;
}
interface IFormProduct {
  controlId: string;
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: any;
}
const ProductAddScreen = () => {
  const [state, setState] = useState<IProductState>({
    productName: '',
    price: '',
    brand: '',
    category: '',
    description: '',
  });

  const [image, setImage] = useState('');
  const { data: categories, isLoading: loadingCategories } = useGetCategoriesQuery();
  const [addProduct, { isLoading: loadingAdd }] = useCreateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  const uploadFileHandler = async (imageEvent: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = imageEvent.target;
    if (fileInput.files && fileInput.files.length > 0) {
      const formData = new FormData();
      formData.append('image', fileInput.files[0]);

      try {
        const response = await uploadProductImage(formData);
        if ('data' in response) {
          const { message, image: uploadedImg } = response.data;
          toast.success(message);
          setImage(uploadedImg);
        } else {
          toast.error('Error');
        }
      } catch (err) {
        toast.error('Error');
      }
    }
  };

  const formFields: IFormProduct[] = [
    {
      controlId: 'name',
      label: 'Name',
      placeholder: 'Enter name',
      type: 'text',
      value: state.productName,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, productName: e.target.value }),
    },
    {
      controlId: 'price',
      label: 'Price',
      placeholder: 'Enter price',
      value: state.price,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, price: e.target.value }),
    },
    {
      controlId: 'image',
      label: 'Image',
      type: 'file',
      onChange: uploadFileHandler, // Move uploadFileHandler here
    },
    {
      controlId: 'brand',
      label: 'Brand',
      placeholder: 'Enter brand',
      value: state.brand,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, brand: e.target.value }),
    },
    {
      controlId: 'category',
      label: 'Category',
      children: loadingCategories ? (
        <Loader />
      ) : (
        <Form.Control
          as="select"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, category: e.target.value })}
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
      controlId: 'description',
      label: 'Description',
      placeholder: 'Enter description',
      value: state.description,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, description: e.target.value }),
    },
  ];

  const isFormValid = () => {
    const { productName, price, brand, category, description } = state;
    if (!productName || !price || !image || !brand || !category || !description) {
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
      await addProduct({
        productName: state.productName,
        image,
        price: state.price,
        brand: state.brand,
        category: state.category,
        description: state.description,
      }).unwrap();

      toast.success('Product added');
    } catch (error) {
      toast.error('Error');
    }
  };

  return (
    <ProductAdminStyled>
      <>
        <Link to={PRODUCTLIST} className="btn btn-light my-3">
          Go Back
        </Link>
        <FormContainer>
          <h1>Add Product</h1>
          {loadingAdd && <Loader />}
          <Form onSubmit={submitHandler}>
            {formFields.map((field) => (
              <Form.Group key={field.controlId} controlId={field.controlId}>
                <Form.Label>{field.label}</Form.Label>
                {field.type === 'file' ? (
                  <>
                    <Form.Control type={field.type} aria-label="Choose File" onChange={field.onChange} />
                    {loadingUpload && <Loader />}
                  </>
                ) : (
                  <Form.Control type="text" placeholder={field.placeholder} value={field.value} onChange={field.onChange} />
                )}
                {field.children && field.children}
              </Form.Group>
            ))}
            <Button type="submit" variant="primary" style={{ marginTop: '1rem' }}>
              Add
            </Button>
          </Form>
        </FormContainer>
      </>
    </ProductAdminStyled>
  );
};

export default ProductAddScreen;
