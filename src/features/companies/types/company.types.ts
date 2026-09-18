/** Branding supplied by the authenticated session adapter. */
export interface CompanyBranding {
  id: string;
  name: string;
  logoUrl?: string;
  darkLogoUrl?: string;
  /** Only for temporary mock imagery. */
  isDemoImage?: boolean;
}
