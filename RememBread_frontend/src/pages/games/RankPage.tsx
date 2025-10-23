import { useEffect, useState } from "react";
import { getRanks } from "@/services/gameService";
import { LeaderboardType } from "@/types/game";
import DefaultBread from "@/components/svgs/breads/DefaultBread";
import { getUser } from "@/services/userService";

interface MyRankType {
  rank: number;
  nickname: string;
  maxScore: number;
  playedAt: string;
  mainCharacterImageUrl: string;
}

const tabs = ["순간기억", "가격비교", "그림자빵", "빵 탐정"];

const RankPage = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [Leaderboard, setLeaderboard] = useState<LeaderboardType[]>([]);
  const [nickname, setNickname] = useState<string>("암기빵");
  const [myRank, setMyRank] = useState<MyRankType>();

  const gameTypes = ["MEMORY", "COMPARE", "SHADOW", "DETECTIVE"];

  useEffect(() => {
    const getNickname = async () => {
      try {
        const response = await getUser();
        setNickname(response.result.nickname);
        return response.result.nickname;
      } catch (error) {
        // console.error("유저 정보 조회 중 오류 발생:", error);
        return nickname; // 에러 발생시 현재 상태의 nickname 반환
      }
    };

    const getLeaderboard = async () => {
      try {
        const response = await getRanks(gameTypes[selectedTab]);
        setLeaderboard(response.result);
        return response.result;
      } catch (error) {
        // console.error("게임 랭킹 조회 중 오류 발생:", error);
        return [];
      }
    };

    const initializeData = async () => {
      const [currentNickname, leaderboardData] = await Promise.all([
        getNickname(),
        getLeaderboard(),
      ]);

      const userRank = leaderboardData.find((rank) => rank.nickname === currentNickname);
      setMyRank(userRank);
    };

    initializeData();
  }, [selectedTab]);

  return (
    <>
      {/* 상단 부분 */}
      <header className="relative h-full flex gap-1 border-b my-2">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`flex-1 p-2 text-center cursor-pointer ${
              selectedTab === index ? "font-bold text-primary-500" : "text-neutral-500"
            }`}
            onClick={() => setSelectedTab(index)}
          >
            {tab}
          </div>
        ))}

        <div
          className="absolute bottom-0 h-1 bg-primary-500 transition-all duration-300"
          style={{ width: "25%", left: `${selectedTab * 25}%` }}
        />
      </header>

      {/* 하단 부분 */}
      <main className="flex flex-col items-center">
        <div className="flex justify-center mb-4">
          <span className="text-xl font-bold">전체 랭킹</span>
        </div>
        <div className="w-full max-w-md mx-auto bg-white rounded-lg border-2 border-primary-200 p-6">
          <div className="space-y-2 overflow-y-auto pr-2">
            {/* 내 점수 */}
            {myRank ? (
              <div className="flex items-center gap-4 p-3 border-b-2 border-primary-200 bg-blue-50 rounded-lg">
                <div className="w-8 text-center font-bold">{myRank?.rank}</div>
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  <img
                    src={myRank?.mainCharacterImageUrl}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{myRank?.nickname}</div>
                  <div className="text-xs text-neutral-400">{myRank?.playedAt.split("T")[0]}</div>
                </div>
                <div className="font-bold text-primary-500">{myRank?.maxScore} 점</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center text-neutral-400">
                <p className="text-sm font-medium">게임 기록이 없습니다</p>
              </div>
            )}

            {/* 랭킹 목록 */}
            {Leaderboard.map((player, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50`}
              >
                <div className="w-8 text-center font-bold">{player.rank}</div>
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  {player.mainCharacterImageUrl ? (
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
                <div className="font-bold text-primary-500">{player.maxScore} 점</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default RankPage;
