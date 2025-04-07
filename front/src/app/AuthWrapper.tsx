import { AuthProtectedRoute } from './routes';

const AuthWrapper = () => {
  const accessToken = localStorage.getItem('accessToken');

  const isAuthenticated = !!accessToken;

  if (isAuthenticated) {
    console.log('accessToken이 있습니다!!');
  } else {
    console.log('accessToken이 없습니다!!');
  }

  return <AuthProtectedRoute isAuthenticated={isAuthenticated} />;
};

export default AuthWrapper;
