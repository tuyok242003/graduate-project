import { Button } from 'react-bootstrap';
import { UserScreenStyled } from './styled';

const ForgotPassword = () => {
  const handleForgotPassword = () => {};

  return (
    <UserScreenStyled>
      <div>
      <div className='flex flex-col'>
        <label className='email' htmlFor='email'>
          Enter your email:
        </label>
        <input
          type='text'
          id='email'
          className='input-email w-[800px] pb-2 border-b outline-none placeholder:text-sm'
        />
      </div>
      <div>
        <Button
        className='btn-user'
          type='submit'
          onClick={handleForgotPassword}
        >
          Gửi
        </Button>
      </div>
    </div>
    </UserScreenStyled>
  );
};

export default ForgotPassword;
