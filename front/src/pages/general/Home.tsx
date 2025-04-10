import { MyAccountInfo } from '@/features/account/ui';
import { MyPocketInfo } from '@/features/pocket/ui';
import { Link } from 'react-router';
import {NoticeModal} from "@/shared/ui";

const Home = () => {
  return (
    <div className="flex h-full flex-col gap-4 px-5 pt-5">
        <NoticeModal
            isOpen={true}
            title={"링크로 포켓 생성 완료!"}
            content={"지금 바로 확인해보세요."}
        />
      <MyAccountInfo />
      <MyPocketInfo />
      <Link
        to="/pocket/create"
        className="bg-brand-primary-500 xs:text-title-xl text-title-md mt-3 mt-auto w-full cursor-pointer rounded-2xl py-3 text-center font-bold text-white"
      >
        포켓 만들기
      </Link>
    </div>
  );
};

export default Home;
