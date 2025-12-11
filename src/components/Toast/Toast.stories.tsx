import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "sonner";

import { showToast } from "./Toast";
import { Button } from "../Button/Button";

const meta: Meta = {
  title: "UI/Toast",
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster position="top-right" richColors closeButton />
      </>
    ),
  ],
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <Button
      onClick={() =>
        showToast({
          title: "Upload queued",
          description: "We’ll process this file shortly.",
          tone: "success",
        })
      }
    >
      Show toast
    </Button>
  ),
};
