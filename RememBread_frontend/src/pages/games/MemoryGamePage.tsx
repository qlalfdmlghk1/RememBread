import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "@/components/common/CustomButton";
import Timer from "@/components/common/Timer";
import GameResultModal from "@/components/game/GameResultModal";
import StartModal from "@/components/game/StartModal";
import useGameStore from "@/stores/gameStore";

const MemoryGamePage = () => {
  const navigate = useNavigate();
  const { setMemoryScore } = useGameStore();
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<number>(3); // 초기 난이도 3개
  const [score, setLocalScore] = useState<number>(0);
  const [userInput, setUserInput] = useState<(string|number)[]>([]);
  const [resultModalType, setResultModalType] = useState<"success" | "fail" | null>(null);
  const [successCount, setSuccessCount] = useState<number>(0); // 현재 난이도에서의 성공 횟수
  const [inputResults, setInputResults] = useState<boolean[]>([]); // 각 입력값의 정답 여부를 저장
  
  // 사용 가능한 모든 아이템
  const allItems = [1,2,3,4,5,6,7,8,9,'🍞','🥖','🥐'];
  
  // 현재 난이도에 맞는 랜덤 조합 생성
  const generateRandomCombination = (count: number) => {
    const shuffled = [...allItems].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const [answer, setAnswer] = useState<(string|number)[]>([]);

  // 게임 시작 시 초기화
  const handleGameStart = () => {
    setIsGameStarted(true);
    setShowQuiz(true);
    setAnswer(generateRandomCombination(difficulty));
  };

  // 난이도가 변경되거나 게임이 시작될 때 새로운 조합 생성
  useEffect(() => {
    if (!isGameStarted) return;
    setAnswer(generateRandomCombination(difficulty));
    setShowQuiz(true);
    setSuccessCount(0);
  }, [difficulty, isGameStarted]);

  useEffect(() => {
    if (!showQuiz) return;
    const timer = setTimeout(() => setShowQuiz(false), 2000);
    return () => clearTimeout(timer);
  }, [showQuiz]);

  useEffect(() => {
    if (!resultModalType) return;
  }, [resultModalType]);

  // 버튼 클릭 핸들러
  const handleInput = (val: string|number) => {
    if (userInput.length >= answer.length) return;
    const next = [...userInput, val];
    setUserInput(next);
    
    // 현재 입력한 값의 정답 여부 확인
    const currentIndex = next.length - 1;
    const isCorrect = val === answer[currentIndex];
    const newInputResults = [...inputResults, isCorrect];
    setInputResults(newInputResults);

    // 틀린 경우 즉시 실패 처리
    if (!isCorrect) {
      setResultModalType("fail");
      // 실패 시 새로운 문제 출제
      setAnswer(generateRandomCombination(difficulty));
      return;
    }

    // 모든 답을 맞췄을 경우
    if (next.length === answer.length) {
      setResultModalType("success");
      setLocalScore((prev) => prev + 1);
      const newSuccessCount = successCount + 1;
      setSuccessCount(newSuccessCount);
    }
  };

  // 모달이 닫힐 때 상태 초기화
  const handleModalClose = () => {
    setResultModalType(null);
    setUserInput([]);
    setInputResults([]); // 입력 결과도 초기화
    setShowQuiz(true);
    
    // 3번 성공했고 최대 난이도가 아닐 경우 난이도 증가
    if (successCount >= 3 && difficulty < 10) {
      setDifficulty(prev => prev + 1);
    } else {
      setAnswer(generateRandomCombination(difficulty));
    }
  };

  // 새로운 문제가 생성될 때마다 입력 결과 초기화
  useEffect(() => {
    setUserInput([]);
    setInputResults([]);
  }, [answer]);

  const handleTimeEnd = () => {
    setMemoryScore(score);
    navigate("/games/result", { state: { game: "memory" } });
  };

  return (
    <div className="min-h-[calc(100vh-126px)] w-full max-w-[600px] mx-auto flex flex-col items-center justify-start bg-primary-100 px-2 sm:px-4 pt-4 overflow-hidden">
      {!isGameStarted ? (
        <StartModal onCountdownEnd={handleGameStart} />
      ) : (
        <>
          <div className="mb-4 text-2xl font-bold text-primary-700 flex items-center gap-2">
            <span>숫자와 빵을 기억하자!</span>
            <span className="ml-2 text-2xl text-neutral-500">
              <Timer initial={60} onEnd={handleTimeEnd}>{(v) => `${v}초`}</Timer>
            </span>
          </div>
          <div className="w-full max-w-[376px] h-[90px] sm:h-[108px] flex-shrink-0 bg-primary-600 rounded-xl flex flex-row items-center justify-center gap-2 sm:gap-4 py-4 mb-4 text-white text-3xl sm:text-3xl font-bold">
            {showQuiz ? (
              <>
                {answer.map((item, idx) => (
                  <span key={idx}>{item}</span>
                ))}
              </>
            ) : (
              <div className="flex gap-1 justify-center">
                {userInput.map((input, index) => (
                  <div
                    key={index}
                    className={`w-10 h-12 flex items-center justify-center border-2 rounded-lg text-3xl font-bold
                      ${inputResults[index] === undefined ? 'border-gray-300' : 
                        inputResults[index] ? 'border-green-500 bg-primary-100 text-neutral-700' : 'border-red-500 bg-red-50 text-neutral-700'}`}
                  >
                    {input}
                  </div>
                ))}
                {[...Array(answer.length - userInput.length)].map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="w-10 h-12 border-2 border-gray-300 rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="w-full max-w-[376px] mx-auto mt-2 grid grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
            {allItems.map((item, idx) => (
              <CustomButton
                key={idx}
                className="w-full h-[64px] xs:h-[60px] sm:h-[64px] md:h-[86px] flex-shrink-0 rounded-[20px] bg-primary-300 shadow flex items-center justify-center text-2xl sm:text-3xl font-bold text-neutral-700 p-0 sm:px-2 sm:py-2 disabled:opacity-100"
                onClick={() => handleInput(item)}
                disabled={showQuiz}
              >
                {item}
              </CustomButton>
            ))}
          </div>
          <GameResultModal
            open={!!resultModalType}
            type={resultModalType === "success" ? "success" : "fail"}
            onClose={handleModalClose}
          />
        </>
      )}
    </div>
  );
};

export default MemoryGamePage; 