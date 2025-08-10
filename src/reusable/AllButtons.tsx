import React from "react";
import { Link } from "react-router-dom";

// Shared base styles
const baseStyles = "transition-all duration-200 hover:cursor-pointer";

// ---------- Types ----------
interface CommonButtonProps {
  text?: string;
  height?: string;
  width?: string;
  textColor?: string;
  bgColor?: string;
  rounded?: string;
}

interface LinkButtonProps extends CommonButtonProps {
  to?: string;
}

interface OnClickButtonProps extends CommonButtonProps {
  onClick?: () => void;
}

interface NormalLinkButtonProps extends LinkButtonProps {
  className?: string;
}

interface SubmitButtonProps extends CommonButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

// ---------- Components ----------
const LinkButton: React.FC<LinkButtonProps> = ({
  text = "Click Me",
  to = "/",
  height = "h-full",
  width = "w-full",
  textColor = "text-white",
  bgColor = "bg-[#37B874]",
  rounded = "rounded-4xl",
}) => {
  return (
    <Link
      to={to}
      className={`flex items-center justify-center ${height} ${width} ${textColor} ${bgColor} ${baseStyles} ${rounded}`}
    >
      {text}
    </Link>
  );
};

const OnClickButton: React.FC<OnClickButtonProps> = ({
  text = "Click Me",
  onClick,
  height = "h-full",
  width = "w-full",
  textColor = "text-white",
  bgColor = "bg-[#37B874]",
  rounded = "rounded-4xl",
}) => {
  return (
    <Link
      to="#"
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      className={`flex items-center justify-center ${height} ${width} ${textColor} ${bgColor} ${baseStyles} ${rounded}`}
    >
      {text}
    </Link>
  );
};

const NormalLinkButton: React.FC<NormalLinkButtonProps> = ({
  text = "Click Me",
  to = "/",
  height = "h-[40px]",
  width = "w-full",
  textColor = "text-[#676768]",
  bgColor = "bg-transparent",
  rounded = "rounded-4xl",
  className = "",
}) => {
  return (
    <Link
      to={to}
      className={`flex items-center justify-center ${height} ${width} ${textColor} ${bgColor} ${baseStyles} ${rounded} ${className}`}
    >
      {text}
    </Link>
  );
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
  text = "Submit",
  height = "h-[40px]",
  width = "w-full",
  textColor = "text-white",
  bgColor = "bg-[#37B874]",
  rounded = "rounded-[12px]",
  onClick,
  type = "button",
  disabled = false,
}) => {
  const baseSubmitStyles = `flex items-center justify-center font-semibold transition duration-200 cursor-pointer`;

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${height} ${width} ${bgColor} ${textColor} ${rounded} ${baseSubmitStyles} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

// ---------- Export ----------
const Buttons = {
  LinkButton,
  SubmitButton,
  NormalLinkButton,
  OnClickButton,
};

export default Buttons;
