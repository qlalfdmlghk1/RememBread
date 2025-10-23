// "카드 학습 기록 상태"를 전역에서 관리하기 위해 생성
import { create } from "zustand";

interface StudyState {
  isRecording: boolean; // 현재 학습 중인지 여부
  cardSetId: number | null; // 학습 중인 카드셋 ID
  lastCardId: number;
  setRecording: (cardSetId: number) => void; // 학습 시작 시 카드셋 ID 설정
  setLastCardId: (cardId: number) => void;
  stopRecording: () => void; // 학습 종료 시 상태 초기화
}

export const useStudyStore = create<StudyState>((set) => ({
  isRecording: false,
  cardSetId: null,
  lastCardId: 0,

  // 학습 시작 시 사용
  setRecording: (cardSetId) => set({ isRecording: true, cardSetId }),

  // 카드 넘길 때 사용
  setLastCardId: (cardId) => set({ lastCardId: cardId }),

  // 학습 종료 시 사용
  stopRecording: () => set({ isRecording: false, cardSetId: null, lastCardId: 0 }),
}));
