import { useState, useEffect } from "react";
import CharacterImage from "@/components/common/CharacterImage";
import Game from "@/components/svgs/footer/Game";
import Memory from "@/components/svgs/game/mode/Memory";
import Compare from "@/components/svgs/game/mode/Compare";
import Detective from "@/components/svgs/game/mode/Detective";
import Shadow from "@/components/svgs/game/mode/Shadow";
import useProfileStore from "@/stores/profileStore";
import { getGameHistory } from "@/services/gameService";
import { GameHistoryType } from "@/types/game";
import { convertGameTypeToKorean } from "@/utils/breadGame";

const GameHistory = () => {
  const { nickname, mainCharacterId, mainCharacterImageUrl } = useProfileStore();
  const [gameHistory, setGameHistory] = useState<GameHistoryType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        setIsLoading(true);
        const response = await getGameHistory();
        setGameHistory(response.result);
      } catch (error) {
        // console.error("게임 기록 조회 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGameHistory();
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      {/* 프로필 영역 */}
      <div className="flex flex-col items-center mt-4 mb-6">
        <CharacterImage
          characterId={mainCharacterId}
          characterImageUrl={mainCharacterImageUrl}
          className="w-24 h-24 mb-2"
        />
        <div className="text-lg font-bold mb-2">{nickname}</div>
        <div className="w-full h-1.5 bg-primary-300 mb-2" />
      </div>
      {/* 게임 히스토리 리스트 */}
      <div className="w-full px-4 h-[calc(100vh-23rem)] overflow-y-auto scrollbar-hide">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
            <p className="text-sm text-neutral-400 mt-4">로딩 중...</p>
          </div>
        ) : gameHistory.length < 2 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-neutral-400">
            <Game className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-sm font-medium">게임 기록이 없습니다</p>
            <p className="text-xs mt-1">학습을 완료하고 게임을 시작해보세요!</p>
          </div>
        ) : (
          gameHistory.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center py-3 border-t-2 border-primary-300 last:border-b-0"
            >
              {item.gameType === "MEMORY" ? (
                <Memory className="w-14 h-14 mr-4" />
              ) : item.gameType === "COMPARE" ? (
                <Compare className="w-14 h-14 mr-4" />
              ) : item.gameType === "DETECTIVE" ? (
                <Detective className="w-14 h-14 mr-4" />
              ) : (
                <Shadow className="w-14 h-14 mr-4" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="text-md font-semibold text-neutral-700">
                    {convertGameTypeToKorean(item.gameType)}
                  </div>
                  <div className="text-xs text-neutral-400">{item.playedAt.split("T")[0]}</div>
                </div>
                <div className="text-md font-semibold">
                  게임 성적&nbsp;:&nbsp;
                  <span className="font-bold text-lg text-primary-700">{item.score} 점</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameHistory;
