import { Icon } from "@/shared/ui";
import { useNavigate } from "react-router";

const HistoryHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full p-5">
      <button
        type="button"
        className="cursor-pointer"
        onClick={() => {
          navigate(-1);
        }}
      >
        <Icon id="chevron-left" size="big" />
      </button>
    </header>
  );
};

export default HistoryHeader;
