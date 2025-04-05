import { Certificate } from './types';

export const CERTIFICATES: Certificate[] = [
  {
    id: 'honey-cert',
    name: '꿀킵 인증서',
    provider: 'honey',
    logo: '/icon/assets/honeykeep-logo.svg',
  },
  {
    id: 'naver-cert',
    name: '네이버 인증서',
    provider: 'naver',
    logo: '/icon/assets/naver-logo.svg',
  },
];

export const BANK_LIST = [
    { code: '001', name: '한국은행' },
    { code: '002', name: '산업은행' },
    { code: '003', name: '기업은행' },
    { code: '004', name: '국민은행' },
    { code: '011', name: '농협은행' },
    { code: '020', name: '우리은행' },
    { code: '023', name: 'SC제일은행' },
    { code: '027', name: '시티은행' },
    { code: '032', name: '대구은행' },
    { code: '034', name: '광주은행' },
    { code: '035', name: '제주은행' },
    { code: '037', name: '전북은행' },
    { code: '039', name: '경남은행' },
    { code: '045', name: '새마을금고' },
    { code: '081', name: 'KEB하나은행' },
    { code: '088', name: '신한은행' },
    { code: '090', name: '카카오뱅크' },
    { code: '999', name: '싸피은행' },
];