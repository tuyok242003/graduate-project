import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../../components/Loader';
import FormContainer from '../../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useCreatePostMutation,
  useUploadPostImageMutation,
} from '../../../redux/query/postSlice';
import { POST } from '../../../constants';
interface IStatePost {
  postName: string;
  img: string;
  content: string;
}
const PostAddScreen = () => {
  const [state, setState] = useState<IStatePost>({
    postName: '',
    img: '',
    content: '',
  });
  const [addPost, { isLoading: loadingAdd }] = useCreatePostMutation();
  const [uploadPostImg, { isLoading: loadingUpload }] =
    useUploadPostImageMutation();

  const navigate = useNavigate();
  // const isFormValid = () => {
  //   if (!state.postName || !state.img || !state.content) {
  //     toast.error('Vui lòng điền đầy đủ thông tin bài viết');
  //     return false;
  //   }

  //   return true;
  // };
  const submitHandler = async (post: React.FormEvent<HTMLFormElement>) => {
    post.preventDefault();
    // if (!isFormValid()) {
    //   return;
    // }
    try {
      const postData = {
        postName: state.postName,
        img: state.img,
        content: state.content,
      };

      const { data: newPost } = await addPost(postData).unwrap();

      toast.success('Post added');
      navigate(`/admin/post/${newPost._id}/edit`);
    } catch (err) {
      const error = err as { data?: { message?: string }; error?: string };

      toast.error(error?.data?.message || error.error);
    }
  };
  const formData = new FormData();
  const uploadFileHandler = async (
    post: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileInput = post.target;

    if (fileInput.files && fileInput.files.length > 0) {
      formData.append('image', fileInput.files[0]);
    }

    try {
      const response = await uploadPostImg(formData);
      if ('data' in response) {
        const { message, image: uploadedImg } = response.data;
        toast.success(message);
        setState(uploadedImg);
      } else {
      }
    } catch (err) {
      const error = err as { data?: { message?: string }; error?: string };

      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <Link to={POST} className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Add Post</h1>
        {loadingAdd && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter name'
              value={state.postName}
              onChange={(e) => setState({ ...state, postName: e.target.value })}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='img'>
            <Form.Label>Img</Form.Label>
            {/* Remove the input for entering image URL */}
            <Form.Control
              aria-label='Choose File'
              onChange={uploadFileHandler}
              type='file'
            ></Form.Control>
            {loadingUpload && <Loader />}
          </Form.Group>

          <Form.Group controlId='content'>
            <Form.Label>Content</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter description'
              value={state.content}
              onChange={(e) => setState({ ...state, content: e.target.value })}
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

export default PostAddScreen;
