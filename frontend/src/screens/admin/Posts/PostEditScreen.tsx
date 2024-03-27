import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { displayErrorMessage } from '../../../components/Error';
import FormContainer from '../../../components/FormContainer';
import Loader from '../../../components/Loader';
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
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    },
  ];
  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [key]: e.target.value });
  };
  return (
    <PostStyled>
      <>
        <Link to={POSTLIST} className="btn btn-light my-3">
          Go Back
        </Link>
        <FormContainer>
          <h1>Edit Post</h1>

          <Loader loading={isLoading || loadingUpdate} error={!!error} />
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
                  <Form.Control
                    type="text"
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={handleChange(field.controlId)}
                  />
                )}
              </Form.Group>
            ))}
            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        </FormContainer>
      </>
    </PostStyled>
  );
};

export default PostEditScreen;
