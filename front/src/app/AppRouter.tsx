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
]);

export default AppRouter;
