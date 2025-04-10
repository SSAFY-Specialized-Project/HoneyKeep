import { useLocation } from 'react-router';

const QRPaySimulation = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const qrcode = queryParams.get('qrcode');
  const token = queryParams.get('token');
  const account = queryParams.get('account');
  const pocketId = queryParams.get('pocketId');

  console.log('QR Code:', qrcode);
  console.log('Token:', token);
  console.log('Account:', account);
  console.log('Pocket ID:', pocketId);

  return <div>페이 페이지</div>;
};

export default QRPaySimulation;
