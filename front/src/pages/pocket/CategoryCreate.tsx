import CreateCategoryForm from '@/features/category/ui/CreateCategoryForm';
import { Icon } from '@/shared/ui';

const CategoryCreate = () => {
  return (
    <div className="relative flex h-full flex-col gap-35 px-5 pt-2 pb-5">
      <h2 className="flex items-center justify-start gap-2">
        <Icon id="folder" size="big" />
        <span className="text-title-xl font-bold">카테고리 만들기</span>
      </h2>
      <CreateCategoryForm />
    </div>
  );
};

export default CategoryCreate;
