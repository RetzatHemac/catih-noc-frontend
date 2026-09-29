import conectNest from "../../../app/contexts/conectNest";

import type { CreateTicketFormData } from "../types/createTicket.types";

export async function createTicket(data: CreateTicketFormData) {
  const formData = new FormData();

  formData.append("projectId", data.projectId);
  formData.append("siteId", data.siteId);
  formData.append("categoryId", data.categoryId);
  formData.append("ticketTypeId", data.ticketTypeId);
  formData.append("classificationId", data.classificationId);
  formData.append("description", data.description);

  if (data.images[0]) {
    formData.append("image", data.images[0]);
  }

  data.attachments.forEach((file) => {
    formData.append("attachments", file);
  });
  const response = await conectNest.post("/tickets", formData, {
    timeout: 120_000,
  });

  return response.data;
}
