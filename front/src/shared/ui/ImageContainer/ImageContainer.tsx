interface Props {
  imgSrc?: string | null;
  size: "big" | "small";
}

const ImageContaier = ({ imgSrc, size }: Props) => {
  const IMG_SIZE = {
    big: "w-10 h-10",
    small: "w-40 h-40",
  };

  return (
    <div className={`${IMG_SIZE[size]} overflow-hidden `}>
      {imgSrc ? (
        <img src={imgSrc} alt="상품 이미지" className="object-contain" />
      ) : null}
    </div>
  );
};

export default ImageContaier;
