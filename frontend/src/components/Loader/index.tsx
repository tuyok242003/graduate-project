import { Spinner } from 'react-bootstrap';
import { LoaderStyled } from './styled';

const Loader = () => {
  return (
    <LoaderStyled>
      <Spinner className="spinner" animation="border" role="status"></Spinner>
    </LoaderStyled>
  );
};

export default Loader;
