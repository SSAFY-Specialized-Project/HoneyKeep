import {useNavigate} from "react-router-dom";
import {AgreementWidget} from "@/widgets/mydata/ui";

const Agreement = () => {
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate("/mydata/certificates");
    };

    return (
        <AgreementWidget
            //TODO: 현재 사용자 이름 fetching 로직 구현
            userName="사용자"
            onSubmit={handleSubmit}
        />
    );
};

export default Agreement;