# 🌌 OMAR ADEL CORRAL | Ultra-Premium Full Stack & Mobile Portfolio

Este es el manual técnico maestro de referencia de **Omar Adel Corral** para comprender, depurar y recrear desde cero este portafolio interactivo de nivel internacional (estilo **Awwwards / FWA**). 

Diseñado con una estética cyberpunk-editorial de alto contraste, combina un motor de proyección 3D matemático puro sobre Canvas, una terminal Unix interactiva, sintetizadores de audio integrados y distorsiones elásticas de scroll en tiempo real para presentar la trayectoria y proyectos de Omar.

---

## 📂 Arquitectura del Proyecto

Para recrear este portafolio, la estructura de archivos e imágenes debe organizarse exactamente de la siguiente forma:

```
PortfolioWeb/
├── index.html              # Estructura semántica, nodos del terminal, layouts y CDN scripts
├── css/
│   └── styles.css          # Sistema de diseño, variables CSS, film grain, orbes y transforms 3D
├── js/
│   ├── particles.js        # Constelación interactiva, chispas físicas y Cubo 3D por software
│   ├── main.js             # Lógica central: cursor LERP, terminal logger, scramble y audio context
│   └── animations.js       # Smooth scroll (Lenis), secuencias GSAP, marquees por velocidad y color morphs
└── assets/                 # Gráficos y capturas de pantalla de los proyectos
    ├── project1.png        # FIT-WIN - Ecosistema Fitness Full Stack
    ├── project2.png        # CAR-FINDER - Scraper de Vehículos
    └── project3.png        # DESTAKA - APIs RESTful & UX-UI
```

---

## 🛠️ Stack de Tecnologías Clave y CDNs

Para evitar la sobrecarga y latencias de descarga, la web está construida completamente sobre **Vanilla JS, HTML5 y CSS3**, apoyándose únicamente en tres librerías externas de animación y scroll a través de CDN (declaradas al final del `body` en `index.html`):

1. **GSAP Core v3.12.5** (Motor de animación de alta velocidad):
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
   ```
2. **GSAP ScrollTrigger v3.12.5** (Sincronizador de animaciones con el scroll del usuario):
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
   ```
3. **Lenis v1.0.42** (Motor de suavizado de inercia y fricción para scroll):
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
   ```
4. **Google Fonts** (Tipografías premium sin impacto de renderizado local):
   * **Syne:** Títulos masivos e impactantes.
   * **Space Grotesk:** Subtítulos de consola, badges y datos técnicos.
   * **Inter:** Lecturas de texto semántico y descripciones.
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
   ```

---

## 💎 Guía Técnica de Recreación Paso a Paso

A continuación se detallan todas las mecánicas, algoritmos y configuraciones técnicas divididas por módulos funcionales para que puedas implementarlas de forma independiente:

### 1. Sistema de Diseño y Texturas CSS (`css/styles.css`)

El archivo CSS centraliza todo el look & feel interactivo basándose en variables CSS personalizadas y efectos de distorsión cinemáticos:

* **Variables de Diseño (:root):**
  * Paleta de fondo profunda: `--color-bg: #07070a;` y `--color-bg-alt: #0c0c12;`.
  * Acentos de neón calibrados en HSL: Cian (`#00f2fe`), Violeta (`#a18cd1`) y Rosa (`#ff0844`).
  * Curvas de interpolación premium: `--ease-out-expo` (`cubic-bezier(0.16, 1, 0.3, 1)`) y `--ease-elastic` (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
* **Textura de Grano Cinematográfico (.film-grain):**
  Para dar un toque de alta fidelidad analógica, se superpone una capa fija infinita con ruido matemático SVG embebido en base64 con animación de desfase constante:
  ```css
  .film-grain {
      position: fixed;
      top: -50%; left: -50%; right: -50%; bottom: -50%;
      width: 200%; height: 200%;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' ... noiseFilter ...");
      opacity: 0.008;
      pointer-events: none;
      z-index: 9999;
      animation: grain-animation 8s steps(10) infinite;
  }
  ```
* **Orbes Ambientales Shifting (.ambient-orb):**
  Tres esferas gigantes desenfocadas (`filter: blur(140px)`) flotan en coordenadas absolutas y se mezclan mediante `mix-blend-mode: screen`. Sus colores cambian elásticamente a través de transiciones CSS reactivas controladas dinámicamente por GSAP al cambiar de sección.
* **Ocultado de Cursor Nativo:**
  Para evitar que el cursor del sistema rompa el renderizado del cursor holográfico, se desactiva mediante CSS en dispositivos con capacidad de hover:
  ```css
  @media (hover: hover) and (pointer: fine) {
      body, a, button, .magnetic {
          cursor: none !important;
      }
  }
  ```

---

### 2. Motor de Partículas y Proyección 3D Matemática (`js/particles.js`)

Se renderiza sobre un único `<canvas id="bg-canvas">` que ocupa el 100% de la pantalla a 120 FPS fijos. Ejecuta tres sub-motores por software puro:

#### A. Red de Partículas e Interacción Radial (Constelación)
* **Comportamiento:** 100 puntos enlazados que rebotan en los límites de la pantalla.
* **Efecto Imán:** Si el cursor se acerca a menos de `radius: 160px`, se aplica una fuerza de atracción elástica proporcional a la distancia y se incrementa su opacidad y tamaño.
* **Malla de Conexión:** En cada bucle, se calcula la distancia euclidiana entre cada par de puntos $p_1$ y $p_2$. Si la distancia $d < 110px$, se dibuja una línea blanca ultrafina con opacidad inversamente proporcional a la distancia:
  $$\alpha = \left(1 - \frac{d}{110}\right) \times 0.07$$

#### B. Física de Estela de Chispas del Cursor (Cursor Sparks)
* **Fórmula Aplicada:** Al desplazar el ratón, se calcula la velocidad física del cursor y se emiten partículas efímeras con fuerzas vectoriales en ángulos aleatorios.
* **Arrastre y Resistencia del Aire (Fricción):** El vector de velocidad se amortigua en cada fotograma multiplicándose por un coeficiente elástico:
  `vx *= 0.96; vy *= 0.96;`
* **Gravedad Acumulativa:** Se añade una aceleración vertical constante hacia abajo en cada frame:
  `vy += 0.03;`

#### C. Cubo Criptográfico Holográfico 3D (Renderizado 3D por Software)
Dibuja un cubo tridimensional sin librerías externas (sin Three.js ni WebGL), calculando las proyecciones en tiempo real mediante matrices trigonométricas.
* **Estructura:** Se definen 8 vértices en coordenadas locales $[-s, s]$ y 12 aristas mapeadas por los índices de sus vértices.
* **Rotación y Euler:** Los ángulos de rotación en los tres ejes ($A_X, A_Y, A_Z$) se actualizan elásticamente inclinándose hacia el cursor mediante interpolaciones lineales (LERP):
  `angleY += (targetRotY - angleY) * 0.06;`
  `angleX += (targetRotX - angleX) * 0.06;`
* **Cálculo de Proyección (Trigonometría 3D a 2D):**
  Para cada vértice $(x, y, z)$, se aplican rotaciones sucesivas sobre los senos y cosenos de los tres ángulos (matrices de rotación Euler de 3D) para calcular las nuevas coordenadas transformadas $(x_3, y_3, z_2)$. Posteriormente se proyectan en el plano 2D usando una fórmula de perspectiva focal clásica:
  $$\text{scale} = \frac{d_{\text{camera}}}{d_{\text{camera}} + z_2}$$
  $$\text{projX} = \text{centerX} + x_3 \times \text{scale}$$
  $$\text{projY} = \text{centerY} + y_3 \times \text{scale}$$
* **Holographic Depth Fade (Opacidad de Profundidad):** Las líneas de las aristas del cubo se dibujan con un gradiente lineal cian/violeta. Su opacidad general se escala dinámicamente según la coordenada transformada de profundidad $z_2$ de la arista para crear un efecto tridimensional realista:
  `brightness = Math.max(0.12, Math.min(0.75, 1 - (averageDepth + size) / (size * 2)))`
* **Caracteres Binarios Volumétricos:** 18 dígitos `0` y `1` flotan dentro de la caja virtual del cubo. Son proyectados en pantalla aplicando las mismas matrices trigonométricas que los vértices del cubo, flotando con un suave micro-drift senoidal individual en su eje Z.

---

### 3. Sistema de Interacción Central (`js/main.js`)

Implementa la experiencia táctil interactiva, respondiendo instantáneamente a los hovers y clicks del usuario.

#### A. Cursor Dual Inteligente
* **Estructura:** Un punto central de precisión `.cursor-dot` y un aro reactivo `.cursor-circle` que le persigue.
* **Suavizado LERP (Inercia):** Para crear un movimiento suave y dinámico, la posición del aro se calcula restando la distancia actual del cursor y multiplicándola por una constante de retardo (LERP a `0.1` para el aro, `0.3` para el punto, y `0.04` para un gran orbe de luz azul difusa de fondo):
  $$\text{pos.x} += (\text{mouse.x} - \text{pos.x}) \times 0.1$$
* **Estados Activos:** 
  * Al pasar sobre un botón o enlace (`a`, `button`), el aro se expande a `180px`, se difumina mediante un degradado radial interno y activa un modo de fusión por pantalla (`mix-blend-mode: screen`).
  * Al pasar sobre una tarjeta de proyecto, se expande a `220px` y revela el texto *"VER"* centrado, el cual adquiere un brillo de neón cian.

#### B. Efecto Paralaje 3D Holográfico en Tarjetas (Hover Cards)
* **Funcionamiento:** Al mover el ratón sobre las tarjetas de proyectos (`.project-card`), se calculan las coordenadas locales del ratón respecto al centro geométrico del contenedor.
* **Transformaciones 3D e Inclinación:** Se aplica una rotación interactiva en los ejes X e Y (máximo 7 grados):
  `rotateX = ((centerY - y) / centerY) * 7;`
  `rotateY = ((x - centerX) / centerX) * 7;`
* **Flotación Interna en Eje Z (Multi-Layer Depth):** Se desglosan las capas internas de la tarjeta (imagen, categorías y títulos) y se les aplican coeficientes de desplazamiento opuestos en 3D. Esto provoca que el texto flote físicamente hacia afuera mediante transformaciones de profundidad reales (`translateZ(50px)`), logrando un efecto paralaje tridimensional impecable.

#### C. Atracción Magnética en Elementos de Interfaz
* **Comportamiento:** Los botones principales de la cabecera y redes sociales aplican una atracción elástica de succión al pasar a menos de $40px$.
* **Mecánica:** Calcula la distancia entre el ratón y el punto central del botón y desplaza el elemento físico un porcentaje controlado de esa distancia (`relX * (strength / 100)`). Al retirar el ratón, el elemento regresa elásticamente a su posición original mediante una transición `cubic-bezier(0.34, 1.56, 0.64, 1)`.

#### D. Decodificador Scramble Cyberpunk
* **Mecánica:** Al hacer hover sobre los enlaces y menús, el texto no se revela de golpe. Los caracteres del botón se sustituyen a gran velocidad por símbolos alfanuméricos aleatorios de la cadena de glifos `$%&?*#@█░10XYZ+-[]{}<>`, reconstruyendo e imprimiendo secuencialmente el texto de izquierda a derecha en un intervalo cíclico repetitivo de `30ms`.

#### E. Consola Unix Terminal Debugger (Live Stream Logger)
* **Interactividad:** Cuando el usuario hace hover sobre cualquier tarjeta de proyecto, la terminal fija de la derecha se activa de inmediato.
* **Bucle de Simulación:**
  1. Limpia instantáneamente las trazas previas e interrumpe cualquier tecleado activo.
  2. Consulta la base de datos interna de eventos reales del proyecto (JUnit tests, scrapers, APIs).
  3. Formatea la hora física real del ordenador del usuario (`[HH:MM:SS]`).
  4. Inyecta concurrentemente cada línea de depuración técnica del servidor con un retardo escalonado de consola (`index * 180ms`), forzando un scroll automático vertical al final del panel.

#### F. Sintetizador de Sonido por Software (Sinth Audio Web API)
Para asegurar retroalimentación táctil inmersiva de ciencia ficción sin descargar pesados ficheros de sonido `.mp3`, el archivo JS genera y modula ondas físicas en tiempo real usando la API del navegador `AudioContext`:
* **Sonido Click:** Genera un oscilador en onda senoidal pura (`sine`) a una frecuencia alta inicial ($1400Hz$) que decae exponencialmente a $400Hz$ en apenas $0.08$ segundos, reduciendo simultáneamente la ganancia a cero.
* **Sonido Hover (Deslizamiento):** Emplea un oscilador de onda triangular (`triangle`) a baja frecuencia ($160Hz$) que asciende elásticamente a $280Hz$ en un intervalo de $0.12$ segundos para simular el paso por un campo electromagnético digital.

#### G. Cajón Desplizable de Especificaciones (Inspect Project Drawer)
* **Comportamiento:** Al pulsar en una tarjeta de proyecto, se despliega un panel flotante desde el extremo derecho.
* **Inyección de Código:** Inyecta en el drawer el detalle del proyecto, el archivo simulado y un fragmento de código de servidor real (en Kotlin Multiplatform, Python o Java Spring Boot) formateado en un bloque de código clásico.
* **Control del Scroll:** Llama a `window.lenis.stop()` para pausar el motor de scroll de la web de fondo, bloqueando la navegación interna y permitiendo su cierre mediante clicks en el fondo negro traslúcido, la cruz de cierre o la tecla física `Escape`.

---

### 4. Motor de Animación Lineal y Scroll Reactivo (`js/animations.js`)

#### A. Lenis Scroll Suave
* Configura la duración de scroll en inercia lineal profunda a `1.4` segundos con una ecuación de amortiguamiento exponencial rápida:
  $$\text{easing}(t) = 1 - 2^{-10t}$$
* Sincroniza la renderización de los refrescos de pantalla con el Ticker maestro de animaciones de GSAP para evitar sacudidas o pérdida de fotogramas, forzando `gsap.ticker.lagSmoothing(0)`.

#### B. Preloader Premium y Secuencia Hero
Al cargar la web por primera vez, el preloader controla el orden de arranque:
1. **Contador de Carga:** Simula una carga orgánica de 0 a 100 de forma no lineal.
2. **Implosión CAD:** Al llegar a 100%, reduce la escala (`scale: 0.1`) e implota con desvanecimiento el monograma vectorial y el texto central hacia el punto origen.
3. **Apertura de Cortinas:** Las cortinas oscuras superior e inferior se deslizan en sentido vertical inverso (`y: '-100%'` e `y: '100%'`) emulando la apertura física de un teatro.
4. **Revelación Hero Cascade:** GSAP ejecuta en línea el desvanecimiento de la cabecera, la entrada del badge con un suave rebote y la rotación elástica individualizada de las palabras gigantes del título, las cuales emergen desde su máscara inferior (`clip-path` y `translateY`).

#### C. Aceleración Elástica y Skew de Marquesina
La marquesina infinita se desplaza continuamente en bucle sobre un tween lineal de GSAP de `x: '-50%'`.
* **Inercia Física de Scroll:** Mediante el listener `ScrollTrigger`, se evalúa la velocidad física real del scroll (`self.getVelocity()`) en píxeles por segundo.
* **Aceleración:** La velocidad normalizada acelera el `timeScale` de la animación de la marquesina de forma fluida desde 1x (scroll quieto) hasta 8x (scroll rápido).
* **Skew (Deformación):** El contenedor de la marquesina se deforma lateralmente en 3D (`skewX` hasta un límite físico de 12 grados) proporcionalmente a la dirección y velocidad del scroll, simulando inercia y arrastre cinético.

#### D. Sistema Morphing Ambient Glow
Cada sección del portafolio tiene asignada una combinación cromática neón de 3 colores. Al entrar o salir de los límites de cualquier sección mediante scroll, GSAP intercepta el evento e interpola fluidamente (en $2.2$ segundos) el valor de las variables CSS de los orbes del root (`--glow-color-1`, `--glow-color-2` y `--glow-color-3`), cambiando la atmósfera de toda la web en segundo plano.

---

## 🚀 Requisitos para la Puesta en Producción

Para recrear y publicar este portfolio de forma exitosa tú solo, sigue estos pasos:

1. **Configuración Inicial:** Crea la carpeta raíz y añade las subcarpetas `css/`, `js/` y `assets/`.
2. **Imágenes:** Exporta tus capturas de proyectos en formato `.png` o `.jpg` a la carpeta `assets/` asegurando nombres consistentes (`project1.png`, etc.).
3. **Despliegue Local:** Sirve el directorio con cualquier servidor local simple.
   * Por ejemplo, si usas VS Code, haz clic derecho sobre `index.html` y selecciona **Live Server**.
   * O corre en tu terminal:
     ```bash
     npx servor ./ 8080
     ```
4. **Subida a Servidor:** Puedes desplegarlo de manera 100% gratuita y en un solo clic a través de plataformas estáticas como **GitHub Pages**, **Vercel** o **Netlify**.

---
*Manual Técnico redactado con rigor arquitectónico. Todo el código matemático, animaciones elásticas y mecánicas táctiles de Omar Adel Corral están integradas en este manual para su total reconstrucción autónoma.*
