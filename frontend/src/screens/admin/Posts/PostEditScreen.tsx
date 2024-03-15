import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { displayErrorMessage } from '../../../components/Error';
import FormContainer from '../../../components/FormContainer';
import Loader from '../../../components/Footer'
import Message from '../../../components/Message';
import { POSTLIST } from '../../../constants/constants';
import {
  useGetPostDetailsQuery,
  useUpdatePostMutation,
  useUploadPostImageMutation,
} from '../../../redux/query/postSlice';
import { IPostState } from './PostAddScreen';
import { PostStyled } from './styled';
const PostEditScreen = () => {
  const { id: postId } = useParams();

  const [state,setState] = useState<IPostState>({
    postName:'',
    content:''
  })
  const [image, setImg] = useState('');
  const {
    data: post,
    isLoading,
    refetch,
    error,
  } = useGetPostDetailsQuery(postId || '');

  const [updatePost, { isLoading: loadingUpdate }] = useUpdatePostMutation();

  const [uploadPostImg, { isLoading: loadingUpload }] =
    useUploadPostImageMutation();

  const navigate = useNavigate();

  const isFormValid = () => {
   
    if (!state.postName || !image || !state.content ) {
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
        postName:state.postName,
        image,
        content:state.content,
      }).unwrap();
      toast.success('Post updated');
      refetch();
      navigate(POSTLIST);
    } catch (err) {
      displayErrorMessage(err);
    }
  };

  useEffect(() => {
    if (post) {
      setState({...state,postName:post.postName,content:post.content});
      setImg(post.image);

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);
  const formData = new FormData();
  const uploadFileHandler = async (image: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = image.target;

    if (fileInput.files && fileInput.files.length > 0) {
      formData.append('image', fileInput.files[0]);
    }
    try {
      const response = await uploadPostImg(formData);
      if ('data' in response) {
        const { message, image: uploadedImg } = response.data;
        toast.success(message);
        setImg(uploadedImg);
      } else {
      }
    } catch (err) {
      displayErrorMessage(err);
    }
  };

  return (
   <PostStyled>
     <>
      <Link to={POSTLIST} className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Post</h1>
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
                value={state.postName}
                onChange={(e) => setState({...state,postName:e.target.value})}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Img</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                onChange={(e) => setImg(e.target.value)}
              ></Form.Control>
              <Form.Control
                value={image}
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
                value={state.content}
                onChange={(e) => setState({...state,content:e.target.value})}
              ></Form.Control>
            </Form.Group>

            <Button
              type='submit'
              variant='primary'
           
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
   </PostStyled>
  );
};

export default PostEditScreen;
