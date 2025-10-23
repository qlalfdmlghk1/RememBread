import { useEffect } from "react";
import ClearBread from "@/components/svgs/breads/ClearBread";
import FailBread from "@/components/svgs/breads/FailBread";

interface GameResultModalProps {
  open: boolean;
  onClose: () => void;
  type: "success" | "fail";
}

const GameResultModal = ({ open, onClose, type }: GameResultModalProps) => {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 1000);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        {type === "success" ? (
          <ClearBread className="w-128 h-128" />
        ) : (
          <FailBread className="w-96 h-96" />
        )}
      </div>
    </div>
  );
};

export default GameResultModal; 