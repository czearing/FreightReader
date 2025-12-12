import type React from "react";

export type FreightReaderLogoVariant = "outline" | "filled" | "duotone";

export interface FreightReaderLogoProps {
  className?: string;
  variant?: FreightReaderLogoVariant;
  color?: string;
  onMouseEnter?: React.MouseEventHandler<SVGSVGElement>;
  onMouseLeave?: React.MouseEventHandler<SVGSVGElement>;
}
