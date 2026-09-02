import styles from "./DashboardPage.module.css";

import { useTheme } from "../app/hooks/useTheme";

export function DashboardPage() {
  const { theme, toggleTheme } = useTheme();
  return (
    <section className={styles.page}>
      <div>
        <p className={styles.eyebrow}>CATiH NOC</p>

        <h1>Tickets</h1>

        <p className={styles.description}>
          Espacio de trabajo para la gestión y seguimiento de tickets.
        </p>
        <button type="button" onClick={toggleTheme}>
          {theme === "light" ? "Cambiar a oscuro" : "Cambiar a claro"}
        </button>
      </div>
    </section>
  );
}
