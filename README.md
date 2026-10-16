# Manual Técnico – Plantilla Interactiva LMS (C04 Reto: Un aviso a tiempo)

**Módulo:** C04 – Reto: Un aviso a tiempo  
**Documento:** Manual Técnico, Guía de Arquitectura, Accesibilidad e Integración  
**Versión:** 2.0 (Producción / LMS Ready)  
**Fecha:** 16 de octubre de 2026  

---

## 1. Resumen Ejecutivo y Propósito

Este paquete contiene la plantilla interactiva para plataformas de aprendizaje virtual (LMS) del reto **«Un aviso a tiempo»**. El diseño sigue una arquitectura web moderna, ligera y auto-contenida (Vanilla HTML5, CSS3 modular y JavaScript ES6+ sin dependencias de frameworks externos como React o TailwindCSS), optimizada para carga instantánea, compatibilidad transversal en navegadores de escritorio y dispositivos móviles, y cumplimiento estricto de los estándares de accesibilidad **WCAG 2.1 Nivel AA**.

### Objetivos Clave de la Implementación
1. **Resolución de Bugs Móviles Históricos:** Corrección definitiva de reglas CSS de ocultamiento indiscriminado en pantallas móviles (<= 520px) que impedían visualizar el selector tipográfico y los glifos de tema (Sol/Luna).
2. **Sistema Multi-Tema Refinado:** Rediseño conceptual de paletas con nomenclatura clara («Día» y «Sol» para fondos claros; «Noche» y «Estrella» para fondos oscuros), sincronización bidireccional entre el control rápido de cabecera y el panel de Ajustes, y contraste no textual garantizado (SC 1.4.11 > 3:1).
3. **Accesibilidad Universal (a11y):** Estructura semántica ARIA rigurosa, soporte completo de navegación por teclado, foco visible reforzado, soporte nativo de `prefers-reduced-motion` y áreas táctiles mínimas de 44×44 px.
4. **Interactividad Progresiva:** Ayudas contextuales desplegables (`<details>/<summary>`) activables por teclado y tacto, micro-animaciones fluidas en ilustraciones SVG al interactuar con opciones, y contadores de progreso reactivos.
5. **Internacionalización Desacoplada (i18n):** Carga opcional mediante diccionario JSON externo (`i18n.json`) y conector modular (`lms-i18n.js`), con arquitectura *graceful degradation* (fallback nativo bilingüe inline) y canal de eventos para hosts LMS.

---

## 2. Inventario de Archivos y Responsabilidades

| Archivo | Rol en el Paquete | Descripción Técnica |
| :--- | :--- | :--- |
| `C04-reto-un-aviso-a-tiempo (nuevo).html` | **Plantilla Maestra** | Documento interactivo para el alumno. Integra los estilos CSS encapsulados, marcado HTML5 semántico, componentes didácticos y controladores de estado cliente. |
| `C04-reto-un-aviso-a-tiempo(antiguo).html` | **Línea Base Histórica** | Archivo original de partida conservado intacto para trazabilidad, comparaciones de regresión y auditorías de código. |
| `i18n.json` | **Diccionario Externo** | Repositorio de 146 claves por idioma (`es` y `en`) con todas las cadenas de interfaz, accesibilidad, textos pedagógicos y respuestas. |
| `lms-i18n.js` | **Conector LMS** | Script ligero y asíncrono para consumir `i18n.json`, traducir el árbol DOM, actualizar atributos ARIA y responder a eventos `tp:languagechange`. |
| `cambios.md` | **Registro de Cambios** | Historial técnico de auditoría y transformaciones detalladas respecto al original antiguo. |
| `README.md` | **Manual Técnico** | Documentación de arquitectura, diseño, contrastes, accesibilidad e instrucciones de despliegue. |

---

## 3. Arquitectura del Diseño, Temas y Responsive

### 3.1. Nomenclatura y Configuración de Paletas
La plantilla cuenta con cuatro variantes de visualización organizadas en dos modos maestros:

*   **Modo Claro (`data-theme="light"`):**
    *   **«Día»** (`data-paper="white"`): Fondo blanco puro (`#FFFFFF`) con superficie suave (`#F5F7F7`). Diseñado para entornos con alta iluminación ambiental.
    *   **«Sol»** (`data-paper="cream"`): Fondo cálido apergaminado (`#F7F4EC`) con superficie suave (`#EDECE5`). Diseñado para reducir la fatiga visual en sesiones prolongadas.
*   **Modo Oscuro (`data-theme="dark"`):**
    *   **«Noche»** (`data-ink="brand"`): Fondo azul petróleo profundo (`#00343C`) con superficies en `#0D3E46`.
    *   **«Estrella»** (`data-ink="alt"`): Fondo teal oscuro refinado (`#004650`) con superficies en `#0D4F59` (reemplaza con ventaja estética al antiguo tono plano «Petróleo»).

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
*   **Glifo Sol/Luna:** Rota suavemente 360° al cambiar de modo mediante la clase temporal `.toggled`.
*   **Rueda de Ajustes (`.tp-prefs-btn svg`):** Gira sutilmente hacia la derecha (+55°) al abrirse (`.turn-open`) y hacia la izquierda (-55°) al cerrarse (`.turn-close`).
*   **Control de movimiento reducido:** La función `replayMotionClass()` consulta activamente `matchMedia('(prefers-reduced-motion: reduce)')`. Si el usuario tiene activada la reducción de movimiento en su sistema operativo, las clases de animación no se aplican y la transición visual se realiza de forma estática e instantánea.

### 3.4. Tipografía y Responsive Mobile-First
*   **Fuentes disponibles:** Inter (Sans por defecto), Literata (Serif editorial), Atkinson Hyperlegible (diseñada específicamente para baja visión) y Sistema (fuente nativa del dispositivo).
*   **Escalado Tipográfico Dinámico:** Se implementa `clamp()` para la fuente base del cuerpo:
    $$\text{Font Size} = \text{clamp}(16\text{ px}, 15.6\text{ px} + 0.35\text{vw}, 17\text{ px})$$
*   **Objetivos Táctiles (Touch Targets):** Todos los botones del selector de tamaños (`data-sizes`), paletas (`data-only-light`, `data-only-dark`) y conmutadores cumplen con un mínimo de **44×44 px** (o altura mínima de 44 px en comboboxes y toggles extendidos).
*   **Eliminación de Desbordamiento:** El panel de lectura y la barra de herramientas han sido auditados en anchos desde **320 px hasta 1280 px**, garantizando `scrollWidth === innerWidth` (cero desbordamiento horizontal).

---

## 4. Auditoría de Accesibilidad (WCAG 2.1 Nivel AA)

### 4.1. Medición de Ratios de Contraste
Las cuatro combinaciones han sido validadas algorítmicamente bajo la fórmula de luminancia relativa de WCAG:

| Métrica / Elemento | Criterio WCAG | Día (`white`) | Sol (`cream`) | Noche (`brand`) | Estrella (`alt`) | Estado |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Texto Principal (`--fg` vs `--bg`)** | SC 1.4.3 (>= 4.5:1) | **13.49 : 1** | **12.28 : 1** | **12.87 : 1** | **10.05 : 1** | **Pasa (AAA)** |
| **Texto Secundario (`--fg-soft` vs `--bg`)** | SC 1.4.3 (>= 4.5:1) | **8.10 : 1** | **7.37 : 1** | **10.85 : 1** | **8.48 : 1** | **Pasa (AAA)** |
| **Texto Apagado / Metadatos (`--muted`)** | SC 1.4.3 (>= 4.5:1) | **6.04 : 1** | **5.50 : 1** | **6.85 : 1** | **6.69 : 1** | **Pasa (AA)** |
| **Acento Interactivo (`--accent` vs `--bg`)** | SC 1.4.3 (>= 4.5:1) | **10.54 : 1** | **9.59 : 1** | **6.27 : 1** | **4.90 : 1** | **Pasa (AA)** |
| **Texto en Botón Acento (`--on-accent`)** | SC 1.4.3 (>= 4.5:1) | **10.05 : 1** | **10.05 : 1** | **6.27 : 1** | **4.90 : 1** | **Pasa (AA)** |
| **Bordes de Controles (`--line-strong` vs soft)** | SC 1.4.11 (>= 3.0:1) | **3.42 : 1** | **3.10 : 1** | **4.39 : 1** | **3.72 : 1** | **Pasa (AA)** |

*Nota sobre bordes:* El valor `--line-strong` fue ajustado estratégicamente a `#748A84` en modo claro, `#7EA6A3` en modo Noche y `#85ACA9` en modo Estrella para asegurar que las opciones de formulario (`.ydc-opt`), chips de arrastre y botones tengan límites discernibles con ratio > 3:1 frente a superficies adyacentes.

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
    *   Anillo de foco prominente con `outline: 2px solid var(--accent); outline-offset: 2px` en todos los controles interactivos nativos y personalizados.

---

## 5. Interactividad del Formulario y Actividades Didácticas

La plantilla integra una serie de componentes de aprendizaje activo que refuerzan la retención sin desviar la atención del estudiante:

1.  **Decisiones del Reto (`.ydc-item`):**
    *   Cada bloque de decisión incorpora un componente nativo accesible `<details class="ydc-help">` con `<summary>`, que ofrece guía pedagógica sin bloquear la vista.
    *   Al seleccionar una opción (`input[type="radio"]`), la ilustración SVG superior asociada `.yart-says > .yart` recibe una micro-animación sutil de rebote elástico (`turn-pop`), ofreciendo retroalimentación visual inmediata.
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

La plantilla ha superado una batería de pruebas automatizadas con **Playwright** en Chrome Headless:

1.  **Pruebas de Disposición Responsive:**
    *   Viewports evaluados: 320, 360, 375, 390, 520, 640, 768, 860, 861, 1024 y 1280 px.
    *   Resultado: Cero desbordamiento horizontal (`body.scrollWidth === innerWidth`).
2.  **Zoom de Texto al 200%:**
    *   Verificado en viewport de 320 px con el ajuste tipográfico máximo (`xxl`). La columna de lectura se adapta sin cortar contenido ni expulsar elementos de la pantalla.
3.  **Auditoría de Sintaxis:**
    *   Scripts inline y archivo `lms-i18n.js` verificados con el motor de análisis sintáctico de Node.js (`vm.Script`): **0 errores de sintaxis**.
    *   Validación JSON de `i18n.json`: Parseo conforme con cobertura al 100% (146 claves por idioma, 0 claves faltantes).
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

## 9. Rediseño de Navegación Móvil y Cumplimiento Avanzado WCAG (Plan Maestro)

### 9.1. Rediseño del Índice de Navegación Móvil (<= 860px)
En pantallas móviles y tablets (`<= 860px`), la barra horizontal tradicional de chips consumía más de 100 px de altura vertical, ocultaba secciones fuera del viewport y carecía de scroll sincronizado. Se ha reemplazado por un **Menú Selector de Cabecera + Cajón Modal Inferior (Bottom-Sheet Drawer)**:

1.  **Botón Selector de Cabecera (`#llr-nav-btn`):**
    *   Ubicado en la barra superior móvil (`.llr-topbar-nav`).
    *   Muestra dinámicamente la sección activa y el progreso global: `X/5 · [Título de la sección]`.
    *   Soporte ARIA completo: `aria-haspopup="dialog"`, `aria-expanded="false|true"`, `aria-controls="llr-toc"` y `aria-label` descriptivo.
    *   Recupera más de 46 px de espacio vertical útil para la lectura en pantallas táctiles.
2.  **Cajón Modal Inferior Accesible (`#llr-toc`):**
    *   Se despliega suavemente desde la base de la pantalla mediante una animación `cubic-bezier(0.16, 1, 0.3, 1)`.
    *   Fondo translúcido con desenfoque (`backdrop-filter: blur(4px)`) y telón (`#llr-toc-backdrop`) para aislar la experiencia de navegación.
    *   Cabecera dedicada con título accesible (`data-i18n="navigation.tocRegion"`) y botón de cierre táctil (`#llr-toc-close`) de 44×44 px.
    *   Ítems verticales de ancho completo con touch target superior a 48 px, tipografía legible e indicación visual de avance (checkmarks).
3.  **Gestión de Foco y Trampa de Teclado (Focus Trap):**
    *   Al abrirse, el foco se sitúa de inmediato en la sección activa o en el botón de cierre.
    *   Trampa de foco estricta mediante captura de tecla `Tab` / `Shift+Tab`, impidiendo fugas de foco hacia el fondo de la página.
    *   Cierre ágil mediante tecla `Escape`, clic sobre el telón (`#llr-toc-backdrop`), botón de cierre o selección de cualquier sección.
    *   Al cerrarse, el foco se devuelve de forma garantizada al botón disparador `#llr-nav-btn`.

### 9.2. Perfeccionamiento de Accesibilidad WCAG 2.1 AA
*   **Sección Activa Dinámica (`aria-current="true"`):**
    *   El enlace TOC correspondiente a la sección actualmente visible recibe dinámicamente `aria-current="true"`. Al hacer scroll fuera de la sección, el atributo se remueve limpiamente (WCAG SC 1.3.1 y 4.1.2).
*   **Trampa de Foco en Ajustes de Lectura:**
    *   El panel flotante `#tp-reading-settings` cuenta con un listener de foco cíclico que atrapa la navegación por tabulación mientras se encuentre abierto (`[open]`).
*   **Escalabilidad Relativa en Opciones (WCAG SC 1.4.4):**
    *   Se sustituyeron alturas fijas en `.ydc-opt` por unidades relativas `min-height: 3.25rem`, permitiendo que el texto crezca sin desbordamiento ni cortes bajo un zoom del 200% y en tamaño de fuente máximo (`xxl`).
*   **Alineación Tipográfica Antirríos (WCAG SC 1.4.8):**
    *   Se forzó alineación izquierda estricta (`text-align: left`) en resoluciones móviles (`< 768px`) y con fuentes grandes (`xl` y `xxl`), evitando la formación de "ríos de espacio blanco" desorientadores para lectores con dislexia o baja visión.

