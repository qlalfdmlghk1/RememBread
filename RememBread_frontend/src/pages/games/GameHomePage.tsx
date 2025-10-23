import { useNavigate } from "react-router-dom";
import SpeechBubble from "@/components/common/SpeechBubble";
import Button from "@/components/common/Button";
import Game from "@/components/svgs/footer/Game";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const GamesHomePage = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);

  const messages = ["오늘도 열심히 해봐요!", "힘내세요!", "잘하고 있어요!", "최고예요!", "파이팅!"];

  useEffect(() => {
    // 컴포넌트가 마운트되면 바로 뛰는 애니메이션 시작
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

  // 말풍선이 true가 되면 500ms 후 자동으로 false로 변경
  useEffect(() => {
    if (showSpeechBubble) {
      const timer = setTimeout(() => setShowSpeechBubble(false), 500);
      return () => clearTimeout(timer);
    }
  }, [showSpeechBubble]);

  const handleRandomGame = () => {
    const games = ["/games/memory", "/games/compare", "/games/detective", "/games/shadow"];
    const randomIndex = Math.floor(Math.random() * games.length);
    navigate(games[randomIndex]);
  };

  const handleGameClick = async () => {
    if (!controls) return;

    setShowSpeechBubble(true);

    try {
      await controls.stop();
      await controls.start({
        rotate: 360,
        transition: {
          duration: 0.8,
          ease: "easeInOut",
        },
      });
      await controls.stop();
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
    } catch (error) {
      // console.error("Animation error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 min-h-[calc(100vh-126px)] justify-center">
      <div className="flex w-full flex-col items-center">
        <div className="relative flex flex-col items-center mb-4">
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
            <Game className="w-60 h-60" />
          </motion.div>
        </div>
      </div>
      {/* 버튼 부분 */}
      <div className="w-full flex flex-col gap-3 max-w-[384px] mt-2">
        <Button
          className="w-full h-[80px] flex-shrink-0 rounded-[30px] bg-primary-200 text-2xl text-neutral-700 hover:bg-primary-200 active:bg-primary-300"
          onClick={handleRandomGame}
        >
          랜덤모드
        </Button>
        <Button
          className="w-full h-[80px] flex-shrink-0 rounded-[30px] bg-primary-200 text-2xl text-neutral-700 hover:bg-primary-200 active:bg-primary-300"
          onClick={() => navigate("/games/game-mode")}
        >
          선택모드
        </Button>
        <Button
          className="w-full h-[80px] flex-shrink-0 rounded-[30px] bg-primary-200 text-2xl text-neutral-700 hover:bg-primary-200 active:bg-primary-300"
          onClick={() => navigate("/games/rank")}
        >
          랭킹
        </Button>
      </div>
    </div>
  );
};

export default GamesHomePage;
