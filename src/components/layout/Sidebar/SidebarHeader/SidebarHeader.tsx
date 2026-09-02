import { Plus, Search } from "lucide-react";

import styles from "./SidebarHeader.module.css";

import { useNavigate } from "react-router-dom";

interface SidebarHeaderProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export function SidebarHeader({
  searchQuery,
  onSearchQueryChange,
}: SidebarHeaderProps) {
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
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
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
