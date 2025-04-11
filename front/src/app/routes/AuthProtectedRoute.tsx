import { Navigate, Outlet, useLocation } from "react-router";

interface Props {
  isAuthenticated: boolean;
}

const AuthProtectedRoute = ({ isAuthenticated }: Props) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default AuthProtectedRoute;
