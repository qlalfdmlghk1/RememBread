import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useGameStore from "@/stores/gameStore";
import DefaultBread from "@/components/svgs/breads/DefaultBread";
import Memory from "@/components/svgs/game/mode/Memory";
import Compare from "@/components/svgs/game/mode/Compare";
import Detective from "@/components/svgs/game/mode/Detective";
import Shadow from "@/components/svgs/game/mode/Shadow";
import { getRanks, postGameResult } from "@/services/gameService";
import { LeaderboardType } from "@/types/game";

interface UserProfile {
  nickname: string;
  mainCharacterImageUrl: string;
  rank: number;
  maxScore: number;
  playedAt: string;
}

const GameResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    memoryScore,
    compareScore,
    detectiveScore,
    shadowScore,
    resetMemoryScore,
    resetCompareScore,
    resetDetectiveScore,
    resetShadowScore,
  } = useGameStore();
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [Leaderboard, setLeaderboard] = useState<LeaderboardType[]>([]);

  const gameType = location.state?.game.toUpperCase();
  const score =
    gameType === "MEMORY"
      ? memoryScore
      : gameType === "COMPARE"
      ? compareScore
      : gameType === "DETECTIVE"
      ? detectiveScore
      : shadowScore;

  useEffect(() => {
    const sendGameResult = async () => {
      try {
        const response = await postGameResult({
          gameType: gameType,
          score: score,
        });
        setUserProfile(response.result);
      } catch (error) {}
    };
    const getLeaderboard = async () => {
      try {
        const response = await getRanks(gameType);
        setLeaderboard(response.result);
      } catch (error) {
        // console.error("게임 랭킹 조회 중 오류 발생:", error);
      }
    };
    sendGameResult().then(() => {
      getLeaderboard();
    });
  }, []);

  return (
    <div className="min-h-[calc(100vh-126px)] flex flex-col items-center justify-center px-5">
      <div className="flex justify-center mb-2">
        {gameType === "MEMORY" ? (
          <Memory className="w-20 h-20" />
        ) : gameType === "COMPARE" ? (
          <Compare className="w-20 h-20" />
        ) : gameType === "DETECTIVE" ? (
          <Detective className="w-20 h-20" />
        ) : (
          <Shadow className="w-20 h-20" />
        )}
      </div>
      <span className="flex text-xl font-bold justify-center">
        {gameType === "MEMORY"
          ? "순간기억"
          : gameType === "COMPARE"
          ? "가격비교"
          : gameType === "DETECTIVE"
          ? "빵 탐정"
          : "그림자빵"}
      </span>

      <div className="flex flex-col flex-grow w-full bg-white max-h-[calc(100vh-302px)] py-5">
        {/* 현재 사용자 점수 */}
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg shrink-0">
          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
            {userProfile?.mainCharacterImageUrl ? (
              <img
                src={userProfile.mainCharacterImageUrl}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <DefaultBread className="w-full h-full" />
            )}
          </div>
          <div className="flex justify-between w-full">
            <div className="text-lg font-bold">{userProfile?.nickname}</div>
            <div className="text-xl font-bold text-gray-500">{score}</div>
          </div>
        </div>

        {/* 전체 순위 */}
        <h3 className="text-xl font-bold w-full shrink-0 bg-white mt-2">전체 순위</h3>
        <div className="flex flex-col flex-grow overflow-y-auto scrollbar-hide my-2 border-2 rounded-lg border-primary-500 p-2">
          <div className="space-y-2">
            {Leaderboard.map((player, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  player.nickname === userProfile?.nickname ? "bg-gray-200" : "hover:bg-gray-50"
                }`}
              >
                <div className="w-8 text-center font-bold">{player.rank}</div>
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  {userProfile?.mainCharacterImageUrl ? (
                    <img
                      src={player.mainCharacterImageUrl}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <DefaultBread className="w-full h-full" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{player.nickname}</div>
                  <div className="text-xs text-neutral-400">{player.playedAt.split("T")[0]}</div>
                </div>
                <div className="font-bold text-primary-500">{player.maxScore}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-grid gap-4 w-full max-w-md pb-5">
        <button
          onClick={() => {
            if (gameType === "MEMORY") {
              resetMemoryScore();
              navigate("/games/memory");
            } else if (gameType === "COMPARE") {
              resetCompareScore();
              navigate("/games/compare");
            } else if (gameType === "DETECTIVE") {
              resetDetectiveScore();
              navigate("/games/detective");
            } else if (gameType === "SHADOW") {
              resetShadowScore();
              navigate("/games/shadow");
            }
          }}
          className="w-full px-6 py-2 bg-primary-500 font-bold text-white rounded-lg hover:bg-primary-600"
        >
          다시하기
        </button>
        <button
          onClick={() => {
            resetMemoryScore();
            resetCompareScore();
            resetDetectiveScore();
            resetShadowScore();
            navigate("/games", { replace: true });
          }}
          className="w-full px-6 py-2 bg-neutral-200 text-neutral-700 font-bold rounded-lg hover:bg-neutral-300"
        >
          게임 목록으로
        </button>
      </div>
    </div>
  );
};

export default GameResultPage;
