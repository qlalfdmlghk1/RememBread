import { useState } from "react";
import Profile from "@/components/profile/Profile";
import GameHistory from "@/components/profile/GameHistory";
import StudyHistory from "@/components/profile/StudyHistory";

const tabs = ["프로필", "게임 히스토리", "학습 기록"];
const tabContents = [
  <div key="0">
    <Profile />
  </div>,
  <div key="1">
    <GameHistory />
  </div>,
  <div key="2">
    <StudyHistory />
  </div>,
];

const ProfilePage = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <>
      <div className="relative flex gap-1 border-b mt-2">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`flex-1 p-2 text-center cursor-pointer ${
              selectedTab === index ? "font-bold text-primary-500" : "text-neutral-500"
            }`}
            onClick={() => setSelectedTab(index)}
          >
            {tab}
          </div>
        ))}

        <div
          className="absolute bottom-0 h-1 bg-primary-500 transition-all duration-300"
          style={{ width: "33.33%", left: `${selectedTab * 33.33}%` }}
        />
      </div>

      <div>{tabContents[selectedTab]}</div>
    </>
  );
};

export default ProfilePage;
