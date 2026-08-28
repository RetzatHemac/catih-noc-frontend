import type { ReactNode } from "react";

import styles from "./DataTable.module.css";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  mobileLabel?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (item: T) => string;
  emptyLabel?: string;
  actions?: (item: T) => ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  emptyLabel = "Sin registros",
  actions,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <div className={styles.empty}>{emptyLabel}</div>;
  }

  return (
    <>
      <div className={styles.desktopWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.header}</th>
              ))}

              {actions && <th className={styles.actionsHeader}>Acciones</th>}
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={getRowId(item)}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render(item)}</td>
                ))}

                {actions && (
                  <td className={styles.actionsCell}>{actions(item)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.mobileList}>
        {data.map((item) => (
          <article key={getRowId(item)} className={styles.card}>
            <div className={styles.cardContent}>
              {columns.map((column) => (
                <div key={column.key} className={styles.cardField}>
                  <span className={styles.cardLabel}>
                    {column.mobileLabel ?? column.header}
                  </span>

                  <div className={styles.cardValue}>{column.render(item)}</div>
                </div>
              ))}
            </div>

            {actions && (
              <div className={styles.cardActions}>{actions(item)}</div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
