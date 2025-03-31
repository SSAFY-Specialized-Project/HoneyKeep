interface Props {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  imageId: string;
  name: string;
  pocketCount: number;
  totalAmount: number;
  pocketList: React.ReactNode;
}

const CategoryDropdown = ({
  active,
  setActive,
  name,
  pocketCount,
  totalAmount,
}: Props) => {
  return (
    <>
      <button
        type="button"
        className="w-full flex justify-between"
        onClick={() => {
          setActive(!active);
        }}
      >
        <div className="flex">
          <div className="w-13 h-13 bg-blue-500"></div>
          <div>
            <span>{name}</span>
            <div>
              <span>{`${pocketCount}개 항목`}</span>
              <span>{`${totalAmount}원`}</span>
            </div>
          </div>
        </div>
        <div className={``}>^</div>
      </button>
    </>
  );
};

export default CategoryDropdown;
