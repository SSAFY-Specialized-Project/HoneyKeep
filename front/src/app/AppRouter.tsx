import {Alarm, Chatbot, Error, Home, Landing, Loading} from '@/pages/general';
import { Login } from '@/pages/user';
import { createBrowserRouter } from 'react-router';
import AuthWrapper from './AuthWrapper';
import { Payment, QRPayment, QRSuccess } from '@/pages/payment';
import { BaseLayout, HistoryLayout } from './layouts';
import { PocketCalendar, PocketCreate, PocketDetail, PocketList } from '@/pages/pocket';
import { FixedPayCreate, FixedPayDetail, FixedPayList, FixedPayUpdate } from '@/pages/fixedPay';
import {
  AccountConnect,
  AccountDetail,
  AccountList,
  AccountTransfer,
  Certification,
  MyAgree,
} from '@/pages/account';
import CategoryCreate from '@/pages/pocket/CategoryCreate';
import ExamplePage from '@/entities/pocket/ui/ExamplePage';
import {Layout} from "@/shared/ui";

const AppRouter = createBrowserRouter([
  {
    path: '/landing',
    element: <Landing />,
  },
  {
    path: '/loading',
    element: <Loading />,
  },
  {
    // 상단 바랑 네비게이션 없는 레이아웃
    element: <Layout />,
    children: [
      {
        // 로그인
        path: '/login',
        element: <Login />,
      },
      {
        element: <AuthWrapper />,
        children: [
          {
            // 결제
            path: '/payment',
            element: <Payment />,
          },
          {
            // QR 결제
            path: '/qrPayment',
            element: <QRPayment />,
          },
          {
            // QR 결제 완료
            path: '/qrSuccess',
            element: <QRSuccess />,
          },
        ],
      },
    ],
  },
  {
    // 상단 바랑 네비게이션 바 있는 레이아웃
    element: <BaseLayout />,
    children: [
      {
        element: <AuthWrapper />,
        children: [
          {
            // 홈
            path: '/',
            element: <Home />,
            errorElement: <div>홈에서 데이터를 불러오기 실패했습니다.</div>,
          },
          {
            // 홈
            path: '/home',
            element: <Home />,
            errorElement: <div>홈에서 데이터를 불러오기 실패했습니다.</div>,
          },
          {
            // 알람 설정
            path: '/alarm',
            element: <Alarm />,
          },
          {
            // 포켓 목록
            path: '/pocket/list',
            element: <PocketList />,
          },
          {
            // 포켓 캘린더
            path: '/pocket/calendar',
            element: <PocketCalendar />,
          },
          {
            // 고정 지출
            path: '/fixedPay/list',
            element: <FixedPayList />,
          },
          {
            // 고정 지출 생성
            path: '/fixedPay/create',
            element: <FixedPayCreate />,
          },
          {
            // 고정 지출 수정
            path: '/fixedPay/update',
            element: <FixedPayUpdate />,
          },
          {
            // 고정 지출 상세
            path: '/fixedPay/:id',
            element: <FixedPayDetail />,
          },
        ],
      },
    ],
  },
  {
    // 뒤로가기만 있는 레이아웃
    element: <HistoryLayout />,
    children: [
      {
        element: <AuthWrapper />,
        children: [
          // 계좌 연결
          {
            // 마이데이터 약관 동의
            path: '/myAgree',
            element: <MyAgree />,
          },
          {
            // 자체 인증서
            path: '/certification',
            element: <Certification />,
          },
          {
            // 연결 은행 선택
            path: '/accountConnect',
            element: <AccountConnect />,
          },

          // 계좌 상세
          {
            // 내 게좌 목록
            path: '/accountList',
            element: <AccountList />,
          },
          {
            // 내 계좌 상세
            path: '/accountDetail/:account',
            element: <AccountDetail />,
          },
          {
            // 계좌 이체
            path: '/accountTransfer/:account',
            element: <AccountTransfer />,
          },

          // 포켓
          {
            // 포켓 생성
            path: '/pocket/create',
            element: <PocketCreate />,
          },
          {
            path: '/category/create',
            element: <CategoryCreate />,
          },

          // 챗봇
          {
            path: '/chatbot',
            element: <Chatbot />,
          },
          {
            path: '/error',
            element: <Error />,
          },
          // 예시 페이지
          {
            path: '/e',
            element: <ExamplePage />,
          },
        ],
      },
    ],
  },
  {},
]);

export default AppRouter;
