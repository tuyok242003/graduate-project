import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { displayErrorMessage } from '../../../components/Error';
import FormContainer from '../../../components/FormContainer';
import Loader from '../../../components/Footer';
import Message from '../../../components/Message';
import { POSTLIST } from '../../../constants/constants';
import { useGetPostDetailsQuery, useUpdatePostMutation, useUploadPostImageMutation } from '../../../redux/query/apiSlice';
import { IPostState } from './PostAddScreen';
import { PostStyled } from './styled';
import { IFormField } from '../../../interfaces/InShop';

const PostEditScreen = () => {
  const { id: postId } = useParams();

  const [state, setState] = useState<IPostState>({
    postName: '',
    content: '',
  });
  const [image, setImg] = useState('');
  const { data: post, isLoading, error } = useGetPostDetailsQuery(postId || '');
  const [updatePost, { isLoading: loadingUpdate }] = useUpdatePostMutation();
  const [uploadPostImg, { isLoading: loadingUpload }] = useUploadPostImageMutation();
  const navigate = useNavigate();
  const isFormValid = () => {
    if (!state.postName || !image || !state.content) {
      toast.error('Vui lòng điền đầy đủ thông tin bài viết');
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
      await updatePost({
        postId,
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
  useEffect(() => {
    if (post) {
      setState({ postName: post.postName, content: post.content });
      setImg(post.image);
    }
  }, [post]);
  const formData = new FormData();
  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    if (fileInput.files && fileInput.files.length > 0) {
      formData.append('image', fileInput.files[0]);
    }
    try {
      const response = await uploadPostImg(formData);
      if ('data' in response) {
        const { message, image: uploadedImg } = response.data;
        toast.success(message);
        setImg(uploadedImg);
      }
    } catch (err) {
      displayErrorMessage(err);
    }
  };

  // Mảng các trường dữ liệu cho biểu mẫu
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
      label: 'Image',
      value: image,
      placeholder: 'Enter Image',
      type: 'file',
      onChange: uploadFileHandler,
    },
    {
      controlId: 'content',
      label: 'Content',
      type: 'text',
      placeholder: 'Enter content',
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
          <h1>Edit Post</h1>

          {isLoading || loadingUpdate ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">Đã xảy ra lỗi. Vui lòng thử lại sau</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              {/* Sử dụng map để render các trường dữ liệu */}
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
