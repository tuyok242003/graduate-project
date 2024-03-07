 import { Table, Button, Row, Col, Pagination } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Message, { IMessageProps } from '../../../components/Message';
import Loader from '../../../components/Loader';
import { toast } from 'react-toastify';
import {
  useGetContactsQuery,
  useDeleteContactMutation,
  useAddContactMutation,
} from '../../../slices/contactSlice';
import { useState } from 'react';
import { IContact } from '@/interfaces/Contact';

const ContactListScreen = () => {
  const { data: contacts, isLoading, error, refetch } = useGetContactsQuery();
  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteContactMutation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 5;
  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        toast.error('Error');
      }
    }
  };

  const [createContacts, { isLoading: loadingCreate, error: createError }] =
    useAddContactMutation();
  const createContactHandler = async () => {
    try {
      navigate('/admin/contact/add');
      refetch();
    } catch (err) {
      const error = err as { data?: { message?: string }; error?: string };

      toast.error(error?.data?.message || error.error);
    }
  };
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts?.slice(
    indexOfFirstContact,
    indexOfLastContact
  );
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
        <Message variant='danger'>{(error as IMessageProps).children}</Message>
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
              {currentContacts?.map((contact: IContact) => (
                <tr key={contact._id}>
                  <td>{contact._id}</td>
                  <td>{contact.name}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.email}</td>
                  <td>{contact.content}</td>
                  <td>
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
          <Pagination>
            {Array.from({
              length: Math.ceil((contacts?.length || 0) / contactsPerPage) || 1,
            }).map((page, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </>
  );
};

export default ContactListScreen;
