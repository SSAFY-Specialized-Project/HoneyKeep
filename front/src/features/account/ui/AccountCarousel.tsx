import Account from '@/entities/account/model/types';
import { QRAccount } from '@/entities/account/ui';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect } from 'react';

interface Props {
  accounts: Account[];
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}

const AccountCarousel = ({ accounts, setIndex }: Props) => {
  const options: EmblaOptionsType = {
    containScroll: 'trimSnaps',
    align: 'start',
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  // 슬라이드 변경 시 호출될 콜백 함수
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // emblaApi가 준비되면 이벤트 리스너 등록
  useEffect(() => {
    if (!emblaApi) return;

    // select 이벤트 리스너 등록
    emblaApi.on('select', onSelect);
    // 초기 선택 인덱스 설정
    onSelect();

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="embla" ref={emblaRef}>
      <div className="embla__container gap-5">
        {accounts.length > 0 ? (
          accounts.map((item) => {
            return (
              <QRAccount
                key={item.accountId}
                bankName={item.bankName}
                accountName={item.accountName}
                accountId={item.accountId}
                accountBalance={item.accountBalance}
              />
            );
          })
        ) : (
          <div></div>
        )}
      </div>
    </section>
  );
};

export default AccountCarousel;
