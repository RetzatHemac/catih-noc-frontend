# Estado del proyecto y siguiente fase

Última actualización: 8 de septiembre de 2026.

## Listo actualmente

- Base responsive Sidebar–Taskbar–Detalle.
- Selección de ticket sincronizada con la URL.
- Filtros funcionales sobre la colección mock.
- Formularios y modales reutilizables.
- Detalle amplio con edición y eliminación según capacidad.
- Taskbar contextual completamente modelado en frontend.
- Modal NOC Online con usuarios activos, limitado por permiso.
- Liberación mock de cuadrillas para Analista y Superadministrador.
- Badge y vista responsive de tickets asignados pendientes por iniciar.
- Usuario, roles, permisos base y overrides mock.
- Pruebas automatizadas para los flujos críticos implementados.
- Tabla de proyectos con búsqueda, filtros, paginación y acciones por permiso.
- Formularios mock de proyecto e implementación dentro del panel de detalle.
- Tabla de sitios condicionada por proyecto, con búsqueda, paginación y descarga local.
- Edición y eliminación mock de sitios, administración de direccionamientos e inventario.
- Descargas provisionales de protocolo e imágenes de inventario.
- Tabla de etiquetado con búsqueda, paginación, edición mock y layout `.xls`.

## Límites intencionales de la fase mock

- No existe persistencia después de recargar.
- Cambiar de ticket reconstruye el detalle desde el mock.
- Crear y duplicar tickets no agrega elementos persistentes al listado.
- Los adjuntos locales usan `URL.createObjectURL` y no se suben.
- Los reportes son representaciones provisionales TXT/CSV.
- No existen loading ni errores de red reales.
- La lectura de notificaciones funciona en memoria al abrir el ticket; se reinicia al recargar.
- La alerta sonora sigue pendiente de implementación.
- El frontend oculta acciones, pero aún no hay autorización de servidor.
- Las tablas de diagnósticos y marcas/modelos siguen como placeholders.
- Concluir reemplazos, marcar accesible y ver el detalle de una fila de inventario permanecen deshabilitados hasta definir su flujo.

## Antes o durante la fase de roles

1. Confirmar la matriz final de permisos con producto y backend.
2. Separar permisos que hoy comparten una capacidad provisional, especialmente chat y notas.
3. Definir visibilidad y mutabilidad por estado para cada acción del Taskbar.
4. Confirmar si los permisos llegan como lista efectiva desde backend o se calculan desde el rol.
5. Probar cada capacidad con un rol permitido, uno denegado y overrides por usuario.
6. Mantener las políticas fuera de los componentes visuales.

## Puntos técnicos a vigilar

- Consolidar `tokens7.css`/`themes7.css` como nombres definitivos cuando se apruebe el tema; actualmente son los archivos realmente importados.
- Unificar estados y formatos de fecha antes del contrato API.
- Evitar que `TicketWorkspaceProvider` se convierta en caché global de datos remotos.
- Revocar object URLs cuando se retire un archivo o se desmonte su flujo.
- Añadir paginación o virtualización si tickets, chat, notas o actividades crecen significativamente.
- Implementar una estrategia central de errores antes de conectar múltiples endpoints.

## Definición mínima de terminado para nuevos cambios

- Respeta los lineamientos del proyecto.
- Funciona desde 320 px y en desktop.
- Es operable con teclado y conserva foco visible.
- Usa permisos/capacidades en lugar de comparar roles dentro de la UI.
- Incluye estados vacío y de error cuando correspondan.
- Incluye pruebas proporcionales al riesgo.
- Supera `npm run check`.
