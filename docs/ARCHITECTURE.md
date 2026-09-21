# Arquitectura del frontend

Última actualización: 21 de septiembre de 2026.

## Visibilidad del Sidebar en escritorio

Los encabezados del Sidebar, detalle y menú comparten `--workspace-header-height` (77 px). Las opciones principales del menú usan `--sidebar-menu-item-height` (56 px mínimo), iconos de 32 px y separación compacta; los controles táctiles mantienen al menos 44 px. Los textos del encabezado del detalle ocupan una línea por nivel y se abrevian visualmente con puntos suspensivos cuando falta espacio, conservando el texto completo en el DOM y en `title`.

`NavigationProvider` conserva en memoria la elección de ocultar/mostrar el Sidebar durante la navegación. `SidebarToggle` ofrece un control de 44 px en el encabezado del detalle, con etiqueta accesible, `aria-expanded` y `aria-controls`. El Sidebar se oculta con `display: none` sin desmontarse por esta acción, conservando filtros, menú y desplazamiento. La cuadrícula de `AppShell` libera su columna y mantiene la del Taskbar cuando corresponde. La visibilidad de los paneles se resuelve en el provider, sin sobrescrituras `!important` en desktop.

La preferencia sólo afecta a escritorio (desde 768 px); en móvil la ruta determina el panel visible. Al volver a escritorio se recupera la elección. Recargar restablece el Sidebar visible. Ocultar el panel no modifica rutas, permisos ni el ticket activo.

## Panel de filtros

El Sidebar vive fuera del `TicketWorkspaceProvider` identificado por ticket: cambiar de ticket reinicia únicamente el workspace del detalle, conservando búsqueda, filtros, panel abierto y desplazamiento del Sidebar.

Desde 768 px, `SidebarFilters` abre un panel no modal de 300 px a la derecha de la lista, con desplazamiento independiente, cierre explícito y Escape desde sus controles. El botón conserva su altura y muestra la cantidad de filtros activos; los valores siguen en `Sidebar` y cerrar el panel no los elimina. No se bloquea el foco ni la interacción con los tickets.

Desde 1280 px, la cuadrícula de `AppShell` reserva el espacio del panel para mantener visibles filtros, lista y detalle. Entre 768 y 1279 px se superpone sólo al área derecha, preservando la lista. En móvil conserva el acordeón. Abrir el menú u ocultar el Sidebar oculta también sus filtros y libera la columna adicional; al regresar se mantiene la selección. No hay duplicación de controles ni cambios de permisos o consulta.

## Galerías de imágenes

`ImageGallery` conserva el carrusel y abre `ImageViewerDialog` al activar la imagen principal (clic, Enter o Espacio). El visor reutiliza `Modal`, contiene la imagen sin deformarla y muestra su descripción. El patrón también funciona dentro del inventario: sólo el modal superior procesa Escape y la navegación de foco.

El callback opcional `onEditDescription` habilita un lápiz junto a eliminar. `ImageDescriptionDialog` mantiene un borrador independiente, permite cancelar y entrega el ID y la descripción al propietario de los datos. Editar y eliminar son capacidades independientes. En tickets, `canEditImageDescriptions` requiere `ticket.images.view` y `ticket.edit`; el handler también valida la capacidad. La actualización inmutable ocurre en `TicketWorkspaceProvider`, tanto en imágenes del problema como en los seis grupos. El inventario mantiene sus imágenes de sólo lectura, con acceso al visor.

## Encabezado interno del ticket

El encabezado interno del ticket usa espaciado compacto y una consulta de contenedor: desde 640 px de ancho disponible reúne título, copiado y acciones en una fila; en espacios menores se distribuye en varias filas. Esto permite adaptarse al Sidebar ocultable sin fijar alturas ni recortar el nombre del sitio. Sus botones mantienen un mínimo de 44 px.

## Bienvenida por empresa

`DashboardPage` compone la bienvenida del detalle inicial (`/`). La ruta `/welcome`, accesible desde Inicio en el menú, muestra la misma pantalla en móvil con regreso a la lista. La entrada móvil conserva el Sidebar.

`AuthUser.company` contiene `CompanyBranding` (identificador, nombre, logo y variante oscura opcional). `CompanyLogo`, en `features/companies`, resuelve la imagen por tema, mantiene su proporción y ofrece un respaldo si falta o falla. Un cambio de empresa o URL reinicia el estado de error. Una sola pantalla sirve para todas las empresas, sin condiciones por rol ni inferencias desde el correo.

El usuario mock Hemac utiliza temporalmente una imagen de prueba existente, indicada mediante `isDemoImage`. Los logos oficiales están pendientes. Los estilos son CSS Modules con tokens compartidos y enfoque mobile first.

## Preparación de herramientas y permisos efectivos

Las herramientas de la lista viven en `TicketListTools`, dentro del menú. Reciben una instantánea de los mismos filtros e identificadores que alimentan la lista. Las cuatro herramientas permanecen deshabilitadas; sus permisos pendientes (`null`) sólo permiten previsualización con la sesión mock, sin permisos efectivos recibidos.

Cuando existe `AuthUser.effectivePermissions`, esa lista es la autoridad para la UI (incluido `[]`); si no existe, se conserva el cálculo mock por rol y overrides. El Taskbar comparte la política entre visibilidad, ejecución y diálogos. Los catálogos provisionales también validan su permiso al entrar por URL. La matriz definitiva y la autorización del servidor siguen pendientes.

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
- `PendingNotificationsProvider`: comparte el estado leído/no leído entre el contador del Sidebar y el detalle del ticket. `TicketDetailPage` marca las notificaciones del ticket abierto como leídas cuando el usuario tiene permiso para consultar pendientes.
- El botón Pendientes desplaza y enfoca el inicio de la lista del Sidebar, conservando filtros y ruta actual. No abre una pantalla en el panel de detalle.
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

## Menú del Sidebar

- `Sidebar` conserva búsqueda, filtros y desplazamiento mientras muestra un panel del mismo ancho sobre su área de contenido. El footer permanece visible y el panel no modifica el ancho del detalle.
- `SidebarFooter` contiene como máximo seis accesos de 44 px, en una sola fila: desplegar/ocultar menú, pendientes, conexión, perfil, tema y salir. Pendientes y Perfil respetan sus permisos.
- `SidebarMenu` agrupa NOC Online y liberación de cuadrillas en Operación, y Tablas en Administración. El panel tiene desplazamiento propio para admitir más opciones sin aumentar la altura del footer.
- `TableMenu` usa un desplegable dentro del panel y enlaces `NavLink`. `sidebarMenu.config.ts` centraliza rutas, etiquetas, iconos y permisos; sitios, etiquetados y proyectos usan sus permisos de consulta. Los catálogos provisionales de diagnósticos y marcas/modelos usan `catalogs.manage`.
- Abrir el panel enfoca su botón de cierre y vuelve inerte el contenido cubierto. Escape, el cierre y el botón del footer permiten ocultarlo y restaurar el foco. Navegar a una tabla o al perfil cierra el panel; Pendientes lo cierra y enfoca el inicio de la lista.
- NOC Online y liberar cuadrilla reutilizan sus modales. Cerrar un modal regresa al panel; Escape dentro del modal no cierra el panel que queda debajo.
- El acceso genérico a Reportes se retiró del footer; los reportes del ticket permanecen en el Taskbar. Conexión y Salir conservan su lugar como accesos deshabilitados hasta implementar sus flujos.

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
- Los archivos definitivos importados por `globals.css` son `tokens.css` y `themes.css`.
- El tema claro usa fondos grisáceos: fondo general `#E4E6EC`, superficies `#ECEEF3` y superficies elevadas `#F2F3F6`. El blanco se reserva para texto sobre fondos de color.
- El tema oscuro usa azul pizarra: fondo `#111A27`, superficies `#192536` y superficies elevadas `#223247`, para distinguir capas sin recurrir a negro casi puro.
- La identidad visual se concentra en encabezados, navegación activa y títulos de sección. Usar `--color-surface-accent`, `--color-border-accent` y `--color-text-accent` para estos acentos; las áreas de lectura mantienen superficies neutras. El icono principal del encabezado usa fondo de marca y `--color-text-on-primary`.
- Los textos y enlaces de acento usan `--color-text-accent`, separado del color de relleno `--color-primary`. Los textos sobre botones usan `--color-text-on-primary` o `--color-text-on-danger`, con valores específicos para cada tema.
- Los estados conservan las asociaciones históricas: creado celeste, asignado naranja, en proceso azul, pausado amarillo, cerrado gris, cotización verde claro y resuelto verde. Cada estado tiene variables para indicador (`--status-*`), fondo (`--status-*-soft`) y texto (`--status-*-text`), adaptadas a claro y oscuro.

Los archivos `tokens1.css` a `tokens7.css` y sus equivalentes de tema son variantes anteriores y no están activos. Las modificaciones visuales deben realizarse en los archivos definitivos.

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
