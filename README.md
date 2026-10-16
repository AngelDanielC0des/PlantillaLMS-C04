# Manual Técnico – Plantilla Interactiva LMS (C04 Reto: Un aviso a tiempo)

**Módulo:** C04 – Reto: Un aviso a tiempo  
**Documento:** Manual Técnico, Guía de Arquitectura, Accesibilidad e Integración  
**Versión:** 2.0 (Producción / LMS Ready)  
**Fecha:** 16 de octubre de 2026  

---

## 1. Resumen Ejecutivo y Propósito

Este paquete contiene la plantilla interactiva para plataformas de aprendizaje virtual (LMS) del reto **«Un aviso a tiempo»**. El diseño sigue una arquitectura web moderna, ligera y auto-contenida (Vanilla HTML5, CSS3 modular y JavaScript ES6+ sin dependencias de frameworks externos como React o TailwindCSS), optimizada para carga instantánea, compatibilidad transversal en navegadores de escritorio y dispositivos móviles, y diseñada con criterios de accesibilidad **WCAG 2.1 AA**. La conformidad debe comprobarse además con tecnologías de asistencia y en el LMS de destino.

### Objetivos Clave de la Implementación
1. **Resolución de Bugs Móviles Históricos:** Corrección definitiva de reglas CSS de ocultamiento indiscriminado en pantallas móviles (<= 520px) que impedían visualizar el selector tipográfico y los glifos de tema (Sol/Luna).
2. **Sistema Multi-Tema Refinado:** Rediseño conceptual de paletas con nomenclatura clara («Día» y «Sol» para fondos claros; «Noche» y «Estrella» para fondos oscuros), sincronización bidireccional entre el control rápido de cabecera y el panel de Ajustes, y contraste no textual garantizado (SC 1.4.11 > 3:1).
3. **Accesibilidad (a11y):** Semántica, navegación por teclado, foco visible, `prefers-reduced-motion` y objetivos táctiles diseñados según criterios WCAG 2.1 AA; la conformidad requiere pruebas con tecnologías de asistencia y el LMS de destino.
4. **Interactividad Progresiva:** Ayudas contextuales desplegables (`<details>/<summary>`) activables por teclado y tacto, micro-animaciones fluidas en ilustraciones SVG al interactuar con opciones, y contadores de progreso reactivos.
5. **Internacionalización Desacoplada (i18n):** Carga opcional mediante diccionario JSON externo (`i18n.json`) y conector modular (`lms-i18n.js`), con arquitectura *graceful degradation* (fallback nativo bilingüe inline) y canal de eventos para hosts LMS.

---

## 2. Inventario de Archivos y Responsabilidades

| Archivo | Rol en el Paquete | Descripción Técnica |
| :--- | :--- | :--- |
| `C04-reto-un-aviso-a-tiempo (nuevo).html` | **Plantilla Maestra** | Documento interactivo para el alumno. Integra los estilos CSS encapsulados, marcado HTML5 semántico, componentes didácticos y controladores de estado cliente. |
| `C04-reto-un-aviso-a-tiempo(antiguo).html` | **Línea Base Histórica** | Archivo original de partida conservado intacto para trazabilidad, comparaciones de regresión y auditorías de código. |
| `i18n.json` | **Diccionario Externo** | Repositorio de 175 claves hoja por idioma (`es` y `en`) con todas las cadenas de interfaz, accesibilidad, textos pedagógicos y respuestas. |
| `lms-i18n.js` | **Conector LMS** | Script ligero y asíncrono para consumir `i18n.json`, traducir el árbol DOM, actualizar atributos ARIA y responder a eventos `tp:languagechange`. |
| `cambios.md` | **Registro de Cambios** | Historial técnico de auditoría y transformaciones detalladas respecto al original antiguo. |
| `README.md` | **Manual Técnico** | Documentación de arquitectura, diseño, contrastes, accesibilidad e instrucciones de despliegue. |

---

## 3. Arquitectura del Diseño, Temas y Responsive

### 3.1. Nomenclatura y configuración de paletas
La plantilla ofrece cuatro combinaciones, cada una definida con tokens de fondo, superficies, texto, acento y bordes:

* **Día** (`data-paper="white"`): blanco neutro con superficies gris azulado muy claro.
* **Sol** (`data-paper="cream"`): fondo cálido suave (`#FBF6EC`) con superficies cálidas coordinadas.
* **Noche** (`data-ink="brand"`): azul pizarra oscuro (`#172A33`) y superficies graduadas.
* **Estrella** (`data-ink="alt"`): verde petróleo oscuro (`#2B4046`) y superficies graduadas.

Los colores predeterminados se mantienen alineados con `tpBrandCss`, el generador usado cuando el LMS entrega una marca. Ese generador debe volver a medirse si cambian los colores de marca; los valores de esta sección describen el conjunto predeterminado.

### 3.2. Sincronización Bidireccional de Controles
Existen dos puntos de interacción para alternar el modo:
1.  **Botón rápido superior (`.tp-tools > [data-theme-toggle]`):** Accesible de manera inmediata en la cabecera. Contiene el glifo animado sol/luna.
2.  **Interruptor en panel de Ajustes (`.tp-mode-toggle`):** Situado dentro de `#tp-reading-settings` junto a las paletas específicas, con etiqueta legible («Pasar a Noche» / «Pasar a Día»).

Ambos controles comparten el despachador central `toggleTheme()` y actualizan simultáneamente:
*   Atributo en la raíz: `document.documentElement.dataset.theme`.
*   Estado de accesibilidad: `aria-pressed="true|false"` en ambos botones.
*   Nombres accesibles y etiquetas visibles: `aria-label` y texto de `.tp-mode-label`.
*   Persistencia: se almacena en `localStorage` bajo la clave del curso.

### 3.3. Animaciones y `prefers-reduced-motion`
*   **Glifo Sol/Luna:** Cambia con una entrada y salida breves de escala y rotación al alternar el tema; respeta `prefers-reduced-motion`.
*   **Rueda de Ajustes (`.tp-prefs-btn svg`):** Gira 60° mientras el panel está abierto y vuelve a su posición al cerrarse, mediante una transición de 420 ms vinculada al estado del panel.
*   **Control de movimiento reducido:** La función `replayMotionClass()` consulta activamente `matchMedia('(prefers-reduced-motion: reduce)')`. Si el usuario tiene activada la reducción de movimiento en su sistema operativo, las clases de animación no se aplican y la transición visual se realiza de forma estática e instantánea.

### 3.4. Tipografía y responsive mobile-first
* **Familias disponibles:** Sans clara (Inter con fallbacks del sistema) y Alta legibilidad (Atkinson Hyperlegible con fallbacks del sistema). La familia seleccionada se aplica tanto al contenido como a encabezados y controles. El código conserva su familia monoespaciada.
* **Preferencias antiguas:** los valores `brand`, `serif` y `system` se normalizan a Sans clara; `legible` se conserva. El canal de preferencias del LMS sigue aceptando la propiedad `font`.
* **Escalado de lectura:** el tamaño base se adapta con `clamp()`; los cinco tamaños de lectura siguen disponibles y el máximo llega a 200 %.
* **Targets táctiles:** los controles principales y el cierre del índice tienen al menos 44 px de alto.
* **Superficies móviles:** índice y ajustes se presentan como vistas de pantalla completa con áreas seguras. El contenido no se divide en grupos horizontales con scroll independiente; el viewport de la vista puede desplazarse completo cuando la altura o el zoom no permiten mostrar todas las opciones a la vez.

---

## 4. Criterios y comprobaciones de accesibilidad (WCAG 2.1 AA)

### 4.1. Medición de ratios de contraste
Ratios predeterminados calculados sobre las variables de la plantilla con la fórmula de luminancia relativa de WCAG. Los fondos de superficie se comprobaron además del fondo base. El texto principal, secundario y atenuado, los acentos, el texto sobre acento y los bordes cumplen WCAG AA en las cuatro combinaciones.

| Métrica | Criterio | Día | Sol | Noche | Estrella |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Texto principal (`--fg` / superficies) | 4.5:1 | 11.75:1 | 11.01:1 | 9.09:1 | 6.79:1 |
| Texto secundario (`--fg-soft` / superficies) | 4.5:1 | 6.92:1 | 6.49:1 | 7.49:1 | 5.61:1 |
| Texto atenuado (`--muted` / superficies) | 4.5:1 | 5.14:1 | 4.82:1 | 5.57:1 | 4.84:1 |
| Acento y texto sobre acento | 4.5:1 | 5.27:1 | 4.94:1 | 4.82:1 | 4.81:1 |
| Borde visible (`--line` / superficies) | 3:1 | 3.42:1 | 3.20:1 | 3.20:1 | 3.24:1 |

Los valores publicados corresponden a los colores predeterminados. Los temas con colores de marca proporcionados por el LMS deben verificarse con los cuatro colores de marca efectivos antes de publicar.

### 4.2. Operación Completa por Teclado
*   **Selector de Fuentes Personalizado:**
    *   Implementado con patrón ARIA `role="combobox"` y `aria-haspopup="listbox"`.
    *   Asociación semántica mediante `aria-labelledby="tp-font-field-label tp-font-value"`.
    *   Teclas soportadas: `ArrowDown` y `ArrowUp` navegan cíclicamente entre opciones actualizando `aria-activedescendant`; `Enter` y `Space` confirman la selección; `Escape` cierra el desplegable y devuelve el foco al botón disparador.
*   **Panel de Ajustes:**
    *   `Escape` cierra el panel desplegable (`visibility: hidden`) y devuelve el foco inmediatamente al botón `.tp-prefs-btn`.
    *   `Tab` / `Shift+Tab` recorre los controles en un orden natural y lógico.
*   **Atajo Rápido Global:**
    *   La tecla `T` (en mayúscula o minúscula) conmuta el modo claro/oscuro desde cualquier parte del documento, con guarda activa para no interferir si el usuario está escribiendo en un campo de texto o editable.
*   **Indicadores `:focus-visible`:**
    *   La regla base de botones, enlaces y controles de actividades usa `outline: 2px solid var(--accent); outline-offset: 3px`. La barra `.tp-icon` coloca el anillo de `--focus-ring` en el interior para mantenerlo dentro del viewport. En las decisiones `.ydc`, el anillo de la opción usa `outline: 2px solid var(--focus-ring); outline-offset: 3px`; el foco del radio se representa en esa opción para evitar contornos duplicados.

---

## 5. Interactividad del Formulario y Actividades Didácticas

La plantilla integra una serie de componentes de aprendizaje activo que refuerzan la retención sin desviar la atención del estudiante:

1.  **Decisiones del Reto (`.ydc-item`):**
    *   Cada bloque de decisión incorpora un componente nativo accesible `<details class="ydc-help">` con `<summary>`, que ofrece guía pedagógica sin bloquear la vista.
    *   Al enfocar una decisión o seleccionar una opción, la figura asociada `.ydc-person` recibe un micro-movimiento breve; se desactiva con `prefers-reduced-motion: reduce`.
    *   Las decisiones «Aceptar», «Obstáculo» y «Valoración» incorporan escenas SVG adaptadas a las variables `--yart-*`, visibles desde 720 px. En anchos menores se mantienen las figuras compactas originales.
    *   La elección muestra una consecuencia explicativa inmediata (`.ydc-out`) y resume el aprendizaje en el panel final «Te llevas».
2.  **Emparejamiento de Conceptos (`.mp`):**
    *   Chips de origen (`.mp-chip`) y zonas de destino (`.mp-zone`) accesibles con teclado mediante `role="button"`, `tabindex="0"` y `aria-pressed`.
3.  **Ordenación de Fases (`.or`):**
    *   Banco de elementos (`.or-pool`) y ranuras secuenciales (`.or-slot`) con soporte de selección por teclado y anuncios de estado para lectores de pantalla.
4.  **Completar Huecos (`.gaps`):**
    *   Desplegables inline construidos como comboboxes accesibles, etiquetados dinámicamente con su índice y total (ej. *«Hueco 1 de 3»*).
5.  **Seguimiento y Progreso (`.llr-progress` y `yulia:progress`):**
    *   Barra de progreso visual y región accesible `[data-ypr-status]` con `role="status"` y `aria-live="polite"`.
    *   Actualización reactiva al cambiar de idioma para mostrar cadenas perfectamente localizadas (ej. *«1 de 3 actividades realizadas»* / *«1 of 3 activities completed»*).
6.  **Ayudas contextuales de decisión:**
    *   Cada una de las cinco decisiones incluye un botón de ayuda con `aria-describedby` y una descripción `role="tooltip"`.
    *   La ayuda se abre con foco de teclado, puntero o toque; se cierra con `Escape` o al salir del control y se ofrece en español e inglés.
7.  **Cierre de la clase:**
    *   Al pulsar «Terminar esta clase» con todos los hitos requeridos completados, aparece una celebración SVG de 1,7 s. No retrasa el evento de cierre enviado al LMS; con `prefers-reduced-motion: reduce` se muestra un check estático.

---

## 6. Internacionalización (i18n) e Integración con el LMS

### 6.1. Arquitectura de Traducción Desacoplada
El sistema está diseñado para funcionar en dos escenarios operativos:

1.  **Modo Autónomo / Fallback (Por defecto):**
    *   La plantilla no requiere conexión a internet ni llamadas a servidores remotos para funcionar.
    *   Todos los elementos traducibles cuentan con atributos `data-es` y `data-en` inline en el HTML.
    *   El motor interno gestiona el cambio de idioma localmente sin dependencias.
2.  **Modo LMS con Diccionario Externo (`i18n.json`):**
    *   Permite al administrador del LMS actualizar o corregir textos sin editar el archivo HTML maestro.
    *   Se activa mediante una sola etiqueta en el `<head>` del documento.

### 6.2. Activación en el LMS
En el archivo `C04-reto-un-aviso-a-tiempo (nuevo).html`, dentro de la etiqueta `<head>` (inmediatamente después del `<title>`), se encuentra la siguiente línea comentada:

```html
<!-- <script src="./lms-i18n.js" data-i18n-url="./i18n.json" defer></script> -->
```

**Pasos para activar la integración externa:**
1.  Copie `i18n.json` y `lms-i18n.js` al paquete de recursos del LMS o a un CDN con cabeceras CORS permitidas.
2.  Descomente la línea anterior eliminando `<!--` y `-->`.
3.  Sustituya `./i18n.json` por la URL absoluta o relativa pública expuesta por el LMS:
    ```html
    <script src="./lms-i18n.js" data-i18n-url="https://mi-lms.ejemplo.com/cursos/c04/i18n.json" defer></script>
    ```

### 6.3. Comunicación Bidireccional con el LMS Host
*   **Evento de cambio de idioma desde el LMS:**
    Si la plataforma contenedora cuenta con un selector de idioma global, puede instruir a la plantilla enviando un evento personalizado a `document`:
    ```javascript
    document.dispatchEvent(new CustomEvent('tp:languagechange', {
      detail: { lang: 'en' } // o 'es'
    }));
    ```
    La plantilla actualizará instantáneamente todos los textos del DOM, los atributos `aria-label`, el atributo `document.documentElement.lang`, los textos de decisiones acumuladas y el contador de progreso.
*   **Tolerancia a Fallos y Manejo de Errores (Graceful Degradation):**
    Si `lms-i18n.js` experimenta un fallo de red, error HTTP (404/500) o JSON malformado:
    *   Captura el error en un bloque `try/catch` sin interrumpir la ejecución del curso.
    *   Conserva intacto el contenido español de fallback nativo.
    *   Emite el evento `tp:i18nerror` para registro o monitoreo opcional del host LMS.

---

## 7. Verificación Técnica y Calidad (QA)

El registro de cambios conserva resultados de una batería anterior de pruebas automatizadas con **Playwright** en Chrome Headless. Son resultados históricos y no sustituyen la validación de la revisión actual:

1.  **Pruebas de Disposición Responsive:**
    *   Viewports evaluados: 320, 360, 375, 390, 520, 640, 768, 860, 861, 1024 y 1280 px.
    *   Resultado: Cero desbordamiento horizontal (`body.scrollWidth === innerWidth`).
2.  **Zoom de Texto al 200%:**
    *   Verificado en viewport de 320 px con el ajuste tipográfico máximo (`xxl`). La columna de lectura se adapta sin cortar contenido ni expulsar elementos de la pantalla.
3.  **Auditoría de Sintaxis:**
    *   Scripts inline y archivo `lms-i18n.js` verificados con el motor de análisis sintáctico de Node.js (`vm.Script`): **0 errores de sintaxis**.
    *   Validación JSON: el recuento comprobado es de 175 claves hoja por idioma (`es` y `en`), incluidas las ayudas y tooltips.
4.  **Persistencia:**
    *   Validada la persistencia en `localStorage` de tamaño tipográfico, familia, tema y paleta seleccionada.

---

## 8. Consideraciones para el Administrador de Plataforma

*   **Política de Origen y CORS:** Al utilizar `data-i18n-url` con un dominio diferente al que aloja el HTML, el servidor que sirve `i18n.json` debe incluir la cabecera HTTP `Access-Control-Allow-Origin: *` (o el dominio específico del LMS).
*   **Incrustación en iFrame:** Si el LMS incrusta la plantilla mediante `<iframe>`, se recomienda habilitar los atributos estándar:
    ```html
    <iframe src="C04-reto-un-aviso-a-tiempo (nuevo).html" 
            title="C04 Reto: Un aviso a tiempo" 
            allow="fullscreen" 
            style="width:100%; height:100%; border:none;">
    </iframe>
    ```

---

## 9. Navegación y ajustes móviles

### 9.1. Índice de secciones
En anchos de hasta 860 px, el botón de cabecera abre el índice como diálogo modal a pantalla completa, con una única cabecera visible «Secciones». El viewport usa unidades dinámicas y respeta las áreas seguras del dispositivo. Los cinco destinos usan filas de ancho completo; el botón de cierre mide 44×44 px. Al abrirse, el foco pasa al botón de cierre, el contenido de fondo queda inerte y el foco se mantiene dentro del diálogo. Escape, el botón de cierre y la selección de una sección cierran el índice; después el foco vuelve al disparador. En escritorio, el índice conserva la semántica de `aside` y no se marca como modal.

### 9.2. Ajustes de lectura
En anchos de hasta 860 px, Ajustes ocupa la pantalla completa con cabecera fija, botón de cierre, áreas seguras y controles dispuestos en una columna. Las opciones segmentadas se envuelven en filas, sin una franja con desplazamiento horizontal. Si la altura visible es reducida o el zoom supera el espacio disponible, se desplaza la vista completa como una unidad para que ningún ajuste quede inaccesible.

En escritorio, Ajustes conserva su presentación flotante. Ambos modos admiten Escape, retorno del foco y el recorrido de teclado. Las animaciones respetan `prefers-reduced-motion`.

### 9.3. Contraste y foco
El generador de marca ajusta el texto y los bordes a ratios mínimos de contraste, además de ofrecer tokens para superficies y estados. Los valores predeterminados se reflejan en la tabla de la sección 4.1. La validación de cualquier combinación personalizada del LMS depende de medir los colores que entregue el host.

## 10. Estado de validación (16 de octubre de 2026)

- La tipografía de lectura y de interfaz se unificó en dos familias seleccionables; las preferencias antiguas se normalizan y las fuentes incrustadas que ya no se usan se retiraron.
- Se actualizaron las cuatro paletas predeterminadas y el generador de marca. Se mejoró el contraste de líneas para que los bordes visibles también alcancen 3:1 en fondos y superficies.
- El índice y Ajustes móvil usan vistas de pantalla completa con áreas seguras, controles de cierre de 44 px y estado modal. Las pruebas visuales en dispositivos y la comprobación con un LMS real siguen dependiendo de que el entorno permita abrir la plantilla allí.

- Se incorporaron tooltips contextuales a las cinco decisiones. Cada botón tiene `aria-describedby`, estado `aria-expanded` y un destino `role="tooltip"`; se abren con foco o puntero y se cierran con `Escape` o al perder foco.
- Las ayudas desplegables de cada decisión ahora explican la tarea concreta. Los textos se localizan en español e inglés, tanto desde el HTML autónomo como desde el diccionario LMS.
- `i18n.json` contiene 175 claves hoja por idioma tras añadir el nombre accesible traducible de la navegación interior del índice y el botón para avanzar a la sección siguiente; los recuentos históricos anteriores corresponden a versiones previas.
- La etiqueta de carga del conector LMS permanece desactivada hasta disponer de una ruta pública válida. La integración con un host LMS y las pruebas con lectores de pantalla requieren ese entorno y no se consideran verificadas aquí.
- En la revisión del 16 de octubre de 2026 se reprodujeron y verificaron con Playwright/Chromium desde disco la barra de foco, el índice móvil y el cierre en viewports representativos. La validación con lector de pantalla y la integración con un LMS real siguen pendientes; no se afirma certificación WCAG completa.
