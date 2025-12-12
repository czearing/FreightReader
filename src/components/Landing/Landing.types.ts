import type React from "react";

export type PreviewRow = {
  title: string;
  timestamp: string;
  shipper: string;
  consignee: string;
};

export type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};
