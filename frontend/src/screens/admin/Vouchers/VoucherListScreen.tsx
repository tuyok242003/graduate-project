import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Pagination } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Message, { IMessageProps } from '../../../components/Message';
import Loader from '../../../components/Loader';
import { toast } from 'react-toastify';
import {
  useGetVouchersQuery,
  useDeleteVoucherMutation,

} from '../../../redux/query/voucherSlice';
import { useState } from 'react';
import { IVouchers } from '@/interfaces/Voucher';
import { displayErrorMessage } from '../../../components/Error';
import { VOUCHERADD } from '../../../constants';

const VoucherListScreen = () => {
  const { data: vouchers, isLoading, error, refetch } = useGetVouchersQuery();
  const [deleteVoucher, { isLoading: loadingDelete }] = useDeleteVoucherMutation();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteVoucher(id);
        refetch();
      } catch (err) {
        toast.error('Error');
      }
    }
  };
 
  const createVoucherHandler = async () => {
    try {
      navigate(VOUCHERADD);
      refetch();
    } catch (err) {
      displayErrorMessage(err);
    }
  };
  const indexOfLastVoucher = currentPage * ordersPerPage;
  const indexOfFirstVoucher = indexOfLastVoucher - ordersPerPage;
  const currentVouchers = vouchers?.slice(indexOfFirstVoucher, indexOfLastVoucher);
  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Vouchers</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createVoucherHandler}>
            <FaPlus /> Create Voucher
          </Button>
        </Col>
      </Row>
    

      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>TÊN</th>
                <th>GIẢM</th>
                <th>SỐ LƯỢNG</th>
                <th>HẠN SỬ DỤNG</th>
                <th>TRUE/FALSE</th>
             <th>Đã sử dụng</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentVouchers?.map((voucher: IVouchers) => (
                <tr key={voucher._id}>
                  <td>{voucher._id}</td>
                  <td>{voucher.voucherName}</td>
                  <td>
                  {voucher.discountAmount}
                  </td>
                  <td>{voucher.qty}</td>
                 
                  <td>{voucher.isUsed.toString()}</td>
                 
                  <td>
                    <LinkContainer to={`/admin/voucher/${voucher._id}`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      // onClick={() => deleteHandler(voucher._id)}
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
              length: Math.ceil((vouchers?.length || 0) / ordersPerPage) || 1,
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

export default VoucherListScreen;
