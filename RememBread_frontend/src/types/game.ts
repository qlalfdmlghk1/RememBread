export interface Bread {
    name: string;
    price: number;
    type: string;
  }
  
export interface LeaderboardType {
    nickname: string;
    mainCharacterImageUrl: string;
    rank: number;
    maxScore: number;
    playedAt: string;
  }

export interface GameHistoryType {
  id: number;
  playedAt: string;
  score: number;
  gameType: string;
}