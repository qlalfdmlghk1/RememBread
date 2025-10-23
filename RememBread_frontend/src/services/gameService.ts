import http from "@/services/httpCommon";
import { GAME_END_POINT } from "@/services/endPoints";
import { LeaderboardType, GameHistoryType } from "@/types/game";

interface RankResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: LeaderboardType[];
}

interface GameResultResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    nickname: string;
    mainCharacterImageUrl: string;
    rank: number;
    maxScore: number;
    playedAt: string;
  };
}

interface GameResultParams {
  score: number;
  gameType: string;
}

interface GameHistoryResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: GameHistoryType[];
}

/**
 * 게임 결과 저장
 *
 * 게임 결과 저장 요청 및 응답 처리
 */
export const postGameResult = async (body: GameResultParams): Promise<GameResultResponse> => {
  try {
    const response = await http.post<GameResultResponse>(GAME_END_POINT.POST_GAME_RESULT, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 게임 랭킹 조회
 *
 * 게임 랭킹 조회 요청 및 응답 처리
 */
export const getRanks = async (gameType: string): Promise<RankResponse> => {
  try {
    const response = await http.get<RankResponse>(GAME_END_POINT.GET_RANKS(gameType));
    return response.data;
  } catch (error) {
    // console.log("게임 랭킹 조회 오류", error)
    throw error;
  }
};

/**
 * 게임 히스토리 조회
 *
 * 게임 히스토리 조회 요청 및 응답 처리
 */
export const getGameHistory = async (): Promise<GameHistoryResponse> => {
  try {
    const response = await http.get<GameHistoryResponse>(GAME_END_POINT.GET_GAME_HISTORY);
    return response.data;
  } catch (error) {
    throw error;
  }
};
