import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Sparkles } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "./Dialog";
import { Button } from "../Button/Button";

const meta: Meta = {
  title: "UI/Dialog",
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button appearance="secondary" icon={<Sparkles size={16} />}>
            Open dialog
          </Button>
        </DialogTrigger>
        <DialogContent
          title="Example dialog"
          description="Radix-based dialog with focus trapping."
        >
          <p style={{ color: "rgba(229, 231, 235, 0.8)", margin: 0 }}>
            You can tab through controls and press Escape to close.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button appearance="ghost">Cancel</Button>
            </DialogClose>
            <Button icon={<Sparkles size={16} />} onClick={() => setOpen(false)}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};
