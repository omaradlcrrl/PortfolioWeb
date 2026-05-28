/* ==========================================================================
   MAIN CORE LOGIC & INTERACTION ENGINE - OMAR PORTFOLIO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar Cursor Inteligente Dual
    initCustomCursor();

    // 1b. Inicializar Copiado de Email al Portapapeles
    initEmailCopyToClipboard();

    // 2. Inicializar Efecto de Inclinación Holográfico 3D en Tarjetas
    initProjectCards3DTilt();

    // 3. Inicializar Tirón Magnético en Elementos Selectos
    initMagneticElements();

    // 4. Inicializar Efecto Cyberpunk Scramble Decoder al Hover
    initScrambleHoverEffect();

    // 5. Inicializar Brillos Dinámicos de la Pirámide
    initPyramidGlow();

    // 6. Inicializar Consola Terminal Debugger de Proyectos
    initTerminalDebugger();

    // 7. Inicializar Panel Desplizable de Especificaciones de Proyectos
    initProjectInspectDrawer();

    // 8. Inicializar Efectos de Sonido Táctiles (Audio Context UI)
    initAudioUI();

    // 9. Inicializar Canvas de Agujero Negro del Stack Técnico
    initSkillsBlackhole();
});

/* ==========================================================================
   A. DYNAMIC GLOW PYRAMID CELLS
   ========================================================================== */
function initPyramidGlow() {
    const cells = document.querySelectorAll('.pyramid-cell');
    cells.forEach(cell => {
        let pyramidGlowRAF = null;
        cell.addEventListener('mousemove', function(e) {
            const mx = e.clientX, my = e.clientY;
            if (pyramidGlowRAF) return;
            pyramidGlowRAF = requestAnimationFrame(() => {
                const rect = this.getBoundingClientRect();
                // Calcular coordenadas locales respecto a la casilla
                const x = mx - rect.left;
                const y = my - rect.top;
                
                // Asignar variables CSS al resplandor neón-azul interno
                this.style.setProperty('--x', `${x}px`);
                this.style.setProperty('--y', `${y}px`);
                pyramidGlowRAF = null;
            });
        });

        cell.addEventListener('mouseleave', function() {
            // Resetear posición de luz al centro suavemente
            this.style.setProperty('--x', '50%');
            this.style.setProperty('--y', '50%');
        });
    });
}

/* ==========================================================================
   B. CUSTOM MAGNETIC CURSOR
   ========================================================================== */
function initCustomCursor() {
    // Desactivar cursor personalizado en dispositivos táctiles (móviles / tabletas)
    if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
        return;
    }
    const cursor = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.cursor-dot');
    const circle = document.querySelector('.cursor-circle');
    const mouseGlow = document.querySelector('.mouse-glow-orb');
    
    if (!cursor || !dot || !circle) return;

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let circlePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let dotPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let glowPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // Revelar el orbe de luz en la primera interacción del ratón, solo si la intro ya terminó
    if (mouseGlow) {
        const revealGlow = () => {
            if (window.heroRevealed) {
                mouseGlow.style.opacity = '1';
                window.removeEventListener('mousemove', revealGlow);
            }
        };
        window.addEventListener('mousemove', revealGlow);
    }

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function updateCoordinates() {
        circlePos.x += (mouse.x - circlePos.x) * 0.1;
        circlePos.y += (mouse.y - circlePos.y) * 0.1;

        dotPos.x += (mouse.x - dotPos.x) * 0.3;
        dotPos.y += (mouse.y - dotPos.y) * 0.3;

        dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
        circle.style.transform = `translate3d(${circlePos.x}px, ${circlePos.y}px, 0) translate(-50%, -50%)`;

        // LERP cinemático más lento (0.04) para crear un trailing suave de energía azul flotando detrás del cursor
        if (mouseGlow) {
            glowPos.x += (mouse.x - glowPos.x) * 0.04;
            glowPos.y += (mouse.y - glowPos.y) * 0.04;
            mouseGlow.style.transform = `translate3d(${glowPos.x}px, ${glowPos.y}px, 0) translate(-50%, -50%)`;
        }

        requestAnimationFrame(updateCoordinates);
    }
    requestAnimationFrame(updateCoordinates);

    const interactiveElements = document.querySelectorAll('a, button, .nav-link, .magnetic, .scramble-hover');
    interactiveElements.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering-link');
        });
        elem.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering-link');
        });
    });

    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering-project');
        });
        card.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering-project');
        });
    });
}

/* ==========================================================================
   B2. EMAIL CLIPBOARD COPY WITH CYBERPUNK TOAST
   ========================================================================== */
function showToast(message) {
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    
    // Forzar reflow para reiniciar la animación
    toast.offsetHeight;
    
    toast.classList.add('show');
    
    // Ocultar tras 2.5 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function initEmailCopyToClipboard() {
    const emailLinks = document.querySelectorAll('.sidebar-email, .contact-large-btn');
    emailLinks.forEach(link => {
        const email = 'omar.adel.corral@gmail.com';
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(email).then(() => {
                const currentLang = localStorage.getItem('portfolio-lang') || 'es';
                const msg = currentLang === 'es' ? '¡Email copiado al portapapeles! 📋' : 'Email copied to clipboard! 📋';
                showToast(msg);
                
                // Efecto de sonido cyberpunk al hacer clic
                if (typeof synthSound !== 'undefined' && typeof synthSound.playClick === 'function') {
                    synthSound.playClick();
                }
            }).catch(err => {
                console.error('Error al copiar el email: ', err);
            });
        });
    });
}

/* ==========================================================================
   C. HOLOGRAPHIC 3D TILT EFFECT & RADIAL SPOTLIGHT
   ========================================================================== */
function initProjectCards3DTilt() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        const imgWrapper = card.querySelector('.project-img-wrapper');
        const infoBlock = card.querySelector('.project-info');
        const pName = card.querySelector('.project-name');
        const pMeta = card.querySelector('.project-meta');
        let cardTiltRAF = null;

        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;
            const mx = e.clientX, my = e.clientY;
            if (cardTiltRAF) return;
            cardTiltRAF = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = mx - rect.left;
                const y = my - rect.top;
                
                card.style.setProperty('--x', `${x}px`);
                card.style.setProperty('--y', `${y}px`);

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((centerY - y) / centerY) * 7;
                const rotateY = ((x - centerX) / centerX) * 7;

                const imgShiftX = ((x - centerX) / centerX) * -12;
                const imgShiftY = ((y - centerY) / centerY) * -12;

                const infoShiftX = ((x - centerX) / centerX) * 15;
                const infoShiftY = ((y - centerY) / centerY) * 15;

                const titleShiftX = ((x - centerX) / centerX) * 25;
                const titleShiftY = ((y - centerY) / centerY) * 25;

                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
                
                if (imgWrapper) {
                    imgWrapper.style.transform = `translate3d(${imgShiftX}px, calc(-10% + ${imgShiftY}px), 0)`;
                }
                if (infoBlock) {
                    infoBlock.style.transform = `translate3d(${infoShiftX}px, ${infoShiftY}px, 50px)`;
                }
                if (pName) {
                    pName.style.transform = `translate3d(${titleShiftX}px, ${titleShiftY}px, 30px)`;
                }
                if (pMeta) {
                    pMeta.style.transform = `translate3d(${infoShiftX * 0.5}px, ${infoShiftY * 0.5}px, 10px)`;
                }
                cardTiltRAF = null;
            });
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';

            if (imgWrapper) {
                imgWrapper.style.transform = 'translate3d(0px, -10%, 0px)';
                imgWrapper.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            }
            if (infoBlock) {
                infoBlock.style.transform = 'translate3d(0px, 0px, 50px)';
                infoBlock.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            }
            if (pName) {
                pName.style.transform = 'translate3d(0px, 0px, 30px)';
                pName.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            }
            if (pMeta) {
                pMeta.style.transform = 'translate3d(0px, 0px, 10px)';
                pMeta.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            }
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
            if (imgWrapper) imgWrapper.style.transition = 'none';
            if (infoBlock) infoBlock.style.transition = 'none';
            if (pName) pName.style.transition = 'none';
            if (pMeta) pMeta.style.transition = 'none';
        });
    });
}

/* ==========================================================================
   D. MAGNETIC UI ATTRACTION
   ========================================================================== */
function initMagneticElements() {
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(elem => {
        const strength = parseFloat(elem.getAttribute('data-strength')) || 20;
        const innerText = elem.querySelector('span');
        let magneticRAF = null;

        elem.addEventListener('mousemove', function(e) {
            const mx = e.clientX, my = e.clientY;
            if (magneticRAF) return;
            magneticRAF = requestAnimationFrame(() => {
                const rect = this.getBoundingClientRect();
                
                const relX = mx - (rect.left + rect.width / 2);
                const relY = my - (rect.top + rect.height / 2);

                this.style.transform = `translate3d(${relX * (strength / 100)}px, ${relY * (strength / 100)}px, 0)`;
                
                if (innerText) {
                    innerText.style.transform = `translate3d(${relX * (strength / 150)}px, ${relY * (strength / 150)}px, 0)`;
                }
                magneticRAF = null;
            });
        });

        elem.addEventListener('mouseleave', function() {
            this.style.transform = 'translate3d(0px, 0px, 0px)';
            this.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            
            if (innerText) {
                innerText.style.transform = 'translate3d(0px, 0px, 0px)';
                innerText.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }
        });
        
        elem.addEventListener('mouseenter', function() {
            this.style.transition = 'none';
            if (innerText) {
                innerText.style.transition = 'none';
            }
        });
    });
}

/* ==========================================================================
   E. CYBERNETIC SCRAMBLE DECODER HOVER EFFECT
   ========================================================================== */
function initScrambleHoverEffect() {
    const scrambleElements = document.querySelectorAll('.contact-large-btn .scramble-hover');
    const glyphs = '$%&?*#@█░10XYZ+-[]{}<>';

    scrambleElements.forEach(elem => {
        const originalText = elem.getAttribute('data-scramble') || elem.innerText.trim();
        let isScrambling = false;

        // Si el elemento scramble-hover está en una casilla de la pirámide, escuchar el hover en la casilla entera
        const triggerElement = elem.closest('.pyramid-cell') || elem;

        triggerElement.addEventListener('mouseenter', () => {
            if (isScrambling) return;
            isScrambling = true;

            const textLength = originalText.length;
            const iterationsPerFrame = 0.35;
            const frameDuration = 30; // ms per iteration step
            let scrambleRAF;
            let scrambleStart;

            function scrambleStep(timestamp) {
                if (!scrambleStart) scrambleStart = timestamp;
                const elapsed = timestamp - scrambleStart;
                const currentIteration = (elapsed / frameDuration) * iterationsPerFrame;

                if (currentIteration >= textLength) {
                    if (originalText === 'HABLEMOS' && elem.classList.contains('main-cta')) {
                        elem.innerHTML = '<span>Hablemos</span>';
                    } else if (originalText === 'OMAR.' && elem.classList.contains('logo')) {
                        elem.innerHTML = '<span class="logo-text">OMAR</span><span class="logo-dot">.</span>';
                    } else {
                        elem.textContent = originalText;
                    }
                    isScrambling = false;
                    return;
                }

                elem.textContent = originalText
                    .split('')
                    .map((char, index) => {
                        if (index < currentIteration) {
                            return originalText[index];
                        }
                        if (char === ' ') return ' ';
                        return glyphs[Math.floor(Math.random() * glyphs.length)];
                    })
                    .join('');

                scrambleRAF = requestAnimationFrame(scrambleStep);
            }
            scrambleRAF = requestAnimationFrame(scrambleStep);
        });
    });
}

/* ==========================================================================
   F. LIVE TERMINAL DEBUGGER ENGINE (UPGRADE)
   ========================================================================== */
function initTerminalDebugger() {
    const cards = document.querySelectorAll('.project-card');
    const injectionDiv = document.getElementById('terminal-stream-injection');
    
    if (!injectionDiv) return;

    // Base de datos de trazas de servidor por proyecto reales del CV
    const logDatabase = {
        fitwin: [
            { tag: 'START', type: 'system', msg: 'Starting FitWinApplication on port 8080...' },
            { tag: 'SEC', type: 'ready', msg: 'Spring Security: Configuring JWT filter chain...' },
            { tag: 'DB', type: 'info', msg: 'Connected to MariaDB database \'fitwin_db\' (2.1ms)' },
            { tag: 'TEST', type: 'system', msg: 'Running test suite: 159 tests passed successfully [100% OK].' },
            { tag: 'CALC', type: 'info', msg: 'Mifflin-St Jeor calorie formulas loaded successfully.' },
            { tag: 'KMP', type: 'ready', msg: 'Kotlin Multiplatform: UI synchronized with Compose framework.' },
            { tag: 'HTTP', type: 'ready', msg: 'Tomcat server started on port 8080. Ready for requests!_' }
        ],
        carfinder: [
            { tag: 'START', type: 'system', msg: 'Starting Car-Finder Python scraper...' },
            { tag: 'REQ', type: 'info', msg: 'Fetching pages from Wallapop and Coches.net...' },
            { tag: 'SCRAPE', type: 'info', msg: '25 new vehicle listings found.' },
            { tag: 'DB', type: 'ready', msg: 'Saving new listings to local SQLite database... Done.' },
            { tag: 'FILTER', type: 'info', msg: 'Filtering by price anomaly & vehicle condition.' },
            { tag: 'TELEGRAM', type: 'ready', msg: 'Alert sent: found BMW 320d (2018) below market value!' },
            { tag: 'IDLE', type: 'ready', msg: 'Scrape finished. Sleeping for 15 minutes..._' }
        ],
        liferpg: [
            { tag: 'INIT', type: 'system', msg: 'Initializing Android Room Database...' },
            { tag: 'DB', type: 'ready', msg: 'SQLite schema verified: Quest and Character tables loaded.' },
            { tag: 'UI', type: 'info', msg: 'Binding Compose state flows for dashboard view.' },
            { tag: 'GAME', type: 'system', msg: 'Calculating player XP and level progression...' },
            { tag: 'SYNC', type: 'info', msg: 'Syncing completed daily quests with SQLite database.' },
            { tag: 'LEVEL', type: 'ready', msg: 'Player leveled up! Triggering firework animation flow._' }
        ]
    };

    // Variable para almacenar el ID del temporizador activo y evitar solapes de tecleado
    let activeTimers = [];

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const projectId = card.getAttribute('data-project-id');
            const logs = logDatabase[projectId];
            
            if (!logs) return;

            // Limpiar consola de depuración previa e interrumpir escrituras previas
            injectionDiv.innerHTML = '';
            activeTimers.forEach(timer => clearTimeout(timer));
            activeTimers = [];

            // Escribir líneas en cascada con retraso de consola de servidor
            logs.forEach((log, index) => {
                const timer = setTimeout(() => {
                    const row = document.createElement('div');
                    row.className = 'terminal-log-row project-log';
                    
                    // Elegir color del tag según el tipo
                    let tagColorClass = 'system-ready';
                    if (log.type === 'system') tagColorClass = 'system-startup';
                    if (log.type === 'info') tagColorClass = 'log-timestamp';

                    // Formatear fecha física del sistema
                    const now = new Date();
                    const timestamp = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;

                    row.innerHTML = `
                        <span class="log-timestamp">${timestamp}</span>
                        <span class="log-tag ${tagColorClass}">[${log.tag}]</span>
                        <span class="log-text">${log.msg}</span>
                    `;

                    injectionDiv.appendChild(row);

                    // Hacer scroll automático al fondo del terminal para seguir el flujo
                    const terminalBody = document.querySelector('.terminal-body-content');
                    if (terminalBody) {
                        terminalBody.scrollTop = terminalBody.scrollHeight;
                    }
                }, index * 180); // 180ms por línea (tecleado ultra veloz y fluido)

                activeTimers.push(timer);
            });
        });
    });
}

/* ==========================================================================
   G. WEB AUDIO SYNTHESIZER FOR SOUND FEEDBACK
   ========================================================================== */
const synthSound = {
    ctx: null,
    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },
    playClick() {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine';
        // Frecuencia inicial alta que decae exponencialmente al instante (clic digital táctil de ciencia ficción)
        osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    },
    playHover() {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'triangle';
        // Frecuencia baja y sutil que sube suavemente (un pulso holográfico táctil)
        osc.frequency.setValueAtTime(160, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(280, this.ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
    }
};

function initAudioUI() {
    // Escuchar el primer clic o movimiento para desbloquear AudioContext (autoplay policy)
    const unlock = () => {
        synthSound.init();
        document.removeEventListener('click', unlock);
        document.removeEventListener('mousemove', unlock);
    };
    document.addEventListener('click', unlock);
    document.addEventListener('mousemove', unlock);

    // Clics a enlaces, botones e interactivos
    const clickables = document.querySelectorAll('a, button, .project-card, .magnetic, .scramble-hover');
    clickables.forEach(el => {
        el.addEventListener('click', () => {
            synthSound.playClick();
        });
    });

    // Hovers a elementos destacados
    const hoverables = document.querySelectorAll('.nav-link, .magnetic, .project-card, .drawer-close-btn, .pyramid-cell');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            synthSound.playHover();
        });
    });
}

/* ==========================================================================
   H. FUTURISTIC PROJECT SPECIFICATIONS DRAWER
   ========================================================================== */
function initProjectInspectDrawer() {
    const drawer = document.getElementById('project-inspect-drawer');
    const backdrop = drawer.querySelector('.drawer-backdrop');
    const closeBtn = drawer.querySelector('.drawer-close-btn');
    const cards = document.querySelectorAll('.project-card');
    
    if (!drawer || !backdrop || !closeBtn) return;

    // Base de datos técnica extendida con descripciones premium y bloques de código de servidor
    const projectSpecs = {
        fitwin: {
            tag: "SPRING BOOT / KOTLIN MULTIPLATFORM / KTOR",
            title: "FIT-WIN",
            year: "2026",
            desc: `
                <p><strong>Fit-Win</strong> es un ecosistema fitness modular formado por una API REST en el backend y un cliente nativo Android multiplataforma.</p>
                <p><strong>Características de Arquitectura:</strong></p>
                <ul>
                    <li><strong>Backend:</strong> API REST desarrollada con Spring Boot y Java 21, persistencia con MariaDB.</li>
                    <li><strong>Seguridad:</strong> Autenticación mediante tokens JWT rotativos con control de expiración y rate-limiting por IP con Caffeine.</li>
                    <li><strong>Pruebas:</strong> Cobertura de tests automatizados con más de 159 pruebas unitarias utilizando JUnit 5 y Mockito.</li>
                    <li><strong>Cliente Móvil:</strong> Aplicación nativa Android construida con Kotlin Multiplatform (KMP) y Compose Multiplatform, con arquitectura preparada para iOS.</li>
                </ul>
                <a href="https://github.com/omaradlcrrl" target="_blank" class="github-drawer-link scramble-hover" data-scramble="[ VER REPOSITORIO GITHUB ]">[ VER REPOSITORIO GITHUB ]</a>
            `,
            filename: "FitnessHandshakeController.kt",
            code: `package com.fitwin.api.controller

import com.fitwin.api.dto.HandshakeRequest
import com.fitwin.api.dto.HandshakeResponse
import com.fitwin.api.security.JwtService
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import jakarta.validation.Valid

@RestController
@RequestMapping("/api/v1/handshake")
class FitnessHandshakeController(
    private val jwtService: JwtService
) {
    private val logger = LoggerFactory.getLogger(FitnessHandshakeController::class.java)

    @PostMapping("/sync")
    fun synchronizeDevice(
        @RequestHeader("X-Device-UUID") deviceUuid: String,
        @Valid @RequestBody request: HandshakeRequest
    ): ResponseEntity<HandshakeResponse> {
        logger.info("Iniciando handshake para dispositivo: $deviceUuid, usuario: \\\${request.email}")
        
        // Validar firma del payload criptográfico del cliente
        val isValidSignature = jwtService.verifyClientSignature(request.payload, request.signature)
        if (!isValidSignature) {
            logger.warn("Firma inválida detectada en el handshake de $deviceUuid")
            return ResponseEntity.status(401).build()
        }

        // Generar par de tokens JWT rotativos (Access y Refresh Tokens)
        val tokens = jwtService.generateSessionTokens(request.email, deviceUuid)
        
        logger.info("Handshake completado y sincronizado con éxito para $deviceUuid")
        return ResponseEntity.ok(
            HandshakeResponse(
                status = "SYNCHRONIZED",
                accessToken = tokens.accessToken,
                refreshToken = tokens.refreshToken,
                serverTime = System.currentTimeMillis()
            )
        )
    }
}`
        },
        carfinder: {
            tag: "PYTHON / SQLITE / TELEGRAM BOT API",
            title: "CAR-FINDER",
            year: "2026",
            desc: `
                <p><strong>Car-Finder</strong> es un scraper autónomo e inteligente de vehículos de segunda mano de alta frecuencia. Automatiza la detección de anomalías de precio en múltiples portales de venta.</p>
                <p><strong>Características de Arquitectura:</strong></p>
                <ul>
                    <li><strong>Extracción Web:</strong> Hilos concurrentes de scraping en Python diseñados para saltarse las protecciones SSR modernas mediante rotación dinámica de User-Agents y proxies.</li>
                    <li><strong>Motor de Datos:</strong> Indexación de vehículos en tiempo real en una base de datos local SQLite con deduplicación automatizada.</li>
                    <li><strong>Filtro de Anomalías:</strong> Evaluación automática mediante algoritmos estadísticos para detectar precios muy por debajo del promedio del mercado.</li>
                    <li><strong>Notificaciones:</strong> Webhooks activos que alertan al instante a un Bot de Telegram con la información clave del vehículo.</li>
                </ul>
                <a href="https://github.com/omaradlcrrl" target="_blank" class="github-drawer-link scramble-hover" data-scramble="[ VER REPOSITORIO GITHUB ]">[ VER REPOSITORIO GITHUB ]</a>
            `,
            filename: "vehicle_scraper.py",
            code: `import os
import sqlite3
import requests
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor

class VehicleScraper:
    def __init__(self, db_path="vehicles.db"):
        self.db_path = db_path
        self.telegram_bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
        self.telegram_chat_id = os.getenv("TELEGRAM_CHAT_ID")
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS vehicles (
                    id TEXT PRIMARY KEY,
                    title TEXT, price REAL, url TEXT,
                    source TEXT, detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

    def check_pricing_anomaly(self, price, model_year):
        # Simulación de detección estadística de subprecio de mercado
        average_price = 12000.0  # Obtenido dinámicamente según histórico
        return price < (average_price * 0.75)  # Anomalía del 25% de descuento

    def notify_telegram(self, title, price, url):
        message = f"🚨 ANOMALÍA DETECTADA 🚨\\\\nVehículo: {title}\\\\nPrecio: {price}€\\\\nEnlace: {url}"
        api_url = f"https://api.telegram.org/bot{self.telegram_bot_token}/sendMessage"
        requests.post(api_url, json={"chat_id": self.telegram_chat_id, "text": message})

    def scrape_portal(self, url):
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Flujo de parsing concurrente y guardado de resultados
        # ...`
        },
        liferpg: {
            tag: "KOTLIN / JETPACK COMPOSE / ROOM DB",
            title: "LIFERPG",
            year: "2025",
            desc: `
                <p><strong>LifeRPG</strong> es una aplicación móvil nativa de productividad gamificada que transforma la realización de tareas diarias, hábitos y objetivos en misiones interactivas con puntos de experiencia, recompensas y subidas de nivel.</p>
                <p><strong>Características de Arquitectura:</strong></p>
                <ul>
                    <li><strong>Jetpack Compose:</strong> Interfaz reactiva fluida, micro-animaciones personalizadas de subida de nivel y paneles dinámicos de estadísticas del personaje.</li>
                    <li><strong>Persistencia Robusta (Room DB):</strong> Mapeo relacional de entidades complejas (Quest, Habit, Character, Skill) almacenadas localmente y sincronizadas asíncronamente con Kotlin Flows y Coroutines.</li>
                    <li><strong>Arquitectura Limpia & SOLID:</strong> Capas completamente desacopladas con repositorios reactivos y flujo de datos unidireccional (MVI/MVVM).</li>
                </ul>
                <a href="https://github.com/omaradlcrrl" target="_blank" class="github-drawer-link scramble-hover" data-scramble="[ VER REPOSITORIO GITHUB ]">[ VER REPOSITORIO GITHUB ]</a>
            `,
            filename: "QuestRepository.kt",
            code: `package com.liferpg.app.repository

import com.liferpg.app.db.dao.QuestDao
import com.liferpg.app.model.Quest
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class QuestRepository(private val questDao: QuestDao) {

    val activeQuests: Flow<List<Quest>> = questDao.getActiveQuestsFlow()

    suspend fun completeQuest(questId: Long, experienceReward: Int): Unit = withContext(Dispatchers.IO) {
        val quest = questDao.getQuestById(questId) ?: return@withContext
        val updatedQuest = quest.copy(
            isCompleted = true,
            completedTimestamp = System.currentTimeMillis()
        )
        questDao.update(updatedQuest)
        
        // Disparar evento de incremento de experiencia del personaje
        CharacterManager.awardExperience(experienceReward)
    }
}`
        }
    };

    const openDrawer = (projectId) => {
        const spec = projectSpecs[projectId];
        if (!spec) return;

        // Rellenar dinámicamente con los datos correspondientes
        document.getElementById('drawer-project-tag').innerText = spec.tag;
        document.getElementById('drawer-project-title').innerText = spec.title;
        document.getElementById('drawer-project-year').innerText = spec.year;
        document.getElementById('drawer-project-desc').innerHTML = spec.desc;
        document.getElementById('drawer-project-filename').innerText = spec.filename;
        document.getElementById('drawer-project-code').textContent = spec.code;

        // Reinicializar scramble hover para el nuevo enlace que se ha inyectado en el drawer
        if (!openDrawer._drawerScrambleInitialized) {
            initScrambleHoverEffect();
            openDrawer._drawerScrambleInitialized = true;
        }

        // Mostrar drawer
        drawer.classList.add('drawer-active');
        
        // Detener scroll suave de Lenis para evitar scroll por debajo del panel
        if (window.lenis) {
            window.lenis.stop();
        }
        document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
        drawer.classList.remove('drawer-active');
        
        // Reactivar scroll suave de Lenis
        if (window.lenis) {
            window.lenis.start();
        }
        document.body.style.overflow = '';
    };

    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            const projectId = card.getAttribute('data-project-id');
            if (projectId) {
                openDrawer(projectId);
            }
        });
    });

    closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);

    // Permitir cerrar pulsando Escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('drawer-active')) {
            closeDrawer();
        }
    });

    // --- 3D INTERACTIVE TILT FOR ABOUT PROFILE CARD ---
    const aboutCard = document.querySelector('.about-image-card');
    if (aboutCard) {
        const specBox = aboutCard.querySelector('.about-spec-box');
        let aboutTiltRAF = null;

        aboutCard.addEventListener('mousemove', (e) => {
            const mx = e.clientX, my = e.clientY;
            if (aboutTiltRAF) return;
            aboutTiltRAF = requestAnimationFrame(() => {
                const rect = aboutCard.getBoundingClientRect();
                const x = mx - rect.left; // x position inside card
                const y = my - rect.top;  // y position inside card
                
                // Calculate relative positions (-0.5 to 0.5)
                const xc = (x - rect.width / 2) / (rect.width / 2);
                const yc = (y - rect.height / 2) / (rect.height / 2);
                
                // Limit max rotation to 12 degrees
                const maxRot = 12;
                const rotX = -yc * maxRot;
                const rotY = xc * maxRot;
                
                gsap.to(aboutCard, {
                    rotateX: rotX,
                    rotateY: rotY,
                    transformPerspective: 1000,
                    duration: 0.4,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
                
                // Translate the floating specs box slightly in the opposite direction for parallax depth!
                if (specBox) {
                    gsap.to(specBox, {
                        x: -xc * 15,
                        y: -yc * 15,
                        duration: 0.4,
                        ease: 'power2.out',
                        overwrite: 'auto'
                    });
                }
                aboutTiltRAF = null;
            });
        });
        
        aboutCard.addEventListener('mouseleave', () => {
            // Restore normal stable state smoothly
            gsap.to(aboutCard, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.8,
                ease: 'power2.out',
                overwrite: 'auto'
            });
            
            if (specBox) {
                gsap.to(specBox, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            }
        });
    }
}

/* ==========================================================================
   I18N — ES/EN TOGGLE (UI copy only; terminal logs & drawer code stay)
   ========================================================================== */
const i18n = {
    es: {
        'nav.about': 'Sobre Mí',
        'nav.projects': 'Proyectos',
        'nav.skills': 'Habilidades',
        'nav.experience': 'Experiencia',
        'nav.cv': 'CV ↓',
        'nav.contact': 'Hablemos',
        'hero.badge': 'Buscando primera posición Full Stack / Backend Java',
        'hero.title.1a': 'DESARROLLANDO',
        'hero.title.1b': 'SISTEMAS',
        'hero.title.2': 'DE ALTO RENDIMIENTO',
        'hero.title.3a': 'CON',
        'hero.title.3b': 'SPRING Y KOTLIN',
        'hero.subtitle': 'Construyo APIs RESTful e interfaces nativas multiplataforma sobre el ecosistema JVM (Java, Spring Boot, Kotlin). Foco en rendimiento, testing y arquitectura mantenible.',
        'hero.explore': 'Explorar',
        'about.tag': '/ 01. QUIÉN SOY',
        'about.title': 'Sobre Mí',
        'about.subtitle': 'Desarrollo de software robusto y escalable enfocado en el rendimiento',
        'about.text.1': 'Soy Omar Adel Corral, desarrollador Full Stack & Mobile recién titulado en DAM (ESIC). Me especializo en el ecosistema JVM (Java, Spring Boot, Kotlin) para estructurar APIs RESTful con autenticación JWT, seguridad robusta y persistencia eficiente sobre MariaDB.',
        'about.text.2': 'En móvil apuesto por Kotlin Multiplatform y Compose Multiplatform para apps nativas Android desde una sola base de código, con arquitectura preparada para iOS. Trabajo con un proceso disciplinado donde testing (JUnit 5, Mockito), Clean Code y SOLID son la línea base, no un extra.',
        'tech.01.title': 'Backend & APIs',
        'tech.01.desc': 'APIs RESTful con Spring Boot y Java. Seguridad JWT, persistencia sobre MariaDB y código limpio bajo principios SOLID.',
        'tech.02.title': 'Mobile Nativo',
        'tech.02.desc': 'Creación de apps nativas fluidas con Kotlin Multiplatform y Android SDK para rendimiento puro.',
        'tech.03.title': 'Clean Code & SOLID',
        'tech.03.desc': 'Estructuración limpia orientada a componentes, patrones de diseño modulares y testing exhaustivo.',
        'tech.04.title': 'Rendimiento',
        'tech.04.desc': 'Indexación SQL, rate limiting por IP con Caffeine y diseño orientado a un backend estable y eficiente.',
        'projects.tag': '/ SELECCIÓN DE TRABAJOS',
        'projects.title': 'Proyectos Destacados',
        'skills.tag': '/ ARQUITECTURA TECNOLÓGICA',
        'skills.title': 'Mi Stack',
        'exp.tag': '/ TRAYECTORIA Y EDUCACIÓN',
        'exp.title': 'Experiencia & Educación',
        'exp.flagship': 'PROYECTO INSIGNIA',
        'exp.fitwin.date': 'Ene 2025 - May 2026',
        'exp.fitwin.role': 'Creador de Fit-Win (Ecosistema Full Stack)',
        'exp.fitwin.company': 'Proyecto Destacado Independiente',
        'exp.fitwin.desc': 'Diseño e implementación de un ecosistema completo: API REST con Spring Boot/Java 21 sobre MariaDB (159 pruebas unitarias Mockito/JUnit 5) y cliente nativo Android con Kotlin Multiplatform y Compose Multiplatform. Seguridad mediante tokens JWT rotativos y rate limiting por IP.',
        'exp.destaka.date': 'Mar 2024 - Jul 2024',
        'exp.destaka.role': 'Desarrollador Full Stack (Remoto)',
        'exp.destaka.company': 'Destaka Marketing',
        'exp.destaka.desc': 'Diseño de prototipos de aplicaciones móviles en Figma para clientes. Desarrollo e implementación de APIs RESTful con Java y Spring Boot. Mantenimiento y optimización de rendimiento del frontend corporativo (JavaScript y WordPress).',
        'exp.dam.date': 'Oct 2022 - Ene 2026',
        'exp.dam.role': 'Técnico Superior DAM',
        'exp.dam.company': 'ESIC Business & Marketing School',
        'exp.dam.desc': 'Titulado en Desarrollo de Aplicaciones Multiplataforma (DAM). Especialización en Data Analytics: visualización con Power BI, análisis con Excel y gestión de bases de datos.',
        'certs.heading': '/ CERTIFICACIONES',
        'certs.cyber.date': 'Mayo 2026',
        'certs.cyber.name': 'Google Cybersecurity Certificate',
        'certs.cyber.issuer': 'Coursera · Fundamentos de ciberseguridad, redes, Linux, SIEM y automatización con Python',
        'lang.heading': '/ IDIOMAS',
        'lang.es.name': 'Español',
        'lang.es.level': 'Nativo',
        'lang.en.name': 'Inglés',
        'lang.en.level': 'B2 — First Certificate',
        'contact.tag': '',
        'contact.line1': 'Contacto',
        'contact.line2': '',
        'contact.cv': 'Descargar CV (PDF)',
        'contact.social': 'Redes Sociales',
        'contact.location': 'Ubicación y Hora',
        'contact.location.val': 'Madrid, España / UTC+2',
        'footer.copyright': '© 2026 Omar Adel Corral.',
        'footer.tagline': ''
    },
    en: {
        'nav.about': 'About',
        'nav.projects': 'Projects',
        'nav.skills': 'Skills',
        'nav.experience': 'Experience',
        'nav.cv': 'CV ↓',
        'nav.contact': "Let's Talk",
        'hero.badge': 'Seeking first Full Stack / Backend Java position',
        'hero.title.1a': 'BUILDING',
        'hero.title.1b': 'HIGH-PERFORMANCE',
        'hero.title.2': 'SYSTEMS',
        'hero.title.3a': 'WITH',
        'hero.title.3b': 'SPRING & KOTLIN',
        'hero.subtitle': 'I build RESTful APIs and native cross-platform interfaces on top of the JVM ecosystem (Java, Spring Boot, Kotlin). Focused on performance, testing and maintainable architecture.',
        'hero.explore': 'Explore',
        'about.tag': '/ 01. WHO I AM',
        'about.title': 'About Me',
        'about.subtitle': 'Robust, scalable, performance-focused software development',
        'about.text.1': "I'm Omar Adel Corral, a Full Stack & Mobile developer freshly graduated from DAM at ESIC. I specialize in the JVM ecosystem (Java, Spring Boot, Kotlin) to design RESTful APIs with JWT authentication, robust security and efficient persistence on MariaDB.",
        'about.text.2': "On mobile I bet on Kotlin Multiplatform and Compose Multiplatform to ship native Android apps from a single codebase, with an architecture ready for iOS. I work with a disciplined process where testing (JUnit 5, Mockito), Clean Code and SOLID are baseline, not extras.",
        'tech.01.title': 'Backend & APIs',
        'tech.01.desc': 'RESTful APIs with Spring Boot and Java. JWT security, MariaDB persistence and clean code following SOLID principles.',
        'tech.02.title': 'Native Mobile',
        'tech.02.desc': 'Fluid native apps with Kotlin Multiplatform and the Android SDK for raw performance.',
        'tech.03.title': 'Clean Code & SOLID',
        'tech.03.desc': 'Component-oriented structure, modular design patterns and exhaustive testing.',
        'tech.04.title': 'Performance',
        'tech.04.desc': 'SQL indexing, IP-based rate limiting with Caffeine and design focused on a stable, efficient backend.',
        'projects.tag': '/ SELECTED WORK',
        'projects.title': 'Featured Projects',
        'skills.tag': '/ TECHNOLOGY ARCHITECTURE',
        'skills.title': 'My Stack',
        'exp.tag': '/ JOURNEY & EDUCATION',
        'exp.title': 'Experience & Education',
        'exp.flagship': 'FLAGSHIP PROJECT',
        'exp.fitwin.date': 'Jan 2025 - May 2026',
        'exp.fitwin.role': 'Creator of Fit-Win (Full Stack Ecosystem)',
        'exp.fitwin.company': 'Independent Flagship Project',
        'exp.fitwin.desc': 'Design and implementation of a full ecosystem: REST API with Spring Boot/Java 21 on MariaDB (159 unit tests with Mockito/JUnit 5) plus a native Android client with Kotlin Multiplatform and Compose Multiplatform. Security via rotating JWT tokens and IP rate limiting.',
        'exp.destaka.date': 'Mar 2024 - Jul 2024',
        'exp.destaka.role': 'Full Stack Developer (Remote)',
        'exp.destaka.company': 'Destaka Marketing',
        'exp.destaka.desc': 'Mobile app prototypes in Figma for clients. Design and implementation of RESTful APIs with Java and Spring Boot. Maintenance and performance optimization of the corporate frontend (JavaScript and WordPress).',
        'exp.dam.date': 'Oct 2022 - Jan 2026',
        'exp.dam.role': 'Higher Technician — DAM',
        'exp.dam.company': 'ESIC Business & Marketing School',
        'exp.dam.desc': 'Graduated in Multi-Platform Application Development (DAM). Specialization in Data Analytics: visualization with Power BI, analysis with Excel and database management.',
        'certs.heading': '/ CERTIFICATIONS',
        'certs.cyber.date': 'May 2026',
        'certs.cyber.name': 'Google Cybersecurity Certificate',
        'certs.cyber.issuer': 'Coursera · Foundations of cybersecurity, networking, Linux, SIEM and security automation with Python',
        'lang.heading': '/ LANGUAGES',
        'lang.es.name': 'Spanish',
        'lang.es.level': 'Native',
        'lang.en.name': 'English',
        'lang.en.level': 'B2 — First Certificate',
        'contact.tag': '',
        'contact.line1': 'Contact',
        'contact.line2': '',
        'contact.cv': 'Download CV (PDF)',
        'contact.social': 'Social',
        'contact.location': 'Location & Time',
        'contact.location.val': 'Madrid, Spain / UTC+2',
        'footer.copyright': '© 2026 Omar Adel Corral.',
        'footer.tagline': ''
    }
};

function applyLang(lang) {
    if (!i18n[lang]) lang = 'es';
    const dict = i18n[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-scramble]').forEach(el => {
        const key = el.getAttribute('data-i18n-scramble');
        if (dict[key] !== undefined) el.setAttribute('data-scramble', dict[key].toUpperCase());
    });
    localStorage.setItem('portfolio-lang', lang);
    const cur = document.querySelector('.lang-current');
    const alt = document.querySelector('.lang-alt');
    if (cur) cur.textContent = lang.toUpperCase();
    if (alt) alt.textContent = (lang === 'es' ? 'EN' : 'ES');
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.lang-toggle');
    if (btn) {
        btn.addEventListener('click', () => {
            const current = localStorage.getItem('portfolio-lang') || 'es';
            applyLang(current === 'es' ? 'en' : 'es');
        });
    }
    applyLang(localStorage.getItem('portfolio-lang') || 'es');
});


/* ==========================================================================
   J. SKILLS GRAVITATIONAL BLACKHOLE CANVAS
   ========================================================================== */
function initSkillsBlackhole() {
    const canvas = document.getElementById('skills-blackhole-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        if (!canvas) return;
        const rect = canvas.parentNode.getBoundingClientRect();
        // Usar dimensiones exactas del contenedor padre para evitar estiramientos y distorsión
        width = canvas.width = rect.width || window.innerWidth;
        height = canvas.height = rect.height || 650;
    }
    
    // Debounce del resize
    let bhResizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(bhResizeTimer);
        bhResizeTimer = setTimeout(() => {
            resize();
        }, 200);
    });
    resize();

    let time = 0;
    let frameCount = 0;
    let cy = height / 2 + 15; // Valor por defecto

    // Configuración de la rejilla de alta densidad
    const cols = 32; // Más columnas para una rejilla más densa
    const rows = 18; // Más filas para mayor detalle
    
    // Parámetros de proyección 3D
    const focalLength = 320;
    const cameraDistance = 500;
    const perspectiveTilt = 0.54; // Aplanado de inclinación vertical isométrica
    
    const isMobile = window.innerWidth < 768;

    // IntersectionObserver para pausar cuando no sea visible
    let bhVisible = true;
    let bhAnimating = false;
    const bhObserver = new IntersectionObserver(([entry]) => {
        bhVisible = entry.isIntersecting;
        if (bhVisible && !bhAnimating) {
            bhAnimating = true;
            draw();
        }
    }, { threshold: 0.01 });
    bhObserver.observe(canvas);

    function draw() {
        if (!canvas) return;
        if (!bhVisible) {
            bhAnimating = false;
            return;
        }
        bhAnimating = true;

        ctx.clearRect(0, 0, width, height);

        time += 0.006;
        frameCount++;

        const cx = width / 2;

        // Calcular de forma dinámica y pixel-perfect el centro de la celda "APIs RESTful" cada 30 frames
        // Esto previene el layout thrashing durante el movimiento del ratón y responde al redimensionado/animaciones dinámicas
        if (frameCount % 30 === 1) {
            const apiCell = document.querySelector('.pyramid-cell [data-scramble="APIS RESTFUL"]')?.closest('.pyramid-cell');
            if (apiCell && canvas) {
                const sectionRect = canvas.parentNode.getBoundingClientRect();
                const cellRect = apiCell.getBoundingClientRect();
                if (cellRect.height > 0 && sectionRect.height > 0) {
                    cy = (cellRect.top + cellRect.height / 2) - sectionRect.top;
                }
            }
        }

        // 1. Núcleo Volumétrico Gigante del Agujero Negro (Pulsante con Acreción Ciberpunk)
        const pulse = Math.sin(time * 2.8) * 15;
        const coreRadius = (isMobile ? 90 : 180) + pulse; // Núcleo aún más grande y volumétrico como en la foto de referencia
        
        const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius);
        coreGlow.addColorStop(0, '#ffffff'); // Centro blanco incandescente
        coreGlow.addColorStop(0.12, 'rgba(0, 242, 254, 0.95)'); // Cian neón súper brillante
        coreGlow.addColorStop(0.35, 'rgba(161, 140, 209, 0.7)'); // Púrpura/Violeta denso
        coreGlow.addColorStop(0.7, 'rgba(0, 114, 255, 0.15)'); // Halo azul de vacío
        coreGlow.addColorStop(1, 'rgba(7, 7, 10, 0)'); // Fuga al vacío negro

        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
        ctx.fill();

        // 1.5. Anillo / Disco de Acreción de Partículas de Neón Orbitando (Giro fluido y dinámico visible)
        const numParticles = isMobile ? 12 : 32;
        for (let i = 0; i < numParticles; i++) {
            const orbitRadius = coreRadius * 0.42 + (i * (isMobile ? 4.5 : 7.2));
            // Cada partícula orbita a una velocidad que disminuye con la distancia (física kepleriana real)
            const speedCoeff = 6.2 / Math.sqrt(orbitRadius);
            const angle = time * speedCoeff * 8.5 + (i * (Math.PI * 2 / numParticles));
            
            // Proyectar elípticamente según la inclinación vertical perspectiveTilt
            const px = cx + Math.cos(angle) * orbitRadius;
            const py = cy + Math.sin(angle) * orbitRadius * perspectiveTilt;
            
            const size = (isMobile ? 1.0 : 1.9) + Math.sin(time * 4.5 + i) * 0.85;
            ctx.fillStyle = i % 2 === 0 ? 'rgba(0, 242, 254, 0.9)' : 'rgba(161, 140, 209, 0.9)';
            
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }

        // 2. Rejilla virtual ancha en 3D (para abarcar el 100% de la pantalla sin vacíos en los bordes)
        const virtualWidth = width * 1.55;
        const virtualHeight = height * 1.35;
        const spacingX = virtualWidth / (cols - 1);
        const spacingY = virtualHeight / (rows - 1);

        const points = [];

        for (let r = 0; r < rows; r++) {
            points[r] = [];
            for (let c = 0; c < cols; c++) {
                // Coordenadas iniciales en el plano virtual centrado en (0, 0)
                const rx = (c * spacingX) - (virtualWidth / 2);
                const ry = (r * spacingY) - (virtualHeight / 2) + 30;
                const dist = Math.sqrt(rx * rx + ry * ry);

                // Embudo Gravitacional 3D (Hundimiento en Z)
                const gravityRadius = isMobile ? 180 : 260;
                const depthAmplitude = isMobile ? 260 : 350;
                const z = -depthAmplitude / (1 + (dist / gravityRadius) * (dist / gravityRadius));

                // Torsión en Espiral Keplereana (Efecto torbellino del Agujero Negro) - Rotación visible y obvia
                const spiralStrength = isMobile ? 0.32 : 0.58;
                const rotAngle = time * 2.2 + (spiralStrength / (1 + (dist / 140) * (dist / 140)));

                // Rotación de puntos locales
                const rxRot = rx * Math.cos(rotAngle) - ry * Math.sin(rotAngle);
                const ryRot = ry * Math.cos(rotAngle) + rx * Math.sin(rotAngle);

                // Proyectar el punto 3D deformado a 2D en pantalla
                const scale = focalLength / (cameraDistance + z);
                const px = cx + rxRot * scale;
                const py = cy + ryRot * scale * perspectiveTilt;

                points[r][c] = { x: px, y: py, dist: dist };
            }
        }

        // 3. Dibujar líneas longitudinales de la rejilla (Agrupadas por opacidad para minimizar strokes)
        ctx.lineWidth = 0.95;
        const purpleBuckets = {};
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols - 1; c++) {
                const pt1 = points[r][c];
                const pt2 = points[r][c + 1];
                
                const avgDist = (pt1.dist + pt2.dist) / 2;
                const decay = Math.exp(-avgDist / 240); 
                const opacity = (0.015 + decay * 0.35) * 0.95;

                // Redondear la opacidad a incrementos de 0.05 para agrupar en cubos
                const opacityKey = (Math.round(opacity * 20) / 20).toFixed(2);
                if (!purpleBuckets[opacityKey]) {
                    purpleBuckets[opacityKey] = [];
                }
                purpleBuckets[opacityKey].push({ x1: pt1.x, y1: pt1.y, x2: pt2.x, y2: pt2.y });
            }
        }
        
        for (const [opacity, segments] of Object.entries(purpleBuckets)) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(147, 112, 219, ${opacity})`;
            for (let i = 0; i < segments.length; i++) {
                const s = segments[i];
                ctx.moveTo(s.x1, s.y1);
                ctx.lineTo(s.x2, s.y2);
            }
            ctx.stroke();
        }

        // 4. Dibujar líneas latitudinales de la rejilla (Agrupadas por opacidad)
        const cyanBuckets = {};
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows - 1; r++) {
                const pt1 = points[r][c];
                const pt2 = points[r + 1][c];
                
                const avgDist = (pt1.dist + pt2.dist) / 2;
                const decay = Math.exp(-avgDist / 240);
                const opacity = (0.012 + decay * 0.28) * 0.85;

                const opacityKey = (Math.round(opacity * 20) / 20).toFixed(2);
                if (!cyanBuckets[opacityKey]) {
                    cyanBuckets[opacityKey] = [];
                }
                cyanBuckets[opacityKey].push({ x1: pt1.x, y1: pt1.y, x2: pt2.x, y2: pt2.y });
            }
        }
        
        for (const [opacity, segments] of Object.entries(cyanBuckets)) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
            for (let i = 0; i < segments.length; i++) {
                const s = segments[i];
                ctx.moveTo(s.x1, s.y1);
                ctx.lineTo(s.x2, s.y2);
            }
            ctx.stroke();
        }

        // 5. Círculos concéntricos de fuerza gravitacional orbitales mixtos (Cian/Púrpura con desvanecimiento)
        ctx.lineWidth = 1.1;
        const ringCounts = isMobile ? 6 : 9;
        const baseRadius = 40;
        const ringSpacing = isMobile ? 35 : 45;

        for (let i = 1; i <= ringCounts; i++) {
            const currentRadius = baseRadius + i * ringSpacing;
            ctx.beginPath();
            const segments = 60;
            for (let s = 0; s <= segments; s++) {
                const theta = (s / segments) * Math.PI * 2 + time * 0.22 * (1 / (i * 0.45));
                const rx = currentRadius * Math.cos(theta);
                const ry = currentRadius * Math.sin(theta);
                
                const dist = currentRadius;
                const gravityRadius = isMobile ? 180 : 260;
                const depthAmplitude = isMobile ? 260 : 350;
                const z = -depthAmplitude / (1 + (dist / gravityRadius) * (dist / gravityRadius));

                const scale = focalLength / (cameraDistance + z);
                const px = cx + rx * scale;
                const py = cy + ry * scale * perspectiveTilt;

                if (s === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
            
            // Los anillos también se desvanecen exponencialmente con la distancia
            const ringDecay = Math.exp(-currentRadius / 260);
            const ringOpacity = (0.015 + ringDecay * 0.32) * 0.72;
            
            // Alternar colores entre cian neón y violeta de forma espectacular
            ctx.strokeStyle = i % 2 === 0 
                ? `rgba(0, 242, 254, ${ringOpacity})` 
                : `rgba(161, 140, 209, ${ringOpacity * 1.3})`;
            ctx.stroke();
        }

        if (bhVisible) {
            requestAnimationFrame(draw);
        }
    }
}

