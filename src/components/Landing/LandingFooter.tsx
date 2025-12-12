"use client";

import styles from "@/app/LandingPage.module.css";

export const LandingFooter = () => (
  <footer className={styles.Landing_footer}>
    © {new Date().getFullYear()} FreightReader.io. All rights reserved.
  </footer>
);
