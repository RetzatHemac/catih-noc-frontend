import styles from "./DashboardPage.module.css";
import { useId } from "react";
import { useAuth } from "../auth";
import { CompanyLogo } from "../features/companies/components/CompanyLogo/CompanyLogo";
import { useTheme } from "../app/hooks/useTheme";

export function DashboardPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const titleId = useId();
  return (
    <section className={styles.page} aria-labelledby={titleId}>
      <div className={styles.welcome}>
        {/* <p className={styles.eyebrow}>CATiH NOC</p> */}

        <h2 id={titleId} className={styles.title}>
          Bienvenido al Centro de Atención en Tecnologías de la Información
          Hemac
        </h2>
        <div className={styles.company}>
          <CompanyLogo company={user.company} theme={theme} />
          {user.company && (
            <p className={styles.companyName}>{user.company.name}</p>
          )}
        </div>
      </div>
    </section>
  );
}
