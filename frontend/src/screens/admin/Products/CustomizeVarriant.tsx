import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../../components/Footer';
import FormContainer from '../../../components/FormContainer';
import { toast } from 'react-toastify';
import { useAddVariantMutation, useUploadProductImageMutation } from '../../../redux/query/productsApiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { displayErrorMessage } from '../../../components/Error'; 
import { ProductAdminStyled } from './styled';
import { IFormField } from '@/interfaces/FormField';

interface IVariantState {
  variantColor: string;
  variantPrice: string;
  variantCountInStock: number;
  variantQuantitySold: number;
  variantThumb: string;
  variantTitle: string;
  variantDiscount: number;
}

const CustomizeVariant = () => {
  const { id } = useParams();
  const [state, setState] = useState<IVariantState>({
    variantColor: '',
    variantPrice: '',
    variantCountInStock: 0,
    variantQuantitySold: 0,
    variantThumb: '',
    variantTitle: '',
    variantDiscount: 0
  });
  const [variantImages, setVariantImages] = useState('');
  const navigate = useNavigate();
  const [addVariant, { isLoading: loadingAddVariant }] = useAddVariantMutation();
  const [uploadVariantImages, { isLoading: loadingUploadVariantImages }] = useUploadProductImageMutation();

  const isFormValid = () => {
    return !!state.variantColor && !!state.variantPrice && !!state.variantQuantitySold && !!variantImages && !!state.variantCountInStock && !!state.variantDiscount && !!state.variantTitle;
  };

  const submitHandler = async (variant: React.FormEvent<HTMLFormElement>) => {
    variant.preventDefault();
    if (!isFormValid()) {
      toast.error('Vui lòng điền đầy đủ thông tin sản phẩm.');
      return;
    }
    try {
    await addVariant({
        productId: id,
        variantData: {
          color: state.variantColor,
          price: state.variantPrice,
          thumb: state.variantThumb,
          images: variantImages,
          title: state.variantTitle,
          countInStock: state.variantCountInStock,
          quantitySold: state.variantQuantitySold,
          discount: state.variantDiscount,
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

  const uploadFileHandler = async (imageEvent: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = imageEvent.target;
    if (fileInput.files && fileInput.files.length > 0) {
      const formData = new FormData();
      formData.append('image', fileInput.files[0]);
      try {
        const response = await uploadVariantImages(formData);
        if ('data' in response) {
          const { message, image: uploadedImg } = response.data;
          toast.success(message);
          setVariantImages(uploadedImg);
        }
      } catch (err) {
        displayErrorMessage(err);
      }
    }
  };

  const formFields:IFormField[] = [
    {
      controlId: 'variantColor',
      label: 'Color',
      type:'text',
      placeholder: 'Enter color',
      value: state.variantColor,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState({ ...state, variantColor: e.target.value }),
    },
    {
      controlId: 'variantPrice',
      label: 'Price',
         type:'number',
      placeholder: 'Enter price',
      value: state.variantPrice,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState({ ...state, variantPrice: e.target.value }),
    },
    {
      controlId: 'variantDiscount',
      label: 'Discount',
         type:'number',
      placeholder: 'Enter discount',
      value: state.variantDiscount.toString(),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState({ ...state, variantDiscount: parseInt(e.target.value) }),
    },
    {
      controlId: 'variantCountInStock',
      label: 'CountInStock',
         type:'number',
      placeholder: 'Enter countInStock',
      value: state.variantCountInStock.toString(),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState({ ...state, variantCountInStock: parseInt(e.target.value) }),
    },
    {
      controlId: 'variantThumb',
      label: 'Thumbnail',
         type:'text',
      placeholder: 'Enter thumbnail url',
      value: state.variantThumb,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState({ ...state, variantThumb: e.target.value }),
    },
    {
      controlId: 'variantQuantitySold',
      label: 'QuantitySold',
         type:'number',
      placeholder: 'Enter thumbnail url',
      value: state.variantQuantitySold.toString(),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState({ ...state, variantQuantitySold: parseInt(e.target.value) }),
    },
    {
      controlId: 'variantImages',
      label: 'Images',
       value:'image',
       placeholder:"Enter image",
      type: 'file',
      onChange: uploadFileHandler,
    },
    {
      controlId: 'variantTitle',
      label: 'Title',
         type:'text',
      placeholder: 'Enter title',
      value: state.variantTitle,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState({ ...state, variantTitle: e.target.value }),
    },
  ];

  return (
    <ProductAdminStyled>
      <FormContainer>
        <h1>Add Variant</h1>
        {loadingAddVariant && <Loader />}
        <Form onSubmit={submitHandler}>
          {formFields.map((field) => (
            <Form.Group key={field.controlId} controlId={field.controlId}>
              <Form.Label>{field.label}</Form.Label>
              <Form.Control
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={field.value}
                onChange={field.onChange}
              />
              {loadingUploadVariantImages && field.controlId === 'variantImages' && <Loader />}
            </Form.Group>
          ))}
          <Button type="submit" className="button-product" variant="primary">
            Add Variant
          </Button>
        </Form>
      </FormContainer>
    </ProductAdminStyled>
  );
};

export default CustomizeVariant;
