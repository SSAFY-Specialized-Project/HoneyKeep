import { MyAccountInfo } from "@/features/account/ui";
import { Link } from "react-router";

const Home = () => {
  return (
    <div className="flex flex-col gap-2 px-5 pt-5">
      <MyAccountInfo />
      {/* <MyPocketInfo /> */}
      <Link
        to="/pocket/create"
        className="w-full py-3 mt-3 bg-brand-primary-500 rounded-2xl text-white text-title-md font-bold text-center"
      >
        포켓 만들기
      </Link>
    </div>
  );
};

export default Home;
