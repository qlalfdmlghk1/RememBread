import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Timer from "@/components/common/Timer";
import GameResultModal from "@/components/game/GameResultModal";
import StartModal from "@/components/game/StartModal";
import QuizContainer from "@/components/game/QuizContainer";
import useGameStore from "@/stores/gameStore";
import { generateNewBreadPrices, initialBreads } from "@/utils/breadPriceGenerator";
import { getNewQuiz } from "@/utils/breadGame";
import { Bread as BreadType } from "@/types/game";
import { renderBread } from "@/constants/game";

const CompareGamePage = () => {
  const navigate = useNavigate();
  const { setCompareScore } = useGameStore();
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string | null>(null);
  const [resultModalType, setResultModalType] = useState<"success"|"fail"|null>(null);
  const [score, setLocalScore] = useState<number>(0);
  const [breads, setBreads] = useState<BreadType[]>(initialBreads);
  const [quiz, setQuiz] = useState(() => getNewQuiz(breads, 0));

  // 게임 시작 시 초기화
  const handleGameStart = () => {
    setIsGameStarted(true);
    const newBreads = generateNewBreadPrices(breads);
    setBreads(newBreads);
    setQuiz(getNewQuiz(newBreads, 0));
  };

  // 페이지 접속 시 한 번만 가격 변경
  useEffect(() => {
    if (!isGameStarted) return;
    const newBreads = generateNewBreadPrices(breads);
    setBreads(newBreads);
    setQuiz(getNewQuiz(newBreads, 0));
  }, [isGameStarted]);

  useEffect(() => {
    if (!resultModalType) return;
  }, [resultModalType]);

  const handleInput = (selected: string) => {
    if (userInput !== null) return;
    const topSum = quiz.top.reduce((acc, cur) => acc + cur.price, 0);
    const bottomSum = quiz.bottom.reduce((acc, cur) => acc + cur.price, 0);
    const isCorrect = (selected === "top" && topSum >= bottomSum) || (selected === "bottom" && bottomSum > topSum);
    setUserInput(selected);
    if (isCorrect) {
      setResultModalType("success");
      setLocalScore((prev) => prev + 1);
    } else {
      setResultModalType("fail");
      if (score > 0) {
        setLocalScore((prev) => prev - 1);
      }
    }
  };

  const handleTimeEnd = () => {
    setCompareScore(score);
    navigate("/games/result", { state: { game: "compare" } });
  };

  const handleNextQuiz = () => {
    setResultModalType(null);
    setUserInput(null);
    setQuiz(getNewQuiz(breads, score));
  };

  return (
    <div className="min-h-[calc(100vh-126px)] w-full max-w-[600px] mx-auto flex flex-col items-center justify-start bg-primary-100 px-2 sm:px-4 pt-4 overflow-hidden">
      {!isGameStarted ? (
        <StartModal onCountdownEnd={handleGameStart} />
      ) : (
        <>
          <div className="mb-2 sm:mb-4 text-2xl font-bold text-primary-700 flex items-center gap-2">
            <span>가격이 더 비싼 빵은?</span>
            <span className="ml-2 text-2xl text-neutral-500">
              <Timer initial={60} onEnd={handleTimeEnd}>{(v) => `${v}초`}</Timer>
            </span>
          </div>
          <div className="w-full max-w-96 h-24 sm:h-28 flex-shrink-0 bg-primary-600 rounded-xl flex flex-row items-center justify-center gap-4 sm:gap-8 py-2 sm:py-4 mb-4 text-white">
            <div className="flex flex-row items-center justify-center w-full gap-12">
              {breads.map((bread, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mt-2 sm:mt-3 flex items-center justify-center">
                    {renderBread(bread.type)}
                  </div>
                  <span className="text-xl font-semibold">{bread.price} 원</span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full max-w-96 mx-auto flex flex-col gap-4">
            <QuizContainer breads={quiz.top} onClick={() => handleInput("top")} />
            <QuizContainer breads={quiz.bottom} onClick={() => handleInput("bottom")} />
          </div>
          <GameResultModal
            open={!!resultModalType}
            type={resultModalType === "success" ? "success" : "fail"}
            onClose={handleNextQuiz}
          />
        </>
      )}
    </div>
  );
};

export default CompareGamePage; 