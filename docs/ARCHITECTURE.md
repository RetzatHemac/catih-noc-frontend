# Arquitectura del frontend

Última actualización: 8 de septiembre de 2026.

## Objetivo

Mantener una interfaz modular que pueda desarrollarse y probarse con mocks, sin acoplar los componentes visuales al mecanismo definitivo de persistencia.

## Capas

| Capa               | Responsabilidad                                                       | Ubicación                  |
| ------------------ | --------------------------------------------------------------------- | -------------------------- |
| Aplicación         | Composición de providers, rutas y navegación responsive.              | `src/app/`                 |
| Autorización UX    | Roles, permisos, usuario activo y evaluación de capacidades.          | `src/auth/`                |
| Layout             | Distribución del Sidebar, Taskbar y panel de detalle.                 | `src/components/layout/`   |
| UI                 | Controles visuales sin conocimiento del negocio.                      | `src/components/ui/`       |
| Patrones           | Composiciones reutilizables como tablas, galerías y campos editables. | `src/components/patterns/` |
| Feature tickets    | Tipos, mocks, políticas, estado y casos de uso visuales de tickets.   | `src/features/tickets/`    |
| Feature proyectos  | Tabla, formularios, filtros, mocks y reporte local de proyectos.      | `src/features/projects/`   |
| Feature sitios     | Sitios por proyecto, direccionamientos, inventario y descargas.       | `src/features/sites/`      |
| Feature etiquetado | Tabla, edición mock y generación de layout para Excel.                | `src/features/tagging/`    |
| Páginas            | Entrada de cada ruta.                                                 | `src/pages/`               |

## Flujo del ticket activo

```text
URL /tickets/:ticketId
        ↓
getMockTicketDetail(ticketId)
        ↓
TicketWorkspaceProvider
        ↓
TicketDetail + TaskbarActionDialog
        ↓
updateTicket(actualizador inmutable)
        ↓
La interfaz refleja el cambio en memoria
```

`TicketWorkspaceProvider` es actualmente la fuente única del detalle visible. Se crea con una clave por `ticketId`; por eso cada cambio de ticket inicia un workspace nuevo a partir del mock.

La selección del Sidebar se deriva de la URL mediante `NavLink`. No debe mantenerse otra copia de ese estado en componentes locales.

## Estado global y local

- `AuthProvider`: expone el usuario mock.
- `ThemeProvider`: administra tema claro/oscuro.
- `NavigationProvider`: decide qué paneles se muestran según ruta y viewport.
- `TicketWorkspaceProvider`: mantiene el ticket activo y el mensaje de retroalimentación.
- `PendingNotificationsProvider`: comparte el estado leído/no leído entre el Sidebar y la vista de pendientes.
- Estado local: borradores de formularios, filtros, pestañas y apertura de modales.
- `Pagination` y `DataTable` son patrones compartidos para las vistas tabulares.
- Las galerías del inventario de sitio se despliegan dentro del mismo modal para conservar el contexto y evitar navegación adicional.

No se usa Redux, Zustand ni una biblioteca de servidor/caché porque todavía no existe integración remota. Al conectar la API se deberá evaluar TanStack Query o una alternativa aprobada, evitando trasladar datos del servidor a Context sin necesidad.

## Autorización en la interfaz

La autorización visual se divide en tres piezas:

1. `ROLE_PERMISSIONS` define los permisos base de cada rol.
2. `permissionOverrides` permite conceder o negar permisos a un usuario concreto.
3. Las políticas convierten permisos y estado del ticket en capacidades que consume la UI.

Políticas actuales:

- `getTicketDetailCapabilities`: edición, imágenes, materiales, proveedor y acciones del detalle.
- `getVisibleTaskbarActions`: visibilidad de acciones contextuales.
- `canViewPendingTickets`: acceso a notificaciones de tickets por iniciar.
- El Taskbar completo se oculta cuando el ticket está `ASIGNADO`.
- Iniciar ticket requiere `ticket.start` y estado `ASIGNADO`.

Los componentes no deben comparar nombres de roles directamente. Deben consultar permisos o capacidades derivadas.

## Taskbar

`taskbarActions.ts` es el catálogo central de acciones. Cada entrada define identificador, etiqueta, icono, permiso y restricciones por estado. `TaskbarActionDialog` traduce la acción seleccionada a un diálogo especializado y actualiza el workspace mock.

| Acción       | Resultado actual                                               |
| ------------ | -------------------------------------------------------------- |
| Chat         | Agrega mensajes y adjuntos en memoria.                         |
| Notas        | Agrega comentarios internos en memoria.                        |
| Imágenes     | Agrega imágenes a uno de seis grupos.                          |
| Actividades  | Registra actividad remota o en sitio.                          |
| Inventario   | Registra equipo dañado y reemplazo.                            |
| Intervención | Registra equipo intervenido.                                   |
| Pausa        | Cambia el estado y registra dependencia, motivo y detalle.     |
| Agenda       | Asigna usuario proveedor y fecha.                              |
| Padres       | Relaciona tickets padre o hijo.                                |
| Duplicar     | Simula la confirmación; todavía no crea un ticket persistente. |
| Cerrar       | Cambia el ticket activo a `CERRADO`.                           |
| Reportes     | Genera archivos TXT o CSV provisionales en el navegador.       |

## Sistema visual

- Mobile-first; el breakpoint estructural principal es `768px`.
- CSS Modules para aislamiento por componente.
- Tokens semánticos para color, espacio, tipografía, radios y sombras.
- Tema mediante `data-theme="light|dark"`.
- El archivo global activo importa actualmente `tokens7.css` y `themes7.css`.

Los archivos `tokens.css`, `tokens1.css` a `tokens6.css` y sus equivalentes de tema no están activos. Antes de producción conviene consolidar la variante aprobada y retirar o archivar las demás para evitar ediciones en el archivo equivocado.

## Accesibilidad

- Controles con nombre accesible y estados ARIA cuando aplican.
- Modales con bloqueo y restauración de foco, cierre con `Escape` y focus trap.
- Pestañas de imágenes navegables por teclado.
- Foco visible global.
- Áreas táctiles de al menos 44 px en acciones principales.
- Respeto a `prefers-reduced-motion`.

## Pruebas

Vitest se ejecuta sobre `jsdom` y Testing Library prueba el comportamiento observable. La cobertura existente prioriza permisos, filtros, modales, campos editables, galerías, tablas y acciones críticas del Taskbar.

Los cambios en permisos deben incluir al menos:

- caso permitido;
- caso denegado;
- restricción por estado cuando exista;
- actualización visual esperada.

## Convenciones para extender una feature

1. Definir o actualizar primero el contrato en `types/`.
2. Aislar catálogos temporales en `config/` o datos de ejemplo en `mocks/`.
3. Mantener lógica de acceso en `policies/`.
4. Usar primitivas de `components/ui/` antes de crear controles nuevos.
5. Implementar el componente dentro de su feature.
6. Agregar pruebas de comportamiento.
7. Ejecutar `npm run check`.
