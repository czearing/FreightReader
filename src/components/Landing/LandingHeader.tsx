import Link from "next/link";

import { FreightReaderLogo } from "@/components/FreightReaderLogo/FreightReaderLogo";
import styles from "@/app/marketing/LandingPage.module.css";

export const LandingHeader = () => (
  <header className={styles.Landing_header}>
    <div className={styles.Landing_logoGroup}>
      <FreightReaderLogo
        className={styles.Landing_logoMark}
        variant="duotone"
        color="var(--brand-solid)"
      />
      <div className={styles.Landing_logo}>FreightReader.io</div>
    </div>
    <Link href="/auth" className={styles.Landing_loginBtnPrimary}>
      Log In
    </Link>
  </header>
);
