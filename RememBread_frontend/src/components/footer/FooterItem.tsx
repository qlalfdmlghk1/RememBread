import React from "react";

interface FooterItemProps {
  isActive: boolean;
  onClick: () => void;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  label: string;
}

const FooterItem: React.FC<FooterItemProps> = ({
  isActive,
  onClick,
  activeIcon,
  inactiveIcon,
  label,
}) => {
  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center cursor-pointer border-t-4 ${
        isActive ? "border-primary-500" : "border-white"
      }`}
      onClick={onClick}
    >
      {isActive ? activeIcon : inactiveIcon}
      <span className="text-xxxs">{label}</span>
    </div>
  );
};

export default FooterItem;
