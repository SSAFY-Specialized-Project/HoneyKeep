import Lottie from "lottie-react";
import loadingAnimation from "../../../assets/LoadingAnimation.json";

const Loading = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <Lottie animationData={loadingAnimation} loop={true} />
    </div>
  );
};

export default Loading;
