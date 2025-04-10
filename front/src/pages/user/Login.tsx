import { LoginForm } from '@/features/auth/login';
import { useMutation } from '@tanstack/react-query';
import loginUserAPI from '../../entities/user/api/loginUserAPI.ts';
import { ResponseErrorDTO } from '@/shared/model/types.ts';
import { useNavigate } from 'react-router';

const Login = () => {
  const navigate = useNavigate();

  const loginUserMutation = useMutation({
    mutationFn: loginUserAPI,
    onSuccess: (response) => {
      const accessToken = response.data.accessToken;
      localStorage.setItem('accessToken', accessToken);
      navigate('/home');
    },
    onError: (error: ResponseErrorDTO) => {
      if (error.status == 401) {
        console.log('로그인 실패');
      }
    },
  });

  const handleClick = () => {
    loginUserMutation.mutate({
      email: 'psm@naver.com',
      password: '123456',
    });
  };

  return (
    <div className="relative flex h-full flex-col gap-8 px-5 pt-20 pb-5">
      <button
        type="button"
        onClick={handleClick}
        className="bg-brand-primary-500 absolute top-5 right-5 w-50 cursor-pointer rounded-xl py-2 font-semibold text-white"
      >
        테스트 계정으로 로그인
      </button>
      <div className="flex flex-col gap-3">
        <h1 className="text-title-xl font-bold text-gray-900">사용자 본인인증</h1>
        <span className="text-title-sm font-semibold text-gray-600">
          회원가입 확인 및 가입을 진행합니다.
        </span>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
