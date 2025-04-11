import { useState, useEffect } from 'react';

interface Props {
  imgSrc?: string | null;
  size: 'big' | 'small';
}

const ImageContainer = ({ imgSrc, size }: Props) => {
  const [isImageValid, setIsImageValid] = useState<boolean>(false);

  const IMG_SIZE = {
    big: 'w-40 h-40',
    small: 'w-10 h-10',
  };

  useEffect(() => {
    // 이미지 URL이 변경될 때마다 유효성 검사 초기화
    setIsImageValid(false);

    if (imgSrc) {
      const img = new Image();
      img.onload = () => setIsImageValid(true);
      img.onerror = () => setIsImageValid(false);
      img.src = imgSrc;
    }
  }, [imgSrc]);

  return (
    <div className={`${IMG_SIZE[size]} overflow-hidden rounded-2xl`}>
      {imgSrc && isImageValid ? (
        <img src={imgSrc} alt="상품 이미지" className="h-full w-full object-contain" />
      ) : (
        <img
          src={'/image/ImageContainer.png'}
          alt="상품 이미지"
          className="h-full w-full object-contain"
        />
      )}
    </div>
  );
};

export default ImageContainer;
