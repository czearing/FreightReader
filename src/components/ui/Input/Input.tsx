import { forwardRef } from "react";
import cx from "clsx";

import styles from "./Input.module.css";
import type { InputProps } from "./Input.types";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      wrapperClassName,
      label,
      hint,
      error,
      leadingIcon,
      trailingIcon,
      inputRef,
      ...rest
    },
    ref,
  ) => {
    const mergedRef = inputRef ?? ref;
    const fieldClassName = cx(styles.field, error && styles.error);
    const inputClassName = cx(styles.input, className);

    return (
      <label className={cx(styles.wrapper, wrapperClassName)}>
        {label && <span className={styles.label}>{label}</span>}
        <div className={fieldClassName}>
          {leadingIcon && <span className={styles.icon}>{leadingIcon}</span>}
          <input ref={mergedRef} className={inputClassName} {...rest} />
          {trailingIcon && <span className={styles.icon}>{trailingIcon}</span>}
        </div>
        {!error && hint && <p className={styles.hint}>{hint}</p>}
        {error && <p className={styles.errorText}>{error}</p>}
      </label>
    );
  },
);

Input.displayName = "Input";
