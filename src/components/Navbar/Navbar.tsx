/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import cx from "clsx";
import { CreditCard, LogOut, Palette, Settings } from "lucide-react";

import styles from "./Navbar.module.css";
import type { NavbarProps } from "./Navbar.types";
import { AccountDialog } from "../AccountDialog/AccountDialog";
import { BillingDialog } from "../BillingDialog/BillingDialog";
import { FreightReaderLogo } from "../FreightReaderLogo/FreightReaderLogo";
import { PreferencesDialog } from "../PreferencesDialog/PreferencesDialog";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((segment) => segment[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

export const Navbar = ({
  user,
  stats,
  settings,
  updateSettings,
  onUpdateProfile,
  onSignOut,
}: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isLogoHover, setIsLogoHover] = useState(false);

  const remainingDocs = useMemo(
    () => Math.max(0, stats.limit - stats.used),
    [stats.limit, stats.used]
  );

  const toggleMenu = () => setIsMenuOpen((open) => !open);
  const closeMenu = () => setIsMenuOpen(false);

  const handlePreferencesClick = () => {
    closeMenu();
    setIsPreferencesOpen(true);
  };

  const handleAccountClick = () => {
    closeMenu();
    setIsAccountOpen(true);
  };

  const handleBillingClick = () => {
    closeMenu();
    setIsBillingOpen(true);
  };

  const avatarFallback = getInitials(user.name);
  const usageCountClassName = cx(
    styles.Navbar_usageCount,
    stats.used >= stats.limit && styles.Navbar_usageCountWarning
  );
  const avatarTriggerClassName = cx(
    styles.Navbar_avatarTrigger,
    isMenuOpen && styles.Navbar_avatarTriggerActive
  );

  return (
    <>
      <nav className={styles.Navbar_nav}>
        <div className={styles.Navbar_logoArea}>
          <FreightReaderLogo
            className={styles.Navbar_logoMark}
            variant="duotone"
            color="var(--brand-solid)"
            onMouseEnter={() => setIsLogoHover(true)}
            onMouseLeave={() => setIsLogoHover(false)}
          />
          <span className={styles.Navbar_logoText}>FreightReader.io</span>
        </div>

        <div className={styles.Navbar_rightActions}>
          <div className={styles.Navbar_usageIndicator}>
            <span className={usageCountClassName}>
              {stats.used} / {stats.limit}
            </span>
            <span className={styles.Navbar_usageLabel}>Docs Used</span>
            {stats.used >= stats.limit && (
              <span className={styles.Navbar_planBadge}>Free Plan</span>
            )}
          </div>

          <button className={styles.Navbar_upgradeButton} type="button">
            <CreditCard size={16} aria-hidden />
            Upgrade Plan
          </button>

          <div className={styles.Navbar_userMenuWrapper}>
            <button
              type="button"
              onClick={toggleMenu}
              className={avatarTriggerClassName}
              title="User Menu"
              aria-expanded={isMenuOpen}
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className={styles.Navbar_avatarImage}
                />
              ) : (
                <div className={styles.Navbar_avatarFallback}>
                  {avatarFallback}
                </div>
              )}
            </button>

            {isMenuOpen && (
              <>
                <div
                  className={styles.Navbar_dropdownOverlay}
                  onClick={closeMenu}
                />
                <div className={styles.Navbar_dropdownMenu}>
                  <div className={styles.Navbar_dropdownHeader}>
                    <div className={styles.Navbar_userName}>{user.name}</div>
                    <div className={styles.Navbar_userEmail}>{user.email}</div>
                    <div className={styles.Navbar_userPlan}>
                      {user.plan} • {remainingDocs} docs left
                    </div>
                  </div>

                  <div className={styles.Navbar_dropdownSeparator} />

                  <button
                    type="button"
                    className={styles.Navbar_menuItem}
                    onClick={handleAccountClick}
                  >
                    <Settings
                      size={16}
                      className={styles.Navbar_menuIcon}
                      aria-hidden
                    />
                    Account Settings
                  </button>
                  <button
                    type="button"
                    className={styles.Navbar_menuItem}
                    onClick={handleBillingClick}
                  >
                    <CreditCard
                      size={16}
                      className={styles.Navbar_menuIcon}
                      aria-hidden
                    />
                    Billing &amp; Plan
                  </button>
                  <button
                    type="button"
                    className={styles.Navbar_menuItem}
                    onClick={handlePreferencesClick}
                  >
                    <Palette
                      size={16}
                      className={styles.Navbar_menuIcon}
                      aria-hidden
                    />
                    Preferences
                  </button>

                  <div className={styles.Navbar_dropdownSeparator} />

                  <button
                    type="button"
                    className={cx(
                      styles.Navbar_menuItem,
                      styles.Navbar_menuItemDanger
                    )}
                    onClick={() => {
                      closeMenu();
                      onSignOut();
                    }}
                  >
                    <LogOut
                      size={16}
                      className={styles.Navbar_menuIcon}
                      aria-hidden
                    />
                    Log Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      <PreferencesDialog
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        currentSettings={settings}
        onSave={updateSettings}
      />

      <AccountDialog
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        user={user}
        stats={stats}
        onSave={onUpdateProfile}
      />

      <BillingDialog
        isOpen={isBillingOpen}
        onClose={() => setIsBillingOpen(false)}
        user={user}
        stats={stats}
      />
    </>
  );
};
