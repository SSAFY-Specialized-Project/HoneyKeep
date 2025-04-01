interface Props {
  imageId: string;
  name: string;
  pocketCount: number;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CategoryCheck = ({
  imageId,
  name,
  pocketCount,
  checked,
  onChange,
}: Props) => {
  return (
    <div className="flex justify-between w-full px-3 py-2">
      <label htmlFor={name} className="w-full flex gap-3 items-center">
        <div className="w-10 h-10 bg-brand-primary-500 rounded-md">
          {imageId}
        </div>
        <div className="flex flex-col">
          <span className="text-gray-900 font-semibold">{name}</span>
          <span className="text-text-sm text-gray-500">{`연결된 포켓 ${pocketCount}개`}</span>
        </div>
      </label>
      <input
        type="checkbox"
        name={name}
        id={name}
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
};

export default CategoryCheck;
