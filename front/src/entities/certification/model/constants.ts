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

// Bank type 정의 (icon 속성 추가)
export interface Bank {
  code: string;
  name: string;
  icon?: string; // Optional icon path
}

export const BANK_LIST: Bank[] = [
    { code: '001', name: '한국은행', icon: '' }, // 아이콘 없음
    { code: '002', name: '산업은행', icon: '/icon/bank/sanup.svg' },
    { code: '003', name: '기업은행', icon: '/icon/bank/ibk.svg' },
    { code: '004', name: '국민은행', icon: '/icon/bank/kb.svg' },
    { code: '011', name: '농협은행', icon: '/icon/bank/nh.svg' },
    { code: '020', name: '우리은행', icon: '/icon/bank/woori.svg' },
    { code: '023', name: 'SC제일은행', icon: '/icon/bank/sc.svg' },
    { code: '027', name: '시티은행', icon: '/icon/bank/citi.svg' },
    { code: '032', name: '대구은행', icon: '/icon/bank/daegu.svg' },
    { code: '034', name: '광주은행', icon: '/icon/bank/gwanjoo.svg' }, // gwanjoo -> gwangju 가정
    { code: '035', name: '제주은행', icon: '' }, // 아이콘 없음
    { code: '037', name: '전북은행', icon: '' }, // 아이콘 없음
    { code: '039', name: '경남은행', icon: '/icon/bank/gyeongnam.svg' },
    { code: '045', name: '새마을금고', icon: '/icon/bank/saemaeul.svg' },
    { code: '081', name: 'KEB하나은행', icon: '/icon/bank/hana.svg' }, // 하나은행 아이콘 사용
    { code: '088', name: '신한은행', icon: '' }, // 아이콘 없음
    { code: '090', name: '카카오뱅크', icon: '/icon/bank/kakao.svg' },
    { code: '999', name: '싸피은행', icon: '' }, // 아이콘 없음
];