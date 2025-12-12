import { ArrowRight } from "lucide-react";
import Link from "next/link";

import styles from "@/app/marketing/LandingPage.module.css";

export const LandingHero = () => (
  <section className={styles.Landing_hero}>
    <h1 className={styles.Landing_title}>
      Automate Your{" "}
      <span className={styles.Landing_titleHighlight}>Freight Docs</span>
    </h1>
    <p className={styles.Landing_subtitle}>
      Extract critical data from BOLs, PODs, and Rate Confirmations instantly
      using AI. Stop manual entry, start moving freight.
    </p>
    <Link href="/auth" className={styles.Landing_ctaBtn}>
      Get Started for Free <ArrowRight width={20} height={20} />
    </Link>
  </section>
);
