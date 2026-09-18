import { Building2 } from "lucide-react";
import { useState } from "react";
import type { Theme } from "../../../../app/contexts/theme.context";
import type { CompanyBranding } from "../../types/company.types";
import styles from "./CompanyLogo.module.css";

interface CompanyLogoProps {
  company?: CompanyBranding;
  theme: Theme;
}

export function CompanyLogo({ company, theme }: CompanyLogoProps) {
  const source =
    theme === "dark"
      ? company?.darkLogoUrl || company?.logoUrl
      : company?.logoUrl;

  return (
    <LogoImage
      key={`${company?.id ?? "unassigned"}:${source ?? "none"}`}
      source={source}
      name={company?.name ?? "CATiH NOC"}
      demo={company?.isDemoImage}
      darkVariant={theme === "dark" && Boolean(company?.darkLogoUrl)}
    />
  );
}

function LogoImage({
  source,
  name,
  demo,
  darkVariant,
}: {
  source?: string;
  name: string;
  demo?: boolean;
  darkVariant: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={styles.frame} data-dark-variant={darkVariant}>
      {source && !failed ? (
        <img
          className={styles.image}
          src={source}
          alt={demo ? `Imagen de prueba para ${name}` : `Logo de ${name}`}
          onError={() => setFailed(true)}
        />
      ) : (
        <Building2
          className={styles.fallback}
          aria-label={`Empresa: ${name}`}
          role="img"
        />
      )}
    </div>
  );
}
