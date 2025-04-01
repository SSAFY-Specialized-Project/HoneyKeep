import { getAllAccountAPI } from "@/entities/account/api";
import { AccountDTO } from "@/entities/account/model/types";
import { ResponseDTO } from "@/shared/model/types";
import { ContentAddBox } from "@/shared/ui";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

const MyAccountInfo = () => {
  const navigate = useNavigate();

  const { data: accountData } = useSuspenseQuery<ResponseDTO<AccountDTO[]>>({
    queryKey: ["accounts"],
    queryFn: getAllAccountAPI,
  });

  return (
    <div>
      <h3>내 계좌 정보</h3>
      {accountData ? (
        <div></div>
      ) : (
        <ContentAddBox
          text="내 자산 추가하기"
          onClick={() => {
            navigate("/myAgree");
          }}
        />
      )}
    </div>
  );
};

export default MyAccountInfo;
