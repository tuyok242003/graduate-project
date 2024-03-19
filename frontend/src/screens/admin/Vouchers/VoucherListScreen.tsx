import { displayErrorMessage } from '../../../components/Error';
import { IVouchers } from '../../../interfaces/OutShop';
import { useState } from 'react';
import { Button, Col, Pagination, Row, Table } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../../components/Footer';
import Message from '../../../components/Message';
import { VOUCHERADD } from '../../../constants/constants';
import { useDeleteVoucherMutation, useGetVouchersQuery } from '../../../redux/query/apiSlice';
import { VoucherAdminStyled } from './styled';
import { currentData } from '../../../components/CurrentData';
const VoucherListScreen = () => {
  const { data: vouchers, isLoading, error } = useGetVouchersQuery();
  const [deleteVoucher, { isLoading: loadingDelete }] = useDeleteVoucherMutation();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteVoucher(id);
      } catch (err) {
        toast.error('Error');
      }
    }
  };

  const createVoucherHandler = async () => {
    try {
      navigate(VOUCHERADD);
    } catch (err) {
      displayErrorMessage(err);
    }
  };

  return (
    <VoucherAdminStyled>
      {' '}
      <>
        <Row className="align-items-center">
          <Col>
            <h1>Vouchers</h1>
          </Col>
          <Col className="text-end">
            <Button className="my-3" onClick={createVoucherHandler}>
              <FaPlus /> Create Voucher
            </Button>
          </Col>
        </Row>
        {isLoading || loadingDelete ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
        ) : (
          <>
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>TÊN</th>
                  <th>GIẢM</th>
                  <th>SỐ LƯỢNG</th>

                  <th>TRUE/FALSE</th>
                  <th>ACTION</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentData(currentPage, ordersPerPage, vouchers)?.map((voucher: IVouchers) => (
                  <tr key={voucher._id}>
                    <td>{voucher._id}</td>
                    <td>{voucher.voucherName}</td>
                    <td>{voucher.discountAmount}</td>
                    <td>{voucher.qty}</td>

                    <td>{voucher.isUsed.toString()}</td>

                    <td>
                      <LinkContainer to={`/admin/voucher/${voucher._id}`}>
                        <Button variant="light" className="btn-sm mx-2">
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(voucher._id || '')}>
                        <FaTrash className="fatrash" />
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
                <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </>
        )}
      </>
    </VoucherAdminStyled>
  );
};

export default VoucherListScreen;
