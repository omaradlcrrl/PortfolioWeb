/* ==========================================================================
   INTERACTIVE CANVAS PARTICLES & 3D CRYPTO-VAULT PARTICLES ENGINE - OMAR PORTFOLIO
   ========================================================================== */

// Función auxiliar de conversión Hexadecimal a RGBA
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const TWO_PI = Math.PI * 2;

class ParticleEngine {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        // 1. Configuraciones de Partículas de Fondo
        this.particles = [];
        this.sparks = []; // Estela de chispas del cursor
        this.particleCount = 100;
        this.mouse = { x: null, y: null, radius: 160 };
        this.prevMouse = { x: null, y: null };
        this.themeColors = ['#00f2fe', '#a18cd1', '#ff0844'];
        this._sparkThrottle = false;

        // 2. Configuraciones de la Bóveda de Partículas Criptográficas 3D (Secure Vault)
        this.vault = {
            particles: [],
            angleX: 0.3,
            angleY: 0.5,
            angleZ: 0.1,
            targetRotX: 0,
            targetRotY: 0,
            size: 130, // Radio base de la esfera cuántica
            centerX: 0,
            centerY: 0
        };

        // Cached window width (updated on resize)
        this._cachedWidth = window.innerWidth;

        this._boundAnimate = this.animate.bind(this);

        this.init();
        this.animate();
        this.registerEvents();
    }

    init() {
        this.resize();
        this.particles = [];
        this.sparks = [];
        
        let vaultCount = 450; // Cantidad de partículas en desktop para densidad óptima
        
        // Determinar cantidad de partículas según tamaño de pantalla
        if (this._cachedWidth < 768) {
            this.particleCount = 35;
            this.mouse.radius = 90;
            this.vault.size = 75; // Más pequeño en móviles
            vaultCount = 200; // Reducido para excelente fluidez en dispositivos móviles
        } else {
            this.particleCount = 100;
            this.mouse.radius = 160;
            this.vault.size = 135; // Grande en desktop
            vaultCount = 450;
        }

        // Vault center (recalculated on init/resize, not per-frame)
        this.vault.centerX = this.canvas.width * (this._cachedWidth < 768 ? 0.5 : 0.72);
        this.vault.centerY = this.canvas.height * (this._cachedWidth < 768 ? 0.35 : 0.42);

        // Inicializar Partículas de Fondo
        for (let i = 0; i < this.particleCount; i++) {
            const size = Math.random() * 2 + 1;
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const color = this.themeColors[Math.floor(Math.random() * this.themeColors.length)];
            const glowColor = hexToRgba(color, 0.08);
            
            const vx = (Math.random() - 0.5) * 0.35;
            const vy = (Math.random() - 0.5) * 0.35;
            const alpha = Math.random() * 0.5 + 0.15;

            this.particles.push({
                x,
                y,
                size,
                vx,
                vy,
                color,
                glowColor,
                alpha,
                originAlpha: alpha,
                originSize: size
            });
        }

        // Inicializar la Bóveda de Partículas Esféricas 3D (Distribución Fibonacci Homogénea)
        this.vault.particles = [];
        const r = this.vault.size;
        for (let i = 0; i < vaultCount; i++) {
            // Algoritmo de Espiral de Fibonacci para distribución perfectamente homogénea sobre una esfera
            const theta = Math.acos(1 - 2 * (i + 0.5) / vaultCount);
            const phi = Math.sqrt(vaultCount * Math.PI) * theta;
            
            // Coordenadas locales cartesianas iniciales a partir de polares
            const x = r * Math.sin(theta) * Math.cos(phi);
            const y = r * Math.sin(theta) * Math.sin(phi);
            const z = r * Math.cos(theta);
            
            const color = this.themeColors[Math.floor(Math.random() * this.themeColors.length)];
            const glowColor = hexToRgba(color, 0.08);
            
            this.vault.particles.push({
                x: x,
                y: y,
                z: z,
                ox: x, // Posiciones de origen para la física elástica
                oy: y,
                oz: z,
                theta: theta,
                phi: phi,
                driftTheta: Math.random() * TWO_PI, // Desfase angular
                driftPhi: Math.random() * TWO_PI,
                driftSpeed: Math.random() * 0.005 + 0.002, // Deriva súper lenta para fluidez
                color: color,
                glowColor: glowColor,
                size: Math.random() * 1.5 + 1.2, // Tamaño fino
                alpha: Math.random() * 0.4 + 0.35, // Opacidad base translúcida
                elasticity: Math.random() * 0.06 + 0.045 // Inercia de retorno de resorte
            });
        }
    }

    resize() {
        this._cachedWidth = window.innerWidth;
        this.canvas.width = this._cachedWidth || document.documentElement.clientWidth || window.screen.width || 1920;
        this.canvas.height = window.innerHeight || document.documentElement.clientHeight || window.screen.height || 1080;
    }

    registerEvents() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.resize();
                this.init();
            }, 200);
        });

        // Seguir coordenadas y aplicar fuerzas de rotación al volumen 3D
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            if (this._cachedWidth >= 768) {
                if (!this._sparkThrottle) {
                    this._sparkThrottle = true;
                    this.emitSparks(e.clientX, e.clientY);
                    requestAnimationFrame(() => { this._sparkThrottle = false; });
                }
                
                // Rotación reactiva inercial según coordenadas relativas
                const dx = e.clientX - this.vault.centerX;
                const dy = e.clientY - this.vault.centerY;
                this.vault.targetRotY = dx * 0.0006;
                this.vault.targetRotX = -dy * 0.0006;
            }
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
            this.vault.targetRotX = 0;
            this.vault.targetRotY = 0;
        });
    }

    emitSparks(x, y) {
        if (this.sparks.length >= 60) return;

        let speed = 0;
        if (this.prevMouse.x !== null && this.prevMouse.y !== null) {
            const dx = x - this.prevMouse.x;
            const dy = y - this.prevMouse.y;
            speed = Math.sqrt(dx * dx + dy * dy);
        }
        this.prevMouse.x = x;
        this.prevMouse.y = y;

        const density = Math.min(3, Math.floor(speed * 0.12) + 1);

        for (let i = 0; i < density; i++) {
            const size = Math.random() * 2.5 + 1.5;
            const color = this.themeColors[Math.floor(Math.random() * this.themeColors.length)];
            
            const angle = Math.random() * TWO_PI;
            const velocityMagnitude = Math.random() * 1.8 + 0.4;
            const vx = Math.cos(angle) * velocityMagnitude + (Math.random() - 0.5) * 0.4;
            const vy = Math.sin(angle) * velocityMagnitude - 0.6;
            const life = 1.0;
            const decay = Math.random() * 0.018 + 0.012;

            this.sparks.push({
                x,
                y,
                size,
                vx,
                vy,
                color,
                life,
                decay
            });
        }
    }

    animate() {
        requestAnimationFrame(this._boundAnimate);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const winW = this._cachedWidth;

        // ==========================================
        // PARTE A: RENDER DE PARTÍCULAS CONSTELACIÓN (FONDO)
        // ==========================================
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const safeDistance = Math.max(0.1, distance);
                    p.x += (dx / safeDistance) * force * 0.8;
                    p.y += (dy / safeDistance) * force * 0.8;
                    
                    p.alpha = Math.min(p.originAlpha * 2, 0.85);
                    p.size = p.originSize * 1.5;
                } else {
                    if (p.alpha > p.originAlpha) p.alpha -= 0.01;
                    if (p.size > p.originSize) p.size -= 0.05;
                }
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, TWO_PI, false);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fill();

            // Malla de fondo conectora
            const maxConnectDist = 110;
            const maxConnectDistSq = maxConnectDist * maxConnectDist;
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxConnectDistSq) {
                    const dist = Math.sqrt(distSq);
                    const alpha = (1 - dist / maxConnectDist) * 0.07;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = '#ffffff';
                    this.ctx.globalAlpha = alpha;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }

        // ==========================================
        // PARTE B: RENDER DE ESTELA DE CHISPAS DOCK (CURSOR TRAIL)
        // ==========================================
        for (let i = this.sparks.length - 1; i >= 0; i--) {
            const s = this.sparks[i];
            
            s.vx *= 0.96;
            s.vy *= 0.96;
            s.vy += 0.03;
            
            s.x += s.vx;
            s.y += s.vy;
            s.life -= s.decay;

            if (s.life <= 0) {
                this.sparks[i] = this.sparks[this.sparks.length - 1];
                this.sparks.pop();
                i--;
                continue;
            }

            this.ctx.beginPath();
            this.ctx.arc(s.x, s.y, s.size * s.life, 0, TWO_PI, false);
            this.ctx.fillStyle = s.color;
            this.ctx.globalAlpha = s.life * 0.9;
            this.ctx.fill();
        }

        // ==========================================
        // PARTE C: RENDER DE LA BÓVEDA DE PARTÍCULAS 3D
        // ==========================================
        this.renderSecureVault();
        
        this.ctx.globalAlpha = 1;
    }

    renderSecureVault() {
        const c = this.vault;

        // Vault center is now computed in init()/resize(), not per-frame

        // 1. Deriva orbital autónoma sobre la superficie de la esfera
        for (let i = 0; i < c.particles.length; i++) {
            const p = c.particles[i];
            p.driftTheta += p.driftSpeed;
            p.driftPhi += p.driftSpeed * 0.8;

            // Variación armónica del radio de la esfera muy sutil (micro-pulsación)
            const currentR = c.size + Math.sin(p.driftTheta) * (c.size * 0.05);

            // Re-calcular la posición de origen local tridimensional en base a la deriva
            p.ox = currentR * Math.sin(p.theta) * Math.cos(p.phi + p.driftPhi * 0.15);
            p.oy = currentR * Math.sin(p.theta) * Math.sin(p.phi + p.driftPhi * 0.15);
            p.oz = currentR * Math.cos(p.theta);
            
            // Física de resorte (Spring Physics) elástica de retorno hacia su órbita original ox,oy,oz
            p.x += (p.ox - p.x) * p.elasticity;
            p.y += (p.oy - p.y) * p.elasticity;
            p.z += (p.oz - p.z) * p.elasticity;
        }

        // 2. Interpolación inercial de la rotación del ratón (Lerp inercia)
        c.angleX += (c.targetRotX + 0.002 - c.angleX) * 0.06; // Rotación automática constante + bias ratón
        c.angleY += (c.targetRotY + 0.003 - c.angleY) * 0.06;
        c.angleZ += 0.0015; // Giro en Z constante suave

        const cosX = Math.cos(c.angleX), sinX = Math.sin(c.angleX);
        const cosY = Math.cos(c.angleY), sinY = Math.sin(c.angleY);
        const cosZ = Math.cos(c.angleZ), sinZ = Math.sin(c.angleZ);

        // Constante de perspectiva (distancia focal del ojo de la cámara virtual)
        const cameraDistance = 450;

        // 3. Proyectar y renderizar las partículas aplicando física gravitatoria reactiva al ratón
        for (let i = 0; i < c.particles.length; i++) {
            const p = c.particles[i];

            // A. Rotar en eje X
            let y1 = p.y * cosX - p.z * sinX;
            let z1 = p.y * sinX + p.z * cosX;

            // B. Rotar en eje Y
            let x2 = p.x * cosY + z1 * sinY;
            let z2 = -p.x * sinY + z1 * cosY;

            // C. Rotar en eje Z
            let x3 = x2 * cosZ - y1 * sinZ;
            let y3 = x2 * sinZ + y1 * cosZ;

            // D. Perspectiva 3D -> 2D
            const scale = cameraDistance / (cameraDistance + z2);
            const projX = c.centerX + x3 * scale;
            const projY = c.centerY + y3 * scale;

            // E. FÍSICA GRAVITATORIA TÁCTIL (Hundimiento/Repulsión elástica por proximidad del cursor)
            let renderX = projX;
            let renderY = projY;
            let renderAlpha = p.alpha;
            let renderSize = p.size;

            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dxMouse = projX - this.mouse.x;
                const dyMouse = projY - this.mouse.y;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                
                // Radio de influencia gravitatoria (160px en desktop, 90px en móvil)
                const influenceRadius = this._cachedWidth < 768 ? 90 : 160;

                if (distMouse < influenceRadius) {
                    // Fuerza exponencial elástica inversa (más cerca = empuje drástico)
                    const force = (influenceRadius - distMouse) / influenceRadius;
                    
                    // Empuje físico en 2D radial hacia afuera alejado del cursor
                    const safeDistMouse = Math.max(0.1, distMouse);
                    const pushStrength = force * force * 50 * scale; // Ajustado por profundidad para 3D realista
                    renderX = projX + (dxMouse / safeDistMouse) * pushStrength;
                    renderY = projY + (dyMouse / safeDistMouse) * pushStrength;
                    
                    // Excitación energética cuántica (las partículas deformadas brillan e iluminan el borde del hueco)
                    renderAlpha = Math.min(0.9, p.alpha + force * 0.45);
                    renderSize = p.size * (1 + force * 0.9);
                    
                    // Alterar temporalmente las coordenadas locales 3D para inducir inercia de rebote
                    p.x -= (dxMouse / safeDistMouse) * force * 4.2;
                    p.y -= (dyMouse / safeDistMouse) * force * 4.2;
                }
            }

            // F. Dibujar partícula esférica proyectada
            const brightness = Math.max(0.12, Math.min(0.85, 1 - (z2 + c.size) / (c.size * 2)));

            this.ctx.beginPath();
            this.ctx.arc(renderX, renderY, renderSize * scale, 0, TWO_PI);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = renderAlpha * brightness;
            this.ctx.fill();

            // Sutil micro-glow neón radial en el centro de las partículas más brillantes de primer plano
            if (z2 < -c.size * 0.3 && brightness > 0.65) {
                this.ctx.beginPath();
                this.ctx.arc(renderX, renderY, renderSize * scale * 2.2, 0, TWO_PI);
                this.ctx.fillStyle = p.glowColor;
                this.ctx.globalAlpha = 1.0;
                this.ctx.fill();
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParticleEngine();
});
