import axios from "axios";

/** Display validation messages as text; never expose raw server errors or HTML. */
export function getRequestErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error))
    return "Ocurrió un problema inesperado. Tus datos se conservan; intenta nuevamente.";
  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return "El servidor tardó demasiado en responder. No pudimos confirmar si el ticket se creó. Revisa la lista antes de volver a enviarlo para evitar duplicados.";
  }
  if (!error.response)
    return "No se pudo obtener respuesta del servidor. Revisa tu conexión. Tus datos se conservan; comprueba si el ticket se creó antes de volver a enviarlo.";
  const status = error.response.status;
  if (status === 401)
    return "Tu sesión venció o no está disponible. Vuelve a iniciar sesión antes de enviar el ticket.";
  if (status === 403)
    return "No tienes permiso para realizar esta operación. Solicita acceso al administrador.";
  if (status === 413)
    return "El servidor rechazó la carga por su tamaño. Reduce el tamaño de los archivos e inténtalo nuevamente.";
  if (status === 415)
    return "El servidor no admite el formato de uno de los archivos. Reemplázalo por un formato compatible.";
  if (status === 429)
    return "Se realizaron demasiadas solicitudes. Espera un momento antes de volver a intentarlo.";
  if (status >= 500)
    return "El servidor tuvo un problema. No pudimos confirmar la creación del ticket. Revisa la lista antes de volver a enviarlo.";
  if ([400, 409, 422].includes(status)) {
    const data: unknown = error.response.data;
    if (data && typeof data === "object" && "message" in data) {
      const message = data.message;
      const messages = (Array.isArray(message) ? message : [message])
        .filter(
          (item): item is string =>
            typeof item === "string" && item.trim().length > 0,
        )
        .map((item) => item.trim());
      if (
        messages.length &&
        messages.every((item) => item.length <= 1000 && !/[<>]/.test(item))
      ) {
        return messages.slice(0, 10).join("\n");
      }
    }
    return status === 409
      ? "La operación entra en conflicto con un registro existente. Revisa los datos antes de reintentar."
      : "Revisa los datos y archivos del ticket: el servidor encontró información no válida.";
  }
  return "No fue posible completar la solicitud. Tus datos se conservan; intenta nuevamente.";
}
