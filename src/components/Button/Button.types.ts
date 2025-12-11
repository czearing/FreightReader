import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonAppearance = "primary" | "secondary" | "ghost";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  appearance?: ButtonAppearance;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
}
