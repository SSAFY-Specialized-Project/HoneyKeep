import { BorderInput, CategoryIcon } from '@/shared/ui';
import { useState } from 'react';
import SelectCategoryModal from './SelectCategoryModal';

const CreateCategoryForm = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [iconId, setIconId] = useState<number>(0);
  const [name, setName] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  return (
    <>
      <form method="POST" className="flex h-full w-full flex-col items-center gap-8">
        <button
          type="button"
          onClick={() => {
            setOpen(true);
          }}
        >
          <CategoryIcon size="big" category={iconId} />
        </button>
        <div>
          <label htmlFor=""></label>
          <input type="hidden" value={iconId} />
        </div>
        <BorderInput
          type="text"
          label="category"
          placeholder="카테고리명을 입력하세요."
          value={name}
          onChange={handleChange}
          regText="최대 10자 입력"
        />
        <button
          type="submit"
          className="bg-brand-primary-500 text-title-md mt-auto w-full rounded-2xl py-3 text-center font-bold text-white"
        >
          확인
        </button>
      </form>
      <SelectCategoryModal isOpen={isOpen} setOpen={setOpen} setId={setIconId} />
    </>
  );
};

export default CreateCategoryForm;
