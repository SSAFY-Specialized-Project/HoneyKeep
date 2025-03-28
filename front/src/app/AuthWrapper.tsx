import { AuthProtectedRoute } from "./routes";

const AuthWrapper = () => {
  const accessToken = localStorage.getItem("accessToken");

  const isAuthenticated = !!accessToken;

  return <AuthProtectedRoute isAuthenticated={isAuthenticated} />;
};

export default AuthWrapper;
