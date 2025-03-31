interface Props {
  category: number;
}

const CategoryIcon = ({ category }: Props) => {
  return (
    <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
      <svg width={60} height={60} viewBox="0 0 60 60">
        <use href={`/icon/category/_sprite.svg#category_${category}`} />
      </svg>
    </div>
  );
};

export default CategoryIcon;
