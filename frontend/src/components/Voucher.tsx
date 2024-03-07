import { Table, Button, Row, Col, Pagination } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Message, { IMessageProps } from './Message';
import Loader from './Loader';
import { toast } from 'react-toastify';
import { useGetVouchersQuery,useDeleteVoucherMutation } from '../slices/voucherSlice';
import { useState } from 'react';
import { IVouchers } from '../interfaces/Voucher';

const VoucherList = () => {
  const { data: vouchers, isLoading, error, refetch } = useGetVouchersQuery();
  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteVoucherMutation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const vouchersPerPage = 5;
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

  
  const createVoucherHandler = async () => {
    try {
      navigate('/admin/voucher/add');
      refetch();
    } catch (err) {
      const error = err as { data?: { message?: string }; error?: string };

      toast.error(error?.data?.message || error.error);
    }
  };
  const indexOfLastVoucher = currentPage * vouchersPerPage;
  const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
  const currentVouchers = vouchers?.slice(
    indexOfFirstVoucher,
    indexOfLastVoucher
  );
  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Vouchers</h1>
        </Col>
       
      </Row>
  

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
                <th>GIẢM</th>
                <th>NGÀY HẾT HẠN</th>
                <th>ĐÃ/CHƯA SỬ DỤNG</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentVouchers?.map((voucher: IVouchers) => (
                <tr key={voucher._id}>
                  <td>{voucher._id}</td>
                  <td>{voucher.name}</td>
                  <td>{voucher.discountAmount}</td>
                  <td>{voucher.expiryDate.toString()}</td>
                  <td>{voucher.isUsed.toString()}</td>
                 
                  <td>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(voucher._id)}
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
              length: Math.ceil((vouchers?.length || 0) / vouchersPerPage) || 1,
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

export default VoucherList;
