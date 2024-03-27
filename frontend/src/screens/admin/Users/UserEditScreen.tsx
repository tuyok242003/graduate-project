import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { displayErrorMessage } from '../../../components/Error';
import FormContainer from '../../../components/FormContainer';
import Loader from '../../../components/Loader';
import { USERLIST } from '../../../constants/constants';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../../redux/query/apiSlice';
interface IUserState {
  userName: string;
  email: string;
  isAdmin: boolean;
}
const UserEditScreen = () => {
  const { id: userId } = useParams();

  const [state, setState] = useState<IUserState>({
    userName: '',
    email: '',
    isAdmin: false,
  });
  const { data: user, isLoading, error } = useGetUserDetailsQuery(userId || '');

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  const submitHandler = async (user: React.FormEvent<HTMLFormElement>) => {
    user.preventDefault();
    try {
      await updateUser({ userId, userName: state.userName, email: state.email, isAdmin: state.isAdmin });
      toast.success('user updated successfully');
      navigate(USERLIST);
    } catch (err) {
      displayErrorMessage(err);
    }
  };

  useEffect(() => {
    if (user) {
      setState({ ...state, userName: user.userName, email: user.email, isAdmin: user.isAdmin });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const formFields = [
    {
      controlId: 'name',
      label: 'Name',
      type: 'text',
      value: state.userName,
    },
    {
      controlId: 'email',
      label: 'Email Address',
      type: 'text',
      value: state.email,
    },
    {
      controlId: 'isAdmin',
      label: 'Is Admin',
      type: 'option',
      value: state.isAdmin,
    },
  ];
  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [key]: e.target.value || e.target.checked });
  };
  return (
    <>
      <Link to={USERLIST} className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        <Loader loading={isLoading} error={!!error} />
        <Form onSubmit={submitHandler}>
          {formFields.map((field) => (
            <Form.Group key={field.controlId} className="my-2" controlId={field.controlId}>
              <Form.Label>{field.label}</Form.Label>
              {field.type === 'text' ? (
                <Form.Control
                  type={field.type || 'otherType'}
                  placeholder={`Enter ${field.label}`}
                  value={field.value?.toString()}
                  onChange={handleChange(field.controlId)}
                />
              ) : null}
              {field.type === 'option' ? (
                <Form.Select
                  defaultValue={field.value ? 'true' : 'false'}
                  onChange={(e) => {
                    setState({ ...state, isAdmin: e.target.value === 'true' });
                  }}
                >
                  <option value="true">TRUE</option>
                  <option value="false">FALSE</option>
                </Form.Select>
              ) : null}
            </Form.Group>
          ))}

          <Button type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
