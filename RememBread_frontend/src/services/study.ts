import http from "@/services/httpCommon";

// 테스트 시작
export const postStartTest = async (
  cardSetId: number,
  count: number,
  mode: string,
  latitude: number,
  longitude: number,
) => {
  try {
    const response = await http.post(`studies/${cardSetId}/start`, {
      count,
      mode,
      latitude,
      longitude,
    });

    return response.data.result;
  } catch (error) {
    // console.error("테스트 시작 중 오류:", error);
    throw new Error("테스트 시작 실패");
  }
};

// 테스트 다음 카드
export const getNextCard = async (cardSetId: number) => {
  try {
    const response = await http.get(`studies/${cardSetId}/next`);

    return response.data.result;
  } catch (error) {
    // console.error("다음 카드 조회 중 오류:", error);
    throw new Error("다음 카드 조회 실패");
  }
};

// 답 제출
export const postAnswer = async (cardSetId: number, cardId: number, isCorrect: boolean) => {
  try {
    const response = await http.post(`studies/${cardSetId}/cards/${cardId}/answer`, { isCorrect });

    return response.data.result;
  } catch (error) {
    // console.error("답 제출 중 오류:", error);
    throw new Error("답 제출 실패");
  }
};

// 테스트 중단/종료
export const postStopTest = async (
  cardSetId: number,
  lastCardId: number,
  latitude: number | null,
  longitude: number | null,
) => {
  try {
    const response = await http.post(`studies/${cardSetId}/stop`, {
      lastCardId,
      latitude,
      longitude,
    });

    return response.data.result;
  } catch (error) {
    // console.error("테스트 중단 중 오류:", error);
    throw new Error("테스트 중단 실패");
  }
};

// 테스트 경로
export const postLocation = async (
  cardSetId: number,
  latitude: number | null,
  longitude: number | null,
) => {
  try {
    const response = await http.post(`studies/${cardSetId}/location`, {
      latitude,
      longitude,
    });

    return response.data;
  } catch (error) {
    // console.error("위치 전송 중 오류:", error);
    throw new Error("위치 전송 실패");
  }
};

export const getTTSFiles = async (cardSetId: number) => {
  const response = await http.get(`/tss/${cardSetId}`);
  return response.data;
};
