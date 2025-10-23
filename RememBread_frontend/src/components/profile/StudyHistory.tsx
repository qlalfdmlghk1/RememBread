import CharacterImage from "@/components/common/CharacterImage";
import StudyBarChart from "@/components/profile/StudyBarChart";
import useProfileStore from "@/stores/profileStore";

const StudyHistory = () => {
  const { nickname, mainCharacterId, mainCharacterImageUrl } = useProfileStore();

  return (
    <div className="flex flex-col items-center w-full webkit-scrollbar-hide">
      {/* 프로필 영역 */}
      <div className="flex flex-col items-center mt-4 mb-6">
        <CharacterImage characterId={mainCharacterId} characterImageUrl={mainCharacterImageUrl} className="w-24 h-24 mb-2" />
        <div className="text-lg font-bold mb-2">{nickname}</div>
        <div className="w-full h-1.5 bg-primary-300 mb-2" />
      </div>
      {/* 학습 기록 영역 */}
      <StudyBarChart />
    </div>
  );
};

export default StudyHistory; 