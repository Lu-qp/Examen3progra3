# Catálogo de Villa Peñas

Aplicación en React, TypeScript y Vite para explorar los paquetes de Villa Peñas, consultar sus servicios y buscar productos adicionales.

## Cómo ejecutar el proyecto

Con Node.js 20.19+ de la rama 20 o 22.12 en adelante, abrí esta carpeta en VS Code y usá estos comandos en la terminal.

```bash
npm ci
npm run dev
```

Abrí [http://localhost:5173](http://localhost:5173). El proyecto fija ese puerto porque la API lo acepta como origen de consulta. Para comprobar los tipos de TypeScript y generar la compilación de producción, ejecutá `npm run build`.

## Ficha de análisis de servicios

| Recurso y operación | Datos seleccionados | Uso en la interfaz |
| --- | --- | --- |
| `GET /public/paquetes` | Arreglo de paquetes. Se usan `id`, `nombre` y `precioColones`. | Lista las alternativas disponibles y da el ID para solicitar el detalle. |
| `GET /public/paquetes/{id}` | Objeto de un paquete. Se usan `id`, `nombre`, `descripcion`, `precioColones` y `paquetesServicios`. Cada elemento contiene `orden` y un `servicio` con nombre y descripción. | Presenta el precio, la descripción y los servicios incluidos del paquete elegido. |
| `GET /public/opciones-productos-adicionales` | Arreglo de opciones. Se usan `id`, `productoAdicionalId`, `nombre`, `precioVentaColones` y el `productoAdicional` anidado con nombre, descripción e imagen. | Agrupa las presentaciones por producto y permite buscar por nombre de producto o de presentación. |

El listado y el detalle se conectan por el `id` del paquete. Las opciones adicionales forman un catálogo general y se agrupan por `productoAdicionalId`. Así se puede comparar qué incluye un paquete y consultar por separado qué se puede agregar al evento.

Swagger identifica las tres operaciones como públicas. Las comprobé con solicitudes GET sin token ni cookies y obtuve HTTP 200. El detalle requiere un ID que sale de la primera consulta. [Swagger de Villa Peñas](https://villa-penas-production.up.railway.app/api/docs)

## Cómo funciona el código

| Archivo | Responsabilidad |
| --- | --- |
| `src/servicios/villaPenas.ts` | Construye las solicitudes, comprueba el estado HTTP e interpreta la respuesta JSON. |
| `src/tipos.ts` | Describe los campos de la API que usa React. |
| `src/hooks/useConsulta.ts` | Administra la carga, los datos y el error. Cancela la solicitud cuando el componente se desmonta. |
| `src/componentes/Paquetes.tsx` | Muestra la lista y consulta el detalle según el ID seleccionado. |
| `src/componentes/Adicionales.tsx` | Agrupa las opciones y filtra los datos que ya llegaron. |
| `src/componentes/PanelConsulta.tsx` | Reutiliza los mensajes de carga y error, con un botón de reintento. |

Al cargar la página se piden los paquetes y los adicionales. Con el primer paquete disponible se consulta su detalle. Al elegir otro, cambia la `key` del panel de detalle y React monta un panel nuevo. `AbortController` cancela la consulta anterior si sigue pendiente. Eso impide que una respuesta tardía muestre servicios del paquete anterior. La búsqueda de adicionales filtra en memoria y puede mostrar un mensaje sin resultados.

## Comprobación en el navegador

1. Abrí la aplicación y presioná **F12**. Entrá a **Network / Red** y elegí **Fetch/XHR**.
2. Recargá la página. Seleccioná `paquetes`, el detalle del paquete y `opciones-productos-adicionales`. En **Headers** se ve el método `GET` y el estado HTTP. En **Response** se puede cotejar el JSON con los nombres y precios de la pantalla.
3. Seleccioná **Paquete Premium**. Con los datos observados, aparece `GET /public/paquetes/2` y el detalle muestra ₡80 000 y sus servicios.
4. Buscá `maiz` para comprobar que aparecen las palomitas y luego escribí un término inexistente para ver el estado sin resultados.

En la consulta original, el catálogo devolvió dos paquetes y diez opciones adicionales. El origen local estaba autorizado por la cabecera `Access-Control-Allow-Origin`. Los datos pueden variar si se actualiza el catálogo. Swagger también lista `/public/instagram`, que devolvió HTTP 502 durante la revisión y quedó fuera de la aplicación.

La carpeta `evidencias` incluye las capturas del catálogo en escritorio y móvil, una captura de **Network** con los estados HTTP y el archivo `solicitudes_http.json` con los cuerpos de las respuestas reales. Se ven cuatro solicitudes porque se consultó el detalle de dos paquetes con la misma operación. El diagnóstico del HTTP 502 de Instagram está en `diagnostico_instagram.json`.

Durante la comprobación vi el mensaje de carga y confirmé que se reemplazaba el detalle al cambiar de paquete. Probé una búsqueda sin coincidencias y simulé HTTP 503 en una sola solicitud de detalle. Al pulsar **Reintentar**, el detalle volvió a cargar con la respuesta real de la API.

## Repositorio Git

[https://github.com/Lu-qp/Examen3progra3](https://github.com/Lu-qp/Examen3progra3)

El ZIP incluye la rama `main`, el historial de Git y el remoto `origin` configurado. Con Git instalado, ejecutá este comando desde la carpeta del proyecto descomprimido para subirlo a GitHub.

```bash
git push -u origin main
```

Cuando termine, abrí el enlace y verificá que aparezcan `README.md` y la carpeta `src`.
