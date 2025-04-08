import { BorderInput, CategoryIcon } from '@/shared/ui';
import { useState } from 'react';
import SelectCategoryModal from './SelectCategoryModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategoryAPI } from '@/entities/category/api';
import { useBasicModalStore } from '@/shared/store';
import { useNavigate } from 'react-router';

const CreateCategoryForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useBasicModalStore();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [iconId, setIconId] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [name, setName] = useState<string>('');

  const createCategoryMutation = useMutation({
    mutationFn: createCategoryAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category-data'] });
      console.log(categoryId);
      console.log('카테고리 생성 완료');
      // 생성 완료 후 행동
      navigate(-1);
    },
    onError: () => {
      // 에러 상황 처리 필요
      openModal({
        icon: 'exclamation-triangle',
        title: '카테고리 생성 실패',
        itemName: '카테고리 생성',
        description: '에 실패했습니다.',
        buttonText: '확인',
        onConfirm: () => {
          closeModal();
        },
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { name, icon: iconId };
    createCategoryMutation.mutate(data);
  };

  return (
    <>
      <form
        method="POST"
        className="flex h-full w-full flex-col items-center gap-8"
        onSubmit={handleSubmit}
      >
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
          className="bg-brand-primary-500 text-title-md mt-auto w-full cursor-pointer rounded-2xl py-3 text-center font-bold text-white"
        >
          확인
        </button>
      </form>
      <SelectCategoryModal isOpen={isOpen} setOpen={setOpen} setId={setIconId} />
    </>
  );
};

export default CreateCategoryForm;
