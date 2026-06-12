import { useEffect, useRef, useState } from "react";
import styles from "./HomePage.module.css";
import logo1 from "../assets/logo.svg";
import logo2 from "../assets/logo2.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const SERVICES = [
  {
    num: "01",
    title: "Ingeniería de Software",
    desc: "Diseñamos y construimos sistemas que escalan. Desde arquitectura hasta entrega, con estándares que resisten el tiempo.",
  },
  {
    num: "02",
    title: "Gobernanza Corporativa",
    desc: "Estructuras de control, marcos de compliance y modelos de gobierno que dan certeza a la dirección ejecutiva.",
  },
  {
    num: "03",
    title: "Gestión Estratégica",
    desc: "Diagnóstico sin adornos, diseño de soluciones y ejecución directa. Nos quedamos hasta que el resultado es real.",
  },
  {
    num: "04",
    title: "Resolución de Problemas",
    desc: "Intervención en crisis operativas, técnicas y organizacionales. Metodología estructurada, velocidad quirúrgica.",
  },
];

const MANIFESTO_LINES = [
  "No somos consultores que diagnostican y se van.",
  "Somos profesionales que se quedan hasta resolver.",
  "Cada problema es una ecuación. Toda ecuación tiene solución.",
];

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [navShrunk, setNavShrunk] = useState(false);
  const [entered, setEntered] = useState(false);

  const [navLinksLeft, setNavLinksLeft] = useState(false);

  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const mouseTargetRef = useRef({ x: 0.5, y: 0.5 });
  const animRef = useRef(null);
  const revealRefs = useRef([]);
  const enteredRef = useRef(false);
  const manifestoCanvasRef = useRef(null);
  const servicesCanvasRef = useRef(null);
  const navInnerRef = useRef(null);
  const [linkOffset, setLinkOffset] = useState(null);


  /* ── ENTRADA ── */
  useEffect(() => {
    const t = setTimeout(() => {
      setEntered(true);
      enteredRef.current = true;
    }, 80);
    return () => clearTimeout(t);
  }, []);

  /* ── SCROLL ── */
  useEffect(() => {
  let timeout = null;
  const onScroll = () => {
    const y = window.scrollY;
    setScrollY(y);
    if (y > 80) {
      setNavShrunk(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setNavLinksLeft(true), 500);
    } else {
      setNavShrunk(false);
      setNavLinksLeft(false);
      clearTimeout(timeout);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => {
    window.removeEventListener("scroll", onScroll);
    clearTimeout(timeout);
  };
}, []);

  /* ── MOUSE con inercia ── */
  useEffect(() => {
    const onMouse = (e) => {
      mouseTargetRef.current = {
        x: e.clientX / window.innerWidth / 0.5,
        y: e.clientY / window.innerHeight ,
      };
    };
    window.addEventListener("mousemove", onMouse);
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  /* ── CANVAS ── */
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  let t = 0;

  const draw = () => {
    const W = canvas.width;
    const H = canvas.height;

    // Inercia del mouse
    mouseRef.current.x += (mouseTargetRef.current.x - mouseRef.current.x) * 0.2;
    mouseRef.current.y += (mouseTargetRef.current.y - mouseRef.current.y) * 0.2;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    t += 0.0018;

    // Paralaje del mouse — más agresivo
    const px = (mx - 0.5) * 0.38;
    const py = (my - 0.5) * 0.30;

    ctx.clearRect(0, 0, W, H);

    // ── BASE: blanco puro ──
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // ── CAPA 1: masa oscura navy — arriba-izquierda, gran cobertura ──
    // Replicando la zona oscura superior de la imagen
    {
      const cx = (0.18 + Math.sin(t * 0.55) * 0.04 + px * 1.1) * W;
      const cy = (0.22 + Math.cos(t * 0.40) * 0.03 + py * 1.1) * H;
      const r  = Math.max(W, H) * 0.78;
      const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0,    "rgba(3, 12, 48, 1)");
      g.addColorStop(0.08, "rgba(5, 20, 70, 1)");
      g.addColorStop(0.20, "rgba(8, 45, 115, 0.98)");
      g.addColorStop(0.38, "rgba(12, 75, 165, 0.82)");
      g.addColorStop(0.56, "rgba(20, 115, 210, 0.45)");
      g.addColorStop(0.75, "rgba(60, 160, 240, 0.12)");
      g.addColorStop(1,    "rgba(180, 225, 255, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // ── CAPA 2: azul cielo vibrante — banda diagonal inferior-derecha ──
    // La zona azul brillante y clara de la imagen
    {
      const cx = (0.72 + Math.sin(t * 0.42 + 2.1) * 0.06 - px * 0.9) * W;
      const cy = (0.72 + Math.cos(t * 0.38 + 1.3) * 0.05 - py * 0.9) * H;
      const r  = Math.max(W, H) * 0.65;
      const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0,    "rgba(20, 155, 255, 1)");
      g.addColorStop(0.15, "rgba(35, 165, 255, 0.95)");
      g.addColorStop(0.35, "rgba(70, 185, 255, 0.70)");
      g.addColorStop(0.58, "rgba(130, 210, 255, 0.30)");
      g.addColorStop(0.80, "rgba(200, 235, 255, 0.08)");
      g.addColorStop(1,    "rgba(255, 255, 255, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // ── CAPA 3: transición media — el arco azul intermedio de la imagen ──
    {
      const cx = (0.48 + Math.sin(t * 0.33 + 4.2) * 0.08 + px * 0.5) * W;
      const cy = (0.50 + Math.cos(t * 0.44 + 0.8) * 0.07 + py * 0.5) * H;
      const r  = Math.max(W, H) * 0.52;
      const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0,    "rgba(15, 100, 210, 0.80)");
      g.addColorStop(0.30, "rgba(30, 140, 235, 0.50)");
      g.addColorStop(0.60, "rgba(80, 175, 250, 0.20)");
      g.addColorStop(1,    "rgba(160, 220, 255, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // ── CAPA 4: NEÓN — azul eléctrico puro, sigue al mouse de forma agresiva ──
    {
      const cx = (mx * 0.75 + 0.13) * W;
      const cy = (my * 0.75 + 0.13) * H;
      const r  = Math.max(W, H) * 0.32;
      const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0,    "rgba(42, 122, 229, 0.55)");
      g.addColorStop(0.25, "rgba(42, 122, 229, 0.30)");
      g.addColorStop(0.55, "rgba(80, 160, 255, 0.10)");
      g.addColorStop(1,    "rgba(80, 160, 255, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // ── CAPA 5: destello neón puntual en el cursor — muy visible ──
    {
      const cx = mx * W;
      const cy = my * H;
      const r  = Math.max(W, H) * 0.45;
      const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0,   "rgba(100, 180, 255, 0.45)");
      g.addColorStop(0.4, "rgba(60, 140, 255, 0.18)");
      g.addColorStop(1,   "rgba(60, 140, 255, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // ── CAPA 6: brillo de sol — movimiento diagonal autónomo ──
    // ── CAPA 6: brillo de sol — movimiento diagonal autónomo ──
{
  const sunX = (0.25 + Math.sin(t * 0.18) * 0.55) * W;
  const sunY = (0.20 + Math.cos(t * 0.13) * 0.45) * H;

  // Entrada sincronizada con el logo
  if (!enteredRef._startTime && enteredRef.current) {
    enteredRef._startTime = performance.now() / 1000;
  }
  const now = performance.now() / 1000;
  const elapsed = enteredRef._startTime ? now - enteredRef._startTime : 0;
  const entryAlpha = Math.min(Math.max((elapsed - 0.3) / 2.2, 0), 1);

  // Edge fade
  const marginX = Math.min(sunX / W, (W - sunX) / W) * 6;
  const marginY = Math.min(sunY / H, (H - sunY) / H) * 6;
  const edgeFade = Math.min(marginX, marginY, 1);

  const r = Math.max(W, H) * 0.22;
  const g = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, r);
  g.addColorStop(0,    "rgba(255, 255, 255, 0.78)");
  g.addColorStop(0.12, "rgba(200, 230, 255, 0.50)");
  g.addColorStop(0.35, "rgba(120, 190, 255, 0.20)");
  g.addColorStop(0.65, "rgba(80,  160, 255, 0.06)");
  g.addColorStop(1,    "rgba(80,  160, 255, 0)");

  ctx.globalAlpha = entryAlpha * edgeFade;
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 1;
}

    animRef.current = requestAnimationFrame(draw);
  };

  draw();

  return () => {
    cancelAnimationFrame(animRef.current);
    window.removeEventListener("resize", resize);
  };
}, []);

  /* ── INTERSECTION OBSERVER ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.revealed);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const addReveal = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const heroH = heroRef.current?.offsetHeight || window.innerHeight;
  const heroProgress = Math.min(scrollY / heroH, 1);
  const logoScale = Math.max(1 - heroProgress * 0.58, 0.42);
  const logoOpacityHero = Math.max(1 - heroProgress * 2.2, 0);
  const logoOpacityNav = Math.min((heroProgress - 0.28) * 3.5, 1);


  /* ── CANVAS MANIFESTO ── */
  useEffect(() => {
    const canvas = manifestoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId = null;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const NUM_LINES = 52;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      t += 0.022;

      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < NUM_LINES; i++) {
        const progress = i / (NUM_LINES - 1); // 0 → 1 izq a der

        // Ola dominó: cada línea tiene un offset de fase basado en su posición
        const wavePhase = progress * Math.PI * 2.2;

        // Altura base crece de izquierda a derecha (efecto levantado)
        const baseHeight = 0.08 + progress * 0.55;

        // Breathing — oscilación perpetua, cada línea ligeramente desfasada
        const breathe = Math.sin(t - wavePhase) * 0.08 + Math.cos(t * 0.6 - wavePhase * 0.5) * 0.04;

        // Ola dominó secundaria — movimiento suave continuo
        const wave = Math.sin(t * 0.8 - wavePhase * 1.4) * 0.06;

        const heightRatio = Math.max(baseHeight + breathe + wave, 0.04);
        const lineH = H * heightRatio;

        // Grosor: delgado por defecto, la más alta más gruesa
        // Las últimas líneas (derecha) son más prominentes
        const thickness = progress > 0.85
          ? 2.5
          : progress > 0.65
          ? 1.5
          : 0.8;

        const x = (i / (NUM_LINES - 1)) * W;
        const y = H - lineH;

        // Opacidad — las líneas del centro/derecha más visibles
        const opacity = 0.12 + progress * 0.55 + Math.sin(t * 0.5 - wavePhase) * 0.08;

        // Gradiente vertical: azul brillante arriba, desvanece abajo
        const grad = ctx.createLinearGradient(x, y, x, H);
        grad.addColorStop(0,    `rgba(42, 122, 229, ${Math.min(opacity, 0.85)})`);
        grad.addColorStop(0.3,  `rgba(42, 122, 229, ${Math.min(opacity * 0.8, 0.65)})`);
        grad.addColorStop(0.7,  `rgba(42, 122, 229, ${Math.min(opacity * 0.4, 0.30)})`);
        grad.addColorStop(1,    `rgba(42, 122, 229, 0)`);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, H);
        ctx.strokeStyle = grad;
        ctx.lineWidth = thickness;
        ctx.stroke();

        // Punto de luz en la punta de las líneas más altas
        if (progress > 0.5) {
          const glowOpacity = (progress - 0.5) * 0.6 + Math.sin(t - wavePhase) * 0.1;
          const glowR = ctx.createRadialGradient(x, y, 0, x, y, 6 + progress * 8);
          glowR.addColorStop(0,   `rgba(100, 180, 255, ${Math.min(glowOpacity, 0.7)})`);
          glowR.addColorStop(0.5, `rgba(42, 122, 229,  ${Math.min(glowOpacity * 0.4, 0.3)})`);
          glowR.addColorStop(1,   `rgba(42, 122, 229, 0)`);
          ctx.fillStyle = glowR;
          ctx.beginPath();
          ctx.arc(x, y, 6 + progress * 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ── CANVAS SERVICES ── */
  useEffect(() => {
    const canvas = servicesCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId = null;
    let t = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      t += 0.1;

      ctx.clearRect(0, 0, W, H);

      // ── BASE negro profundo ──
      ctx.fillStyle = "#080808";
      ctx.fillRect(0, 0, W, H);

      // ── BLOB 1: masa azul oscura — arriba izquierda ──
      {
        const cx = (0.15 + Math.sin(t * 0.45) * 0.18) * W;
        const cy = (0.25 + Math.cos(t * 0.38) * 0.22) * H;
        const r  = Math.max(W, H) * 0.55;
        const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0,    "rgba(8,  35, 90,  0.95)");
        g.addColorStop(0.25, "rgba(10, 50, 120, 0.70)");
        g.addColorStop(0.55, "rgba(15, 70, 150, 0.30)");
        g.addColorStop(1,    "rgba(8,  20, 60,  0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // ── BLOB 2: destello azul eléctrico — centro derecha ──
      {
        const cx = (0.78 + Math.sin(t * 0.32 + 1.8) * 0.22) * W;
        const cy = (0.55 + Math.cos(t * 0.28 + 0.9) * 0.26) * H;
        const r  = Math.max(W, H) * 0.42;
        const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0,    "rgba(20, 100, 220, 0.55)");
        g.addColorStop(0.30, "rgba(30, 120, 230, 0.28)");
        g.addColorStop(0.60, "rgba(42, 122, 229, 0.10)");
        g.addColorStop(1,    "rgba(42, 122, 229, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // ── BLOB 3: neón tenue — abajo centro ──
      {
        const cx = (0.45 + Math.sin(t * 0.22 + 3.2) * 0.20) * W;
        const cy = (0.82 + Math.cos(t * 0.18 + 1.4) * 0.16) * H;
        const r  = Math.max(W, H) * 0.38;
        const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0,    "rgba(15, 80, 200, 0.40)");
        g.addColorStop(0.40, "rgba(25, 100, 210, 0.18)");
        g.addColorStop(1,    "rgba(42, 122, 229, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // ── BLOB 4: destello frío — arriba derecha ──
      {
        const cx = (0.88 + Math.sin(t * 0.40 + 5.1) * 0.17) * W;
        const cy = (0.12 + Math.cos(t * 0.35 + 2.2) * 0.18) * H;
        const r  = Math.max(W, H) * 0.28;
        const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0,    "rgba(60, 140, 255, 0.35)");
        g.addColorStop(0.40, "rgba(42, 122, 229, 0.12)");
        g.addColorStop(1,    "rgba(42, 122, 229, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // ── BLOB 5: masa oscura abajo izquierda — ancla el negro ──
      {
        const cx = (0.08 + Math.sin(t * 0.28 + 4.0) * 0.12) * W;
        const cy = (0.88 + Math.cos(t * 0.22 + 3.0) * 0.13) * H;
        const r  = Math.max(W, H) * 0.45;
        const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0,    "rgba(4, 15, 45, 0.95)");
        g.addColorStop(0.50, "rgba(6, 25, 70, 0.50)");
        g.addColorStop(1,    "rgba(8, 20, 60, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // ── VIÑETA negra en bordes — mantiene el negro profundo en extremos ──
      {
        const g = ctx.createRadialGradient(
          W * 0.5, H * 0.5, H * 0.2,
          W * 0.5, H * 0.5, H * 0.9
        );
        g.addColorStop(0, "rgba(8,8,8,0)");
        g.addColorStop(1, "rgba(8,8,8,0.82)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
  const calcOffset = () => {
    const inner = navInnerRef.current;
    const links = inner?.querySelector('ul');
    const logo  = inner?.querySelector('img');
    if (!inner || !links || !logo) return;
    const innerRect = inner.getBoundingClientRect();
    const logoRect  = logo.getBoundingClientRect();
    const linksRect = links.getBoundingClientRect();
    // distancia desde el centro actual hasta justo después del logo
    const currentCenter = linksRect.left + linksRect.width / 2;
    const targetLeft    = logoRect.right + 32; // 32px de gap
    setLinkOffset(targetLeft - currentCenter);
  };
  calcOffset();
  window.addEventListener('resize', calcOffset);
  return () => window.removeEventListener('resize', calcOffset);
}, []);


  return (
    <div className={styles.root}>

      {/* ── NAV ── */}
      <nav className={`${styles.nav} ${navShrunk ? styles.navShrunk : ""}`}>
        <div className={`${styles.navInner} ${navLinksLeft ? styles.navInnerShrunk : ""} ${navShrunk ? styles.navInnerDark : ""}`}>
          <img
            src={logo1}
            alt="HECO"
            className={styles.navLogo}
            style={{ opacity: logoOpacityNav }}
          />
          <ul className={styles.navLinks}>
            {["Servicios", "Nosotros", "Contacto"].map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase()}`} className={styles.navLink}>
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contacto" className={styles.navCta}>
            Contacto
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero} ref={heroRef}>
        <canvas ref={canvasRef} className={styles.heroCanvas} />

        {/* Logo con animación de entrada */}
        <div className={styles.heroLogoWrap}>
          <img
            src={logo2}
            alt="HECO"
            className={`${styles.heroLogo} ${entered ? styles.heroLogoIn : ""}`}
            style={{
              transform: `scale(${entered ? logoScale : 1.18}) translateY(${entered ? -scrollY * 0.12 : 0}px)`,
              opacity: entered ? logoOpacityHero : 0,
            }}
          />
        </div>

        {/* Tagline con entrada */}
        <div
          className={`${styles.heroTagline} ${entered ? styles.heroTaglineIn : ""}`}
          style={{ opacity: entered ? Math.max(1 - heroProgress * 3.5, 0) : 0 }}
        >
          <span>Ingeniería</span>
          <span className={styles.dot}>·</span>
          <span>Gobernanza</span>
          <span className={styles.dot}>·</span>
          <span>Resultados</span>
        </div>

      </section>

      {/* ── MANIFESTO ── */}
      <section className={styles.manifesto} id="nosotros">
        <canvas ref={manifestoCanvasRef} className={styles.manifestoCanvas} />
        <div className={styles.manifestoContent}>
          {MANIFESTO_LINES.map((line, i) => (
            <p
              key={i}
              ref={addReveal}
              className={styles.manifestoLine}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              {line}
            </p>
          ))}
        </div>
      </section>

      {/* ── QUIÉNES SOMOS ── */}
      <section className={styles.about}>
        <div className={styles.aboutGrid}>
          <div ref={addReveal} className={`${styles.revealEl} ${styles.aboutLeft}`}>
            <span className={styles.tag}>Quiénes somos</span>
            <h2 className={styles.aboutTitle}>
              Problema complejo.<br />
              Solución exacta.
            </h2>
          </div>
          <div ref={addReveal} className={`${styles.revealEl} ${styles.aboutRight}`}>
            <p>
              HECO es una firma de ingeniería y consultoría fundada sobre una premisa simple:
              los problemas reales requieren rigor técnico y visión estratégica al mismo tiempo.
            </p>
            <p>
              Operamos en la intersección entre el código y la sala de directorio. Construimos
              software que funciona, estructuras que gobiernan y estrategias que se ejecutan.
              Sin presentaciones vacías. Sin promesas sin respaldo.
            </p>
            <p>
              Trabajamos con empresas que tienen un problema que otros no han podido resolver.
              Eso es exactamente lo que hacemos.
            </p>
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section className={styles.services} id="servicios">
        <canvas ref={servicesCanvasRef} className={styles.servicesCanvas} />
        <div ref={addReveal} className={`${styles.revealEl} ${styles.servicesHeader}`}>
          <span className={styles.tag}>Qué hacemos</span>
          <h2 className={styles.sectionTitle}>Capacidades.</h2>
        </div>
        <div className={styles.servicesGrid}>
          {SERVICES.map((s, i) => (
            <div
              key={s.num}
              ref={addReveal}
              className={`${styles.revealEl} ${styles.serviceCard}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <span className={styles.serviceNum}>{s.num}</span>
              <h3 className={styles.serviceTitle}>{s.title}</h3>
              <p className={styles.serviceDesc}>{s.desc}</p>
              <span className={styles.serviceArrow}>→</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className={styles.stats}>
        {[
          { v: "01+", l: "Año operando" },
          { v: "10+", l: "Proyectos entregados" },
          { v: "2",   l: "Países" },
          { v: "100%", l: "Compromiso con resultados" },
        ].map(({ v, l }, i) => (
          <div
            key={l}
            ref={addReveal}
            className={`${styles.revealEl} ${styles.statItem}`}
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <span className={styles.statVal}>{v}</span>
            <span className={styles.statLabel}>{l}</span>
          </div>
        ))}
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta} id="contacto">
        <div ref={addReveal} className={`${styles.revealEl} ${styles.ctaInner}`}>
          <h2 className={styles.ctaTitle}>
            ¿Tienes un problema<br />
            que nadie ha resuelto?
          </h2>
          <p className={styles.ctaSub}>
            Una conversación honesta. Sin pitch. <br /> Sin compromiso.
          </p>
          <a href="https://wa.me/59160831964" className={styles.ctaBtn}>
            <FontAwesomeIcon icon={faWhatsapp} size="xl" /> Contactanos
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <img src={logo2} alt="logo" className={styles.footerName}/>
        <div className={styles.footerDivLinks}>
            <a href="#servicios" className={styles.footerLink}> Servicios </a>
            <a href="#nosotros" className={styles.footerLink}> Nosotros </a>
            <a href="#contacto" className={styles.footerLink}> Contacto </a>
        </div>
        br
        <span className={styles.footerCopy}>
          © {new Date().getFullYear()} HECO. Todos los derechos reservados.
        </span>
      </footer>
    </div>
  );
}