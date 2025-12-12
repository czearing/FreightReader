"use client";

import { useRouter } from "next/navigation";

import styles from "@/app/LandingPage.module.css";

export const LandingHeader = () => {
  const router = useRouter();
  const handleLogin = () => router.push("/auth");

  return (
    <header className={styles.Landing_header}>
      <div className={styles.Landing_logo}>FreightReader.io</div>
      <button onClick={handleLogin} className={styles.Landing_loginBtn}>
        Log In
      </button>
    </header>
  );
};
