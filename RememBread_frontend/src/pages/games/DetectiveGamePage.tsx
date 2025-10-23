import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '@/components/common/CustomButton';
import Timer from '@/components/common/Timer';
import StartModal from '@/components/game/StartModal';
import RandomImage from '@/components/game/RandomImage';
import { breadNames, imageToName } from '@/utils/breadData';
import useGameStore from '@/stores/gameStore';
import GameResultModal from '@/components/game/GameResultModal';

const GameDetectivePage = () => {
  const navigate = useNavigate();
  const { setDetectiveScore } = useGameStore();
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [problemNumber, setProblemNumber] = useState<number>(1);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [resultModalType, setResultModalType] = useState<"success"|"fail"|null>(null);

  // 랜덤한 답안 생성
  const generateAnswers = (correctAnswer: string) => {
    // 정답을 제외한 빵 이름들
    const otherBreads = breadNames.filter(name => name !== correctAnswer);
    
    // 3개의 랜덤한 답안 선택
    const randomAnswers = [...otherBreads]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    // 정답을 포함한 4개의 답안 생성
    const allAnswers = [...randomAnswers, correctAnswer];
    
    // 답안 순서 섞기
    return allAnswers.sort(() => Math.random() - 0.5);
  };

  // 게임 시작 시 초기화
  const handleGameStart = () => {
    setIsGameStarted(true);
    setProblemNumber(1);
    setScore(0);
  };

  // 이미지가 변경될 때마다 답안 생성
  useEffect(() => {
    if (!isGameStarted || !currentImage) return;
    const correctAnswer = imageToName[currentImage];
    if (correctAnswer) {
      setAnswers(generateAnswers(correctAnswer));
    }
  }, [currentImage, isGameStarted]);

  // 사용자가 정답을 누르면
  const handleAnswer = (selectedAnswer: string) => {
    const correctAnswer = imageToName[currentImage];
    if (selectedAnswer === correctAnswer) {
      setScore(prev => prev + 1);
      setResultModalType("success");
    } else {
      setResultModalType("fail");
      if (score > 0) {
        setScore(prev => prev - 1);
      }
    }
  };

  const handleNextProblem = () => {
    setResultModalType(null);
    setProblemNumber(prev => prev + 1);
  };

  const handleTimeEnd = () => {
    setDetectiveScore(score);
    navigate("/games/result", { state: { game: "detective" } });
  };

  return (
    <div className="min-h-[calc(100vh-126px)] w-full max-w-[600px] mx-auto flex flex-col items-center justify-start bg-primary-100 px-2 sm:px-4 pt-4 overflow-hidden">
      {!isGameStarted ? (
        <StartModal onCountdownEnd={handleGameStart} />
      ) : (
        <div className="flex flex-col items-center gap-2 w-full">
          {/* 상단: 전체 타이머 */}
          <div className="w-full mb-4 text-xl font-bold text-primary-700 flex items-center justify-center gap-2">
            <span>무슨 빵일까?</span>
            <span className="text-xl text-neutral-500">
              <Timer
                initial={60}
                onEnd={handleTimeEnd}
              >
                {(time) => `${time}초`}
              </Timer>
            </span>
          </div>

          {/* 중앙: 이미지 */}
          <div className="flex flex-col items-center justify-center w-full max-w-[280px] sm:max-w-[360px] h-[calc(100vh-400px)] min-h-[280px] max-h-[360px]">
            <div className="w-full h-full flex items-center justify-center">
              <RandomImage 
                key={problemNumber}
                onImageSelect={setCurrentImage}
              />
            </div>
          </div>

          {/* 하단: 선택지 버튼 */}
          <div className="w-full grid grid-cols-2 gap-2 mt-2 ">
            {answers.map((answer, index) => (
              <CustomButton 
                key={index}
                className="bg-white active:bg-primary-100 shadow-md rounded-xl py-6"
                onClick={() => handleAnswer(answer)}
              >
                <span className="text-lg font-bold">{answer}</span>
              </CustomButton>
            ))}
          </div>
        </div>
      )}

      <GameResultModal
        open={!!resultModalType}
        type={resultModalType === "success" ? "success" : "fail"}
        onClose={handleNextProblem}
      />
    </div>
  );
};

export default GameDetectivePage; 