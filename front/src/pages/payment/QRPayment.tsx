import { QRCodeCanvas } from 'qrcode.react';

const QRPayment = () => {
  return (
    <div>
      <div>
        <QRCodeCanvas value="https://www.naver.com" />
        <button type="button"></button>
      </div>
    </div>
  );
};

export default QRPayment;
