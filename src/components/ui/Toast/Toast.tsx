import cx from "clsx";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";

import styles from "./Toast.module.css";
import type { ToastOptions, ToastTone } from "./Toast.types";

const icons: Record<ToastTone, JSX.Element> = {
  info: <Info size={18} />,
  success: <CheckCircle2 size={18} />,
  warning: <TriangleAlert size={18} />,
  error: <AlertCircle size={18} />,
};

export const showToast = ({
  title,
  description,
  tone = "info",
  actionLabel,
  onAction,
  duration,
}: ToastOptions) =>
  toast(title, {
    description,
    duration,
    className: cx(styles.toast, styles[tone]),
    icon: <span className={styles.icon}>{icons[tone]}</span>,
    action:
      actionLabel && onAction
        ? {
            label: actionLabel,
            onClick: onAction,
          }
        : undefined,
  });

export const dismissToast = toast.dismiss;
