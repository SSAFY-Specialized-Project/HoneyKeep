import { Icon } from "@/shared/ui";

const BasicHeader = () => {
  return (
    <header className="w-full bg-blue p-5 flex justify-end items-center bg-blue-200">
      <div className="flex gap-5">
        <Icon id={"qr-code"} size="big" />
        <Icon id={"alarm"} size="big" />
      </div>
    </header>
  );
};

export default BasicHeader;
