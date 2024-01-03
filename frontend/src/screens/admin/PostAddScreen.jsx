import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useCreatePostMutation,
  useUploadPostImageMutation,
} from '../../slices/postSlice';

const PostAddScreen = () => {
  const [name, setName] = useState('');

  const [img, setImg] = useState('');

  const [content, setContent] = useState('');

  const [addPost, { isLoading: loadingAdd }] = useCreatePostMutation();
  const [uploadPostImg, { isLoading: loadingUpload }] =
    useUploadPostImageMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const postData = {
        name,
        img,
        content,
      };

      // Call the addPost mutation to add a new post
      const { data: newPost } = await addPost(postData).unwrap();

      toast.success('Post added');
      navigate(`/admin/post/${newPost._id}/edit`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    try {
      // Call the uploadPostImage mutation to upload the post image
      const {
        data: { message, image: uploadedImg },
      } = await uploadPostImg(formData).unwrap();

      toast.success(message);
      setImg(uploadedImg);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to='/posts' className='btn btn-light my-3'>
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='img'>
            <Form.Label>Img</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter image url'
              value={img}
              onChange={(e) => setImg(e.target.value)}
            ></Form.Control>
            <Form.Control
              label='Choose File'
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
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
