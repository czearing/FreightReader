import type { InputHTMLAttributes, ReactNode, ForwardedRef } from "react";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  inputRef?: ForwardedRef<HTMLInputElement>;
  wrapperClassName?: string;
}
