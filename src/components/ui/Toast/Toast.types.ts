export type ToastTone = "info" | "success" | "warning" | "error";

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}
