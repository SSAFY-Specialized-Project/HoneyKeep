interface Props {
  category: number;
  size?: "big" | "normal";
}

const CategoryIcon = ({ category, size = "normal" }: Props) => {
  const SIZE_PROP = {
    big: "w-40 h-40",
    normal: "w-20 h-20",
  };

  const ICON_SIZE_PROP = {
    big: 128,
    normal: 60,
  };

  return (
    <div
      className={`${SIZE_PROP[size]} rounded-lg bg-gray-100 flex items-center justify-center`}
    >
      <svg
        width={ICON_SIZE_PROP[size]}
        height={ICON_SIZE_PROP[size]}
        viewBox="0 0 60 60"
      >
        <use href={`/icon/category/_sprite.svg#category_${category}`} />
      </svg>
    </div>
  );
};

export default CategoryIcon;
