import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../../components/Footer'
import FormContainer from '../../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useAddVariantMutation,
  useUploadProductImageMutation,
 
} from '../../../redux/query/productsApiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { displayErrorMessage } from '../../../components/Error';
import { ProductAdminStyled } from './styled';
interface IVarriantState{
  variantColor:string;
  variantPrice:string;
  variantCountInStock:number;
  variantQuantitySold:number;
  variantThumb:string;
  variantTitle:string;
  variantDiscount:number
}
const CustomizeVariant = () => {
  const { id } = useParams();
  const [state,setState] = useState<IVarriantState>({
    variantColor:'',
    variantPrice:'',
    variantCountInStock:0,
    variantQuantitySold:0,
    variantThumb:'',
    variantTitle:'',
    variantDiscount:0
  })
  const [variantImages,setVariantImages] = useState('')
  const navigate = useNavigate();
  const [addVariant, { isLoading: loadingAddVariant }] =
    useAddVariantMutation();
  const [uploadVariantImages, { isLoading: loadingUploadVariantImages }] =
    useUploadProductImageMutation();
    
    const isFormValid = () => {
   
      // if (!state.variantColor || !state.variantPrice || !state.variantQuantitySold || variantImages || !state.variantCountInStock || !state.variantDiscount || !state.variantTitle) {
      //   toast.error('Vui lòng điền đầy đủ thông tin sản phẩm.');
      //   return false;
      // }
    
      
      if (isNaN(Number(state.variantPrice))) {
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
  <ProductAdminStyled>
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
            value={state.variantColor}
            onChange={(e) => setState({...state,variantColor:e.target.value})}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='variantPrice'>
          <Form.Label>Price</Form.Label>
          <Form.Control
            type='number'
            placeholder='Enter price'
            value={state.variantPrice}
            onChange={(e) => setState({...state,variantPrice:e.target.value})}
          ></Form.Control>
        </Form.Group>
           <Form.Group controlId='variantDiscount'>
          <Form.Label>Discount</Form.Label>
          <Form.Control
            type='number'
            placeholder='Enter discount'
            value={state.variantDiscount}
            onChange={(e) => setState({...state,variantDiscount:parseInt(e.target.value)})}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='variantPrice'>
          <Form.Label>CountInStock</Form.Label>
          <Form.Control
            type='countInStock'
            placeholder='Enter countInStock'
            value={state.variantCountInStock}
            onChange={(e) => setState({...state,variantCountInStock:parseInt(e.target.value)})}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='variantThumb'>
          <Form.Label>Thumbnail</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter thumbnail url'
            value={state.variantThumb}
            onChange={(e) => setState({...state,variantThumb:e.target.value})}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='variantThumb'>
          <Form.Label>QuantitySold</Form.Label>
          <Form.Control
            type='1'
            placeholder='Enter thumbnail url'
            value={state.variantQuantitySold}
            onChange={(e) => setState({...state,variantQuantitySold:parseInt(e.target.value)})}
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
            value={state.variantTitle}
            onChange={(e) => setState({...state,variantTitle:e.target.value})}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' className='button-product' variant='primary'>
          Add Variant
        </Button>
      </Form>
    </FormContainer>
  </ProductAdminStyled>
  );
};

export default CustomizeVariant;
