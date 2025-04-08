import { FC } from 'react';
import { Certificate } from '@/entities/certification/model/types';

interface CertificateCardProps {
  certificate: Certificate;
  onClick: (certificate: Certificate) => void;
}

export const CertificateCard: FC<CertificateCardProps> = ({ certificate, onClick }) => {
  return (
    <div 
      className="flex items-center px-8 py-6 rounded-lg my-2 cursor-pointer bg-gray-100 gap-1.5"
      onClick={() => onClick(certificate)}
    >
      <img src={certificate.logo} alt={certificate.name} className="size-10 mr-3" />
      <span className="font-medium">{certificate.name}</span>
    </div>
  );
};