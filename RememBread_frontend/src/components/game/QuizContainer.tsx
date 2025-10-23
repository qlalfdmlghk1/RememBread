import { useMemo } from "react";
import Bread from "@/components/svgs/game/Bread";
import Baguette from "@/components/svgs/game/Baguette";
import Croissant from "@/components/svgs/game/Croissant";

interface Bread {
  name: string;
  price: number;
  type: string;
}

interface QuizContainerProps {
  breads: Bread[];
  onClick: () => void;
}

const GRID_COLS = 4; // 가로(열)
const GRID_ROWS = 3; // 세로(행)
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;

const QuizContainer = ({ breads, onClick }: QuizContainerProps) => {
  // breads 배열을 그리드에 랜덤하게 배치할 인덱스 선정
  const grid = useMemo(() => {
    // 0~15 인덱스 배열 생성 후 셔플
    const indices = Array.from({ length: TOTAL_CELLS }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    // 빵 개수만큼 앞에서부터 인덱스 선택
    const breadIndices = indices.slice(0, breads.length);
    // 그리드 배열 생성 (빵이 들어갈 칸에만 breads 데이터 할당)
    const gridArr = Array(TOTAL_CELLS).fill(null);
    breadIndices.forEach((cellIdx, i) => {
      gridArr[cellIdx] = breads[i];
    });
    return gridArr;
  }, [breads]);

  const renderBread = (type: string) => {
    switch (type) {
      case 'bread':
        return <Bread className="w-12 h-12 sm:w-14 sm:h-14" />;
      case 'baguette':
        return <Baguette className="w-12 h-12 sm:w-14 sm:h-14" />;
      case 'croissant':
        return <Croissant className="w-12 h-12 sm:w-14 sm:h-14" />;
      default:
        return null;
    }
  };

  return (
    <div
      className="w-full sm:w-96 h-40 sm:h-48 flex-shrink-0 bg-neutral-50 rounded-xl border border-neutral-300 relative cursor-pointer overflow-hidden flex items-center justify-center"
      onClick={onClick}
    >
      <div className="grid grid-cols-4 grid-rows-3 gap-2 w-full h-full p-2 sm:p-4">
        {grid.map((bread, idx) => (
          <div key={idx} className="flex items-center justify-center w-full h-full">
            {bread ? renderBread(bread.type) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizContainer; 