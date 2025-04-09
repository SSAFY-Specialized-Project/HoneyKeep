import { AuthProtectedRoute } from './routes';
import { useFCMStore } from '@/shared/store';

const AuthWrapper = () => {
  const accessToken = localStorage.getItem('accessToken');

  const isAuthenticated = !!accessToken;

  useFCMStore.getState().initializeFCM();

  if (isAuthenticated) {
    console.log('accessToken이 있습니다!!');
  } else {
    console.log('accessToken이 없습니다!!');
  }

  return <AuthProtectedRoute isAuthenticated={isAuthenticated} />;
};

export default AuthWrapper;
