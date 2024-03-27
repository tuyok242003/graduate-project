import { Spinner } from 'react-bootstrap';
import { LoaderStyled } from './styled';
import Message from '../Message';

const Loader = ({ loading, error }: { loading?: boolean; error?: boolean }) => {
  return loading ? (
    <LoaderStyled>
      <Spinner className="spinner" animation="border" role="status"></Spinner>
    </LoaderStyled>
  ) : error ? (
    <Message variant="danger">Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
  ) : null;
};

export default Loader;
