import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileText, ShieldCheck, Upload } from "lucide-react";

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
} from "./Dropdown";
import { Button } from "../Button/Button";

const meta: Meta = {
  title: "UI/Dropdown",
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: function Render() {
    const [selection, setSelection] = useState("Bill of Lading");

    return (
      <Dropdown>
        <DropdownTrigger asChild>
          <Button appearance="secondary">{selection}</Button>
        </DropdownTrigger>
        <DropdownContent align="start">
          <DropdownLabel>Freight doc type</DropdownLabel>
          <DropdownItem
            icon={<FileText size={16} />}
            onSelect={() => setSelection("Bill of Lading")}
          >
            Bill of Lading
          </DropdownItem>
          <DropdownItem
            icon={<ShieldCheck size={16} />}
            onSelect={() => setSelection("Proof of delivery")}
          >
            Proof of delivery
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem
            tone="danger"
            inset
            icon={<Upload size={16} />}
            onSelect={() => setSelection("Other attachment")}
          >
            Other attachment
          </DropdownItem>
        </DropdownContent>
      </Dropdown>
    );
  },
};
