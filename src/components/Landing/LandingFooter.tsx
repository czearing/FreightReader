import styles from "@/app/marketing/LandingPage.module.css";

export const LandingFooter = () => (
  <footer className={styles.Landing_footer}>
    © {new Date().getFullYear()} FreightReader.io. All rights reserved.
  </footer>
);
