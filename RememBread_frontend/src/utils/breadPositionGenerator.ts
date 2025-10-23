interface Position {
  left: number;
  top: number;
}

const calculateDistance = (pos1: Position, pos2: Position): number => {
  const dx = pos1.left - pos2.left;
  const dy = pos1.top - pos2.top;
  return Math.sqrt(dx * dx + dy * dy);
};

export const generateBreadPositions = (
  count: number,
  containerWidth: number,
  containerHeight: number,
  imgSize: number,
  padding: number
): Position[] => {
  const positions: Position[] = [];
  const minDistance = imgSize * 1;

  // 이미지가 컨테이너 밖으로 나가지 않도록 범위 보정
  const minLeft = padding + imgSize / 2;
  const maxLeft = containerWidth - padding - imgSize / 2;
  const minTop = padding + imgSize / 2;
  const maxTop = containerHeight - padding - imgSize / 2;

  // 격자 기반 위치 생성 (성능 최적화)
  const gridCols = Math.max(1, Math.floor((maxLeft - minLeft) / minDistance));
  const gridRows = Math.max(1, Math.floor((maxTop - minTop) / minDistance));
  const gridPositions: Position[] = [];

  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      gridPositions.push({
        left: minLeft + (col * minDistance),
        top: minTop + (row * minDistance)
      });
    }
  }

  // 격자 위치를 랜덤하게 섞기
  const shuffledPositions = [...gridPositions].sort(() => Math.random() - 0.5);

  // 격자 기반으로 우선 배치
  for (let i = 0; i < Math.min(count, shuffledPositions.length); i++) {
    positions.push(shuffledPositions[i]);
  }

  // 남은 빵만 랜덤 후보 방식(후보 수 10개)으로 배치
  while (positions.length < count) {
    const candidateCount = 10;
    let bestPosition = null;
    let maxMinDistance = -1;

    for (let i = 0; i < candidateCount; i++) {
      const left = Math.random() * (maxLeft - minLeft) + minLeft;
      const top = Math.random() * (maxTop - minTop) + minTop;
      const candidate = { left, top };

      // 기존 위치들과의 최소 거리 계산
      let minDist = Infinity;
      for (const pos of positions) {
        const dist = calculateDistance(candidate, pos);
        if (dist < minDist) minDist = dist;
        if (minDist < minDistance * 0.5) break;
      }
      if (positions.length === 0) {
        bestPosition = candidate;
        break;
      }
      if (minDist > maxMinDistance) {
        maxMinDistance = minDist;
        bestPosition = candidate;
        if (minDist > minDistance * 1.5) break;
      }
    }
    if (bestPosition) {
      positions.push(bestPosition);
    }
  }

  return positions;
}; 