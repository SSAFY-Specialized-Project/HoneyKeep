import { getCategoryListAPI } from '@/entities/category/api';
import { FilterDropdown } from '@/shared/ui';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface Props {
  setCategoryId: React.Dispatch<React.SetStateAction<number | null>>;
}

const CategoryFilterDropdown = ({ setCategoryId }: Props) => {
  const [category, setCategory] = useState<string | null>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const { data: categoryData } = useQuery({
    queryKey: ['category-list'],
    queryFn: getCategoryListAPI,
    staleTime: 60 * 1000 * 60,
  });

  const handleCategoryFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.dataset.value) return;

    if (e.currentTarget.dataset.id === 'all') {
      setCategoryId(null);
      setCategory(null);
    } else if (e.currentTarget.dataset.id) {
      setCategoryId(Number(e.currentTarget.dataset.id));
      setCategory(e.currentTarget.dataset.value);
    }
    setOpen(false);
  };

  const categoryList = (
    <ul className="">
      <li>
        <button
          type="button"
          className="text-text-lg cursor-pointer px-4 py-1.5 font-bold text-gray-600"
          data-value="전체"
          data-id="all"
          onClick={handleCategoryFilter}
        >
          전체
        </button>
      </li>
      {categoryData?.data.map((item) => (
        <li key={item.categoryId}>
          <button
            type="button"
            className="text-text-lg cursor-pointer px-4 py-1.5 font-bold text-gray-600"
            data-value={item.name}
            data-id={item.categoryId}
            onClick={handleCategoryFilter}
          >
            {item.name}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <FilterDropdown
      title="카테고리"
      value={category}
      children={categoryList}
      isOpen={isOpen}
      setOpen={setOpen}
    />
  );
};

export default CategoryFilterDropdown;
