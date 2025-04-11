import {PocketChoiceTab} from '@/entities/pocket/ui';
import {Icon} from '@/shared/ui';
import {Outlet} from 'react-router';

const PocketCreate = () => {
    return (
        <div className="flex h-full flex-col gap-4 px-5">
            <div>
                <div className="flex items-center gap-3">
                    <Icon size="big" id="money-bag"/>
                    <h2 className="xs:text-title-xl text-title-md font-bold">포켓 만들기</h2>
                </div>
                <span className="xs:text-title-sm text-text-lg text-gray-500">
          어떤 지출이 예정되어 있나요?
        </span>
            </div>
            <PocketChoiceTab/>
            <div className="">
                <Outlet/>
            </div>
        </div>
    );
};

export default PocketCreate;
