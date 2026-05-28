/* ==========================================================================
   GSAP & LENIS HIGH-END ANIMATIONS ENGINE - OMAR PORTFOLIO
   ========================================================================== */

// Registrar los plugins de GSAP
gsap.registerPlugin(ScrollTrigger);

// Variable global para registrar si todos los recursos secundarios se han descargado
let isWindowLoaded = false;
window.addEventListener('load', () => {
    isWindowLoaded = true;
});

document.addEventListener('DOMContentLoaded', () => {
    // Forzar al navegador a ignorar el scroll restaurado y forzar siempre el inicio en el tope (0, 0)
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Bloquear scroll físico del body temporalmente durante la intro
    document.body.style.overflow = 'hidden';

    // 0. Construir Teclado Volumétrico 3D Dinámicamente
    build3DKeyboard();

    // 1. Ocultar header, sidebars, canvas, orbes flotantes y rejilla al inicio para una intro limpia
    gsap.set(['.main-header', '.sidebar-links', '#bg-canvas', '.mouse-glow-orb', '.holographic-grid', '.ambient-orbs-container', '.hero-section'], { opacity: 0, pointerEvents: 'none' });
    
    // Configurar la escala inicial masiva para el aterrizaje elástico
    gsap.set('.hero-section', { scale: 1.8 });

    // Ocultar también la consola al principio para simular encendido
    gsap.set('.terminal-body .terminal-line:not(.blink)', { opacity: 0, x: -10 });

    // Ocultar la laptop y la mesa inicialmente para evitar flashes visuales antes de la intro
    gsap.set(['.laptop-3d', '.desk-3d', '.desk-glow', '.scroll-indicator-intro'], { opacity: 0 });

    // 2. Iniciar secuencia de carga holográfica (Preloader con monograma y barra)
    runPreloaderSequence();
});

// A. CONTROL DE CARGA HOLOGRÁFICA (PRELOADER PROGRESS & IMPLOSION)
function runPreloaderSequence() {
    const progressWrapper = document.querySelector('.preloader-progress-wrapper');
    const progressBar = document.querySelector('.preloader-progress-bar');
    const percentageText = document.querySelector('.preloader-percentage');
    
    if (!progressWrapper || !progressBar || !percentageText) {
        // En caso de que no exista el preloader, saltar a la secuencia directamente
        playLaptopIntroEntrance();
        return;
    }

    const loaderObj = { value: 0 };
    
    // Animación fluida de carga ficticia-real con retardo inteligente
    const loaderTween = gsap.to(loaderObj, {
        value: 100,
        duration: 2.2, // Tiempo orgánico de carga
        ease: 'power1.inOut',
        onUpdate: () => {
            const progress = Math.floor(loaderObj.value);
            percentageText.textContent = `${progress}%`;
            progressBar.style.width = `${progress}%`;
            
            // Si llega al 88% y el navegador no ha terminado de cargar recursos físicos reales, pausar
            if (progress === 88 && !isWindowLoaded) {
                loaderTween.pause();
                
                // Hilo de comprobación del estado de carga del window
                const checkLoad = setInterval(() => {
                    if (isWindowLoaded) {
                        clearInterval(checkLoad);
                        loaderTween.resume();
                    }
                }, 80);
            }
        },
        onComplete: () => {
            // Carga completada al 100%, ejecutar secuencia cinemática de implosión y apertura de cortinas
            playPreloaderExitImplosion();
        }
    });
}

function playPreloaderExitImplosion() {
    const exitTl = gsap.timeline({
        onComplete: () => {
            // Eliminar el contenedor del preloader del flujo para liberar interacciones y clicks
            gsap.set('#preloader', { display: 'none' });
        }
    });

    // 1. Secuencia de Implosión Central (Todos los elementos del preloader colapsan al centro con distorsión y rotación)
    exitTl.to(['.preloader-content', '.blueprint-viewport', '.oa-monogram', '.preloader-progress-wrapper', '.preloader-percentage'], {
        scale: 0.1,
        opacity: 0,
        rotate: 15,
        duration: 0.75,
        ease: 'power4.in',
        stagger: 0.05
    });

    // 2. Apertura vertical de cortinas negras elásticamente
    exitTl.to('.preloader-curtain.top', {
        yPercent: -100,
        duration: 1.2,
        ease: 'power4.inOut'
    }, '-=0.3');

    exitTl.to('.preloader-curtain.bottom', {
        yPercent: 100,
        duration: 1.2,
        ease: 'power4.inOut'
    }, '-=1.2');

    // Disparar la revelación del portátil 3D y la mesa en paralelo a la apertura de cortinas para eliminar esperas vacías
    exitTl.add(() => {
        playLaptopIntroEntrance();
    }, '-=1.2');
}

/* ==========================================================================
   A. LENIS SMOOTH SCROLL INITIALIZATION
   ========================================================================== */
function initLenisScroll() {
    // Configuración pesada con inercia profunda, idéntica a wamosair.com
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponencial amortiguado
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.2,
        infinite: false,
    });

    // Conectar el bucle de actualización de Lenis con ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Integrar con el Ticker de GSAP para sincronización perfecta de frames
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    // Desactivar suavizado de retardo para rendimiento óptimo
    gsap.ticker.lagSmoothing(0);

    return lenis;
}

/* ==========================================================================
   B. PRELOADER & HERO SEQUENCING
   ========================================================================== */
/* ==========================================================================
   B. INITIAL LAPTOP ENTRANCE TIMELINE
   ========================================================================== */
function playLaptopIntroEntrance() {
    const isMobile = window.innerWidth < 768;
    const laptopY = isMobile ? -45 : -70;
    const laptopZStart = isMobile ? -205 : -220;
    const laptopZEnd = isMobile ? -25 : -40;

    const deskZStart = isMobile ? -240 : -360;
    const deskZEnd = isMobile ? -120 : -180;

    const tl = gsap.timeline({
        onComplete: () => {
            // 1. Restaurar scroll del body
            document.body.style.overflow = '';

            // 2. Inicializar Scroll Suave con Lenis
            const lenis = initLenisScroll();
            window.lenis = lenis;

            // 3. Configurar Animaciones del Scroll (ScrollTrigger)
            setupScrollTriggerAnimations(lenis);
            
            // 4. Inicializar Bóveda 3D del Portátil
            setupLaptopIntroAnimation();
            
            // Forzar actualización de ScrollTrigger para registrar las posiciones correctas del spacer
            ScrollTrigger.refresh();
        }
    });
    
    // Revelar la laptop 3D y la mesa desde la oscuridad con inercia elástica
    tl.fromTo('.laptop-3d', {
        scale: 0.75,
        opacity: 0,
        rotateX: -12,
        rotateY: 0,
        y: laptopY,
        z: laptopZStart
    }, {
        scale: 1,
        opacity: 1,
        rotateX: -12,
        rotateY: 0,
        y: laptopY,
        z: laptopZEnd,
        duration: 1.2,
        ease: 'power4.out'
    });

    tl.fromTo('.desk-3d', {
        scale: 0.75,
        opacity: 0,
        rotateX: 80,
        z: deskZStart
    }, {
        scale: 1,
        opacity: 1,
        rotateX: 80,
        z: deskZEnd, // Posición Z de reposo real de la mesa en CSS para que quede perfectamente debajo del portátil
        duration: 1.2,
        ease: 'power4.out'
    }, 0.08); // Retardo manual de stagger de 0.08s

    tl.fromTo('.desk-glow', {
        opacity: 0
    }, {
        opacity: 1,
        duration: 1.0,
        ease: 'power2.out'
    }, '-=0.8');

    tl.fromTo('.scroll-indicator-intro', {
        opacity: 0,
        y: 25
    }, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out'
    }, '-=1.0');

    // Inicializar el tipeo secuencial de la consola al terminar la revelación
    tl.add(() => {
        runTerminalBootSequence();
    }, '-=0.8');
}

// Secuencia interna del Hero (Elastic Landing Reveal)
function runHeroReveal() {
    // Remover blindaje de introducción para habilitar la visibilidad de cabecera y enlaces
    document.body.classList.remove('intro-active');

    const heroTl = gsap.timeline();

    // Habilitar interactividad en la capa de contenido
    gsap.set(['.main-header', '.sidebar-links', '#bg-canvas', '.holographic-grid', '.ambient-orbs-container', '.hero-section'], { pointerEvents: 'all' });

    // 1. Aterrizaje elástico de la sección Hero (escala descendente de 1.8x a 1.0x)
    heroTl.fromTo('.hero-section', {
        scale: 1.8,
        opacity: 0
    }, {
        scale: 1.0,
        opacity: 1,
        duration: 1.8,
        ease: 'power3.out'
    }, 0);

    // 2. Escala elástica del fondo de partículas con inercia de muelle
    heroTl.fromTo('#bg-canvas', {
        scale: 0.3,
        opacity: 0
    }, {
        scale: 1.0,
        opacity: 1,
        duration: 2.0,
        ease: 'elastic.out(1, 0.8)'
    }, 0);

    // 3. Revelar rejilla holográfica y orbes ambientales flotantes
    heroTl.fromTo('.holographic-grid', {
        opacity: 0,
        scale: 0.8
    }, {
        opacity: 1,
        scale: 1,
        duration: 1.6,
        ease: 'power2.out'
    }, 0.2);

    heroTl.fromTo('.ambient-orbs-container', {
        opacity: 0,
        scale: 0.5
    }, {
        opacity: 0.45,
        scale: 1,
        duration: 2.0,
        ease: 'power2.out'
    }, 0.1);

    // 4. Deslizar y bloquear elásticamente la cabecera principal (y: -80 a 0)
    heroTl.fromTo('.main-header', {
        y: -80,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 1.4,
        ease: 'elastic.out(1, 0.85)'
    }, 0.4);

    // 5. Deslizar y bloquear elásticamente las barras laterales desde los extremos
    heroTl.fromTo('.sidebar-links.left', {
        x: -60,
        opacity: 0
    }, {
        x: 0,
        opacity: 1,
        duration: 1.4,
        ease: 'elastic.out(1, 0.85)'
    }, 0.5);

    heroTl.fromTo('.sidebar-links.right', {
        x: 60,
        opacity: 0
    }, {
        x: 0,
        opacity: 1,
        duration: 1.4,
        ease: 'elastic.out(1, 0.85)'
    }, 0.5);

    // 6. Revelar el badge superior del hero
    heroTl.fromTo('.hero-badge', {
        y: 30,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out'
    }, 0.6);

    // 7. Revelación elástica de palabras individuales (Split-Text)
    heroTl.to('.title-word', {
        y: '0%',
        rotate: 0,
        duration: 1.6,
        ease: 'expo.out',
        stagger: 0.08
    }, 0.7);

    // 8. Revelar elementos inferiores del Hero
    heroTl.to('.hero-footer .reveal-item', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.1
    }, 0.9);

    return heroTl;
}


/* ==========================================================================
   C. SCROLLTRIGGER WORLD-CLASS REVEALS & UPGRADES
   ========================================================================== */
function setupScrollTriggerAnimations(lenis) {
    
    // --- NUEVO: SINCRO DE MARQUESINA VELOCIDAD-DE-SCROLL ---
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        // Clonar para asegurar loop infinito
        // Animación lineal continua básica
        const marqueeTween = gsap.to('.marquee-content', {
            x: '-50%',
            ease: 'none',
            duration: 25,
            repeat: -1
        });

        // Throttle variables para evitar crear tweens en cada frame de scroll
        let lastMarqueeVelocity = 0;
        let marqueeUpdating = false;

        // Capturar velocidad del scroll y acelerar de forma elástica la marquesina
        ScrollTrigger.create({
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
                // self.getVelocity() devuelve px/seg del scroll (positivo o negativo)
                const scrollVelocity = self.getVelocity();

                // Throttle: solo crear nuevos tweens si la velocidad cambió significativamente
                if (Math.abs(scrollVelocity - lastMarqueeVelocity) < 100) return;

                // rAF gating: evitar múltiples actualizaciones por frame
                if (marqueeUpdating) return;
                marqueeUpdating = true;
                requestAnimationFrame(() => {
                    marqueeUpdating = false;
                });

                // Normalizar velocidad (un scroll rápido alcanza ~2000-4000 px/seg)
                const normalizedVelocity = Math.abs(scrollVelocity) * 0.003;
                
                // Multiplicador de escala de tiempo (mínimo 1, máximo 8x)
                const timeScaleTarget = 1 + Math.min(7, normalizedVelocity);
                
                // Acelerar la marquesina de forma fluida
                gsap.to(marqueeTween, {
                    timeScale: timeScaleTarget,
                    duration: 0.4,
                    ease: 'power2.out'
                });

                // Deformar/inclinar (Skew) la marquesina para dar inercia física tridimensional
                const skewAngle = (scrollVelocity * 0.0035); // Máximo ángulo sutil
                const limitedSkew = Math.min(12, Math.max(-12, skewAngle)); // Tope 12 grados
                
                gsap.to('.marquee-wrapper', {
                    skewX: limitedSkew,
                    duration: 0.3,
                    ease: 'power2.out'
                });

                lastMarqueeVelocity = scrollVelocity;
            }
        });
    }

    // --- NUEVO: SISTEMA DE MORPH DE LUZ AMBIENTAL DYNAMIC GLOW SHIFT ---
    const sections = document.querySelectorAll('section');
    sections.forEach((sec, idx) => {
        // Paletas de color ambiental para cada sección (Cianes, Índigos, Slate-Teals y azules tecnológicos)
        const glows = [
            { c1: '#00f2fe', c2: '#a18cd1', c3: '#0072ff' }, // Hero (Cian / Violeta / Índigo)
            { c1: '#0072ff', c2: '#1a2b3c', c3: '#00f2fe' }, // Proyectos (Índigo / Slate-Teal / Cian)
            { c1: '#00f2fe', c2: '#5f72bd', c3: '#0d2b45' }, // Habilidades (Cian / Slate-Blue / Teal Profundo)
            { c1: '#a18cd1', c2: '#0072ff', c3: '#101c2a' }, // Experiencia (Cyber Violet / Índigo / Void)
            { c1: '#00f2fe', c2: '#0d2b45', c3: '#0072ff' }  // Contacto (Cian / Slate-Teal / Índigo)
        ];
        
        const scheme = glows[idx % glows.length];

        ScrollTrigger.create({
            trigger: sec,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => applyGlowScheme(scheme),
            onEnterBack: () => applyGlowScheme(scheme)
        });
    });

    function applyGlowScheme(scheme) {
        gsap.set(':root', {
            '--glow-color-1': scheme.c1,
            '--glow-color-2': scheme.c2,
            '--glow-color-3': scheme.c3
        });
    }

    // --- ANIMACIÓN 1: TÍTULOS DE SECCIÓN REVEAL POR MÁSCARA ---
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        const text = title.textContent;
        title.innerHTML = `<span class="section-title-wrapper" style="display:inline-block; overflow:hidden; vertical-align:bottom; width:100%"><span class="section-title-inner" style="display:inline-block; transform:translateY(100%); will-change:transform">${text}</span></span>`;
        
        const innerSpan = title.querySelector('.section-title-inner');

        gsap.to(innerSpan, {
            y: '0%',
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // --- ANIMACIÓN: QUIÉN SOY (EXCLUSIVA & DYNAMIC REVEAL) ---
    const aboutSec = document.querySelector('.about-section');
    if (aboutSec) {
        // Parte A: Entrada automática no-scrubbed de los textos (para que solo salga el texto al llegar)
        const aboutTextTL = gsap.timeline({
            scrollTrigger: {
                trigger: aboutSec,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        // 1. Revelar la bio (subtítulo y párrafos) con deslizamiento vertical suave
        aboutTextTL.fromTo(['.about-subtitle', '.about-text'], {
            y: 35,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 1.2,
            ease: 'power3.out'
        });

        // 2. Desplegar el grid de 4 tarjetas tecnológicas de abajo a arriba
        aboutTextTL.fromTo('.about-tech-grid .tech-card', {
            y: 40,
            scale: 0.97,
            opacity: 0
        }, {
            y: 0,
            scale: 1,
            opacity: 1,
            stagger: 0.1,
            duration: 1.2,
            ease: 'power3.out'
        }, '-=0.9');


        // Parte B: Entrada interactiva en Scroll-Scrub del retrato por la IZQUIERDA
        const aboutPhotoTL = gsap.timeline({
            scrollTrigger: {
                trigger: aboutSec,
                start: 'top 95%',      // Empieza al entrar la sección al viewport
                end: 'bottom 65%',    // Se acomoda antes de salir
                scrub: 0.6,           // Físicas ultrasuaves
            }
        });

        // 1. Deslizar la tarjeta de la foto desde la IZQUIERDA con rotación 3D e inercia elástica
        aboutPhotoTL.fromTo('.about-image-card', {
            xPercent: -130,          // Desliza desde fuera de su columna (izquierda)
            scale: 0.82,
            rotateY: -35,
            rotateX: 12,
            opacity: 0,
            transformPerspective: 1000
        }, {
            xPercent: 0,             // Regresa a su posición original
            scale: 1,
            rotateY: 0,
            rotateX: 0,
            opacity: 1,
            ease: 'power2.out',
            duration: 1.8
        });

        // 2. Sincronizar el zoom de la cámara en el retrato (se encoge desde 1.25x)
        aboutPhotoTL.fromTo('.about-img', {
            scale: 1.25,
            opacity: 0.4
        }, {
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            duration: 1.8
        }, 0);

        // 3. El láser del escáner barre la parte superior y media y se desvanece con opacidad suave antes del fondo
        aboutPhotoTL.fromTo('.about-scanner-overlay', {
            yPercent: -100,
            opacity: 0
        }, {
            yPercent: 40,
            opacity: 0.55,           // Menos opaco, resplandor ciber suave en la cara
            ease: 'power1.out',
            duration: 1.0
        }, 0);

        aboutPhotoTL.to('.about-scanner-overlay', {
            yPercent: 80,            // Se detiene al 80% (no baja hasta abajo del todo)
            opacity: 0,              // Se desvanece completamente de forma limpia
            ease: 'power1.in',
            duration: 1.0
        }, 1.0);

        // 4. El HUD de especificaciones se escala elásticamente
        aboutPhotoTL.fromTo('.about-spec-box', {
            scale: 0,
            x: -30,
            opacity: 0
        }, {
            scale: 1,
            x: 0,
            opacity: 1,
            ease: 'back.out(1.5)',
            duration: 1.2
        }, 0.5);
    }

    // --- ANIMACIÓN 2: ELEMENTOS DE TEXTO REVEAL STAGGERED (BATCHED) ---
    ScrollTrigger.batch('.reveal-item', {
        onEnter: (batch) => {
            gsap.to(batch, {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out'
            });
        },
        start: 'top 88%'
    });

    // --- ANIMACIÓN 3: REVELACIÓN DE TARJETAS DE PROYECTOS (PARALLAX + SLIDE) ---
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, idx) => {
        gsap.fromTo(card, {
            y: 100,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        // Parallax interior de imagen sincronizado
        const img = card.querySelector('.project-img');
        if (img) {
            gsap.fromTo(img, {
                y: '-10%',
                scale: 1.25
            }, {
                y: '10%',
                scale: 1.0,
                ease: 'none',
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.3
                }
            });
        }
    });

    // --- ANIMACIÓN 4: TARJETAS DE HABILIDADES REVEAL ---
    const skillCategories = document.querySelectorAll('.skill-category');
    gsap.fromTo(skillCategories, {
        y: 80,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 1.4,
        ease: 'expo.out',
        stagger: 0.15,
        scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    // --- ANIMACIÓN 5: TIMELINE EXPERIENCIA ---
    const timelineContainer = document.querySelector('.timeline-container');
    if (timelineContainer) {
        const line = document.querySelector('.timeline-progress-line');
        if (line) {
            const fill = document.createElement('div');
            fill.className = 'timeline-progress-fill';
            fill.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; background:linear-gradient(to bottom, var(--color-cyan), var(--color-violet), var(--color-rose)); transform-origin:top; transform:scaleY(0); will-change:transform;';
            line.appendChild(fill);

            gsap.to(fill, {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: timelineContainer,
                    start: 'top 25%',
                    end: 'bottom 75%',
                    scrub: 0.3
                }
            });
        }
    }

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        gsap.fromTo(item.querySelector('.glass-card'), {
            x: 50,
            opacity: 0
        }, {
            x: 0,
            opacity: 1,
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        ScrollTrigger.create({
            trigger: item,
            start: 'top 45%',
            end: 'bottom 45%',
            onEnter: () => item.classList.add('active'),
            onLeaveBack: () => item.classList.remove('active'),
            onEnterBack: () => item.classList.add('active'),
            onLeave: () => item.classList.remove('active')
        });
    });

    // --- ANIMACIÓN 6: REVELAR TEXTOS EN CONTACTO ---
    const contactLines = document.querySelectorAll('.contact-line');
    contactLines.forEach(line => {
        const text = line.textContent;
        line.innerHTML = `<span class="contact-title-wrapper" style="display:inline-block; overflow:hidden; width:100%"><span class="contact-title-inner" style="display:inline-block; transform:translateY(100%); will-change:transform">${text}</span></span>`;
        
        const innerSpan = line.querySelector('.contact-title-inner');

        gsap.to(innerSpan, {
            y: '0%',
            duration: 1.5,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: line,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // --- ANCHOR LINK INTERCEPTS (Scroll suave Lenis) ---
    const navAnchors = document.querySelectorAll('a[href^="#"]');
    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            // Si el portátil sigue activo, no forzar saltos hasta terminar zoom
            if (document.getElementById('laptop-intro-container')?.style.pointerEvents !== 'none') {
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                lenis.scrollTo(targetElement, {
                    offset: -80,
                    duration: 1.6,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        });
    });
}

/* ==========================================================================
   INTERACTIVE 3D CSS LAPTOP & SCROLL TRIGGER ENGINE
   ========================================================================== */

window.heroRevealed = false;

function setupLaptopIntroAnimation() {
    // 2. Línea de tiempo de ScrollTrigger para el portátil 3D
    const laptopTL = gsap.timeline({
        scrollTrigger: {
            trigger: '.intro-scroll-spacer',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5, // Scroll súper elástico y cinemático
            onLeave: () => {
                // Cuando el usuario termina el scroll de zoom:
                // Ocultar el portátil del viewport para liberar clicks
                gsap.set('#laptop-intro-container', { pointerEvents: 'none', opacity: 0 });
                // Revelar y activar el orbe de luz del ratón interactivo
                gsap.set('.mouse-glow-orb', { opacity: 1 });
                // Lanzar la animación del Hero si no ha corrido ya
                if (!window.heroRevealed) {
                    window.heroRevealed = true;
                    runHeroReveal();
                }
            },
            onEnterBack: () => {
                // Si vuelve a subir al inicio, restaurar blindaje de introducción, interacciones y ocultar todo
                document.body.classList.add('intro-active');
                gsap.set('#laptop-intro-container', { pointerEvents: 'all', opacity: 1 });
                gsap.set(['.main-header', '.sidebar-links', '#bg-canvas', '.mouse-glow-orb', '.holographic-grid', '.ambient-orbs-container', '.hero-section'], { opacity: 0, pointerEvents: 'none' });
                
                // Reset de estados para entrada perfecta
                gsap.set('.hero-section', { scale: 1.8 });
                gsap.set('.title-word', { y: '115%', rotate: 0 });
                window.heroRevealed = false;
            }
        }
    });

    // 3. Fase A: Apertura elástica de la bisagra de la pantalla (Scroll 0% a 40%)
    // Abre desde -90 grados (cerrada horizontal plana sobre teclado) hasta 12 grados (título vertical de 12° hacia atrás)
    laptopTL.to('.laptop-screen-lid', {
        rotateX: 12,
        duration: 1.5,
        ease: 'power2.inOut'
    }, 0);

    // Sincronizar anillos concéntricos del túnel de distorsión 3D para escalar y girar elásticamente (vórtice hiper-espacial)
    laptopTL.to('.tunnel-ring', {
        scale: 8.5, // Aumentado de 2.5 a 8.5 para que salgan disparados fuera de la pantalla
        rotateZ: 360, // Rotación completa de 360°
        opacity: 0.9,
        stagger: 0.1,
        duration: 2.2,
        ease: 'power2.in'
    }, 0);

    // 4. Fase B: Adentrarse dentro de la pantalla (Zoom 3D cinemático - Vuelo de Cámara) (Scroll 40% a 90%)
    // Animamos la capa completa de la escena (.laptop-viewport) de forma súper profunda para simular que nos adentramos al PC
    laptopTL.to('.laptop-viewport', {
        z: 1350, // Incrementado de 950 a 1350 (vuelo de cámara hiper-profundo)
        y: 365, // Ajustado de 180 a 365 para mantener centrado a gran escala
        scale: 15.0, // Incrementado de 6.5 a 15.0 para que el marco salga del visor completamente
        duration: 2.5,
        ease: 'power3.inOut' // Inercia súper suave y pesada estilo Awwwards
    }, 1.2);

    // Sincronizar el re-centrado del portátil con el zoom de la cámara para que entre perfectamente centrado
    laptopTL.to('.laptop-3d', {
        y: 0,
        z: 0,
        duration: 2.5,
        ease: 'power3.inOut'
    }, 1.2);

    // Desvanecer sutilmente la mesa al final del zoom para asegurar opacidad absoluta y cero fugas visuales en pantallas ultra-panorámicas
    laptopTL.to('.desk-3d', {
        opacity: 0,
        duration: 1.5,
        ease: 'power2.inOut'
    }, 1.5);

    // Desvanecer el indicador de scroll
    laptopTL.to('.scroll-indicator-intro', {
        opacity: 0,
        y: -30,
        duration: 0.6,
        ease: 'power1.out'
    }, 0.2);

    // 5. Fase C: Desvanecer el contenedor entero de la laptop cuando el zoom es total (Scroll 90% a 100%)
    laptopTL.to('#laptop-intro-container', {
        opacity: 0,
        duration: 0.8,
        ease: 'power1.out'
    }, 3.0);
}

// Función para simular el encendido de la consola hacker en tiempo real
function runTerminalBootSequence() {
    const lines = document.querySelectorAll('.terminal-body .terminal-line:not(.blink)');
    lines.forEach((line, idx) => {
        gsap.to(line, {
            opacity: 0.85,
            x: 0,
            duration: 0.35,
            delay: 0.5 + idx * 0.35,
            ease: 'power2.out'
        });
    });
}

// Función para construir dinámicamente un teclado volumétrico 3D Awwwards-class
function build3DKeyboard() {
    const grid = document.querySelector('.keyboard-grid');
    if (!grid) return;

    // Distribución física de un teclado QWERTY estándar de portátil (Invertida verticalmente)
    // El Spacebar se sitúa al frente (HTML top Y=0) y los F-keys al fondo cerca de la bisagra (HTML bottom Y=320px)
    const layout = [
        ['ctrl', 'fn', 'win', 'alt', 'space', 'alt', 'ctrl', '◄', '▲', '▼', '►'],
        ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift'],
        ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'enter'],
        ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        ['~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace'],
        ['esc', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12', 'del']
    ];

    grid.innerHTML = '';

    layout.forEach((rowKeys) => {
        const row = document.createElement('div');
        row.className = 'keyboard-row';
        
        rowKeys.forEach(keyText => {
            const key = document.createElement('div');
            let specClass = '';
            
            // Asignar clases específicas de flex-grow según la tecla
            if (keyText === 'backspace') specClass = 'key-backspace';
            else if (keyText === 'tab') specClass = 'key-tab';
            else if (keyText === 'caps') specClass = 'key-caps';
            else if (keyText === 'enter') specClass = 'key-enter';
            else if (keyText === 'shift') {
                const shifts = row.querySelectorAll('.key-cap');
                specClass = shifts.length === 0 ? 'key-l-shift' : 'key-r-shift';
            }
            else if (keyText === 'ctrl') specClass = 'key-ctrl';
            else if (keyText === 'alt') specClass = 'key-alt';
            else if (keyText === 'space') specClass = 'key-space';
            else if (keyText === 'fn') specClass = 'key-fn';
            else if (keyText === 'win') specClass = 'key-win';

            key.className = `key-cap ${specClass}`.trim();
            // El espacio queda vacío, las demás teclas llevan etiqueta
            key.textContent = keyText === 'space' ? '' : keyText;
            row.appendChild(key);
        });

        grid.appendChild(row);
    });
}

