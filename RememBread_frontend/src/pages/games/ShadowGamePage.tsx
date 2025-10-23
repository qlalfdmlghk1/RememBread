import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import Timer from "@/components/common/Timer";
import StartModal from "@/components/game/StartModal";
import GameResultModal from "@/components/game/GameResultModal";
import useGameStore from "@/stores/gameStore";
import CustomButton from "@/components/common/CustomButton";
import { BREAD_SVG_LIST, BREAD_BLACK_SVG_LIST } from "@/constants/game";
import { getRandomIndices, getAnswerButtons, getRandomPos } from "@/utils/breadGame";

const GameShadowPage = () => {
  const navigate = useNavigate();
  const { setShadowScore } = useGameStore();
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(2);
  const [levelScore, setLevelScore] = useState<number>(0); // 현재 레벨에서의 점수
  const [randomIdx, setRandomIdx] = useState<number[]>([]);
  const [solvedBreads, setSolvedBreads] = useState<number[]>([]);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [answerButtons, setAnswerButtons] = useState<number[]>([]);

  // 각각의 useAnimation을 개별적으로 선언
  const control1 = useAnimation();
  const control2 = useAnimation();
  const control3 = useAnimation();
  const control4 = useAnimation();
  const control5 = useAnimation();
  const control6 = useAnimation();

  // controls 배열을 level에 따라 필터링
  const controls = useMemo(() => {
    const allControls = [control1, control2, control3, control4, control5, control6];
    return allControls.slice(0, level);
  }, [level, control1, control2, control3, control4, control5, control6]);

  const generateNewProblem = () => {
    const newIndices = getRandomIndices(level);
    setRandomIdx(newIndices);
    setAnswerButtons(getAnswerButtons(newIndices));
  };

  // 문제 출제는 레벨, 게임 시작, solvedBreads가 비었을 때만!
  useEffect(() => {
    if (isGameStarted && solvedBreads.length === 0) {
      generateNewProblem();
    }
  }, [isGameStarted, level]);

  // 애니메이션 효과
  useEffect(() => {
    if (!isGameStarted || randomIdx.length === 0) return;

    let isCancelled = false;
    const animationPromises: Promise<void>[] = [];

    // duration 계산 함수
    const getDuration = (level: number) => {
      const base = 1.75;
      const decrement = 0.25;
      // 최소값 0.1초로 제한
      return Math.max(base - (level - 1) * decrement, 0.1);
    };

    const startAnimations = async () => {
      for (const control of controls) {
        const firstPos = getRandomPos();
        await control.set({ x: firstPos.x, y: firstPos.y });

        const animate = async () => {
          try {
            while (!isCancelled) {
              const newPos = getRandomPos();
              await control.start({
                x: newPos.x,
                y: newPos.y,
                transition: {
                  duration: getDuration(level),
                  ease: "easeInOut",
                },
              });
              // 애니메이션이 완료될 때까지 대기
              await new Promise((resolve) => setTimeout(resolve, getDuration(level) * 1000));
            }
          } catch (error) {
            if (!isCancelled) {
              // console.error('Animation error:', error);
            }
          }
        };

        const animationPromise = animate();
        animationPromises.push(animationPromise);
      }
    };

    startAnimations();

    return () => {
      isCancelled = true;
      // 모든 애니메이션 컨트롤 정리
      controls.forEach((control) => {
        try {
          control.stop();
        } catch (error) {
          // console.error("Error stopping animation:", error);
        }
      });

      // 모든 애니메이션 Promise 정리
      Promise.all(animationPromises).catch(() => {
        // 이미 취소된 애니메이션의 에러는 무시
      });
    };
  }, [isGameStarted, randomIdx, controls, level]);

  const handleAnswer = (selectedIdx: number) => {
    if (randomIdx.includes(selectedIdx) && !solvedBreads.includes(selectedIdx)) {
      setSolvedBreads((prev) => [...prev, selectedIdx]);
      if (solvedBreads.length + 1 === level) {
        setIsCorrect(true);
        setShowResultModal(true);
        setScore((prev) => prev + 1);
        setLevelScore((prev) => prev + 1);

        if (levelScore + 1 >= 3 && level < 5) {
          // 모든 애니메이션 중지
          controls.forEach((control) => {
            try {
              control.stop();
            } catch (error) {
              // console.error("Error stopping animation:", error);
            }
          });

          setTimeout(() => {
            setLevel((prev) => prev + 1);
            setLevelScore(0);
            setShowResultModal(false);
            setSolvedBreads([]);
            setIsCorrect(false);
          }, 1000);
        } else {
          setTimeout(() => {
            setShowResultModal(false);
            setSolvedBreads([]);
            generateNewProblem();
          }, 1000);
        }
      }
    } else {
      setIsCorrect(false);
      setShowResultModal(true);
      if (score > 0) {
        setScore((prev) => prev - 1);
      }
      setTimeout(() => {
        setShowResultModal(false);
        setSolvedBreads([]);
        generateNewProblem();
      }, 1000);
    }
  };

  const handleGameStart = () => {
    setIsGameStarted(true);
  };

  const handleTimeEnd = () => {
    setShadowScore(score);
    navigate("/games/result", { state: { game: "shadow" } });
  };

  return (
    <div className="min-h-[calc(100vh-126px)] w-full max-w-[600px] mx-auto flex flex-col items-center justify-start bg-primary-100 px-2 sm:px-4 pt-4 pb-4 overflow-hidden">
      {!isGameStarted ? (
        <StartModal onCountdownEnd={handleGameStart} />
      ) : (
        <>
          <div className="mb-2 sm:mb-4 text-xl sm:text-2xl font-bold text-primary-700 flex items-center gap-2">
            <span>그림자로 변한 빵은?</span>
            <span className="ml-2 text-xl sm:text-2xl text-neutral-500">
              <Timer initial={60} onEnd={handleTimeEnd}>
                {(v) => `${v}초`}
              </Timer>
            </span>
          </div>
          <div className="w-full max-w-[280px] h-[280px] sm:max-w-[375px] sm:h-[350px] flex-shrink-0 bg-primary-200 rounded-xl relative flex items-center justify-center gap-4 py-4 mb-4 sm:mb-6 text-white text-3xl font-bold overflow-hidden">
            <div className="relative w-full h-full">
              {randomIdx.map((idx, i) => {
                const Svg = BREAD_SVG_LIST[idx];
                const BlackSvg = BREAD_BLACK_SVG_LIST[idx];
                return (
                  <motion.div
                    key={`${idx}-${i}`}
                    className="absolute w-[120px] h-[120px] sm:w-[144px] sm:h-[144px]"
                    animate={controls[i]}
                  >
                    {!solvedBreads.includes(idx) ? (
                      <BlackSvg className="w-full h-full" />
                    ) : (
                      <Svg className="w-full h-full" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
          <div className={`w-full max-w-[280px] sm:max-w-[375px] grid grid-cols-3 gap-2 sm:gap-3`}>
            {answerButtons.map((idx) => {
              const Svg = BREAD_SVG_LIST[idx];
              return (
                <CustomButton
                  key={idx}
                  className="bg-white hover:bg-neutral-50 active:bg-neutral-100 shadow-md rounded-xl p-2"
                  onClick={() => handleAnswer(idx)}
                >
                  <Svg className="w-12 h-12 sm:w-24 sm:h-24" />
                </CustomButton>
              );
            })}
          </div>
          <GameResultModal
            open={showResultModal}
            onClose={() => setShowResultModal(false)}
            type={isCorrect ? "success" : "fail"}
          />
        </>
      )}
    </div>
  );
};

export default GameShadowPage;
