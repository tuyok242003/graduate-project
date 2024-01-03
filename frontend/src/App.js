import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { logout } from './slices/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const paypalOptions = {
  'client-id':
    'AU8KNgaaUycpakPgyu__MDmoATKRmt--dr5sjfrLCR5nKdNdasPqN91_aB4lSygUNtY1qnjfz8T_go_r',
  currency: 'USD',
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      const currentTime = new Date().getTime();
      if (currentTime > expirationTime) {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <>
        <ToastContainer />
        <Header />
        <main className='py-3'>
          <Container>
            <Outlet />
          </Container>
        </main>
        <Footer />
      </>
    </PayPalScriptProvider>
  );
};

export default App;
