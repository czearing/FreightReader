import type {
  ComponentPropsWithoutRef,
  ElementRef,
  ReactNode,
} from "react";
import type * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

export type DropdownProps = DropdownMenuPrimitive.DropdownMenuProps;
export type DropdownTriggerProps =
  DropdownMenuPrimitive.DropdownMenuTriggerProps;

export type DropdownContentRef = ElementRef<
  typeof DropdownMenuPrimitive.Content
>;

export type DropdownContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
>;

export type DropdownItemRef = ElementRef<typeof DropdownMenuPrimitive.Item>;

export type DropdownItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Item
> & {
  icon?: ReactNode;
  inset?: boolean;
  tone?: "default" | "danger";
};
