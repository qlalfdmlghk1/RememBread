import { useState } from "react";
import { Crosshair, Target } from "lucide-react";

type Props = {
  onClick: () => void;
};

const CurrentLocationBtn = ({ onClick }: Props) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handleClick = () => {
    onClick();
    setIsClicked(true);
  };

  return (
    <button
      className="z-10 bg-white text-primary-500 border border-primary-500 shadow-xl w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary-100 transition"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-8 h-8 flex justify-center items-center">
        {isHovered || isClicked ? (
          <Target className="w-full h-full" />
        ) : (
          <Crosshair className="w-full h-full" />
        )}
      </div>
    </button>
  );
};

export default CurrentLocationBtn;
