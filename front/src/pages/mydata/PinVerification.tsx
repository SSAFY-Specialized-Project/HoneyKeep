import {PinVerificationWidget} from '@/widgets/certification/ui/PinVerificationWidget';
import {useLocation} from "react-router-dom";

const PinVerification = () => {
    const location = useLocation();
    const state = location.state as { accountNumber: string };

    return (
        <PinVerificationWidget
            accountNumber={state.accountNumber}
        />
    );
};

export default PinVerification; 