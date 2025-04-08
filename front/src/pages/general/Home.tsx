import { MyAccountInfo } from '@/features/account/ui';
import { MyPocketInfo } from '@/features/pocket/ui';
import { Link } from 'react-router';

const Home = () => {
  return (
    <div className="flex h-full flex-col gap-4 px-5 pt-5">
      <MyAccountInfo />
      <MyPocketInfo />
      <Link
        to="/pocket/create"
        className="bg-brand-primary-500 text-title-md mt-3 mt-auto w-full cursor-pointer rounded-2xl py-3 text-center font-bold text-white"
      >
        포켓 만들기
      </Link>
    </div>
  );
};

export default Home;
