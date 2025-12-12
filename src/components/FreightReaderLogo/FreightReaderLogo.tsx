import React from "react";

import type {
  FreightReaderLogoProps,
  FreightReaderLogoVariant,
} from "./FreightReaderLogo.types";

const fillForVariant = (variant: FreightReaderLogoVariant, color: string) => {
  if (variant === "filled") return color;
  if (variant === "duotone") return color;
  return "none";
};

const fillOpacityForVariant = (variant: FreightReaderLogoVariant) => {
  if (variant === "duotone") return 0.2;
  if (variant === "filled") return 1;
  return 0;
};

export const FreightReaderLogo: React.FC<FreightReaderLogoProps> = ({
  className = "w-12 h-12",
  variant = "outline",
  color = "currentColor",
  onMouseEnter,
  onMouseLeave,
}) => {
  const fill = fillForVariant(variant, color);
  const fillOpacity = fillOpacityForVariant(variant);

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="FreightReader logo"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Viewfinder brackets */}
      <path
        d="M2 7V4C2 2.89543 2.89543 2 4 2H7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 2H20C21.1046 2 22 2.89543 22 4V7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 17V20C22 21.1046 21.1046 22 20 22H17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 22H4C2.89543 22 2 21.1046 2 20V17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Cube */}
      <path
        d="M12 7L16.5 9.5V14.5L12 17L7.5 14.5V9.5L12 7Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill}
        fillOpacity={fillOpacity}
      />
      <path
        d="M12 17V12"
        stroke={variant === "filled" ? "white" : color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12L16.5 9.5"
        stroke={variant === "filled" ? "white" : color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12L7.5 9.5"
        stroke={variant === "filled" ? "white" : color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
