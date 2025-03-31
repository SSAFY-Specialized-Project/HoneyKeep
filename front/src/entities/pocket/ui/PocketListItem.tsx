import { ImageContainer } from "@/shared/ui";
import { PocketDTO } from "../model/types";

const PocketListItem = ({ name, imgUrl, totalAmount, endDate }: PocketDTO) => {
  return (
    <li>
      <div className="flex gap-3">
        <ImageContainer imgSrc={imgUrl} size="small" />
        <div className="flex flex-col">
          <span className="text-text-md font-semibold text-gray-900">
            {name}
          </span>
          <div className="flex gap-1">
            <span className="text-text-sm text-gray-500">{endDate}</span>
            <span className="text-text-sm text-gray-900">{totalAmount}</span>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="border border-gray-200 rounded-lg border-gray-200 px-4 py-2"
        onClick={() => {
          // 포켓 관리 모달 오픈
        }}
      >
        관리
      </button>
    </li>
  );
};

export default PocketListItem;
