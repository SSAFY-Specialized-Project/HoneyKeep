import { Alarm, Chatbot, Error, Home, Landing, Loading } from '@/pages/general';
import { Login } from '@/pages/user';
import { createBrowserRouter } from 'react-router';
import AuthWrapper from './AuthWrapper';
import { Payment, QRPayment, QRSuccess } from '@/pages/payment';
import { BaseLayout, HistoryLayout, HistoryNavLayout } from './layouts';
import {
  PocketCalendar,
  PocketCreate,
  PocketCreateStep,
  PocketCreateSuccess,
  PocketDetailPage,
  PocketList,
} from '@/pages/pocket';
import {
    FixedExpenseCreate,
    FixedExpenseList,
    FixedExpenseDetail,
    FixedExpenseListContent,
    FixedExpenseListFound
} from '@/pages/fixedExpense';
import {
  AccountConnect,
  AccountDetail,
  AccountList,
  AccountTransfer,
  Certification,
  MyAgree,
} from '@/pages/account';
import CategoryCreate from '@/pages/pocket/CategoryCreate';
import PocketCreateLink from '@/features/pocket/ui/PocketCreateLink';
import ExamplePage from '@/entities/pocket/ui/ExamplePage';
import { Layout } from '@/shared/ui';
import { PocketCreateDirect, PocketFavoriteList } from '@/features/pocket/ui';
import { Suspense } from 'react';
import { MainSkeleton } from '@/pages/skeleton';

const AppRouter = createBrowserRouter([
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
        path: '/',
        element: <Landing />,
      },
      {
        path: '/loading',
        element: <Loading />,
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
            path: '/home',
            element: (
              <Suspense fallback={<MainSkeleton />}>
                <Home />
              </Suspense>
            ),
            errorElement: <div>홈에서 데이터를 불러오기 실패했습니다.</div>,
          },
          {
            // 알람 설정
            path: '/alarm',
            element: <Alarm />,
          },

          {
            // 포켓 캘린더
            path: '/pocket/calendar',
            element: <PocketCalendar />,
          },
        ],
      },
    ],
  },
  {
    element: <HistoryNavLayout />,
    children: [
      {
        element: <AuthWrapper />,
        children: [
          {
            // 포켓 목록
            path: '/pocket/list',
            element: <PocketList />,
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
            children: [
              {
                path: 'link',
                element: <PocketCreateLink />,
              },
              {
                path: 'favorite',
                element: <PocketFavoriteList />,
              },
              {
                path: 'direct',
                element: <PocketCreateDirect />,
              },
            ],
          },
          {
            path: '/pocket/create/link/step',
            element: <PocketCreateStep />,
          },
          {
            path: '/pocket/success',
            element: <PocketCreateSuccess />,
          },
          {
            path: '/pocket/detail/:id',
            element: <PocketDetailPage />,
          },
          {
            path: '/category/create',
            element: <CategoryCreate />,
          },
          // 고정 지출
          {
            path: '/fixedExpense',
            element: <FixedExpenseList />,
            children: [
              {
                path: "list",
                element: <FixedExpenseListContent />
              },
              {
                path: "found",
                element: <FixedExpenseListFound />
              }
            ]
          },
          {
            // 고정 지출 생성
            path: '/fixedExpense/create',
            element: <FixedExpenseCreate />,
          },
          {
            // 고정 지출 상세
            path: '/fixedExpense/:id',
            element: <FixedExpenseDetail />,
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
