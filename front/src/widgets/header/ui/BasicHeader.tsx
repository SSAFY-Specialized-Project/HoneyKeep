import { Icon } from '@/shared/ui';

const BasicHeader = () => {
  return (
    <header className="flex w-full items-center justify-end p-5">
      <div className="flex gap-5">
        <Icon id={'qr-code'} size="big" />
        <Icon id={'alarm'} size="big" />
      </div>
    </header>
  );
};

export default BasicHeader;
