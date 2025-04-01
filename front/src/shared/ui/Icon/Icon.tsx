interface Props {
  size: "big" | "small";
  id: string;
}

const Icon = ({ size, id }: Props) => {
  const SIZE = {
    big: "w-8 h-8",
    small: "w-6 h-6",
  };

  const SIZE_PROPS = {
    big: 32,
    small: 24,
  };

  return (
    <div
      className={`${SIZE[size]} rounded-lg flex items-center justify-center`}
    >
      <svg
        width={SIZE_PROPS[size]}
        height={SIZE_PROPS[size]}
        viewBox={`0 0 ${SIZE_PROPS[size]} ${SIZE_PROPS[size]}`}
      >
        <use href={`/icon/assets/_sprite.svg#${id}`} />
      </svg>
    </div>
  );
};

export default Icon;
