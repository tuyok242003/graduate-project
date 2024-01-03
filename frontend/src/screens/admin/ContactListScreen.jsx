import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import {
  useGetContactsQuery,
  useDeleteContactMutation,
  useAddContactMutation,
} from '../../slices/contactSlice';

const ContactListScreen = () => {
  const { data: contacts, isLoading, error, refetch } = useGetContactsQuery();
  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteContactMutation();
  const navigate = useNavigate();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  const [{ isLoading: loadingCreate }] = useAddContactMutation();
  const createContactHandler = async () => {
    try {
      navigate('/admin/contact/add');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Contacts</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createContactHandler}>
            <FaPlus /> Create Contact
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}

      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PHONE</th>
                <th>EMAIL</th>
                <th>CONTENT</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {contacts?.map((contact) => (
                <tr key={contact._id}>
                  <td>{contact._id}</td>
                  <td>{contact.name}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.email}</td>
                  <td>{contact.content}</td>
                  <td>
                    <LinkContainer to={`/admin/contact/${contact._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(contact._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default ContactListScreen;
