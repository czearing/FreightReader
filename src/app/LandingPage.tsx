import { Download, Shield, Zap } from "lucide-react";

import type { Feature, PreviewRow } from "@/components/Landing/Landing.types";
import { LandingFeatureGrid } from "@/components/Landing/LandingFeatureGrid";
import { LandingFooter } from "@/components/Landing/LandingFooter";
import { LandingHeader } from "@/components/Landing/LandingHeader";
import { LandingHero } from "@/components/Landing/LandingHero";
import { LandingPreview } from "@/components/Landing/LandingPreview";
import styles from "./LandingPage.module.css";

const PREVIEW_ROWS: PreviewRow[] = [
  {
    title: "BOL-7392_Coyote.pdf",
    timestamp: "Just now",
    shipper: "Procter & Gamble",
    consignee: "Walmart DC #6022",
  },
  {
    title: "RateCon-XPO-99.pdf",
    timestamp: "2 mins ago",
    shipper: "XPO Logistics",
    consignee: "Target Dist. Ctr",
  },
  {
    title: "POD_JBHunt_442.jpg",
    timestamp: "1 hour ago",
    shipper: "Georgia Pacific",
    consignee: "Costco Wholesale",
  },
];

const FEATURES: Feature[] = [
  {
    title: "AI-Powered Extraction",
    description:
      "Instantly pull Shipper, Consignee, PRO#, and Weight from any PDF or image.",
    icon: <Zap width={24} height={24} />,
  },
  {
    title: "Instant Export",
    description:
      "Download clean CSV, JSON, or QuickBooks IIF formats ready for your TMS.",
    icon: <Download width={24} height={24} />,
  },
  {
    title: "Secure & Private",
    description:
      "Enterprise-grade security. Documents stay isolated and never train our models.",
    icon: <Shield width={24} height={24} />,
  },
];

const PREVIEW_DOTS = ["#EF4444", "#F59E0B", "#10B981"];

export function LandingPage() {
  return (
    <div className={styles.Landing_container}>
      <LandingHeader />
      <main className={styles.Landing_main}>
        <LandingHero />
        <LandingPreview rows={PREVIEW_ROWS} dots={PREVIEW_DOTS} />
        <LandingFeatureGrid features={FEATURES} />
      </main>
      <LandingFooter />
    </div>
  );
}
