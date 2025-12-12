"use client";

import React from "react";
import {
  ArrowRight,
  CheckCircle,
  Download,
  FileText,
  MoreHorizontal,
  Shield,
  UploadCloud,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

import styles from "./LandingPage.module.css";
import type { LandingPageProps } from "./LandingPage.types";

export function LandingPage({ onLogin }: LandingPageProps) {
  const router = useRouter();
  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      router.push("/auth");
    }
  };

  return (
    <div className={styles.Landing_container}>
      <header className={styles.Landing_header}>
        <div className={styles.Landing_logo}>FreightReader.io</div>
        <button onClick={handleLogin} className={styles.Landing_loginBtn}>
          Log In
        </button>
      </header>

      <main className={styles.Landing_main}>
        <div className={styles.Landing_hero}>
          <h1 className={styles.Landing_title}>
            Automate Your{" "}
            <span className={styles.Landing_titleHighlight}>Freight Docs</span>
          </h1>
          <p className={styles.Landing_subtitle}>
            Extract critical data from BOLs, PODs, and Rate Confirmations
            instantly using AI. Stop manual entry, start moving freight.
          </p>
          <button onClick={handleLogin} className={styles.Landing_ctaBtn}>
            Get Started for Free <ArrowRight width={20} height={20} />
          </button>

          <div className={styles.Landing_heroImageWrapper}>
            <div className={styles.Landing_previewTransformWrapper}>
              <div className={styles.Landing_previewWindow}>
                <div className={styles.Landing_previewHeader}>
                  <div className={styles.Landing_previewControls}>
                    <div
                      className={styles.Landing_previewDot}
                      style={{ backgroundColor: "#EF4444" }}
                    />
                    <div
                      className={styles.Landing_previewDot}
                      style={{ backgroundColor: "#F59E0B" }}
                    />
                    <div
                      className={styles.Landing_previewDot}
                      style={{ backgroundColor: "#10B981" }}
                    />
                  </div>
                  <div className={styles.Landing_previewAddressBar}>
                    app.freightreader.io/dashboard
                  </div>
                </div>

                <div className={styles.Landing_previewBody}>
                  <div className={styles.Landing_previewSidebar}>
                    <div className={styles.Landing_previewUploadBox}>
                      <div className={styles.Landing_previewIconCircle}>
                        <UploadCloud
                          width={20}
                          height={20}
                          style={{ color: "var(--brand-solid)" }}
                        />
                      </div>
                      <div className={styles.Landing_previewUploadText}>
                        <span>Drop BOLs here</span>
                        <span
                          className={`${styles.Landing_textSecondary} ${styles.Landing_textXs}`}
                        >
                          PDF, PNG, JPG
                        </span>
                      </div>
                    </div>

                    <div className={styles.Landing_previewStats}>
                      <div className={styles.Landing_previewStatItem}>
                        <span
                          className={`${styles.Landing_textSecondary} ${styles.Landing_textXs}`}
                        >
                          Monthly Usage
                        </span>
                        <div className={styles.Landing_previewProgress}>
                          <div
                            className={styles.Landing_previewProgressFill}
                            style={{ width: "65%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.Landing_previewMain}>
                    <div className={styles.Landing_previewTableHeader}>
                      <span>Recent Extractions</span>
                      <MoreHorizontal width={16} height={16} />
                    </div>

                    <div className={styles.Landing_previewRow}>
                      <div className={styles.Landing_previewFile}>
                        <FileText
                          width={16}
                          height={16}
                          className={styles.Landing_textBrand}
                        />
                        <div className={styles.Landing_flexCol}>
                          <span
                            className={`${styles.Landing_textPrimary} ${styles.Landing_fontMedium} ${styles.Landing_textXs}`}
                          >
                            BOL-7392_Coyote.pdf
                          </span>
                          <span
                            className={`${styles.Landing_textTertiary} ${styles.Landing_textXxs}`}
                          >
                            Just now
                          </span>
                        </div>
                      </div>
                      <div className={styles.Landing_previewData}>
                        <span
                          className={`${styles.Landing_textSecondary} ${styles.Landing_textXxs} ${styles.Landing_block}`}
                        >
                          SHPR:{" "}
                          <strong className={styles.Landing_textPrimary}>
                            Procter &amp; Gamble
                          </strong>
                        </span>
                        <span
                          className={`${styles.Landing_textSecondary} ${styles.Landing_textXxs} ${styles.Landing_block}`}
                        >
                          CNSG:{" "}
                          <strong className={styles.Landing_textPrimary}>
                            Walmart DC #6022
                          </strong>
                        </span>
                      </div>
                      <div className={styles.Landing_previewStatus}>
                        <span
                          className={`${styles.Landing_previewBadge} ${styles.success}`}
                        >
                          Done
                        </span>
                      </div>
                    </div>

                    <div className={styles.Landing_previewRow}>
                      <div className={styles.Landing_previewFile}>
                        <FileText
                          width={16}
                          height={16}
                          className={styles.Landing_textBrand}
                        />
                        <div className={styles.Landing_flexCol}>
                          <span
                            className={`${styles.Landing_textPrimary} ${styles.Landing_fontMedium} ${styles.Landing_textXs}`}
                          >
                            RateCon-XPO-99.pdf
                          </span>
                          <span
                            className={`${styles.Landing_textTertiary} ${styles.Landing_textXxs}`}
                          >
                            2 mins ago
                          </span>
                        </div>
                      </div>
                      <div className={styles.Landing_previewData}>
                        <span
                          className={`${styles.Landing_textSecondary} ${styles.Landing_textXxs} ${styles.Landing_block}`}
                        >
                          SHPR:{" "}
                          <strong className={styles.Landing_textPrimary}>
                            XPO Logistics
                          </strong>
                        </span>
                        <span
                          className={`${styles.Landing_textSecondary} ${styles.Landing_textXxs} ${styles.Landing_block}`}
                        >
                          CNSG:{" "}
                          <strong className={styles.Landing_textPrimary}>
                            Target Dist. Ctr
                          </strong>
                        </span>
                      </div>
                      <div className={styles.Landing_previewStatus}>
                        <span
                          className={`${styles.Landing_previewBadge} ${styles.success}`}
                        >
                          Done
                        </span>
                      </div>
                    </div>

                    <div className={styles.Landing_previewRow}>
                      <div className={styles.Landing_previewFile}>
                        <FileText
                          width={16}
                          height={16}
                          className={styles.Landing_textBrand}
                        />
                        <div className={styles.Landing_flexCol}>
                          <span
                            className={`${styles.Landing_textPrimary} ${styles.Landing_fontMedium} ${styles.Landing_textXs}`}
                          >
                            POD_JBHunt_442.jpg
                          </span>
                          <span
                            className={`${styles.Landing_textTertiary} ${styles.Landing_textXxs}`}
                          >
                            1 hour ago
                          </span>
                        </div>
                      </div>
                      <div className={styles.Landing_previewData}>
                        <span
                          className={`${styles.Landing_textSecondary} ${styles.Landing_textXxs} ${styles.Landing_block}`}
                        >
                          SHPR:{" "}
                          <strong className={styles.Landing_textPrimary}>
                            Georgia Pacific
                          </strong>
                        </span>
                        <span
                          className={`${styles.Landing_textSecondary} ${styles.Landing_textXxs} ${styles.Landing_block}`}
                        >
                          CNSG:{" "}
                          <strong className={styles.Landing_textPrimary}>
                            Costco Wholesale
                          </strong>
                        </span>
                      </div>
                      <div className={styles.Landing_previewStatus}>
                        <span
                          className={`${styles.Landing_previewBadge} ${styles.success}`}
                        >
                          Done
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.Landing_floatingCard}>
                <div className={styles.Landing_toastIconBox}>
                  <CheckCircle width={16} height={16} />
                </div>
                <div className={styles.Landing_toastContent}>
                  <p className={styles.Landing_toastTitle}>
                    Extraction Complete
                  </p>
                  <p className={styles.Landing_toastSubtitle}>
                    BOL-7392_Coyote.pdf
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.Landing_features}>
          <div className={styles.Landing_featureCard}>
            <div className={styles.Landing_featureIconBox}>
              <Zap width={24} height={24} />
            </div>
            <h3>AI-Powered Extraction</h3>
            <p>
              Our intelligent models instantly pull Shipper, Consignee, PRO#,
              and Weight from any PDF or image with high accuracy.
            </p>
          </div>
          <div className={styles.Landing_featureCard}>
            <div className={styles.Landing_featureIconBox}>
              <Download width={24} height={24} />
            </div>
            <h3>Instant Export</h3>
            <p>
              Download your data in clean CSV, JSON, or QuickBooks IIF formats
              ready for direct import into your TMS.
            </p>
          </div>
          <div className={styles.Landing_featureCard}>
            <div className={styles.Landing_featureIconBox}>
              <Shield width={24} height={24} />
            </div>
            <h3>Secure &amp; Private</h3>
            <p>
              Enterprise-grade security standards. Your documents are processed
              in isolation and are never used to train our models.
            </p>
          </div>
        </div>
      </main>

      <footer className={styles.Landing_footer}>
        © {new Date().getFullYear()} FreightReader.io. All rights reserved.
      </footer>
    </div>
  );
}
