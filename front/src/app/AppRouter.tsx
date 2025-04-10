import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import AuthWrapper from './AuthWrapper';
import { BaseLayout, HistoryLayout, HistoryNavLayout } from './layouts';
import { Layout } from '@/shared/ui';
import {
  BankPageSkeleton,
  DefaultLoadingSkeleton,
  MainSkeleton,
  PocketListSkeleton,
} from '@/pages/skeleton';
import PocketCreateWrapper from './PocketCreateWrapper';
import SpendingAnalysis from '@/pages/pocket/SpendingAnalysis';
import { QRPaySimulation } from '@/pages/general';

// 일반 페이지 컴포넌트 lazy 로딩
const Landing = lazy(() => import('@/pages/general/Landing'));
const Login = lazy(() => import('@/pages/user/Login'));
const SuccessPage = lazy(() => import('@/pages/general/SuccessPage'));
const Home = lazy(() => import('@/pages/general/Home'));
const Alarm = lazy(() => import('@/pages/general/Alarm'));
const Chatbot = lazy(() => import('@/pages/general/Chatbot'));
const Error = lazy(() => import('@/pages/general/Error'));

// 결제 관련 컴포넌트
const Payment = lazy(() => import('@/pages/payment/Payment'));
const QRPayment = lazy(() => import('@/pages/payment/QRPayment'));
const QRSuccess = lazy(() => import('@/pages/payment/QRSuccess'));

// 포켓 관련 컴포넌트
const PocketCalendar = lazy(() => import('@/pages/pocket/PocketCalendar'));
const PocketList = lazy(() => import('@/pages/pocket/PocketList'));
const PocketCreate = lazy(() => import('@/pages/pocket/PocketCreate'));
const PocketCreateStep = lazy(() => import('@/pages/pocket/PocketCreateStep'));
const PocketCreateDirectStep = lazy(() => import('@/pages/pocket/PocketCreateDirectStep'));
const PocketCreateSuccess = lazy(() => import('@/pages/pocket/PocketCreateSuccess'));
const PocketDetailPage = lazy(() => import('@/pages/pocket/PocketDetailPage'));
const CategoryCreate = lazy(() => import('@/pages/pocket/CategoryCreate'));
const PocketCreateLink = lazy(() => import('@/features/pocket/ui/PocketCreateLink'));
const PocketCreateDirect = lazy(() => import('@/features/pocket/ui/PocketCreateDirect'));
const PocketFavoriteList = lazy(() => import('@/features/pocket/ui/PocketFavoriteList'));
const ExamplePage = lazy(() => import('@/entities/pocket/ui/ExamplePage'));

// 계좌 관련 컴포넌트
const AccountList = lazy(() => import('@/pages/account/AccountList'));
const AccountDetail = lazy(() => import('@/pages/account/AccountDetail'));
const AccountTransfer = lazy(() => import('@/pages/account/AccountTransfer'));
const AccountTransactions = lazy(() => import('@/features/account/ui/AccountTransactions'));
const AccountPockets = lazy(() => import('@/features/account/ui/AccountPockets'));

// 고정 지출 관련 컴포넌트
const FixedExpenseList = lazy(() => import('@/pages/fixedExpense/FixedExpenseList'));
const FixedExpenseCreate = lazy(() => import('@/pages/fixedExpense/FixedExpenseCreate'));
const FixedExpenseDetail = lazy(() => import('@/pages/fixedExpense/FixedExpenseDetail'));
const FixedExpenseListContent = lazy(() => import('@/pages/fixedExpense/FixedExpenseListContent'));
const FixedExpenseListFound = lazy(() => import('@/pages/fixedExpense/FixedExpenseListFound'));

// 마이데이터 관련 컴포넌트
const Agreement = lazy(() => import('@/pages/mydata/Agreement'));
const Certificates = lazy(() => import('@/pages/mydata/Certificates'));
const KkulkipRegister = lazy(() => import('@/pages/mydata/KkulkipRegister'));
const PinVerification = lazy(() => import('@/pages/mydata/PinVerification'));
const AccountConnect = lazy(() => import('@/pages/mydata/AccountConnect'));

const AppRouter = createBrowserRouter([
  {
    // 상단 바랑 네비게이션 없는 레이아웃
    element: <Layout />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<DefaultLoadingSkeleton />}>
            <Landing />
          </Suspense>
        ),
      },
      {
        // 로그인
        path: '/login',
        element: (
          <Suspense fallback={<DefaultLoadingSkeleton />}>
            <Login />
          </Suspense>
        ),
      },

      // 성공 페이지
      {
        path: '/success',
        element: (
          <Suspense fallback={<DefaultLoadingSkeleton />}>
            <SuccessPage />
          </Suspense>
        ),
      },

      {
        element: <AuthWrapper />,
        children: [
          {
            // 결제
            path: '/payment',
            element: (
              <Suspense fallback={<DefaultLoadingSkeleton />}>
                <Payment />
              </Suspense>
            ),
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
            element: (
              <Suspense fallback={<DefaultLoadingSkeleton />}>
                <Alarm />
              </Suspense>
            ),
          },

          {
            // 포켓 캘린더
            path: '/pocket/calendar',
            element: (
              <Suspense fallback={<DefaultLoadingSkeleton />}>
                <PocketCalendar />
              </Suspense>
            ),
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
            element: (
              <Suspense fallback={<PocketListSkeleton />}>
                <PocketList />
              </Suspense>
            ),
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
            path: '/mydata',
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<DefaultLoadingSkeleton />}>
                    <Agreement />
                  </Suspense>
                ),
              },
              {
                path: 'agreement',
                element: (
                  <Suspense fallback={<DefaultLoadingSkeleton />}>
                    <Agreement />
                  </Suspense>
                ),
              },
              {
                path: 'certificates',
                element: (
                  <Suspense fallback={<DefaultLoadingSkeleton />}>
                    <Certificates />
                  </Suspense>
                ),
              },
            ],
          },

          // 인증서 등록
          {
            path: '/:id/register',
            element: (
              <Suspense fallback={<DefaultLoadingSkeleton />}>
                <KkulkipRegister />
              </Suspense>
            ),
          },
          {
            path: '/verifyPin',
            element: (
              <Suspense fallback={<DefaultLoadingSkeleton />}>
                <PinVerification />
              </Suspense>
            ),
          },
          {
            // QR 결제 완료
            path: '/qrSuccess',
            element: (
              <Suspense fallback={<DefaultLoadingSkeleton />}>
                <QRSuccess />
              </Suspense>
            ),
          },
          // 연결 은행 선택
          {
            path: '/mydata/accountConnect',
            element: (
              <Suspense fallback={<PocketListSkeleton />}>
                <AccountConnect />
              </Suspense>
            ),
          },

          // 계좌 상세
          {
            // 내 게좌 목록
            path: '/accountList',
            element: (
              <Suspense fallback={<BankPageSkeleton />}>
                <AccountList />
              </Suspense>
            ),
          },
          {
            // 내 계좌 상세
            path: '/accountDetail/:accountId',
            element: (
              <Suspense fallback={<BankPageSkeleton />}>
                <AccountDetail />
              </Suspense>
            ),
            children: [
              {
                path: 'detail',
                element: (
                  <Suspense fallback={<DefaultLoadingSkeleton />}>
                    <AccountTransactions />
                  </Suspense>
                ),
              },
              {
                path: 'transactions',
                element: (
                  <Suspense fallback={<DefaultLoadingSkeleton />}>
                    <AccountTransactions />
                  </Suspense>
                ),
              },
              {
                path: 'pockets',
                element: (
                  <Suspense fallback={<DefaultLoadingSkeleton />}>
                    <AccountPockets />
                  </Suspense>
                ),
              },
            ],
          },
          {
            // 계좌 이체
            path: '/accountTransfer/:account',
            element: (
              <Suspense fallback={<DefaultLoadingSkeleton />}>
                <AccountTransfer />
              </Suspense>
            ),
          },

          {
            element: <PocketCreateWrapper />,
            children: [
              // 포켓
              {
                // 포켓 생성
                path: '/pocket/create',
                element: (
                  <Suspense fallback={<DefaultLoadingSkeleton />}>
                    <PocketCreate />
                  </Suspense>
                ),
                children: [
                  {
                    path: 'link',
                    element: (
                      <Suspense fallback={<DefaultLoadingSkeleton />}>
                        <PocketCreateLink />
                      </Suspense>
                    ),
                  },
                  {
                    path: 'favorite',
                    element: (
                      <Suspense fallback={<DefaultLoadingSkeleton />}>
                        <PocketFavoriteList />
                      </Suspense>
                    ),
                  },
                  {
                    element: (
                      <Suspense fallback={<DefaultLoadingSkeleton />}>
                        <PocketCreateDirect />
                      </Suspense>
                    ),
                    index: true,
                  },
                ],
              },
              {
                path: '/pocket/create/link/step',
                element: (
                  <Suspense fallback={<DefaultLoadingSkeleton />}>
                    <PocketCreateStep />
                  </Suspense>
                ),
              },
              {
                path: '/pocket/create/direct/step',
                element: (
                  <Suspense fallback={<DefaultLoadingSkeleton />}>
                    <PocketCreateDirectStep />
                  </Suspense>
                ),
              },
              {
                path: '/category/create',
                element: (
                  <Suspense fallback={<DefaultLoadingSkeleton />}>
                    <CategoryCreate />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: '/pocket/success',
            element: (
              <Suspense fallback={<DefaultLoadingSkeleton />}>
                <PocketCreateSuccess />
              </Suspense>
            ),
          },
          {
            path: '/pocket/detail/:id',
            element: (
              <Suspense fallback={<DefaultLoadingSkeleton />}>
                <PocketDetailPage />
              </Suspense>
            ),
          },
          // 고정 지출 상세
          {
            path: '/fixedExpense/:id',
            element: (
              <Suspense fallback={<DefaultLoadingSkeleton />}>
                <FixedExpenseDetail />
              </Suspense>
            ),
          },
          // 챗봇

          {
            path: '/error',
            element: (
              <Suspense fallback={<DefaultLoadingSkeleton />}>
                <Error />
              </Suspense>
            ),
          },
          // 예시 페이지
          {
            path: '/analysis',
            element: (
              <Suspense fallback={<DefaultLoadingSkeleton />}>
                <SpendingAnalysis />
              </Suspense>
            ),
          },
          {
            path: '/chatbot',
            element: (
              <Suspense fallback={<DefaultLoadingSkeleton />}>
                <Chatbot />
              </Suspense>
            ),
          },
          {
            // QR 결제
            path: '/qrPayment',
            element: (
              <Suspense fallback={<DefaultLoadingSkeleton />}>
                <QRPayment />
              </Suspense>
            ),
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
          // 고정 지출
          {
            path: '/fixedExpense',
            element: (
              <Suspense fallback={<BankPageSkeleton />}>
                <FixedExpenseList />
              </Suspense>
            ),
            children: [
              {
                path: 'list',
                element: (
                  <Suspense fallback={<DefaultLoadingSkeleton />}>
                    <FixedExpenseListContent />
                  </Suspense>
                ),
              },
              {
                path: 'found',
                element: (
                  <Suspense fallback={<DefaultLoadingSkeleton />}>
                    <FixedExpenseListFound />
                  </Suspense>
                ),
              },
            ],
          },
          {
            // 고정 지출 생성
            path: '/fixedExpense/create',
            element: (
              <Suspense fallback={<DefaultLoadingSkeleton />}>
                <FixedExpenseCreate />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '/pay/send',
    element: <QRPaySimulation />,
  },
]);

export default AppRouter;
