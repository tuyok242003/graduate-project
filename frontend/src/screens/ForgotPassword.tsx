import { Button } from 'react-bootstrap';

const ForgotPassword = () => {
  const handleForgotPassword = () => {};

  return (
    <div>
      <div className='flex flex-col'>
        <label style={{ marginLeft: 300, paddingRight: 10 }} htmlFor='email'>
          Enter your email:
        </label>
        <input
          style={{ width: 400, height: 30 }}
          type='text'
          id='email'
          className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
        />
      </div>
      <div>
        <Button
          type='submit'
          onClick={handleForgotPassword}
          style={{ marginLeft: 500, marginTop: 50, width: 80 }}
        >
          Gửi
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;
