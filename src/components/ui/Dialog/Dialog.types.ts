import type {
  ComponentPropsWithoutRef,
  ElementRef,
  ReactNode,
} from "react";
import type * as DialogPrimitive from "@radix-ui/react-dialog";

export type DialogRootProps = DialogPrimitive.DialogProps;
export type DialogTriggerProps = DialogPrimitive.DialogTriggerProps;
export type DialogCloseProps = DialogPrimitive.DialogCloseProps;

export type DialogContentProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> & {
  title: ReactNode;
  description?: ReactNode;
};

export type DialogContentRef = ElementRef<typeof DialogPrimitive.Content>;
