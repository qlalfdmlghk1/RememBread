import { JSX, useState } from "react";
import { tutorialPages } from "@/components/tutorial/tutorialData";

import MakeCardTutorial from "@/components/svgs/tutorial/MakeCardTutorial";
import MakeLargeStringTutoria from "@/components/svgs/tutorial/MakeLargeStringTutoria";
import StudyTutorial from "@/components/svgs/tutorial/StudyTutorial";
import TestTutorial from "@/components/svgs/tutorial/TestTutorial";
import TakeCardSetTutorial from "@/components/svgs/tutorial/TakeCardSetTutorial";
import MapTutorial from "@/components/svgs/tutorial/MapTutorial";
import LocationAlert from "@/components/svgs/tutorial/LocationAlert";
import BrainGameTutorial from "@/components/svgs/tutorial/BrainGameTutorial";
import ProfileTutorial from "@/components/svgs/tutorial/ProfileTutorial";
import CharacterTutorial from "@/components/svgs/tutorial/CharacterTutorial";

// 문자열 key를 컴포넌트에 매핑
const componentMap: Record<string, JSX.Element> = {
  MakeCardTutorial: <MakeCardTutorial className="w-full h-auto max-h-full" />,
  MakeLargeStringTutoria: <MakeLargeStringTutoria className="w-full h-auto max-h-full" />,
  StudyTutorial: <StudyTutorial className="w-full h-auto max-h-full" />,
  TestTutorial: <TestTutorial className="w-full h-auto max-h-full" />,
  TakeCardSetTutorial: <TakeCardSetTutorial className="w-full h-auto max-h-full" />,
  MapTutorial: <MapTutorial className="w-full h-auto max-h-full" />,
  LocationAlert: <LocationAlert className="w-full h-auto max-h-full" />,
  BrainGameTutorial: <BrainGameTutorial className="w-full h-auto max-h-full" />,
  ProfileTutorial: <ProfileTutorial className="w-full h-auto max-h-full" />,
  CharacterTutorial: <CharacterTutorial className="w-full h-auto max-h-full" />,
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialModal = ({ isOpen, onClose }: Props) => {
  const [page, setPage] = useState<number>(0);
  const current = tutorialPages[page];

  if (!isOpen) return null;

  const MediaComponent = componentMap[current.componentKey];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
      onClick={() => {
        setPage(0);
        onClose();
      }}
    >
      <div
        className="bg-white p-6 rounded-xl w-[90%] max-w-[500px] text-center h-2/3 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 제목 */}
        <div>
          <h2 className="text-xl pc:text-2xl font-bold mb-1">{current.title}</h2>
          {current.subTitle && <h3 className="text-sm text-gray-500 mb-2">{current.subTitle}</h3>}
        </div>

        {/* 미디어 (SVG 컴포넌트) */}
        <div className="flex justify-center items-center h-2/3 overflow-hidden">
          {MediaComponent ?? <div>미디어를 불러올 수 없습니다.</div>}
        </div>

        {/* 설명 */}
        <p className="text-primary-600 text-xs pc:text-base whitespace-pre-line my-2">
          {current.description}
        </p>

        {/* 하단 버튼 */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex justify-around items-center text-sm">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="text-primary-700 hover:text-primary-500 hover:underline disabled:opacity-40 disabled:pointer-events-none"
            >
              이전
            </button>
            <span className="text-gray-700">
              {page + 1} / {tutorialPages.length}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(tutorialPages.length - 1, p + 1))}
              disabled={page === tutorialPages.length - 1}
              className="text-primary-700 hover:text-primary-500 hover:underline disabled:opacity-40 disabled:pointer-events-none"
            >
              다음
            </button>
          </div>
          <button
            onClick={() => {
              setPage(0);
              onClose();
            }}
            className="w-full bg-primary-700 text-white py-2 rounded text-sm"
          >
            튜토리얼 종료
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
