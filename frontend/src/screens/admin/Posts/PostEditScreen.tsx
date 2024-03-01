import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message, { MessageProps } from '../../../components/Message';
import Loader from '../../../components/Loader';
import FormContainer from '../../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetPostDetailsQuery,
  useUpdatePostMutation,
  useUploadPostImageMutation,
} from '../../../slices/postSlice';

const PostEditScreen = () => {
  const { id: postId } = useParams();

  const [name, setName] = useState('');
  const [img, setImg] = useState('');
  const [content, setContent] = useState('');
  const {
    data: post,
    isLoading,
    refetch,
    error,
  } = useGetPostDetailsQuery(postId);

  const [updatePost, { isLoading: loadingUpdate }] = useUpdatePostMutation();

  const [uploadPostImg, { isLoading: loadingUpload }] =
    useUploadPostImageMutation();

  const navigate = useNavigate();

  const isFormValid = () => {
   
    if (!name || !img || !content ) {
      toast.error('Vui lòng điền đầy đủ thông tin bài viết');
      return false;
    }
  
    
  
    return true;
  };
  const submitHandler = async (post: React.FormEvent<HTMLFormElement>) => {
    post.preventDefault();
    if (!isFormValid()) {
      return;
    }
    try {
      await updatePost({
        postId,
        name,
        img,
        content,
      }).unwrap();
      toast.success('Post updated');
      refetch();
      navigate('/admin/postlist');
    } catch (err) {
      const error = err as { data?: { message?: string }; error?: string };

      toast.error(error?.data?.message || error.error);
    }
  };

  useEffect(() => {
    if (post) {
      setName(post.name);
      setImg(post.img);
      setContent(post.content);
    }
  }, [post]);
  const formData = new FormData();
  const uploadFileHandler = async (image: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = image.target;

    if (fileInput.files && fileInput.files.length > 0) {
      formData.append('img', fileInput.files[0]);
    }
    try {
      const response = await uploadPostImg(formData);
      if ('data' in response) {
        const { message, img: uploadedImg } = response.data;
        toast.success(message);
        setImg(uploadedImg);
      } else {
      }
    } catch (err) {
      const error = err as { data?: { message?: string }; error?: string };

      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <Link to='/admin/postlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Post</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{(error as MessageProps).children}</Message>
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

            <Form.Group controlId='img'>
              <Form.Label>Img</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                onChange={(e) => setImg(e.target.value)}
              ></Form.Control>
              <Form.Control
                value={img}
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
                placeholder='Enter content'
                value={content}
                onChange={(e) => setContent(e.target.value)}
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

export default PostEditScreen;
