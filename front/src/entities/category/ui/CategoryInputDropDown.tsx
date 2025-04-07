import { CategoryIcon, Icon } from '@/shared/ui';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategoryListAPI } from '../api';
import CategoryCheck from './CategoryCheck';
import { useNavigate } from 'react-router';

interface Props {
  categoryId: number | null;
  setCategoryId: React.Dispatch<React.SetStateAction<number | null>>;
}

const CategoryInputDropDown = ({ categoryId, setCategoryId }: Props) => {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryIcon, setCategoryIcon] = useState<number | null>(null);

  const { data: categoryData } = useQuery({
    queryKey: ['category-data'],
    queryFn: getCategoryListAPI,
    staleTime: 20 * 1000,
  });

  return (
    <div className="flex flex-col gap-3">
      <button
        className="flex w-full items-center justify-between rounded-2xl border border-gray-200 px-4 py-5"
        onClick={() => {
          setOpen(!isOpen);
        }}
      >
        {categoryId && categoryIcon ? (
          <div className="flex items-center gap-3">
            <CategoryIcon size="small" category={categoryIcon} />
            <span>{categoryName}</span>
          </div>
        ) : (
          <span className="text-text-lg font-bold text-gray-600">
            포켓의 카테고리를 선택해주세요.
          </span>
        )}
        <Icon size="small" isRotate={isOpen} id="chevron-down" />
      </button>
      <ul
        className={`shadow-custom flex flex-col gap-2.5 rounded-2xl py-3 transition-all duration-300 ${isOpen ? 'max-h-50 overflow-auto opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {categoryData && categoryData.data != null
          ? categoryData.data.map((item) => {
              return (
                <li key={item.categoryId}>
                  <CategoryCheck
                    iconId={item.icon}
                    name={item.name}
                    checked={categoryId == item.categoryId}
                    onChange={() => {
                      setCategoryId(item.categoryId);
                      setCategoryIcon(item.icon);
                      setCategoryName(item.name);
                      setOpen(false);
                    }}
                  />
                </li>
              );
            })
          : null}
      </ul>
      <button
        type="button"
        onClick={() => {
          navigate('/category/create');
        }}
        className="flex w-full items-center justify-center rounded-2xl border border-gray-200 py-4"
      >
        <span className="text-text-xl text-gray-900">새 카테고리 추가</span>
      </button>
    </div>
  );
};

export default CategoryInputDropDown;
