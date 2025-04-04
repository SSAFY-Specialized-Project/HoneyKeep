import { CategoryIcon } from '@/shared/ui';

interface Props {
  iconId: number;
  name: string;
  pocketCount?: number;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CategoryCheck = ({ iconId, name, pocketCount, checked, onChange }: Props) => {
  return (
    <div className="flex w-full justify-between px-3 py-2">
      <label htmlFor={name} className="flex w-full items-center gap-3">
        <CategoryIcon size="small" category={iconId} />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{name}</span>
          {pocketCount ? (
            <span className="text-text-sm text-gray-500">{`연결된 포켓 ${pocketCount}개`}</span>
          ) : null}
        </div>
      </label>
      <input type="checkbox" name={name} id={name} checked={checked} onChange={onChange} />
    </div>
  );
};

export default CategoryCheck;
