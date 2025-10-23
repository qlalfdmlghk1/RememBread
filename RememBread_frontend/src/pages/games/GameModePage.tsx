import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import SpeechBubble from "@/components/common/SpeechBubble";
import CustomButton from "@/components/common/CustomButton";
import Game from "@/components/svgs/footer/Game";
import Memory from "@/components/svgs/game/mode/Memory";
import Compare from "@/components/svgs/game/mode/Compare";
import Shadow from "@/components/svgs/game/mode/Shadow";
import Detective from "@/components/svgs/game/mode/Detective";

const GameModePage = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [showSpeechBubble, setShowSpeechBubble] = useState<boolean>(false);

  const messages = [
    "오늘도 열심히 해봐요!",
    "힘내세요!",
    "잘하고 있어요!",
    "최고예요!",
    "파이팅!",
  ];

  useEffect(() => {
    controls.start({
      y: [10, -40, 10],
      transition: {
        duration: 0.8,
        ease: ["easeOut", "easeIn"],
        repeat: Infinity,
        repeatType: "loop",
      },
    });
  }, [controls]);

  useEffect(() => {
    if (showSpeechBubble) {
      const timer = setTimeout(() => setShowSpeechBubble(false), 500);
      return () => clearTimeout(timer);
    }
  }, [showSpeechBubble]);

  const handleGameClick = async () => {
    setShowSpeechBubble(true);

    controls.stop();
    await controls.start({
      rotate: 360,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    });
    controls.stop();
    await controls.start({
      rotate: 0,
      y: [10, -40, 10],
      transition: {
        y: {
          duration: 0.8,
          ease: ["easeOut", "easeIn"],
          repeat: Infinity,
          repeatType: "loop",
        },
      },
    });
  };

  return (
    <div className="min-h-[calc(100vh-126px)] flex flex-col justify-center items-center px-4">
      <div className="flex w-full flex-col items-center">
        <div className="relative flex flex-col items-center mt-4 mb-4">
          <AnimatePresence>
            {showSpeechBubble && (
              <motion.div
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -20 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 1 }}
                className="absolute z-10"
              >
                <SpeechBubble text={messages[Math.floor(Math.random() * messages.length)]} />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            animate={controls}
            initial={{ y: 10 }}
            onClick={handleGameClick}
            style={{ cursor: "pointer" }}
          >
            <Game className="w-48 h-48" />
          </motion.div>
        </div>
      </div>
      <div className="w-full flex flex-col max-w-[384px] mt-4">
        <CustomButton
          title="순간기억"
          description="숫자와 빵을 기억하자"
          className="bg-primary-200"
          icon={<Memory className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 ml-2" />}
          onClick={() => navigate("/games/memory")}
        />
        <CustomButton
          title="가격비교"
          description="가격이 더 비싼 빵은?"
          className="bg-primary-200"
          icon={<Compare className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 ml-2" />}
          onClick={() => navigate("/games/compare")}
        />
        <CustomButton
          title="그림자빵"
          description="그림자로 변한 빵은?"
          className="bg-primary-200"
          icon={<Shadow className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 ml-2" />}
          onClick={() => navigate("/games/shadow")}
        />
        <CustomButton
          title="빵 탐정"
          description="무슨 빵일까?"
          className="bg-primary-200"
          icon={<Detective className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 ml-2" />}
          onClick={() => navigate("/games/detective")}
        />
      </div>
    </div>
  );
};

export default GameModePage; 