import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { stopRecord } from "@/services/map";
import { useStudyStore } from "@/stores/studyRecord";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import FooterModal from "@/components/footer/FooterModal";
import FooterItem from "@/components/footer/FooterItem";
import Game from "@/components/svgs/footer/Game";
import GameBlack from "@/components/svgs/footer/GameBlack";
import Map from "@/components/svgs/footer/Map";
import MapBlack from "@/components/svgs/footer/MapBlack";
import IndexCard from "@/components/svgs/footer/IndexCard";
import IndexCardBlack from "@/components/svgs/footer/IndexCardBlack";
import Profile from "@/components/svgs/footer/Profile";
import ProfileBlack from "@/components/svgs/footer/ProfileBlack";
import CreateOven from "@/components/svgs/footer/CreateOven";
import StopStudyModal from "@/components/studyMap/StopStudyModal";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOvenOpen, setIsOvenOpen] = useState<boolean>(false);

  const { isRecording, cardSetId, lastCardId, stopRecording } = useStudyStore();
  const [showStopModal, setShowStopModal] = useState<boolean>(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const { location: currentLocation } = useCurrentLocation();

  const isActive = (path: string) => {
    if (path === "/card-view") {
      return location.pathname.startsWith("/card-view");
    }
    if (path === "/games") {
      return location.pathname.startsWith("/games");
    }
    return location.pathname === path;
  };

  const handleOvenClick = () => {
    if (isRecording) {
      setPendingPath("/create");
      setShowStopModal(true);
      return;
    }
    setIsOvenOpen((prev) => !prev);
  };

  const handleCloseModal = () => {
    setIsOvenOpen(false);
  };

  const handleNavigate = (path: string) => {
    handleCloseModal();

    if (isRecording && path !== `/card-view/${cardSetId}`) {
      setPendingPath(path);
      setShowStopModal(true);
    } else {
      navigate(path);
    }
  };

  const handleStopConfirm = async () => {
    if (!cardSetId) return;

    const latitude = currentLocation?.latitude ?? 0;
    const longitude = currentLocation?.longitude ?? 0;

    const payload = {
      lastCardId,
      latitude,
      longitude,
    };

    try {
      await stopRecord(cardSetId, payload);
    } catch (e) {}

    stopRecording();
    setShowStopModal(false);

    if (pendingPath) {
      navigate(pendingPath);
      setPendingPath(null);
    }
  };

  return (
    <>
      <FooterModal isOpen={isOvenOpen} onClose={handleCloseModal} />
      <footer className="fixed flex justify-evenly w-full min-h-16 max-w-[600px] mx-auto pc:border-x bg-white border-t border-neutral-200 z-50 pb-[env(safe-area-inset-bottom)] bottom-0 left-0 right-0">
        <FooterItem
          isActive={isActive("/card-view")}
          onClick={() => handleNavigate("/card-view")}
          activeIcon={<IndexCard className="w-10 h-10" />}
          inactiveIcon={<IndexCardBlack className="w-10 h-10" />}
          label="인덱스 카드"
        />
        <FooterItem
          isActive={isActive("/map")}
          onClick={() => handleNavigate("/map")}
          activeIcon={<Map className="w-10 h-10" />}
          inactiveIcon={<MapBlack className="w-10 h-10" />}
          label="학습 지도"
        />
        <div
          className="flex-1 flex flex-col items-center justify-center cursor-pointer"
          onClick={handleOvenClick}
        >
          <div className="relative w-[60px] h-[69px] flex items-center justify-center">
            <CreateOven className="absolute w-full h-full" />
          </div>
        </div>
        <FooterItem
          isActive={isActive("/games")}
          onClick={() => handleNavigate("/games")}
          activeIcon={<Game className="w-10 h-10" />}
          inactiveIcon={<GameBlack className="w-10 h-10" />}
          label="두뇌 게임"
        />
        <FooterItem
          isActive={isActive("/profile")}
          onClick={() => handleNavigate("/profile")}
          activeIcon={<Profile className="w-10 h-10" />}
          inactiveIcon={<ProfileBlack className="w-10 h-10" />}
          label="프로필"
        />
      </footer>
      <StopStudyModal
        open={showStopModal}
        onOpenChange={(open) => {
          setShowStopModal(open);
          if (!open) setPendingPath(null);
        }}
        cardSetId={cardSetId ?? 0}
        onConfirm={handleStopConfirm}
      />
    </>
  );
};

export default Footer;
