import { Plus, Search } from "lucide-react";

import styles from "./SidebarHeader.module.css";

import { useNavigate } from "react-router-dom";

export function SidebarHeader() {
  const navigate = useNavigate();

  function handleCreateTicket() {
    navigate("/tickets/new");
  }
  return (
    <header className={styles.header}>
      {/* <div className={styles.brand}>
        <div className={styles.logo}>C</div>

        <div>
          <strong>CATiH</strong>
          <span>NOC</span>
        </div>
      </div> */}

      <div className={styles.searchRow}>
        <label className={styles.search}>
          <Search size={18} aria-hidden="true" />

          <input
            type="search"
            placeholder="Buscar ticket..."
            aria-label="Buscar ticket"
          />
        </label>

        <button
          type="button"
          className={styles.createButton}
          aria-label="Crear ticket"
          title="Crear ticket"
          onClick={handleCreateTicket}
        >
          <Plus size={20} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
