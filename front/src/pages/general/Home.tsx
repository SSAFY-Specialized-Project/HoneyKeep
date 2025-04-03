import {MyAccountInfo} from '@/features/account/ui';
import {Link} from 'react-router';

const Home = () => {
    return (
        <div className="flex flex-col gap-2 px-5 pt-5">
            {/* <WebAuthnRegistrationButton /> */}
            {/* <WebAuthnAuthenticationButton /> */}
            <MyAccountInfo/>
            {/* <MyPocketInfo /> */}
            <Link
                to="/pocket/create"
                className="bg-brand-primary-500 text-title-md mt-3 w-full rounded-2xl py-3 text-center font-bold text-white"
            >
                포켓 만들기
            </Link>
        </div>
    );
};

export default Home;
