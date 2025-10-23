import { ReactNode, useState, MouseEvent } from "react";
import clsx from "clsx";

interface CustomButtonProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
}


const CustomButton = ({
  icon,
  title,
  description,
  onClick,
  className,
  disabled,
  children,
}: CustomButtonProps) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.preventDefault();
    setIsClicked(true);
    onClick?.();
    setTimeout(() => {
      setIsClicked(false);
    }, 200);
  };

  return (
    <button
      type="button"
      className={clsx(
        "flex flex-row items-center w-full max-w-[380px] rounded-2xl px-5 py-2 mb-2 transition-all duration-200 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        isClicked && "!bg-primary-400",
        className
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      {icon && <div className="mr-4 pl-2 flex-shrink-0">{icon}</div>}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {title && <span className="font-bold text-sm md:text-md lg:text-lg text-neutral-800">{title}</span>}
        {description && <span className="text-xs md:text-sm text-neutral-500">{description}</span>}
        {children}
      </div>
    </button>
  );
};

export default CustomButton; 