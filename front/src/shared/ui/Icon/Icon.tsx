interface Props {
  size: 'big' | 'small' | 'xSmall';
  id: string;
  isRotate?: boolean;
}

const Icon = ({ size, id, isRotate }: Props) => {
  const SIZE = {
    big: 'w-8 h-8',
    small: 'w-6 h-6',
    xSmall: 'w-4 h-4',
  };

  const SIZE_PROPS = {
    big: 32,
    small: 24,
    xSmall: 16,
  };

  return (
    <div className={`${SIZE[size]} flex items-center justify-center rounded-lg`}>
      <svg
        width={SIZE_PROPS[size]}
        height={SIZE_PROPS[size]}
        viewBox={`0 0 ${SIZE_PROPS[size]} ${SIZE_PROPS[size]}`}
        className={`transition-transform duration-300 ${isRotate ? 'rotate-180' : ''}`}
      >
        <use href={`/icon/assets/_sprite.svg#${id}`} />
      </svg>
    </div>
  );
};

export default Icon;
