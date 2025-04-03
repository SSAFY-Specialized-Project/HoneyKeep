import { LoginForm } from '@/features/auth/login';

const Login = () => {
  return (
    <div className="flex h-full flex-col gap-8 px-5 pt-20 pb-5">
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
