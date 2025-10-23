import http from "@/services/httpCommon";
import { indexCardSet } from "@/types/indexCard";

interface CardSetListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    hasNext: boolean;
    cardSets: indexCardSet[];
  };
}

interface GetCardSetListParams {
  folderId?: number;
  page: number;
  size: number;
  sort: string; // '최신순', '인기순', '포크순'
}

interface UpdateCardSetResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: object;
}

export interface SearchCardSetParams {
  query?: string; // 검색어
  page: number; // 페이지 번호 (0부터 시작)
  size: number; // 한 페이지당 카드셋 개수
  cardSetSortType: "최신순" | "인기순" | "포크순";
}

export interface SearchCardSetResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    hasNext: boolean;
    cardSets: indexCardSet[];
  };
}

export interface SearchMyCardSetParams {
  query: string;
  page: number;
  size: number;
  cardSetSortType: "최신순" | "인기순" | "포크순" | "이름순";
}

export interface SearchMyCardSetResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    hasNext: boolean;
    cardSets: indexCardSet[];
  };
}

export interface GetCardSetResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: indexCardSet;
}

export interface LikeCardSetResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: object;
}

export interface ForkCardSetRequest {
  folderId: number;
}

export interface ForkCardSetResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: object;
}

// 카드셋 목록 조회
export const getCardSetList = async (
  params: GetCardSetListParams,
): Promise<CardSetListResponse> => {
  try {
    const response = await http.get<CardSetListResponse>("/card-sets/lists", {
      params,
    });
    return response.data;
  } catch (error) {
    // console.error("API 호출 에러:", error);
    throw new Error("카드셋 목록 조회 중 오류가 발생했습니다.");
  }
};

// 카드셋 간단 조회
export const getCardSetSimple = async (folderId: number) => {
  try {
    const response = await http.get("/card-sets/lists-simple", {
      params: { folderId },
    });
    return response.data;
  } catch (error) {
    // console.error("API 호출 에러:", error);
    throw new Error("카드셋 간단 조회 중 오류가 발생했습니다.");
  }
};

export interface PostCardSetParams {
  folderId: number;
  name: string;
  hashtags: string[];
  isPublic: boolean;
}

export interface DeleteCardSetResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: object;
}

// 카드셋 생성
export const postCardSet = async (cardSetData: PostCardSetParams) => {
  try {
    const response = await http.post("/card-sets", cardSetData);
    return response.data;
  } catch (error) {
    // console.error("API 호출 에러:", error);
    throw new Error("카드셋 생성 중 오류가 발생했습니다.");
  }
};

export const updateCardSet = async (cardSet: indexCardSet): Promise<UpdateCardSetResponse> => {
  try {
    const payload = {
      name: cardSet.name ?? "",
      hashtags: cardSet.hashtags ?? [],
      isPublic: Boolean(cardSet.isPublic),
    };

    const response = await http.patch<UpdateCardSetResponse>(
      `/card-sets/${cardSet.cardSetId}`,
      payload,
    );
    return response.data;
  } catch (error) {
    // console.error("카드셋 수정 중 오류:", error);
    throw new Error("카드셋 수정 요청 실패");
  }
};

// 카드셋 삭제
export const deleteCardSet = async (cardSetId: number): Promise<DeleteCardSetResponse> => {
  try {
    const response = await http.delete<DeleteCardSetResponse>(`/card-sets/${cardSetId}`);
    return response.data;
  } catch (error) {
    // console.error("카드셋 삭제 중 오류:", error);
    throw new Error("카드셋 삭제 요청에 실패했습니다.");
  }
};

// 카드셋 전체 조회
export const searchCardSet = async (
  params: SearchCardSetParams,
): Promise<SearchCardSetResponse> => {
  try {
    const response = await http.get<SearchCardSetResponse>("/card-sets/search", {
      params,
    });
    return response.data;
  } catch (error) {
    // console.error("카드셋 검색 API 오류:", error);
    throw new Error("카드셋 검색 중 오류가 발생했습니다.");
  }
};

// 나의 카드셋 조회
export const searchMyCardSet = async (
  params: SearchMyCardSetParams,
): Promise<SearchMyCardSetResponse> => {
  try {
    const response = await http.get<SearchMyCardSetResponse>("/card-sets/search-my", {
      params,
    });
    return response.data;
  } catch (error) {
    // console.error("내 카드셋 검색 API 오류:", error);
    throw new Error("내 카드셋 검색 중 오류가 발생했습니다.");
  }
};

// 카드셋 상세 조회
export const getCardSetById = async (cardSetId: number): Promise<GetCardSetResponse> => {
  try {
    const response = await http.get<GetCardSetResponse>(`/card-sets/${cardSetId}`);
    return response.data;
  } catch (error) {
    // console.error("카드셋 단건 조회 중 오류:", error);
    throw new Error("카드셋 조회 요청에 실패했습니다.");
  }
};

// 카드셋 즐겨찾기 조회
export const getLikeCardSet = async (
  params: SearchCardSetParams,
): Promise<SearchCardSetResponse> => {
  try {
    const response = await http.get<SearchCardSetResponse>("/card-sets/like", {
      params,
    });
    return response.data;
  } catch (error) {
    // console.error("카드셋 검색 API 오류:", error);
    throw new Error("카드셋 검색 중 오류가 발생했습니다.");
  }
};

// 카드셋 즐겨찾기
export const postLikeCardSet = async (cardSetId: number): Promise<LikeCardSetResponse> => {
  try {
    const response = await http.post<LikeCardSetResponse>(`/card-sets/${cardSetId}/like`);
    return response.data;
  } catch (error) {
    // console.error("❌ [API 오류]", error);
    throw new Error("카드셋 좋아요 요청에 실패했습니다.");
  }
};

// 카드셋 좋아요 취소
export const deleteLikeCardSet = async (cardSetId: number): Promise<LikeCardSetResponse> => {
  try {
    const response = await http.delete<LikeCardSetResponse>(`/card-sets/${cardSetId}/like`);
    return response.data;
  } catch (error) {
    // console.error("❌ [좋아요 취소 API 오류]", error);
    throw new Error("카드셋 좋아요 취소 요청에 실패했습니다.");
  }
};

// 카드셋 move
export const patchMoveCardSet = async (targetFolderId: number, cardSetIds: number) => {
  try {
    const response = await http.patch("/card-sets/move", {
      targetFolderId,
      cardSetIds: [cardSetIds],
    });

    return response.data;
  } catch (error) {
    // console.error("카드셋 이동 요청 실패:", error);
    throw new Error("카드셋 이동 중 오류가 발생했습니다.");
  }
};

// 카드셋 fork
export const postForkCardSet = async (
  cardSetId: number,
  data: ForkCardSetRequest,
): Promise<ForkCardSetResponse> => {
  try {
    const response = await http.post<ForkCardSetResponse>(`/card-sets/${cardSetId}/fork`, data);
    return response.data;
  } catch (error) {
    // console.error("카드셋 포크 요청 실패:", error);
    throw new Error("카드셋 포크 중 오류가 발생했습니다.");
  }
};
