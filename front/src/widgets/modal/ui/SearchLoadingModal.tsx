import Lottie from 'lottie-react';
import searching from '../../../assets/searching.json';
import { Link } from 'react-router';

interface Props {
  isLoading: boolean;
}

const SearchLoadingModal = ({ isLoading }: Props) => {
  return (
    <div
      className={`absolute top-0 left-0 flex h-full w-full flex-col justify-start bg-white py-10 ${isLoading ? '' : 'hidden'}`}
    >
      <h2 className="text-title-xl text-center font-bold text-gray-600">포켓 만드는 중</h2>
      <Lottie animationData={searching} loop={true} />
      <p className="text-title-md text-center font-semibold text-gray-500">
        링크로 불러오는데 5분 정도 걸려요 <br /> 정보를 다 불러온 뒤 알림으로 알려드릴게요!
      </p>
      <Link
        to="/home"
        className="bg-brand-primary-500 text-title-md mt-auto w-full cursor-pointer rounded-2xl py-3 text-center font-bold text-white disabled:cursor-default disabled:bg-gray-100 disabled:text-gray-400"
      >
        홈으로
      </Link>
    </div>
  );
};

export default SearchLoadingModal;
