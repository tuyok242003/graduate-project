import { useState } from 'react';
import { Button, Col, Pagination, Row, Table } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { IVouchers } from '../../interfaces/Voucher';
import { useDeleteVoucherMutation, useGetVouchersQuery } from '../../redux/query/voucherSlice';
import Loader from '../Loader'
import Message from '../Message';
const VoucherList = () => {
  const { data: vouchers, isLoading, error } = useGetVouchersQuery();
  const [, { isLoading: loadingDelete }] =
    useDeleteVoucherMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const vouchersPerPage = 5;
 

  const indexOfLastVoucher = currentPage * vouchersPerPage;
  const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
  const currentVouchers = vouchers && Array.isArray(vouchers)
    ? vouchers.slice(indexOfFirstVoucher, indexOfLastVoucher)
    : [];
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
        <Message variant='danger'>Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
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
              {currentVouchers?.map((voucher:IVouchers) => (
                <tr key={voucher._id}>
                  <td>{voucher._id}</td>
                  <td>{voucher.voucherName}</td>
                  <td>{voucher.discountAmount}</td>
                 
                  <td>{voucher.isUsed.toString()}</td>
                 
                  <td>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      // onClick={() => deleteHandler(voucher._id)}
                    >
                      <FaTrash  />
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
