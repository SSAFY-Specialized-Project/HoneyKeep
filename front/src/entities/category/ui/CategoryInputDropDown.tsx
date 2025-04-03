import { CategoryIcon, Icon } from '@/shared/ui';
import { useState } from 'react';

const CategoryInputDropDown = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryIcon, setCategoryIcon] = useState<number | null>(null);

  return (
    <div>
      <button className="flex w-full justify-between px-4 py-3">
        {categoryId && categoryIcon ? (
          <div className="flex gap-3">
            <CategoryIcon size="small" category={categoryIcon} />
            <span>{categoryName}</span>
          </div>
        ) : (
          <span>포켓의 카테고리를 선택해주세요.</span>
        )}
        <Icon size="small" isRotate={isOpen} id="chevron-down" />
      </button>
      <ul>
        <li></li>
      </ul>
    </div>
  );
};

export default CategoryInputDropDown;
