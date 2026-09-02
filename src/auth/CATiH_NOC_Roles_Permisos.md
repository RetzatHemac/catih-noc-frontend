# CATiH NOC - Roles y Permisos Consolidados

## Fuente y criterio de consolidación

Este documento resume los **roles existentes** y los **permisos consolidados** del sistema CATiH NOC a partir del SRS.

Se tomó como base:

- La descripción de roles del apartado **2.3 Tipos de usuario**.
- Las matrices de permisos de las páginas **11 a 14**.
- Los requisitos funcionales que aclaran actores autorizados para ciertas acciones específicas.
- Cuando la descripción de un rol y la matriz difieren, se aplica una **unión de permisos**: si cualquiera de las dos fuentes otorga explícitamente una capacidad, se conserva en esta consolidación.
- Las restricciones de alcance, como acceso limitado a proyectos, empresa o tickets asignados, se documentan por separado de los permisos funcionales.

---

# 1. Roles existentes

| Código sugerido | Rol | Área / contexto | Alcance general |
|---|---|---|---|
| `SUPER_ADMIN` | Super administrador | Ingeniería de software | Acceso total al sistema, configuración, usuarios, permisos, catálogos y eliminación de elementos críticos. |
| `NOC_SUPERVISOR` | NOC Supervisor | NOC | Creación y gestión completa de tickets, documentación y sitios. |
| `AGENTE_RJ` | Agente RJ | NOC | Creación y gestión de tickets relacionados con RED Jalisco, sitios y consulta de proyectos. |
| `AGENTE_PGH` | Agente PGH | NOC | Creación y gestión de tickets PGH, asignación de empresa, sitios y consulta de proyectos. |
| `COORDINADOR_OPERATIVO` | Coordinador operativo | Operaciones | Visualización amplia de tickets operativos, asignación de supervisores y cambio de líder operativo. |
| `LIDER_OPERATIVO` | Líder operativo | Operaciones | Visualización de tickets asignados a su operación. |
| `SUPERVISOR` | Supervisor | Operaciones | Visualización de tickets asignados y asignación de empresas proveedoras. |
| `ANALISTA` | Analista | Análisis de operaciones | Creación de tickets, documentación, sitios, formatos y etiquetado. |
| `AGENTE_SERVICIOS` | Agente de servicios | Servicios | Visualización de tickets, gestión de proyectos/implementaciones y documentación. |
| `VISOR` | Visor | Operaciones | Visualización de tickets y descarga de documentación. |
| `SOPORTE` | Soporte | Ingeniería de software | Creación y gestión de tickets de soporte RENATA y métricas. |
| `CLIENTE` | Cliente | Clientes | Creación y visualización de tickets de sus proyectos. |
| `LIDER_CUADRILLA` | Líder de cuadrilla | Campo / móvil | Asignación de cuadrilla para tickets asignados a proveedor. |
| `USUARIO_CUADRILLA` | Usuario de cuadrilla | Campo / móvil | Actividades, imágenes, materiales, reemplazos y etiquetado desde campo. |

> **Usuarios NOC:** `NOC_SUPERVISOR`, `AGENTE_RJ` y `AGENTE_PGH`.

---

# 2. Permisos consolidados

## 2.1 Tickets

### Crear ticket

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`
- `ANALISTA`
- `AGENTE_SERVICIOS`
- `CLIENTE`

Permiso sugerido:

```ts
ticket.create
```

### Dashboard de visualización de tickets

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`
- `COORDINADOR_OPERATIVO`
- `LIDER_OPERATIVO`
- `SUPERVISOR`
- `ANALISTA`
- `AGENTE_SERVICIOS`
- `VISOR`
- `SOPORTE`

Permiso sugerido:

```ts
ticket.dashboard.view
```

### Consultar tickets NOC completos

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`
- `COORDINADOR_OPERATIVO`
- `LIDER_OPERATIVO`
- `SUPERVISOR`
- `ANALISTA`
- `AGENTE_SERVICIOS`
- `VISOR`

Permiso sugerido:

```ts
ticket.view.all
```

### Consultar información limitada de ticket

Roles:

- `CLIENTE`

Restricción:

- Limitado a sus proyectos / empresa.

Permiso sugerido:

```ts
ticket.view.info
```

### Consultar tickets de soporte

Roles:

- `SOPORTE`

Permiso sugerido:

```ts
ticket.support.view
```

### Tabla de tickets

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`
- `COORDINADOR_OPERATIVO`
- `LIDER_OPERATIVO`
- `ANALISTA`
- `AGENTE_SERVICIOS`
- `VISOR`
- `CLIENTE`

Restricción para cliente:

- Limitado a tickets de su empresa / proyectos.

Permiso sugerido:

```ts
ticket.table.view
```

### Editar información del ticket

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`

Permiso sugerido:

```ts
ticket.edit
```

### Gestión general del ticket

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`
- `SOPORTE`

Permiso sugerido:

```ts
ticket.manage
```

### Gestionar notas

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`
- `COORDINADOR_OPERATIVO`
- `LIDER_OPERATIVO`
- `SUPERVISOR`
- `ANALISTA`
- `AGENTE_SERVICIOS`

Permiso sugerido:

```ts
ticket.notes.manage
```

### Eliminar objetos / documentación del ticket

Incluye actividades, reemplazos, intervenciones, fotografías u otros objetos documentales.

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`

Permiso sugerido:

```ts
ticket.objects.delete
```

### Eliminar ticket

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`

Permiso sugerido:

```ts
ticket.delete
```

### Descargar documentación del ticket

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`
- `ANALISTA`
- `AGENTE_SERVICIOS`
- `VISOR`

Permiso sugerido:

```ts
ticket.documents.download
```

---

## 2.2 Información del sitio dentro del ticket

### Editar información del sitio desde el ticket

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`
- `COORDINADOR_OPERATIVO`
- `LIDER_OPERATIVO`
- `SUPERVISOR`
- `ANALISTA`

Permiso sugerido:

```ts
ticket.site.edit
```

### Cambio de domicilio del sitio

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`

Permiso sugerido:

```ts
ticket.site.address.change
```

---

## 2.3 Imágenes

### Visualizar imágenes

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`
- `COORDINADOR_OPERATIVO`
- `LIDER_OPERATIVO`
- `SUPERVISOR`
- `ANALISTA`
- `AGENTE_SERVICIOS`
- `VISOR`
- `CLIENTE`

Restricción para cliente:

- Limitado a sus proyectos.

Permiso sugerido:

```ts
ticket.images.view
```

### Subir imágenes desde web

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`
- `ANALISTA`
- `AGENTE_SERVICIOS`
- `CLIENTE`

Permiso sugerido:

```ts
ticket.images.upload
```

### Subir imágenes desde campo / app

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`
- `USUARIO_CUADRILLA`

Permiso sugerido:

```ts
ticket.images.upload
```

### Eliminar imágenes

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`

Permiso sugerido:

```ts
ticket.objects.delete
```

---

## 2.4 Actividades

### Reportar actividades desde web

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`
- `ANALISTA`
- `AGENTE_SERVICIOS`
- `CLIENTE`

Permiso sugerido:

```ts
ticket.activities.report
```

### Reportar actividades desde app / campo

Roles:

- `SUPER_ADMIN`
- `USUARIO_CUADRILLA`

Permiso sugerido:

```ts
ticket.activities.report.app
```

### Eliminar actividades

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`

Permiso sugerido:

```ts
ticket.objects.delete
```

---

## 2.5 Reemplazos e intervenciones

### Reportar reemplazos desde web

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`
- `AGENTE_SERVICIOS`

Permiso sugerido:

```ts
ticket.replacements.report
```

### Reportar reemplazos desde campo / app

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`
- `USUARIO_CUADRILLA`

Permiso sugerido:

```ts
ticket.replacements.report
```

### Eliminar reemplazos

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`

Permiso sugerido:

```ts
ticket.objects.delete
```

### Eliminar intervenciones

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`

Permiso sugerido:

```ts
ticket.objects.delete
```

> La matriz no presenta una columna específica para reportar intervenciones. El SRS sí contiene un requisito funcional de reporte de intervenciones para usuarios NOC. Este punto debe mantenerse separado si se desea un permiso específico.

---

## 2.6 Materiales

### Visualizar materiales

Roles:

- `COORDINADOR_OPERATIVO`
- `LIDER_OPERATIVO`
- `SUPERVISOR`

Permiso sugerido:

```ts
ticket.materials.view
```

### Reportar materiales

Roles:

- `SUPER_ADMIN`
- `USUARIO_CUADRILLA`

Permiso sugerido:

```ts
ticket.materials.report
```

### Validar materiales

Roles:

- `SUPER_ADMIN`
- `SUPERVISOR`

Permiso sugerido:

```ts
ticket.materials.validate
```

---

## 2.7 Responsables, empresa y cuadrilla

### Asignar empresa

Roles consolidados:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_PGH`
- `SUPERVISOR`
- `AGENTE_SERVICIOS`

Permiso sugerido:

```ts
ticket.provider.assign
```

> `SUPERVISOR` se incluye porque la descripción formal del rol indica explícitamente que puede asignar empresas proveedoras.

### Desasignar / cambiar empresa

Roles:

- Los mismos que `ticket.provider.assign`.

Permiso sugerido:

```ts
ticket.provider.assign
```

### Asignar cuadrilla

Roles:

- `SUPER_ADMIN`
- `LIDER_CUADRILLA`

Permiso sugerido:

```ts
ticket.crew.assign
```

### Asignar supervisor

Roles:

- `COORDINADOR_OPERATIVO`

Permiso sugerido:

```ts
ticket.supervisor.assign
```

### Cambiar líder operativo

Roles:

- `COORDINADOR_OPERATIVO`

Permiso sugerido:

```ts
ticket.leader.change
```

---

## 2.8 Sitios

### Visualizar sitios

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`
- `COORDINADOR_OPERATIVO`
- `LIDER_OPERATIVO`
- `SUPERVISOR`
- `ANALISTA`
- `AGENTE_SERVICIOS`
- `VISOR`
- `CLIENTE`

Restricción para cliente:

- Limitado a sus proyectos.

Permiso sugerido:

```ts
sites.view
```

### Crear / dar de alta sitios

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`
- `ANALISTA`
- `AGENTE_SERVICIOS`

Permiso sugerido:

```ts
sites.create
```

### Editar sitios

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`
- `COORDINADOR_OPERATIVO`
- `LIDER_OPERATIVO`
- `SUPERVISOR`
- `ANALISTA`
- `AGENTE_SERVICIOS`

Permiso sugerido:

```ts
sites.edit
```

### Eliminar sitios

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`

Permiso sugerido:

```ts
sites.delete
```

### Etiquetar sitios desde campo

Roles:

- `SUPER_ADMIN`
- `USUARIO_CUADRILLA`

Permiso sugerido:

```ts
sites.tag
```

---

## 2.9 Etiquetado

### Visualizar tabla de etiquetado

Roles:

- `SUPER_ADMIN`
- `ANALISTA`

Permiso sugerido:

```ts
tagging.view
```

### Editar tabla de etiquetado

Roles:

- `SUPER_ADMIN`
- `ANALISTA`

Permiso sugerido:

```ts
tagging.edit
```

### Validar etiquetado

Roles:

- `SUPER_ADMIN`
- `ANALISTA`

Permiso sugerido:

```ts
tagging.validate
```

### Eliminar etiquetado

Roles:

- `SUPER_ADMIN`

Permiso sugerido:

```ts
tagging.delete
```

### Etiquetar desde campo

Roles:

- `SUPER_ADMIN`
- `USUARIO_CUADRILLA`

Permiso sugerido:

```ts
sites.tag
```

---

## 2.10 Proyectos e implementaciones

### Visualizar proyectos / implementaciones

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`
- `ANALISTA`
- `AGENTE_SERVICIOS`
- `VISOR`

Permiso sugerido:

```ts
projects.view
```

### Crear proyectos

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_SERVICIOS`

Permiso sugerido:

```ts
projects.create
```

### Crear implementaciones

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `ANALISTA`
- `AGENTE_SERVICIOS`

Permiso sugerido:

```ts
implementations.create
```

### Eliminar proyectos

Roles:

- `SUPER_ADMIN`
- `AGENTE_SERVICIOS`

Permiso sugerido:

```ts
projects.delete
```

### Gestión de proyectos / implementaciones

Roles:

- `SUPER_ADMIN`
- `AGENTE_SERVICIOS`

Permiso sugerido:

```ts
projects.manage
```

---

## 2.11 Usuarios y permisos

### Crear usuarios

Roles:

- `SUPER_ADMIN`

Permiso sugerido:

```ts
users.create
```

### Desactivar usuarios

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`

Permiso sugerido:

```ts
users.deactivate
```

### Ver usuarios NOC

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`

Permiso sugerido:

```ts
nocUsers.view
```

### Administrar usuarios

Roles:

- `SUPER_ADMIN`

Permiso sugerido:

```ts
users.manage
```

### Administrar permisos

Roles:

- `SUPER_ADMIN`

Permiso sugerido:

```ts
permissions.manage
```

### Administrar catálogos

Roles:

- `SUPER_ADMIN`

Permiso sugerido:

```ts
catalogs.manage
```

---

## 2.12 Perfil, dashboards y soporte

### Ver perfil

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`
- `COORDINADOR_OPERATIVO`
- `LIDER_OPERATIVO`
- `SUPERVISOR`
- `ANALISTA`
- `AGENTE_SERVICIOS`
- `VISOR`
- `SOPORTE`
- `CLIENTE`

Permiso sugerido:

```ts
profile.view
```

### Dashboard gráfico

Roles:

- `SUPER_ADMIN`
- `NOC_SUPERVISOR`
- `AGENTE_RJ`
- `AGENTE_PGH`
- `AGENTE_SERVICIOS`
- `VISOR`

Permiso sugerido:

```ts
dashboard.graph.view
```

### Métricas de soporte

Roles:

- `SOPORTE`

Permiso sugerido:

```ts
support.metrics.view
```

---

# 3. Restricciones de alcance por rol

Los permisos anteriores indican **qué acción puede ejecutar un usuario**, pero no necesariamente **sobre qué datos puede hacerlo**.

Estas restricciones deben manejarse por separado.

| Rol | Restricción de alcance |
|---|---|
| `CLIENTE` | Solo tickets, imágenes, sitios y proyectos relacionados con su empresa / proyectos. |
| `AGENTE_RJ` | Gestión de tickets relacionados con RED Jalisco. |
| `AGENTE_PGH` | Gestión de tickets relacionados con proyectos generales PGH. |
| `COORDINADOR_OPERATIVO` | Tickets bajo los líderes operativos de las áreas a su cargo. |
| `LIDER_OPERATIVO` | Tickets asignados a él como líder operativo. |
| `SUPERVISOR` | Tickets asignados a él. |
| `VISOR` | Visualización general, sin gestión operativa. |
| `SOPORTE` | Tickets de soporte / RENATA. |
| `LIDER_CUADRILLA` | Tickets asignados al proveedor / cuadrillas que tenga bajo su responsabilidad. |
| `USUARIO_CUADRILLA` | Tickets asignados a su cuadrilla. |

Por lo tanto, en frontend/backend deben distinguirse conceptos como:

```ts
can(user, PERMISSIONS.TICKET_EDIT)
```

de:

```ts
canAccessTicket(user, ticket)
```

El primero valida la **capacidad funcional**.

El segundo valida el **alcance sobre el recurso**.

---

# 4. Nomenclatura sugerida de permisos

```ts
export type Permission =
  // Tickets
  | "ticket.create"
  | "ticket.dashboard.view"
  | "ticket.view.all"
  | "ticket.view.info"
  | "ticket.support.view"
  | "ticket.table.view"
  | "ticket.edit"
  | "ticket.manage"
  | "ticket.delete"
  | "ticket.notes.manage"
  | "ticket.objects.delete"
  | "ticket.documents.download"

  // Sitio dentro del ticket
  | "ticket.site.edit"
  | "ticket.site.address.change"

  // Imágenes
  | "ticket.images.view"
  | "ticket.images.upload"

  // Actividades
  | "ticket.activities.report"
  | "ticket.activities.report.app"

  // Reemplazos
  | "ticket.replacements.report"

  // Materiales
  | "ticket.materials.view"
  | "ticket.materials.report"
  | "ticket.materials.validate"

  // Responsables
  | "ticket.provider.assign"
  | "ticket.crew.assign"
  | "ticket.supervisor.assign"
  | "ticket.leader.change"

  // Sitios
  | "sites.view"
  | "sites.create"
  | "sites.edit"
  | "sites.delete"
  | "sites.tag"

  // Etiquetado
  | "tagging.view"
  | "tagging.edit"
  | "tagging.validate"
  | "tagging.delete"

  // Proyectos
  | "projects.view"
  | "projects.create"
  | "projects.delete"
  | "projects.manage"
  | "implementations.create"

  // Usuarios
  | "users.create"
  | "users.deactivate"
  | "users.manage"
  | "nocUsers.view"
  | "permissions.manage"
  | "catalogs.manage"

  // General
  | "profile.view"
  | "dashboard.graph.view"
  | "support.metrics.view";
```

---

# 5. Consideración de arquitectura

Los roles anteriores representan **perfiles predeterminados**.

La autorización no debe quedar implementada mediante comprobaciones rígidas como:

```ts
user.role === "SUPER_ADMIN"
```

La arquitectura debe permitir:

```text
Rol
 ↓
Permisos predeterminados
 ↓
Permisos especiales otorgados al usuario
 ↓
Permisos especiales retirados al usuario
 ↓
Permisos efectivos
```

Ejemplo:

```ts
can(user, PERMISSIONS.TICKET_OBJECTS_DELETE)
```

Esto permite mantener la matriz predeterminada del SRS y, al mismo tiempo, soportar usuarios de un área con permisos especiales sin crear roles nuevos artificialmente.

---

## Documento fuente

**Documento de especificaciones de requerimientos de software (SRS) CATiH, versión 1.0, 18 de junio de 2026.**

Secciones principales utilizadas:

- 2.3 Tipos de usuario
- Matrices de permisos, páginas 11 a 14
- Requisitos funcionales relacionados con tickets, documentación, imágenes, actividades, reemplazos, intervenciones, sitios, proyectos y usuarios
