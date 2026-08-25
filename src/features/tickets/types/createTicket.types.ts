export interface SelectOption {
  value: string;
  label: string;
}

export interface SiteOption extends SelectOption {
  code?: string;
}

export interface CreateTicketFormData {
  projectId: string;
  siteId: string;
  categoryId: string;
  description: string;
  images: File[];
  ticketTypeId: string;
  classificationId: string;
}

export interface CreateTicketFormErrors {
  projectId?: string;
  siteId?: string;
  categoryId?: string;
  description?: string;
  ticketTypeId?: string;
  classificationId?: string;
}

export interface CreateSiteFormData {
  projectId: string;
  code: string;
  name: string;
  address: string;
  municipality: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
}
