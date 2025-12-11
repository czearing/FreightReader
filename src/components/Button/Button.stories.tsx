import type { Meta, StoryObj } from "@storybook/react";
import { Upload } from "lucide-react";

import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  args: {
    children: "Button",
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { appearance: "primary" },
};

export const Secondary: Story = {
  args: { appearance: "secondary" },
};

export const GhostWithIcon: Story = {
  args: { appearance: "ghost", icon: <Upload size={16} />, children: "Upload" },
};

export const Loading: Story = {
  args: { appearance: "primary", isLoading: true, children: "Loading…" },
};
