# Registro Detallado de Cambios (Changelog y Auditoría Técnica)

**Plantilla:** C04 – Reto: Un aviso a tiempo  
**Archivo de partida (línea base original):** `C04-reto-un-aviso-a-tiempo(antiguo).html`  
**Archivo de entrega actualizado:** `C04-reto-un-aviso-a-tiempo (nuevo).html`  
**Entorno de desarrollo:** Repositorio Git local y worktree aislado `.worktrees/c04-ux-a11y-i18n`  
**Fecha de intervención y cierre:** 16 de octubre de 2026  
**Estándar de conformidad:** WCAG 2.1 Nivel AA / Mobile-First / Vanilla Web Components  

---

## 1. Resumen Ejecutivo de la Intervención

Este documento certifica y detalla de manera exhaustiva todas las modificaciones realizadas sobre la plantilla interactiva para LMS `C04 – Reto: Un aviso a tiempo`, tomando como punto de comparación estricto el archivo histórico original `C04-reto-un-aviso-a-tiempo(antiguo).html`.

Las mejoras resuelven los problemas visuales críticos detectados en dispositivos móviles, rediseñan y sincronizan el sistema multi-tema, garantizan el cumplimiento de accesibilidad WCAG 2.1 AA en contrastes y navegación por teclado, añaden interactividad guiada al formulario y proporcionan una arquitectura de internacionalización desacoplada lista para integración en plataformas LMS corporativas.

---

## 2. Diagnóstico Técnico de Fallos Reproducidos en la Línea Base

Antes de aplicar las correcciones, se auditaron las versiones previas en navegadores reales mediante Playwright, reproduciendo los siguientes fallos deterministas:

1.  **Desaparición de Textos de Ajustes e Iconos en Móvil:**
    *   *Causa raíz:* En la regla responsive móvil (`@media (max-width: 520px)` y `@media (max-width: 480px)`), existía la regla:
        ```css
        .llr-topbar > div:first-child span { display: none; }
        ```
        Al estar `.llr-actions` dentro de dicho contenedor, esta regla ocultaba indiscriminadamente todos los elementos `<span>` descendientes: los glifos `.tp-glyph` del conmutador Sol/Luna, el título de Ajustes, las etiquetas de las preferencias de lectura y el valor textual de la fuente seleccionada (`[data-dd-label]`).
    *   *Evidencia:* En viewport de 390 px y 320 px, el selector tipográfico quedaba como un botón vacío sin texto ni nombre accesible, y el botón de tema no mostraba ningún icono visible.
2.  **Dimensiones Táctiles Inadecuadas en Controles de Ajustes:**
    *   La clase `.tp-theme` aplicaba `padding: .6em .7em` de forma global, reduciendo el nuevo botón de modo a 20 × 42 px, quedando deformado y por debajo del objetivo táctil mínimo de 44 × 44 px recomendado por WCAG SC 2.5.5.
3.  **Selector de Fuentes Semánticamente Débil:**
    *   La lista de selección de tipografías utilizaba estilos inline con posibles comillas conflictivas y carecía de roles ARIA adecuados (usaba `aria-activedescendant` sin `role="combobox"` ni `role="listbox"` completo), lo que generaba un árbol de accesibilidad inconsistente en lectores de pantalla.
4.  **Contraste Sub-estándar en Bordes Interactivos:**
    *   El token `--line-strong` original en modo claro (`#BDC6BF`) presentaba un ratio de contraste de apenas 1.75:1 contra `#FFFFFF` y 1.63:1 contra superficies secundarias `#F5F7F7`, incumpliendo el criterio WCAG 2.1 SC 1.4.11 (Non-text Contrast, mínimo 3.0:1) para bordes de botones y opciones seleccionables.
5.  **Inconsistencias Documentales Previas:**
    *   Versiones preliminares de la documentación hacían referencia a rutas ajenas al proyecto (`C:\Users\angel.dominguez\...`) y a archivos inexistentes en el paquete, además de registrar afirmaciones no verificadas en navegador.

---

## 3. Detalle de Modificaciones Realizadas en `C04-reto-un-aviso-a-tiempo (nuevo).html`

### 3.1. Correcciones de CSS, Responsive y Mobile-First
*   **Eliminación del Ocultamiento Indiscriminado:** Se reescribió la cascada móvil para limitar cualquier ocultamiento de texto exclusivamente a los rótulos que requieran ser compactados, garantizando que `.tp-glyph`, `.tp-mode-label`, `.tp-pref-l`, y `[data-dd-label]` permanezcan visibles en todas las resoluciones (320 px a 1280 px).
*   **Touch Targets Robustos:**
    *   El botón rápido de tema y el botón de Ajustes se dimensionaron a exactamente **44 × 44 px**.
    *   Los cinco botones segmentados de tamaño (`data-sizes`) y los botones de paleta (`data-only-light`, `data-only-dark`) miden **44 × 44 px**.
    *   El botón selector de fuentes (`.tp-dd-btn`) tiene una altura mínima de **44 px** con padding táctil generoso.
    *   El conmutador de modo en Ajustes (`.tp-mode-toggle`) se diseñó como un control táctil tipo píldora de **138 × 44 px**.
*   **Optimización de Contrastes (WCAG 2.1 AA SC 1.4.11):**
    *   Modo Claro (:root / Día y Sol): `--line-strong` actualizado de `#BDC6BF` a `#748A84`, logrando un contraste de **3.68:1** frente a blanco (`#FFFFFF`) y **3.42:1** frente a superficie suave (`#F5F7F7`).
    *   Modo Oscuro Noche (`brand`): `--line-strong` actualizado de `#426D6D` a `#7EA6A3`, logrando un contraste de **5.06:1** frente a fondo (`#00343C`) y **4.39:1** frente a superficie suave (`#0D3E46`).
    *   Modo Oscuro Estrella (`alt`): `--line-strong` actualizado de `#427879` a `#85ACA9`, logrando un contraste de **4.25:1** frente a fondo (`#004650`) y **3.72:1** frente a superficie suave (`#0D4F59`).
*   **Tipografía Adaptativa:**
    *   Incorporación de función `clamp()` en el cuerpo del texto para una transición fluida entre 16 px (móvil) y 17 px (desktop).

### 3.2. Rediseño de Temas y Sincronización Bidireccional
*   **Renombrado de Paletas:**
    *   Paletas claras: `white` pasa a llamarse visiblemente **«Día»**; `cream` pasa a llamarse **«Sol»**.
    *   Paletas oscuras: `brand` pasa a llamarse **«Noche»**; `alt` (antiguo Petróleo) pasa a llamarse **«Estrella»**.
*   **Interruptor Directo en Ajustes:**
    *   Se integró el botón `.tp-mode-toggle` en la fila final de `#tp-reading-settings`, con el icono sol/luna y la etiqueta interactiva contextual («Pasar a Noche» cuando el tema actual es claro; «Pasar a Día» cuando es oscuro).
*   **Sincronización Bidireccional y Persistencia:**
    *   Al cambiar de tema desde el botón rápido de la cabecera o desde el botón interno de Ajustes (o mediante el atajo de teclado `T`), ambos controles actualizan inmediatamente su estado visual, sus atributos `aria-pressed`, sus etiquetas accesibles `aria-label` y la clase `.toggled`.
    *   La preferencia se guarda en `localStorage` y se sincroniza automáticamente con el iframe del deck didáctico.
*   **Animaciones Suaves y Reducción de Movimiento:**
    *   La rueda de Ajustes (`.tp-prefs-btn svg`) rota +55° al desplegar el panel (`.turn-open`) y -55° al replegarse (`.turn-close`).
    *   El glifo Sol/Luna rota 360° con una transición cúbica suave (`cubic-bezier(.22,.8,.24,1)`).
    *   Se implementó la función `replayMotionClass()` con escucha estricta de `matchMedia('(prefers-reduced-motion: reduce)')`. Si la preferencia de reducción de movimiento está activa, las clases de animación se anulan y el cambio de estado es instantáneo.

### 3.3. Accesibilidad Semántica y Operación por Teclado
*   **Selector de Fuentes (`.tp-dd`):**
    *   Marcado estructurado con `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded="false|true"`, `aria-controls="tp-font-options"`.
    *   Asociación de nombre accesible mediante `aria-labelledby="tp-font-field-label tp-font-value"`.
    *   Lista de opciones (`.tp-dd-list`) con `role="listbox"`, `id="tp-font-options"` y elementos `role="option"` con `aria-selected`.
    *   Navegación completa con teclado: teclas `ArrowDown` y `ArrowUp` mueven el foco visual y actualizan `aria-activedescendant`; tecla `Enter` o `Space` selecciona la tipografía; `Escape` cierra el desplegable y retorna el foco al disparador.
*   **Cierre Accesible con Escape:**
    *   Al presionar `Escape` con el panel `#tp-reading-settings` abierto, este se cierra de forma inmediata (`visibility: hidden`) y devuelve el foco al botón `.tp-prefs-btn`.
*   **Indicadores de Foco `:focus-visible`:**
    *   Reforzados en todos los componentes interactivos nativos y personalizados (`.mp-chip`, `.mp-zone`, `.or-chip`, `.or-slot`, `.dd-btn`, `.dd-opt`, `.tp-dd-btn`, `.tp-mode-toggle`) con anillo exterior de alto contraste.
*   **Regiones Dinámicas para Lectores de Pantalla:**
    *   El indicador de progreso `[data-ypr-status]`, los 5 mensajes explicativos `.ydc-live`, el feedback del minitest y el estado de finalización implementan `role="status"` y `aria-live="polite"`.

### 3.4. Interactividad del Formulario y Actividades Pedagógicas
*   **Ayudas Desplegables Contextuales:**
    *   En cada grupo de decisiones `.ydc-item` se incorporó un elemento nativo accesible `<details class="ydc-help">` con `<summary>` estilizado como píldora accesible por teclado y puntero táctil, explicando la dinámica de consecuencias sin depender de estados hover.
*   **Micro-animación en Ilustraciones:**
    *   Al seleccionar una respuesta en los formularios de decisión, la ilustración vectorial SVG de la escena (`.yart-says > .yart`) ejecuta una micro-animación elástica (`turn-pop`) que se limpia tras 600 ms, respetando `prefers-reduced-motion`.
*   **Resumen Acumulativo «Te llevas»:**
    *   Las 18 decisiones del reto mantienen sincronización bilingüe inmediata. Al cambiar de idioma, los textos de consecuencias ya seleccionados se actualizan en el panel de cierre sin alterar el progreso.

---

## 4. Nuevos Módulos y Recursos Incorporados

### 4.1. Diccionario Bilingüe (`i18n.json`)
*   Se extrajeron y estructuraron 146 claves hoja para español (`es`) e inglés (`en`).
*   Familias de claves cubiertas:
    *   `settings.*`: títulos, etiquetas de herramientas, nombres de paletas y etiquetas de tamaño tipográfico (`size92` a `size200`).
    *   `theme.*`: etiquetas del conmutador rápido y del botón de modo.
    *   `activity.*`: textos de ayuda pedagógica, instrucciones y botones de acción.
    *   `matching.*`, `ordering.*`, `gaps.*`: etiquetas de accesibilidad para zonas, ranuras y huecos interactivos.
    *   `completion.*`: mensajes de avance, progreso y finalización.
    *   `legacy.content.*` y `course.content.*`: cobertura completa de textos didácticos del curso.

### 4.2. Cargador Asíncrono para LMS (`lms-i18n.js`)
*   Script autocontenido y tolerante a fallos diseñado para entornos LMS:
    *   Lectura de URL mediante el atributo `data-i18n-url`.
    *   Gestión de errores con `try/catch`: si la petición de red falla o el archivo no existe, la plantilla conserva el contenido nativo en español y despacha el evento `tp:i18nerror`.
    *   Preservación de espaciado: respeta espacios en blanco limítrofes al sustituir nodos de texto inline para evitar palabras pegadas.
    *   Sincronización con eventos del LMS: escucha `tp:languagechange` para conmutar idioma en caliente actualizando `document.documentElement.lang`, textos del DOM y atributos ARIA.
    *   Despacho del evento `tp:i18napplied` para notificar a la plataforma que la internacionalización ha finalizado.

### 4.3. Manual Técnico (`README.md`)
*   Creación de un documento técnico exhaustivo que documenta la arquitectura del sistema, la guía de configuración y despliegue en LMS, el mapa de colores y contrastes WCAG, y los procedimientos de prueba local.

---

## 5. Auditoría de Calidad y Resultados de Verificación QA

### 5.1. Pruebas de Layout en Playwright (11 Viewports)
Ejecutadas con Google Chrome Headless en anchos: **320, 360, 375, 390, 520, 640, 768, 860, 861, 1024 y 1280 px**.
*   **Desbordamiento horizontal:** 0 px en todas las resoluciones (`docWidth === width` y `bodyWidth === width`).
*   **Posicionamiento de controles:** En 320 px, tanto el botón rápido (`x: 216 px`) como el de ajustes (`x: 264 px`) quedan dentro del margen visible con dimensiones de 44 × 44 px.

### 5.2. Verificación de Contraste WCAG 2.1 AA
Cálculos de luminancia relativa algorítmica:
*   **Texto normal (`--fg` / `--bg`):**
    *   Día (`white`): **13.49 : 1** (Pasa AAA)
    *   Sol (`cream`): **12.28 : 1** (Pasa AAA)
    *   Noche (`brand`): **12.87 : 1** (Pasa AAA)
    *   Estrella (`alt`): **10.05 : 1** (Pasa AAA)
*   **Bordes de componentes interactivos (`--line-strong` / `--bg-soft`):**
    *   Día (`white`): **3.42 : 1** (Pasa AA SC 1.4.11)
    *   Sol (`cream`): **3.10 : 1** (Pasa AA SC 1.4.11)
    *   Noche (`brand`): **4.39 : 1** (Pasa AA SC 1.4.11)
    *   Estrella (`alt`): **3.72 : 1** (Pasa AA SC 1.4.11)

### 5.3. Navegación por Teclado y Estados
*   [x] Apertura de Ajustes con Enter/Espacio y foco en primer control activo.
*   [x] Selección tipográfica con flechas de dirección y confirmación con Enter.
*   [x] Conmutación de tema mediante tecla `T` con actualización sincronizada de ambos interruptores.
*   [x] Cierre de panel de Ajustes con tecla `Escape` y retorno de foco a `.tp-prefs-btn`.
*   [x] Anulación de animaciones bajo emulación de `prefers-reduced-motion: reduce`.

### 5.4. Análisis Sintáctico y Cobertura de Claves
*   [x] `vm.Script` en Node.js sobre los dos scripts inline y `lms-i18n.js`: **0 errores de sintaxis**.
*   [x] Barrido estático de cadenas traducibles: 146 claves coincidentes al 100% entre `es` y `en` en `i18n.json`; **0 claves faltantes**.
*   [x] La línea de inclusión de `lms-i18n.js` permanece comentada de forma segura en el `<head>`:
    ```html
    <!-- <script src="./lms-i18n.js" data-i18n-url="./i18n.json" defer></script> -->
    ```

### 5.5. Fase 6: Optimización UX, Accesibilidad y Feedback Continuo
*   [x] **Rotación ultrasuave de la rueda de ajustes:** Sustituido el mecanismo anterior de `@keyframes` + listener `animationend` por una transición CSS declarativa `420ms cubic-bezier(.22, 1, .36, 1)` vinculada al atributo `[open]`. La rueda gira +60° al abrirse de forma orgánica, se mantiene orientada mientras el panel está activo y regresa suavemente al cerrarse, eliminando cualquier salto o tirón visual.
*   [x] **Animación reactiva de ilustraciones (`.ydc-person`):** Conectada la clase `.is-animating` en el listener `change` de cada opción del reto, reiniciando el reflow para reproducir el cabeceo/saludo visual en cada selección (respetando `prefers-reduced-motion`).
*   [x] **Anuncios accesibles en huecos (`fill-in-the-gaps`):** La función `paint()` del selector de huecos actualiza dinámicamente el `aria-label` del botón combobox para anunciar tanto la posición como el valor actualmente seleccionado (ej. `"Hueco 1 de 3: aviso"`).
*   [x] **Feedback visual enriquecido de progreso:**
    *   Cabecera de paso en cada tarjeta de decisión (`"Decisión X de 5"` con distintivo de estado `"Pendiente"` / `"Completada"`).
    *   Tira global de puntos de progreso interactivos con live region para lectores de pantalla.
    *   Icono animado de confirmación (check badge) en la opción seleccionada.
    *   Indicador de sección completada en el índice lateral (`.llr-toc-link.is-done`).
    *   Tooltip accesible (`title` localizado) en opciones exploradas previamente.
    *   Internacionalización completa (ES/EN) de todas las nuevas etiquetas y estados en `i18n.json` y fallbacks en línea.

### 5.6. Fase 7: Plan Maestro y Rediseño de Navegación Móvil (WCAG 2.1 AA)
*   [x] **Rediseño del Índice de Navegación Móvil (`<= 860px`):** Reemplazada la barra horizontal de chips desbordante por un selector de cabecera accesible (`#llr-nav-btn`) y un cajón modal inferior (*bottom-sheet drawer* `.llr-toc` con `#llr-toc-backdrop`).
    *   Recuperación de 46 px de altura vertical para lectura en móviles.
    *   Objetivos táctiles superiores a 48 px en orientación vertical con checkmarks de progreso.
    *   Soporte ARIA: `aria-haspopup="dialog"`, `aria-expanded="false|true"`, `aria-controls="llr-toc"`, botón de cierre `#llr-toc-close`.
    *   Trampa de teclado (`Tab`/`Shift+Tab`) en el cajón modal, cierre con `Escape`, clic en telón o selección de enlace, y retorno de foco al activador.
*   [x] **Sección Activa Dinámica (`aria-current="true"`):** Implementado en el observador de desplazamiento del índice para anunciar en lectores de pantalla la sección que el alumno está leyendo en cada momento.
*   [x] **Trampa de Foco en Ajustes:** Añadida captura cíclica de tabulación en `#tp-reading-settings` mientras está abierto.
*   [x] **Escalabilidad de Texto en Opciones (WCAG 1.4.4):** Sustitución de altura fija en `.ydc-opt` por `min-height: 3.25rem`, garantizando adaptabilidad completa sin recortes al 200% de zoom y tipografía `xxl`.
*   [x] **Alineación Tipográfica Accesible (WCAG 1.4.8):** Regla de alineación a la izquierda obligatoria para viewports `< 768px` o fuentes `xl`/`xxl` para evitar ríos de espacios en blanco.
*   [x] **Internacionalización del Sistema de Navegación:** Nuevas claves `navigation.openToc`, `navigation.closeToc`, `navigation.tocRegion` y `navigation.sectionStep` añadidas a `i18n.json` en español e inglés.

---

## 6. Registro de Integridad Criptográfica (Hashes SHA-256)

Hashes calculados sobre los archivos finales entregados en el paquete:

| Archivo | Hash SHA-256 | Estado |
| :--- | :--- | :--- |
| `C04-reto-un-aviso-a-tiempo (nuevo).html` | `72DD8C886343B1B7CBB3EEE87F1FC1B27220185B0BDD476A7A41EF05E7199AB1` | Modificado, optimizado y auditado |
| `C04-reto-un-aviso-a-tiempo(antiguo).html` | `836A4D99B4174F145E86B274D97A49E94E4DA9C32CBEC652291E8BA95581A19D` | Original histórico intacto |
| `i18n.json` | `899F2A4F1DEC266D55E0CC16518534452A372B7E8F327609AF06199CC46C7FFB` | Diccionario bilingüe ampliado |
| `lms-i18n.js` | `E80B9625001B57544B7A6F78BEEA070ECB07738A1685506D8C4ADF3144C8E68D` | Conector LMS |
| `README.md` | `708614EC38045C229E5889E1DAF8AA100FD55A7CB524973F1C0D0700CD590608` | Manual técnico |
| `cambios.md` | *(Este documento)* | Registro de cambios |


