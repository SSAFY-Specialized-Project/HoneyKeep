import { Login } from "@/pages";
import { Layout } from "@/shared/ui";
import { createBrowserRouter } from "react-router";

const AppRouter = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
    ],
  },
  {
    // 헤더랑 네비게이션 바 있는 상태
    element: <Layout />,
    children: [
      {
        // 홈
        path: "/home",
        element: <Login />,
      },
      {
        // 알람 설정
        path: "/alarm",
        element: <Login />,
      },
    ],
  },
  {
    // 뒤로가기가 있는 상태
    element: <Layout />,
    children: [
      // 계좌 연결 부분
      {
        // 마이데이터 약관 동의
        path: "/myAgree",
        element: <Login />,
      },
      {
        // 자체 인증서
        path: "/certification",
        element: <Login />,
      },
      {
        // 연결 은행 선택
        path: "/accountConnect",
        element: <Login />,
      },
    ],
  },
  {},
]);

export default AppRouter;
