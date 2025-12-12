import Link from "next/link";

import styles from "@/app/LandingPage.module.css";

export const LandingHeader = () => (
  <header className={styles.Landing_header}>
    <div className={styles.Landing_logo}>FreightReader.io</div>
    <Link href="/auth" className={styles.Landing_loginBtn}>
      Log In
    </Link>
  </header>
);
