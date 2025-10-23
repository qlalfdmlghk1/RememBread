import { useNavigate } from "react-router-dom";
import OvenBread from "@/components/svgs/footer/CreateBread.tsx";

interface FooterModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

const FooterModal = ({ isOpen, onClose }: FooterModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const inputTypes = [
    {
      topText: "직접",
      bottomText: "생성",
      path: "/create",
      disabled: false,
    },
    {
      topText: (
        <>
          (AI)
          <br />
          텍스트로
        </>
      ),
      bottomText: "생성",
      path: "/create/text",
      disabled: false,
    },
    {
      topText: (
        <>
          (AI)
          <br />
          PDF로
        </>
      ),
      bottomText: "생성",
      path: "/create/pdf",
      disabled: false,
    },
    {
      topText: (
        <>
          (AI)
          <br />
          이미지로
        </>
      ),
      bottomText: "생성",
      path: "/create/image",
      disabled: false,
    },
  ];

  const handleClick = (path: string, disabled: boolean) => {
    if (disabled) return;
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
      <div className="fixed bottom-16 left-0 right-0 max-w-[600px] mx-auto rounded-t-2xl p-4 z-50">
        <div className="grid grid-cols-4 gap-4">
          {inputTypes.map((type, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                type.disabled ? "cursor-default opacity-50" : "cursor-pointer"
              }`}
              onClick={() => handleClick(type.path, type.disabled)}
            >
              <div className="relative w-24 h-24 flex items-center justify-center">
                <OvenBread className="w-24 h-24" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-center text-xs text-neutral-900 font-bold leading-tight">
                    {type.topText}
                  </span>
                  <span className="text-center text-xs text-neutral-900 font-bold leading-tight">
                    {type.bottomText}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FooterModal;
