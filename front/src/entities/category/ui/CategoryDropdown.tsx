import { Pocket } from "@/entities/pocket/model/types";
import { PocketListItem } from "@/entities/pocket/ui";
import { Icon, ImageContainer } from "@/shared/ui";
import { useState } from "react";
import { Link } from "react-router";

interface Props {
  id: number;
  imageId: number;
  name: string;
  pocketCount: number;
  totalAmount: number;
  pocketList: Pocket[];
}

const CategoryDropdown = ({
  id,
  imageId,
  name,
  pocketCount,
  totalAmount,
  pocketList,
}: Props) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-2 p-5">
      <button
        type="button"
        className="w-full flex justify-between"
        onClick={() => {
          setOpen(isOpen);
        }}
      >
        <div className="flex gap-2.5">
          <ImageContainer size="small" imgSrc={`category_${imageId}`} />
          <div className="flex flex-col">
            <span className="text-text-xl text-gray-900 font-semibold">
              {name}
            </span>
            <div className="flex gap-2">
              <span className="text-gray-500 text-text-sm">{`${pocketCount}개 항목`}</span>
              <span className="text-text-sm text-gray-900">{`${totalAmount}원`}</span>
            </div>
          </div>
        </div>
        <div
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          <Icon id="chevron-down" size="small" />
        </div>
      </button>
      <ul
        className={`overflow-hidden transition-all duration-300 ease-in-out 
        ${isOpen ? "" : "max-h-0 opacity-0 "}
      `}
      >
        {pocketList.map((item) => {
          return (
            <PocketListItem
              key={item.id}
              name={item.name}
              imgUrl={item.imgUrl}
              totalAmount={item.totalAmount}
              endDate={item.endDate}
            />
          );
        })}
        <Link
          to={`/pocket/list?category=${id}`}
          className="block w-full py-2 text-gray-600"
        >
          더 보기
        </Link>
      </ul>
    </div>
  );
};

export default CategoryDropdown;
