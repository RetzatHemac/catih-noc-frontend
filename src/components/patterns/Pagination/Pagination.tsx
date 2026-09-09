import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useId, type FormEvent } from "react";

import { Button } from "../../ui/Button/Button";
import { Input } from "../../ui/Input/Input";

import styles from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const pageInputId = useId();

  function commitPage(input: HTMLInputElement) {
    const requestedPage = Number(input.value);

    if (
      Number.isInteger(requestedPage) &&
      requestedPage >= 1 &&
      requestedPage <= safeTotalPages
    ) {
      onPageChange(requestedPage);
      input.value = String(requestedPage);
      return;
    }

    input.value = String(page);
  }

  function submitPage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("page");

    if (input instanceof HTMLInputElement) commitPage(input);
  }

  return (
    <nav className={styles.pagination} aria-label="Paginación de resultados">
      <span className={styles.summary}>
        Página <strong>{page}</strong> de <strong>{safeTotalPages}</strong>
      </span>

      <div className={styles.controls}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          aria-label="Ir a la primera página"
          title="Primera página"
        >
          <ChevronsLeft size={17} aria-hidden="true" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Ir a la página anterior"
          title="Página anterior"
        >
          <ChevronLeft size={17} aria-hidden="true" />
        </Button>

        <form className={styles.pageForm} onSubmit={submitPage}>
          <label htmlFor={pageInputId}>Página</label>
          <Input
            id={pageInputId}
            type="number"
            min={1}
            max={safeTotalPages}
            step={1}
            inputMode="numeric"
            name="page"
            defaultValue={page}
            key={page}
            onBlur={(event) => commitPage(event.currentTarget)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              commitPage(event.currentTarget);
            }}
          />
        </form>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === safeTotalPages}
          aria-label="Ir a la página siguiente"
          title="Página siguiente"
        >
          <ChevronRight size={17} aria-hidden="true" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(safeTotalPages)}
          disabled={page === safeTotalPages}
          aria-label="Ir a la última página"
          title="Última página"
        >
          <ChevronsRight size={17} aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
