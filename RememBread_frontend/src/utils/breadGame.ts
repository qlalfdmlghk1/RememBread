import { Bread as BreadType } from "@/types/game";
import { BREAD_SVG_LIST } from '@/constants/game';


/**
 * 랜덤 빵 배열 생성 (가격 비교 게임)
*/
export const getRandomBreads = (breads: BreadType[], count: number) => {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(breads[Math.floor(Math.random() * breads.length)]);
  }
  return arr;
}

/**
 * 새로운 문제 생성 (가격 비교 게임)
*/
export const getNewQuiz = (breads: BreadType[], score: number) => {
  let topCount, bottomCount;
  let topBreads, bottomBreads;
  let topSum, bottomSum;
  
  do {
    if (score < 3) {
      // 처음 3문제: 1~3개
      topCount = Math.floor(Math.random() * 3) + 1;
      bottomCount = Math.floor(Math.random() * 3) + 1;
    } else if (score < 6) {
      // 3~5문제: 3~5개
      topCount = Math.floor(Math.random() * 3) + 3;
      bottomCount = Math.floor(Math.random() * 3) + 3;
    } else if (score < 9) {
      // 6문제 이상: 5~7개
      topCount = Math.floor(Math.random() * 3) + 5;
      bottomCount = Math.floor(Math.random() * 3) + 5;
    } else {
      // 9문제 이상: 7~9개
      topCount = Math.floor(Math.random() * 3) + 7;
      bottomCount = Math.floor(Math.random() * 3) + 7;
    }
    
    topBreads = getRandomBreads(breads, topCount);
    bottomBreads = getRandomBreads(breads, bottomCount);
    
    topSum = topBreads.reduce((acc, cur) => acc + cur.price, 0);
    bottomSum = bottomBreads.reduce((acc, cur) => acc + cur.price, 0);
  } while (topSum === bottomSum);
  
  return {
    top: topBreads,
    bottom: bottomBreads
  };
} 

/**
 * 랜덤 인덱스 배열 생성 (그림자 게임)
*/
export function getRandomIndices(count: number) {
  const arr = Array.from({ length: BREAD_SVG_LIST.length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

/**
 * 정답 버튼 배열 생성 (그림자 게임)
*/
export function getAnswerButtons(answerIndices: number[]) {
  // 정답 인덱스들을 포함한 6개의 랜덤 인덱스 생성
  const remainingIndices = Array.from({ length: BREAD_SVG_LIST.length }, (_, i) => i)
  .filter(i => !answerIndices.includes(i));
  
  // 남은 인덱스들 중에서 랜덤하게 선택
  for (let i = remainingIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remainingIndices[i], remainingIndices[j]] = [remainingIndices[j], remainingIndices[i]];
  }
  
  // 정답 인덱스와 랜덤 인덱스를 합쳐서 6개 만들기
  const allIndices = [...answerIndices, ...remainingIndices.slice(0, 6 - answerIndices.length)];
  
  // 최종 인덱스 배열을 섞기
  for (let i = allIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allIndices[i], allIndices[j]] = [allIndices[j], allIndices[i]];
  }
  
  return allIndices;
} 
// 그림자 게임 SVG 크기 상수
export const SVG_WIDTH = 144; // 모바일에서는 120px, 데스크톱에서는 144px
export const SVG_HEIGHT = 144;

/**
 * 화면 크기에 따른 게임 영역 크기 계산 (그림자 게임)
 */
export const getGameAreaDimensions = () => {
  const width = window.innerWidth;
  if (width <= 375) {
    return {
      width: 280,
      height: 280,
      svgSize: 120
    };
  }
  return {
    width: 375,
    height: 350,
    svgSize: 144
  };
};

/**
 * 랜덤 위치 생성 (그림자 게임)
 */
export const getRandomPos = () => {
  const { width: parentW, height: parentH, svgSize } = getGameAreaDimensions();
  
  // 중앙점 계산
  const centerX = (parentW - svgSize) / 2;
  const centerY = (parentH - svgSize) / 2;
  
  // 중앙에서부터 랜덤하게 이동할 거리 계산 (-60% ~ +40%)
  const offsetX = (Math.random() * 1 - 0.55) * (parentW - svgSize);
  const offsetY = (Math.random() * 1 - 0.55) * (parentH - svgSize);
  
  return {
    x: centerX + offsetX,
    y: centerY + offsetY
  };
};

export const convertGameTypeToKorean = (gameType: string): string => {
  switch (gameType) {
    case 'MEMORY':
      return '순간기억';
    case 'COMPARE':
      return '가격비교';
    case 'DETECTIVE':
      return '빵 탐정';
    case 'SHADOW':
      return '그림자빵';
    default:
      return gameType;
  }
};