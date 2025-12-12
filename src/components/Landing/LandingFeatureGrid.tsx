import styles from "@/app/LandingPage.module.css";
import type { Feature } from "./Landing.types";

interface LandingFeatureGridProps {
  features: Feature[];
}

export const LandingFeatureGrid = ({ features }: LandingFeatureGridProps) => (
  <section className={styles.Landing_features}>
    {features.map((feature) => (
      <article key={feature.title} className={styles.Landing_featureCard}>
        <div className={styles.Landing_featureIconBox}>{feature.icon}</div>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </article>
    ))}
  </section>
);
