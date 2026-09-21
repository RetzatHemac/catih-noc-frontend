# Guía de integración con backend

Esta guía identifica los puntos que el equipo backend deberá sustituir o conectar sin cambiar la composición visual.

## Principio de integración

### Descripciones de imágenes

La galería entrega `onEditDescription(imageId, description)` al guardar; permite una descripción vacía y elimina espacios exteriores. El detalle actualiza el grupo correspondiente en memoria y conserva los demás datos de la imagen. La política provisional reutiliza `ticket.images.view` + `ticket.edit`, separada del permiso para eliminar. El contrato definitivo deberá acordar permiso, longitud máxima y operación remota, validar pertenencia de la imagen al ticket/empresa y devolver la descripción persistida. No hay petición remota ni persistencia implementada.

### Empresa de la sesión

El adaptador de sesión puede proporcionar `AuthUser.company` con `{ id, name, logoUrl?, darkLogoUrl? }`. La empresa debe proceder de la asignación autenticada; no se deduce del correo ni del rol. Las URLs deben apuntar a imágenes oficiales autorizadas. La variante oscura es opcional: sin ella se muestra el logo normal sobre un fondo gris. Si no hay imagen o falla, se muestra un símbolo neutro.

Actualmente Hemac usa una imagen local de prueba con `isDemoImage: true`. Al sustituirla por el logo oficial se retira esa marca. No hay un catálogo ficticio de 30 empresas ni conexión remota; la misma vista consume cualquier empresa suministrada por la sesión.

### Permisos y herramientas sobre la lista

`effectivePermissions` presente sustituye los permisos mock por rol/overrides; una lista vacía no concede permisos. El adaptador real deberá proporcionar siempre la lista efectiva, incluso vacía. La ausencia del campo conserva únicamente el comportamiento de desarrollo.

Las herramientas pendientes del menú reciben `TicketListToolsContext` con filtros e IDs de resultados locales. Al incorporar paginación remota, backend deberá resolver el conjunto completo según filtros y alcance autorizado; los IDs de la página no representan necesariamente todos los resultados. No hay endpoints ni permisos definitivos para estas herramientas y continúan deshabilitadas. La visibilidad frontend no sustituye la autorización backend.

Los tipos actuales describen las necesidades de la interfaz, pero no son todavía un contrato oficial de API. Antes de conectar servicios se debe acordar OpenAPI o un contrato equivalente para requests, respuestas, errores y permisos.

El frontend puede validar para mejorar la experiencia. El backend debe validar nuevamente todos los datos y permisos.

## Fuentes mock que deben reemplazarse

| Fuente actual                                     | Sustitución esperada                                                 |
| ------------------------------------------------- | -------------------------------------------------------------------- |
| `config/mockTickets.ts`                           | Consulta paginada y filtrada de tickets.                             |
| `mocks/ticketDetail.mock.ts`                      | Consulta del detalle por identificador.                              |
| `mocks/createTicket.mock.ts`                      | Catálogos de proyectos, sitios, categorías, tipos y clasificaciones. |
| `auth/mockUser.ts`                                | Sesión autenticada y permisos efectivos del usuario.                 |
| `config/inventoryOptions.ts`                      | Catálogos de series, marcas, modelos y observaciones.                |
| `config/pauseOptions.ts`                          | Dependencias y motivos de pausa.                                     |
| `config/scheduleOptions.ts`                       | Usuarios/proveedores disponibles para agenda.                        |
| `features/crews/mocks/releasableCrews.mock.ts`    | Cuadrillas pendientes de liberación.                                 |
| `mocks/pendingTicketNotifications.mock.ts`        | Notificaciones no leídas de tickets pendientes.                      |
| `TicketWorkspaceProvider`                         | Mutaciones remotas y actualización de caché.                         |
| `downloadTicketReport.ts`                         | Descargas generadas por backend o servicio oficial de reportes.      |
| `features/projects/mocks/projects.mock.ts`        | Consulta paginada y filtrada de proyectos.                           |
| `downloadProjectsReport.ts`                       | Reporte oficial de proyectos en formato Excel.                       |
| `features/sites/mocks/sites.mock.ts`              | Sitios, direccionamientos, inventario e imágenes por proyecto.       |
| `features/sites/utils/siteDownloads.ts`           | Reportes, protocolos y archivos ZIP provisionales de sitios.         |
| `features/tagging/mocks/taggedEquipment.mock.ts`  | Equipos y metadatos temporales de etiquetado.                        |
| `features/tagging/utils/downloadTaggingLayout.ts` | Layout provisional compatible con Excel.                             |

## Operaciones requeridas

Los paths son propuestas para alinear conversaciones; backend debe confirmarlos en el contrato oficial.

### Consultas

- `GET /tickets`: filtros, búsqueda, cola y paginación.
- `GET /tickets/{ticketId}`: detalle completo o composición de recursos.
- `GET /tickets/{ticketId}/messages`: chat y adjuntos.
- `GET /tickets/{ticketId}/notes`: notas internas.
- `GET /catalogs/...`: proyectos, sitios, categorías, equipos, motivos y usuarios.
- `GET /me`: usuario, rol y permisos efectivos.
- `GET /notifications/pending-tickets`: cantidad y tickets pendientes no leídos.
- `GET /projects`: búsqueda por nombre, nombre corto, cliente o id; estado y paginación.
- `GET /projects/{projectId}`: información completa para edición.
- `GET /catalogs/projects/...`: SLA, contratos, departamentos, clientes y administradores.
- `GET /projects/{projectId}/sites`: sitios paginados y filtrados por nombre o municipio.
- `GET /sites/{siteId}`: información completa del sitio.
- `GET /sites/{siteId}/addressing`: direccionamientos y accesos autorizados.
- `GET /sites/{siteId}/inventory`: estado, cuadrilla, equipos e imágenes de inventario.
- `GET /tagging/equipment`: equipos paginados y filtrados por proyecto, nombre corto o empresa.

### Mutaciones de proyectos

- Crear, editar y eliminar proyectos.
- Crear implementaciones.
- Descargar el reporte de proyectos con los filtros autorizados.

### Mutaciones de sitios

- Editar o eliminar un sitio.
- Crear, editar o eliminar un direccionamiento.
- Cambiar el estado o la cuadrilla del inventario y marcar el sitio inaccesible o accesible.
- Concluir reemplazos cuando se defina su regla de negocio.
- Descargar sitios del proyecto, protocolo, imágenes generales e imágenes de reemplazo.

### Mutaciones de etiquetado

- Editar dimensiones, color y descripción de un equipo mediante su identificador estable.
- Generar el layout oficial de etiquetado respetando filtros y permisos efectivos.

### Mutaciones del ticket

- Crear, editar, iniciar, pausar, cerrar, duplicar o eliminar ticket.
- Editar sitio y cambiar dirección/coordenadas.
- Asignar o retirar proveedor.
- Crear, editar o eliminar actividades remotas y en sitio.
- Subir o eliminar imágenes por categoría.
- Crear o eliminar reemplazos e intervenciones.
- Validar materiales.
- Crear relaciones padre/hijo.
- Agendar visita.
- Crear mensajes y notas.
- Liberar una cuadrilla mediante su identificador estable.
- Marcar una notificación de ticket como leída al abrir su detalle, para usuarios con permiso de consulta de pendientes. El botón Pendientes conserva el contador y solo desplaza al inicio de la lista del Sidebar.
- Solicitar cada tipo de reporte.

## Contratos que deben conservarse o mapearse

El detalle visual se basa en `TicketDetail` y sus contratos asociados dentro de `src/features/tickets/types/ticketDetail.types.ts`.

Puntos que requieren acuerdo explícito:

- Unificar el formato de estados. La lista usa valores como `in-progress`; el detalle usa `EN_PROCESO`.
- Definir fechas en ISO 8601 con zona horaria. Actualmente hay cadenas mock en más de un formato.
- Confirmar si `id` e `identifier` son campos distintos.
- Definir paginación para actividades, chat, notas, imágenes y relaciones.
- Definir catálogos por ID estable; la UI no debe tomar decisiones usando etiquetas.
- Acordar límites, MIME permitidos y estrategia de subida de imágenes/videos.
- Definir qué acciones son válidas en cada estado del ticket.
- Entregar permisos efectivos o una matriz versionada que coincida con backend.
- Definir si los accesos de direccionamiento se entregan completos bajo autorización específica o mediante una operación temporal de revelado.

## Errores

Formato recomendado:

```json
{
  "error": {
    "code": "TICKET_ALREADY_CLOSED",
    "message": "El ticket ya fue cerrado",
    "requestId": "abc123"
  }
}
```

La UI debe usar `code` para el flujo y mostrar `message` solo si está redactado para usuario final. `requestId` debe conservarse para soporte. Nunca se debe decidir lógica a partir del texto del mensaje.

## Archivos y adjuntos

- Validar extensión, MIME y contenido real en servidor.
- Definir límites de tamaño y cantidad por operación.
- Usar URLs firmadas o un flujo de subida acordado si aplica.
- No confiar en el nombre enviado por el navegador.
- Escanear archivos antes de publicarlos.
- Devolver identificador, tipo, nombre seguro, URL y metadatos necesarios.

Las contraseñas de direccionamiento se muestran como texto en esta fase mock para permitir su consulta y edición. Al integrar el backend se debe confirmar expresamente esta regla con seguridad, evitar registrarlas en logs y aplicar permisos específicos y auditoría para cualquier consulta o cambio.

## Estrategia sugerida de conexión

1. Congelar contratos de lectura de lista y detalle.
2. Crear un cliente HTTP central con manejo uniforme de sesión y errores.
3. Implementar adaptadores que conviertan DTO de API a modelos de UI cuando difieran.
4. Conectar primero consultas sin retirar los mocks.
5. Conectar mutaciones una por una y actualizar caché tras éxito.
6. Incorporar loading, empty, error y retry donde corresponda.
7. Validar permisos tanto en UI como en cada endpoint.
8. Retirar cada mock solamente cuando su flujo remoto tenga pruebas.

## Criterios para considerar integrado un flujo

- Contrato versionado y revisado por frontend/backend.
- Estados loading, error, vacío y éxito cubiertos.
- Error 401 y 403 manejado.
- Permiso validado en servidor.
- Prueba del caso exitoso y del error esperado.
- Sin datos sensibles en logs o almacenamiento local.
- Sin dependencia residual del mock para ese flujo.
