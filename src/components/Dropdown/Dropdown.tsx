import { forwardRef } from "react";
import type { ReactNode } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import cx from "clsx";

import styles from "./Dropdown.module.css";
import type {
  DropdownContentProps,
  DropdownContentRef,
  DropdownItemProps,
  DropdownItemRef,
  DropdownProps,
  DropdownTriggerProps,
} from "./Dropdown.types";

export const Dropdown = ({ children, ...props }: DropdownProps) => (
  <DropdownMenuPrimitive.Root {...props}>{children}</DropdownMenuPrimitive.Root>
);

export const DropdownTrigger = ({ children, ...props }: DropdownTriggerProps) => (
  <DropdownMenuPrimitive.Trigger {...props}>
    {children}
  </DropdownMenuPrimitive.Trigger>
);

export const DropdownContent = forwardRef<
  DropdownContentRef,
  DropdownContentProps
>(({ className, children, sideOffset = 8, ...contentProps }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cx(styles.content, className)}
      {...contentProps}
    >
      {children}
    </DropdownMenuPrimitive.Content>
  </DropdownMenuPrimitive.Portal>
));

DropdownContent.displayName = "DropdownContent";

export const DropdownItem = forwardRef<DropdownItemRef, DropdownItemProps>(
  ({ className, icon, inset, tone = "default", children, ...itemProps }, ref) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cx(
        styles.item,
        inset && styles.inset,
        tone === "danger" && styles.danger,
        className,
      )}
      {...itemProps}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{children}</span>
    </DropdownMenuPrimitive.Item>
  ),
);

DropdownItem.displayName = "DropdownItem";

export const DropdownSeparator = () => (
  <DropdownMenuPrimitive.Separator className={styles.separator} />
);

export const DropdownLabel = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <DropdownMenuPrimitive.Label className={cx(styles.label, className)}>
    {children}
  </DropdownMenuPrimitive.Label>
);
