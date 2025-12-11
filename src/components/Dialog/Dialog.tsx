import { forwardRef } from "react";
import type { ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import cx from "clsx";
import { X } from "lucide-react";

import styles from "./Dialog.module.css";
import type {
  DialogCloseProps,
  DialogContentProps,
  DialogContentRef,
  DialogRootProps,
  DialogTriggerProps,
} from "./Dialog.types";

export const Dialog = ({ children, ...props }: DialogRootProps) => (
  <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>
);

export const DialogTrigger = ({ children, ...props }: DialogTriggerProps) => (
  <DialogPrimitive.Trigger {...props}>{children}</DialogPrimitive.Trigger>
);

export const DialogClose = ({ children, ...props }: DialogCloseProps) => (
  <DialogPrimitive.Close {...props}>{children}</DialogPrimitive.Close>
);

export const DialogContent = forwardRef<DialogContentRef, DialogContentProps>(
  (
    { title, description, children, className, ...contentProps },
    forwardedRef,
  ) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={styles.overlay} />
      <DialogPrimitive.Content
        ref={forwardedRef}
        className={cx(styles.content, className)}
        {...contentProps}
      >
        <div className={styles.header}>
          <div>
            <DialogPrimitive.Title className={styles.title}>
              {title}
            </DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className={styles.description}>
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          <DialogPrimitive.Close className={styles.close} aria-label="Close">
            <X size={18} />
          </DialogPrimitive.Close>
        </div>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  ),
);

DialogContent.displayName = "DialogContent";

export const DialogFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => <div className={cx(styles.footer, className)}>{children}</div>;
