import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { displayErrorMessage } from '../../../components/Error'; 
import FormContainer from '../../../components/FormContainer';
import Loader from '../../../components/Footer'
import Message from '../../../components/Message';
import { USERLIST } from '../../../constants/constants';
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from '../../../redux/query/usersApiSlice';
interface IUserState {
  userName:string
  email:string;
  isAdmin:boolean
}
const UserEditScreen = () => {
  const { id: userId } = useParams();
 
const [state,setState] = useState<IUserState>({
  userName:'',
  email:'',
  isAdmin:false
}
)
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId || '');

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  const submitHandler = async (user: React.FormEvent<HTMLFormElement>) => {
    user.preventDefault();
    try {
      await updateUser({ userId,userName: state.userName,email: state.email,isAdmin: state.isAdmin });
      toast.success('user updated successfully');
      refetch();
      navigate(USERLIST);
    } catch (err) {
      displayErrorMessage(err);
    }
  };

  useEffect(() => {
    if (user) {
      setState({...state,userName:user.userName,email:user.email,isAdmin:user.isAdmin});
     
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
const formFields = [
    { controlId: 'name', label: 'Name', value: state.userName, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, userName: e.target.value }) },
    { controlId: 'email', label: 'Email Address', value: state.email, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, email: e.target.value }) },
    {controlId:'isAdmin',label:'Is Admin',vlaue:state.isAdmin,onChange:(e: React.ChangeEvent<HTMLInputElement>) => setState({...state,isAdmin:e.target.checked})}
  ];
  return (
    <>
      <Link to={USERLIST} className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
        ) : (
         <Form onSubmit={submitHandler}>
            {formFields.map(field => (
              <Form.Group key={field.controlId} className='my-2' controlId={field.controlId}>
                <Form.Label>{field.label}</Form.Label>
             <Form.Control
  type={field.controlId === 'text' ? 'text' : 'otherType'}
  placeholder={`Enter ${field.label}`}
  value={field.value}
  onChange={field.onChange}
/>

              </Form.Group>
            ))}

            <Button type='submit' variant='primary'>
              Update
            </Button>
         
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
