import http from "@/services/httpCommon";
import { indexCard } from "@/types/indexCard";
import { tokenUtils } from "@/lib/queryClient";
import { useCardStore } from "@/stores/cardStore";

interface CardListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    hasNext: boolean;
    total: number;
    cards: indexCard[];
  };
}

export const getCardsByCardSet = async (
  cardSetId: number,
  page: number,
  size: number,
  order: "asc" | "desc" = "asc",
): Promise<CardListResponse> => {
  try {
    const response = await http.get<CardListResponse>(`/card-sets/${cardSetId}/cards`, {
      params: {
        page,
        size,
        order,
      },
    });
    return response.data;
  } catch (error) {
    // console.error("카드 목록 조회 중 오류:", error);
    throw new Error("카드셋 카드 조회 실패");
  }
};

// 카드셋에 카드 한개 추가
export const postCard = async (cardSetId: number, concept: string, description: string) => {
  try {
    const response = await http.post("/cards", {
      cardSetId,
      concept,
      description,
    });

    return response.data;
  } catch (error) {
    // console.error("카드 병합 중 오류:", error);
    throw new Error("카드 병합 실패");
  }
};

// 카드셋에 여러 카드 추가
export const postCards = async (cardSetId: number, cards: indexCard[]) => {
  try {
    const response = await http.post("/cards/create-many", {
      cardSetId,
      breads: cards,
    });
    return response.data;
  } catch (error) {
    // console.error("카드 병합 중 오류:", error);
    throw new Error("카드 병합 실패");
  }
};

const handleStreamedCards = async (response: Response) => {
  if (!response.body) {
    throw new Error("ReadableStream이 없습니다.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  const addCard = useCardStore.getState().appendCard;
  useCardStore.getState().clearCardSet();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let newlineIndex;
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);

      if (line.startsWith("data:")) {
        const json = line.replace(/^data:\s*/, "");
        const card = JSON.parse(json);
        addCard(card);
      }
    }
  }

  // console.log("모든 카드 수신 완료");
};

// 대량 텍스트로 카드 생성
export const postCardsByText = async (text: string) => {
  try {
    const accessToken = tokenUtils.getToken();
    const baseURL = import.meta.env.VITE_APP_BASE_URL;

    const response = await fetch(baseURL + "/cards/text/large", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ text }),
    });

    await handleStreamedCards(response);
  } catch (error) {
    // console.error("카드 생성 중 오류:", error);
    throw new Error("카드 생성 실패");
  }
};

// PDF로 카드 생성
export const postCardsByPDF = async (file: File) => {
  try {
    if (file == null) {
      throw new Error("파일이 없습니다.");
    }
    const accessToken = tokenUtils.getToken();
    const baseURL = import.meta.env.VITE_APP_BASE_URL;
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(baseURL + "/cards/pdf", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    await handleStreamedCards(response);
  } catch (error) {
    // console.error("카드 생성 중 오류:", error);
    throw new Error("카드 생성 실패");
  }
};

// PDF로 카드 생성 (범위)
export const postCardsPageByPDF = async (file: File, startPage: number, endPage: number) => {
  try {
    if (!file) throw new Error("파일이 없습니다.");
    if (startPage < 1 || endPage < startPage) {
      throw new Error("페이지 범위가 올바르지 않습니다.");
    }

    const accessToken = tokenUtils.getToken();
    const baseURL = import.meta.env.VITE_APP_BASE_URL;
    const formData = new FormData();
    formData.append("file", file);

    const queryParams = new URLSearchParams({
      startPage: startPage.toString(),
      endPage: endPage.toString(),
    });

    const response = await fetch(`${baseURL}/cards/pdf/pages?${queryParams.toString()}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    await handleStreamedCards(response);
  } catch (error) {
    // console.error("PDF 페이지 카드 생성 중 오류:", error);
    throw new Error("카드 생성 실패");
  }
};

// 이미지로 카드 생성
export const postCardsByImage = async (images: File[]) => {
  try {
    const accessToken = tokenUtils.getToken();
    const baseURL = import.meta.env.VITE_APP_BASE_URL;
    const formData = new FormData();

    images.forEach((image) => {
      formData.append("image", image);
    });

    const response = await fetch(baseURL + "/cards/image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    await handleStreamedCards(response);
  } catch (error) {
    // console.error("카드 생성 중 오류:", error);
    throw new Error("카드 생성 실패");
  }
};

// 카드 삭제하기
export const deleteCard = async (cardId: number) => {
  try {
    const { data } = await http.delete(`/cards/${cardId}`);
    return data;
  } catch (error) {
    // console.error("카드 삭제 중 오류:", error);
    throw new Error("카드 삭제에 실패했습니다.");
  }
};

// 여러 카드 삭제하기
export const deleteCards = async (cardIds: number[]) => {
  try {
    const { data } = await http.delete("/cards/delete-many", {
      data: { cardIds },
    });

    return data;
  } catch (error) {
    // console.error("카드 삭제 중 오류:", error);
    throw new Error("카드 삭제에 실패했습니다.");
  }
};

// 카드 수정하기
export const patchCard = async (cardId: number, card: Partial<indexCard>) => {
  try {
    const response = await http.patch(`/cards/${cardId}`, card);
    return response.data;
  } catch (error) {
    // console.error("카드 수정 중 오류:", error);
    throw new Error("카드 수정에 실패했습니다.");
  }
};

// 카드 단건 조회
export const getCardById = async (
  cardId: number,
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result: indexCard;
}> => {
  try {
    const response = await http.get(`/cards/${cardId}`);
    return response.data;
  } catch (error) {
    // console.error("카드 단건 조회 중 오류:", error);
    throw new Error("카드 조회 실패");
  }
};
