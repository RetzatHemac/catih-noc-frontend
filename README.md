# CATiH NOC Frontend

Interfaz web para la consulta, creación y operación de tickets del NOC. El proyecto está preparado para trabajar con datos mock mientras se definen y conectan los servicios del backend.

## Estado actual

- Listado de tickets con búsqueda, colas y filtros combinables.
- Creación de tickets y alta local de sitios.
- Detalle del ticket con edición controlada por permisos.
- Actividades remotas y en sitio.
- Galerías, materiales, reemplazos, intervenciones, SLA y atención en sitio.
- Taskbar contextual con chat, notas, imágenes, actividades, inventario, pausa, agenda, relaciones, duplicado, cierre y reportes.
- Roles y permisos simulados en frontend.
- Utilidades del Sidebar para consultar usuarios NOC y liberar cuadrillas.
- Perfil de usuario y cambio de contraseña mock.
- Administración mock de proyectos e implementaciones con búsqueda, filtros y paginación.
- Administración mock de sitios por proyecto, direccionamientos e inventario.
- Tabla de etiquetado con filtros, edición de equipo y generación de layout Excel.
- Diseño mobile-first, tema claro/oscuro y navegación accesible por teclado.
- Pruebas unitarias y de componentes con Vitest y Testing Library.

> El proyecto todavía no consume una API. Las operaciones modifican estado en memoria y se reinician al recargar o cambiar el ticket.


## Requisitos

- Node.js `^20.19.0` o `>=22.12.0`.
- npm, usando el `package-lock.json` del repositorio.

## Inicio rápido

```bash
npm install
npm run dev
```

Vite mostrará en la terminal la dirección local de la aplicación.

## Scripts

| Comando             | Uso                                                 |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Inicia el servidor de desarrollo con HMR.           |
| `npm run lint`      | Ejecuta ESLint, incluyendo reglas de accesibilidad. |
| `npm run typecheck` | Valida TypeScript sin generar una entrega.          |
| `npm run test`      | Ejecuta Vitest en modo interactivo.                 |
| `npm run test:run`  | Ejecuta una sola corrida de pruebas.                |
| `npm run build`     | Valida TypeScript y genera `dist/`.                 |
| `npm run preview`   | Sirve localmente el build de producción.            |
| `npm run check`     | Ejecuta lint, tipos, pruebas y build.               |

Antes de entregar cambios se debe ejecutar:

```bash
npm run check
```

## Estructura principal

```text
src/
├─ app/                 # Router, providers, contextos y hooks globales
├─ auth/                # Usuario mock, roles, permisos y evaluación de acceso
├─ components/
│  ├─ layout/           # AppShell, Sidebar, Detail y Taskbar
│  ├─ patterns/         # Patrones reutilizables del producto
│  └─ ui/               # Primitivos visuales reutilizables
├─ features/tickets/
│  ├─ components/       # Crear ticket, detalle y acciones del Taskbar
│  ├─ config/           # Catálogos y configuración mock
│  ├─ context/          # Estado del ticket activo
│  ├─ mocks/            # Datos temporales
│  ├─ policies/         # Capacidades derivadas de permisos y estado
│  ├─ types/            # Contratos TypeScript
│  └─ utils/            # Filtros y generación temporal de reportes
├─ features/projects/   # Tabla, formularios, mocks y utilidades de proyectos
├─ features/sites/      # Sitios, direccionamientos, inventario y descargas mock
├─ features/tagging/    # Tabla de etiquetado, edición y layout Excel mock
├─ pages/               # Componentes asociados a rutas
├─ styles/              # Tokens, temas, tipografía y estilos globales
└─ test/                # Configuración común de pruebas
```

Los lineamientos internos del equipo permanecen en `documents/`. Esa carpeta está ignorada por Git porque cada integrante ya cuenta con una copia local. La documentación versionable del producto vive en [`docs/`](./docs/).

## Rutas disponibles

| Ruta                  | Estado                                                |
| --------------------- | ----------------------------------------------------- |
| `/`                   | Workspace sin detalle seleccionado.                   |
| `/tickets`            | Presentación general de tickets.                      |
| `/tickets/new`        | Formulario mock de creación.                          |
| `/tickets/:ticketId`  | Detalle operativo del ticket.                         |
| `/pending-tickets`    | Tickets asignados con notificación pendiente de leer. |
| `/profile`            | Perfil de usuario y cambio de contraseña mock.        |
| `/tables/sites`       | Administración mock de sitios por proyecto.           |
| `/tables/tagged`      | Administración mock de equipos en etiquetado.         |
| `/tables/projects`    | Administración mock de proyectos e implementaciones.  |
| `/tables/diagnostics` | Placeholder.                                          |
| `/tables/models`      | Placeholder.                                          |

## Datos mock

- Lista: `src/features/tickets/config/mockTickets.ts`.
- Detalle: `src/features/tickets/mocks/ticketDetail.mock.ts`.
- Creación y catálogos: `src/features/tickets/mocks/createTicket.mock.ts`.
- Usuario activo: `src/auth/mockUser.ts`.
- Catálogos del Taskbar: `src/features/tickets/config/`.
- Notificaciones pendientes: `src/features/tickets/mocks/pendingTicketNotifications.mock.ts`.
- Proyectos: `src/features/projects/mocks/projects.mock.ts`.
- Sitios: `src/features/sites/mocks/sites.mock.ts`.
- Etiquetado: `src/features/tagging/mocks/taggedEquipment.mock.ts`.
- Imágenes estáticas: `public/mocks/tickets/`.

Para probar otro rol, cambia temporalmente `role` en `src/auth/mockUser.ts`. Los permisos específicos de usuario pueden agregarse o negarse mediante `permissionOverrides`.

## Documentación técnica

- [Arquitectura y convenciones](./docs/ARCHITECTURE.md)
- [Guía de integración con backend](./docs/BACKEND_HANDOFF.md)
- [Estado, límites y siguiente fase](./docs/PROJECT_STATUS.md)

## Regla de seguridad sobre permisos

Los permisos del frontend solo controlan la experiencia visual. Cuando exista backend, cada endpoint deberá volver a validar autenticación, autorización, estado del ticket y reglas de negocio. Ocultar un botón nunca debe considerarse una medida de seguridad suficiente.
