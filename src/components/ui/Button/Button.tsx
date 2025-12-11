import { forwardRef } from "react";
import cx from "clsx";
import { Loader2 } from "lucide-react";

import styles from "./Button.module.css";
import type { ButtonProps } from "./Button.types";

const iconSize = 18;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      appearance = "primary",
      children,
      className,
      icon,
      iconPosition = "left",
      isLoading = false,
      type = "button",
      disabled,
      ...rest
    },
    ref,
  ) => {
    const iconToRender = isLoading ? (
      <Loader2 size={iconSize} className={styles.spinner} aria-hidden />
    ) : (
      icon
    );

    const buttonClassName = cx(
      styles.button,
      styles[appearance],
      isLoading && styles.loading,
      className,
    );
    const isButtonDisabled = isLoading ? true : Boolean(disabled);

    return (
      <button
        ref={ref}
        className={buttonClassName}
        type={type}
        disabled={isButtonDisabled}
        {...rest}
      >
        {iconToRender && iconPosition === "left" && (
          <span className={styles.icon} aria-hidden>
            {iconToRender}
          </span>
        )}
        <span className={styles.label}>{children}</span>
        {iconToRender && iconPosition === "right" && (
          <span className={styles.icon} aria-hidden>
            {iconToRender}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
