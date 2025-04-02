import { motion } from "framer-motion";

import Bar1 from "/icon/landing/Bar1.svg";
import Bar2 from "/icon/landing/Bar2.svg";
import Bar3 from "/icon/landing/Bar3.svg";
import Bar4 from "/icon/landing/Bar4.svg";
import K from "/icon/landing/k.svg";
import Name from "/icon/landing/name.svg";

const BarComponents = [Bar1, Bar2, Bar3, Bar3, Bar2, Bar4];

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900">
      <div className="scale-[0.6] flex flex-col items-center">
        {/* 로고 영역 */}
        <div className="flex items-center space-x-2">
          {/* 왼쪽 막대 6개 */}
          <div className="flex flex-col items-center justify-center gap-2.5">
            {BarComponents.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.2,
                  duration: 0.3,
                  ease: "easeOut",
                }}
              >
                <img src={src} alt={`bar-${index}`} />
              </motion.div>
            ))}
          </div>

          {/* K 등장 */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              delay: BarComponents.length * 0.2 + 0.2,
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <img src={K} alt="logo-K" />
          </motion.div>
        </div>

        {/* 텍스트 꿀킵 (이제 scale 안에 포함) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: BarComponents.length * 0.2 + 0.8,
            duration: 0.6,
            ease: "easeInOut",
          }}
          className="mt-6"
        >
          <img src={Name} alt="logo-text" />
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
