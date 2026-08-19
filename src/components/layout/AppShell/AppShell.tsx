import { Outlet } from "react-router-dom";

import styles from "./AppShell.module.css";

export function AppShell() {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.placeholder}>Sidebar</div>
      </aside>

      <aside className={styles.taskbar}>
        <div className={styles.placeholder}>Actions</div>
      </aside>

      <main className={styles.detail}>
        <Outlet />
      </main>
    </div>
  );
}
