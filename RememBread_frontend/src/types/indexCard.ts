export interface indexCard {
  cardId?: number;
  cardSetId?: number;
  number?: number;
  concept: string;
  description: string;
  correctCount?: number;
  solvedCount?: number;
  retentionRate?: number;
  stability?: number;
  lastCorrectAt?: string | Date;
  conceptImageUrl?: string;
  descriptionImageUrl?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface indexCardSet {
  cardSetId: number;
  userId?: number;
  folderId?: number;
  lastViewCardId?: number;
  name?: string;
  nickname?: string;
  correctCardCnt?: number;
  solvedCardCnt?: number;
  isPublic?: number;
  viewCount?: number;
  forkCount?: number;
  isLike?: boolean;
  isMine?: boolean;
  totalCardCnt?: number;
  hashtags?: string[];
  createdDate?: string | Date;
  updatedDate?: string | Date;
}
