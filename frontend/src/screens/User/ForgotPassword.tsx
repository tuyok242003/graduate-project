import { Button } from 'react-bootstrap';
import { UserScreenStyled } from './styled';

const ForgotPassword = () => {
  const handleForgotPassword = () => {};

  return (
    <UserScreenStyled>
      <div>
        <div className="flex flex-col">
          <label className="email" htmlFor="email">
            Enter your email:
          </label>
          <input type="text" id="email" className="input-email " />
        </div>
        <div>
          <Button className="btn-user" type="submit" onClick={handleForgotPassword}>
            Gửi
          </Button>
        </div>
      </div>
    </UserScreenStyled>
  );
};

export default ForgotPassword;
