import { FileDown } from "lucide-react";

import { Button } from "../../../../components/ui/Button/Button";
import { Modal } from "../../../../components/ui/Modal/Modal";
import {
  TICKET_REPORT_GROUPS,
  type TicketReportId,
} from "../../config/reportOptions";

import styles from "./ReportsDialog.module.css";

interface ReportsDialogProps {
  onClose: () => void;
  onDownload: (reportId: TicketReportId) => void;
}

export function ReportsDialog({ onClose, onDownload }: ReportsDialogProps) {
  return (
    <Modal open title="Descargar reportes" onClose={onClose} size="lg">
      <div className={styles.groups}>
        {TICKET_REPORT_GROUPS.map((group) => (
          <section key={group.title} className={styles.group}>
            <h3>{group.title}</h3>
            <div className={styles.reports}>
              {group.reports.map((report) => (
                <Button
                  key={report.id}
                  variant="secondary"
                  className={styles.report}
                  onClick={() => onDownload(report.id)}
                >
                  <FileDown size={17} aria-hidden="true" />
                  {report.label}
                </Button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Modal>
  );
}
