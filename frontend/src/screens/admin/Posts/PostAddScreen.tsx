import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { displayErrorMessage } from '../../../components/Error';
import FormContainer from '../../../components/FormContainer';
import Loader from '../../../components/Footer';
import Message from '../../../components/Message';
import { POSTLIST } from '../../../constants/constants';
import {
  useCreatePostMutation,
  useGetPostDetailsQuery,
  useUpdatePostMutation,
  useUploadPostImageMutation,
} from '../../../redux/query/apiSlice';
import { IFormField } from '../../../interfaces/InShop';
import { PostStyled } from './styled';
export interface IPostState {
  postName: string;
  content: string;
}
const PostAddScreen = () => {
  const { id: postId } = useParams();

  const [state, setState] = useState<IPostState>({
    postName: '',
    content: '',
  });
  const [image, setImg] = useState('');
  const [addPost, { isLoading: loadingAdd }] = useCreatePostMutation();
  const [uploadPostImg, { isLoading: loadingUpload }] = useUploadPostImageMutation();
  const navigate = useNavigate();
  const isFormValid = () => {
    const { postName, content } = state;
    if (!postName || !content) {
      toast.error('Vui lòng điền đầy đủ thông tin bài viết');
      return false;
    }
    return true;
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid()) {
      return;
    }
    try {
      await addPost({
        postName: state.postName,
        image,
        content: state.content,
      }).unwrap();
      toast.success('Post updated');
      navigate(POSTLIST);
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
        const response = await uploadPostImg(formData);
        if ('data' in response) {
          const { message, image: uploadedImg } = response.data;
          toast.success(message);
          setImg(uploadedImg);
        } else {
          toast.error('Error');
        }
      } catch (err) {
        toast.error('Error');
      }
    }
  };

  // Mảng mô tả các trường của form
  const formFields: IFormField[] = [
    {
      controlId: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter name',
      value: state.postName,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, postName: e.target.value }),
    },
    {
      controlId: 'image',
      label: 'Img',
      value: image,
      placeholder: 'Enter img',
      type: 'file',
      onChange: uploadFileHandler,
    },
    {
      controlId: 'content',
      label: 'Content',
      type: 'text',
      placeholder: 'Enter description',
      value: state.content,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, content: e.target.value }),
    },
  ];

  return (
    <PostStyled>
      <>
        <Link to={POSTLIST} className="btn btn-light my-3">
          Go Back
        </Link>
        <FormContainer>
          <h1>Add Post</h1>
          {loadingAdd && <Loader />}
          <Form className="input-add" onSubmit={submitHandler}>
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
              </Form.Group>
            ))}
            <Button type="submit" variant="primary">
              Add
            </Button>
          </Form>
        </FormContainer>
      </>
    </PostStyled>
  );
};

export default PostAddScreen;
