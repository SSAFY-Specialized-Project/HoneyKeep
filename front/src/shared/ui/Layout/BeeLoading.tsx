const BeeLoading = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full z-50">
      <div className="relative flex w-full h-full bg-gray-900/60 overflow-hidden">
        <div className="relative m-auto self-center w-12 h-12 animate-fly">
          <div className="relative w-10 h-6 border-4 border-yellow-600 bg-yellow-300 rounded-full z-10">
            {/* 벌의 머리 부분 */}
            <div className="before:content-[''] before:absolute before:right-full before:top-0.5 before:border-t-[6px] before:border-t-transparent before:border-r-[13px] before:border-r-yellow-600 before:border-b-[6px] before:border-b-transparent"></div>
            <div className="after:content-[''] after:absolute after:right-[97%] after:top-1.5 after:border-t-[3px] after:border-t-transparent after:border-r-[6px] after:border-r-yellow-300 after:border-b-[3px] after:border-b-transparent"></div>
            <div className="relative left-2.5 h-5 w-4 bg-yellow-600">
              {/* 줄무늬 */}
            </div>
          </div>
          <div>
            <div className="absolute top-[-16px] left-4 w-4 h-4 bg-yellow-300 border-4 border-yellow-600 rounded-full transform -skew-x-6 origin-bottom z-[9] animate-wing-right"></div>
            <div className="absolute top-[-16px] left-3 w-4 h-4 bg-yellow-300 border-4 border-yellow-600 rounded-full transform skew-x-6 origin-bottom z-[999] animate-wing-left"></div>
          </div>
        </div>
      </div>

      {/* 애니메이션 정의 */}
      <style>{`
        @keyframes fly {
          50% {
            transform: translateY(-3px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes wing-beat-right {
          50% {
            transform: rotateX(60deg) skew(-20deg) rotateZ(25deg);
          }
          100% {
            transform: rotateX(0) skew(-20deg);
          }
        }

        @keyframes wing-beat-left {
          50% {
            transform: rotateX(-65deg) skew(20deg) rotateZ(-10deg);
          }
          100% {
            transform: rotateX(0) skew(20deg);
          }
        }

        @keyframes pollen-move {
          0% {
            left: -90px;
          }
          100% {
            left: -95px;
          }
        }

        .animate-fly {
          animation: fly 0.4s infinite;
        }

        .animate-wing-right {
          animation: wing-beat-right 0.25s infinite;
        }

        .animate-wing-left {
          animation: wing-beat-left 0.25s infinite;
        }

      
      `}</style>
    </div>
  );
};

export default BeeLoading;
