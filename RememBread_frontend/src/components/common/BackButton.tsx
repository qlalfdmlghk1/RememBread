import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
  className?: string;
}

const BackButton = ({ label = "뒤로가기", className = "" }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1); // 한 단계 뒤로 이동
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1 text-sm text-gray-700 hover:text-black ${className}`}
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
};

export default BackButton;
