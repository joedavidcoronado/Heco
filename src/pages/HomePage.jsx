import { useEffect, useRef, useState } from "react";
import styles from "./HomePage.module.css";
import logo1 from "../assets/logo.svg";
import logo2 from "../assets/logo2.svg";
import logo3 from "/iso.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { getChatbotResponse } from "../hooks/chatbotData";

const SERVICES = [
  {
    num: "01",
    title: "Ingeniería de Software",
    desc: "Diseñamos y construimos sistemas que escalan. Desde arquitectura hasta entrega, con estándares que resisten el tiempo.",
    img: "/ff.svg"
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
  {
    num: "05",
    title: "Resolución de Problemas",
    desc: "Intervención en crisis operativas, técnicas y organizacionales. Metodología estructurada, velocidad quirúrgica.",
  },
  {
    num: "06",
    title: "Resolución de Problemas",
    desc: "Intervención en crisis operativas, técnicas y organizacionales. Metodología estructurada, velocidad quirúrgica.",
  },
  {
    num: "07",
    title: "Resolución de Problemas",
    desc: "Intervención en crisis operativas, técnicas y organizacionales. Metodología estructurada, velocidad quirúrgica.",
  },
];

const MANIFESTO_LINES = [
  "No somos externos que diagnostican y se van.",
  "Somos profesionales que se quedan hasta resolver.",
  "Impulsamos el potencial que ya existe en tu organizacion."
];

export default function HomePage() {
  const [logoMoved, setLogoMoved] = useState(false);
  const [blurOff, setBlurOff] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

  const [scrollY, setScrollY] = useState(0);
  const [navShrunk, setNavShrunk] = useState(false);
  const [entered, setEntered] = useState(false);

  const [navLinksLeft, setNavLinksLeft] = useState(false);

  const heroRef = useRef(null);
  const revealRefs = useRef([]);

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", type: "text", text: "¡Hola! ¿En qué puedo ayudarte hoy?" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping) return;

    const userMsg = { from: "user", type: "text", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    const result = getChatbotResponse(trimmed);

    setTimeout(() => {
      const botMsg =
        result.type === "options"
          ? { from: "bot", type: "options", text: result.response, options: result.options }
          : { from: "bot", type: "text", text: result.response };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 900 + Math.random() * 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    if (!heroRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPastHero(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-80% 0px 0px 0px" }
    );

    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // Ajustá estos dos valores para cambiar el tamaño/curvatura del arco
  const ARC_RADIUS = 150;
  const ARC_SPAN = 170;

  const [activeIndex, setActiveIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [panelExiting, setPanelExiting] = useState(false);
  const isFirstRender = useRef(true);
  const wheelLock = useRef(false);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPanelExiting(true);
    const t = setTimeout(() => {
      setDisplayIndex(activeIndex);
      setPanelExiting(false);
    }, 320);
    return () => clearTimeout(t);
  }, [activeIndex]);

  const goTo = (i) => {
    const clamped = Math.max(0, Math.min(SERVICES.length - 1, i));
    setActiveIndex(clamped);
  };
  const goPrev = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  const handleWheelScroll = (e) => {
    e.preventDefault();
    if (wheelLock.current) return;
    wheelLock.current = true;
    if (e.deltaY > 0) goNext(); else goPrev();
    setTimeout(() => { wheelLock.current = false; }, 450);
  };

  const active = SERVICES[displayIndex];

  /* ── ENTRADA (secuencia) ── */
  useEffect(() => {
    const t1 = setTimeout(() => {
      setEntered(true);
    }, 80);

    const t2 = setTimeout(() => setLogoMoved(true), 80 + 2200);
    const t3 = setTimeout(() => setBlurOff(true), 80 + 2200 + 900);
    const t4 = setTimeout(() => setShowTitle(true), 80 + 2200 + 900 + 150);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
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

  const ROTATING_WORDS = ["Ingeniería", "Administración", "Consultoría"];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.root}>

      {/* ── NAV ── */}
      <nav className={`${styles.nav} ${navShrunk ? styles.navShrunk : ""}`}>

        <div className={`${styles.navInner} ${navLinksLeft ? styles.navInnerShrunk : ""} ${navShrunk ? styles.navInnerDark : ""}`}>
          <div className={styles.navLogoStack}>
            <img
              src={logo3}
              alt="HECO"
              className={styles.navLogo2}
              style={{ opacity: 1 - logoOpacityNav }}
            />
            <img
              src={logo1}
              alt="HECO"
              className={styles.navLogo}
              style={{ opacity: logoOpacityNav }}
            />
          </div>
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
            → Contacto
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero} ref={heroRef}>

        <video
          className={`${styles.overlayVideo} ${blurOff ? styles.overlayVideoClear : ""}`}
          autoPlay
          loop
          muted
          playsInline
          poster="/yt-poster.jpg"
          src="/yt.mp4"
        />

        <div className={`${styles.heroLogoWrap} ${logoMoved ? styles.heroLogoWrapMoved : ""}`}>
          <img
            src={logo2}
            alt="HECO"
            className={`${styles.heroLogo} ${entered ? styles.heroLogoIn : ""} ${logoMoved ? styles.heroLogoMoved : ""}`}
            style={{
              transform: `scale(${entered ? logoScale : 1.18}) translateY(${entered ? -scrollY * 0.12 : 0}px)`,
              opacity: entered ? logoOpacityHero : 0,
            }}
          />
        </div>

        <div className={styles.heroRotatingWordWrap}>
          <span className={styles.heroArrow}>→</span>
          <div className={styles.heroWordWindow}>
            <div
              className={styles.heroWordTrack}
              style={{
                transform: `translateY(-${wordIndex * (100 / ROTATING_WORDS.length)}%)`,
              }}
            >
              {ROTATING_WORDS.map((w) => (
                <div key={w} className={styles.heroWordItem}>{w}</div>
              ))}
            </div>
          </div>
        </div>

        <h1 className={styles.heroTitle}>
          ELEVANDO EL POTENCIAL DE TUS FORTALEZAS
        </h1>
        <div className={`${styles.heroChatBot} ${chatOpen ? styles.heroChatBotOpen : ""} ${pastHero ? styles.heroChatBotScrolled : ""}`}>
          {!chatOpen && (
            <button
              className={styles.chatBotToggle}
              onClick={() => setChatOpen(true)}
              aria-label="Abrir chat"
            >
              <span className={styles.chatBotDot} />
              <b>HECOBot</b>
            </button>
          )}

          {chatOpen && (
            <div className={styles.chatBotPanel}>
              <div className={styles.chatBotHeader}>
                <div className={styles.chatBotHeaderInfo}>
                  <span className={styles.chatBotAvatar}>
                    <img src={logo3} alt="HECO" className={styles.chatBotAvatarImg} />
                  </span>
                  <div className={styles.chatBotHeaderText}>
                    <span className={styles.chatBotHeaderName}>HECOBot</span>
                    <span className={styles.chatBotHeaderStatus}>
                      <span className={styles.chatBotStatusDot} />
                      Asistente virtual · En línea
                    </span>
                  </div>
                </div>
                <button
                  className={styles.chatBotClose}
                  onClick={() => setChatOpen(false)}
                  aria-label="Cerrar chat"
                >
                  ×
                </button>
              </div>

              <div className={styles.chatBotMessages}>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`${styles.chatBubble} ${m.from === "user" ? styles.chatBubbleUser : styles.chatBubbleBot}`}
                  >
                    {m.text}

                    {m.type === "options" && (
                      <div className={styles.chatOptions}>
                        {m.options.map((opt) => (
                          <a 
                            key={opt.label}
                            href={opt.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.chatOptionCard}
                          >
                            <span className={styles.chatOptionIcon}>
                              {opt.icon === "whatsapp" ? "↗" : "✉"}
                            </span>
                            <span>
                              <span className={styles.chatOptionLabel}>{opt.label}</span>
                              <span className={styles.chatOptionSub}>{opt.sublabel}</span>
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className={`${styles.chatBubble} ${styles.chatBubbleBot} ${styles.chatBubbleTyping}`}>
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                  </div>
                )}
              </div>

              <div className={styles.chatBotInputRow}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribí tu pregunta…"
                  className={styles.chatBotInput}
                />
                <button className={styles.chatBotSend} onClick={handleSend} aria-label="Enviar">
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section className={styles.manifesto} id="nosotros">
        <div className={styles.manifestoContent}>
          <div id="lineas">
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
          <img className={styles.girarPerpetuo} src="/Recurso4.svg" alt="imagen.svg" />
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section className={styles.services} id="servicios">

        <div ref={addReveal} className={`${styles.revealEl} ${styles.servicesHeader}`}>
          <span className={styles.tag}>Qué hacemos</span>
          <h2 className={styles.sectionTitle}>Capacidades</h2>
        </div>

        <div ref={addReveal} className={`${styles.revealEl} ${styles.servicesBody}`}>
          {/* ── RUEDA DE SELECCIÓN ── */}
          <div className={styles.servicesWheelWrap}>
            <div className={styles.servicesWheel} onWheel={handleWheelScroll}>
              <div className={styles.wheelTrack}>
                {SERVICES.map((s, i) => {
                  const diff = i - activeIndex;
                  const SEPARACION_BASE = 40;
                  const compressedDiff = Math.sign(diff) * Math.pow(Math.abs(diff), 0.75);

                  const angle = compressedDiff * SEPARACION_BASE;
                  const rad = (angle * Math.PI) / 180;

                  const x = Math.cos(rad) * ARC_RADIUS;
                  const y = Math.sin(rad) * ARC_RADIUS;
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={s.num}
                      type="button"
                      className={`${styles.wheelDot} ${isActive ? styles.wheelDotActive : ""}`}
                      style={{
                        transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                        opacity: isActive ? 1 : Math.max(0.25, 1 - Math.abs(angle) / 110),
                      }}
                      onClick={() => goTo(i)}
                      aria-label={s.title}
                      aria-current={isActive}
                    >
                      <span className={styles.wheelDotNum}>{s.num}</span>
                      {isActive && <span className={styles.wheelDotLabel}>{s.title}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── PANEL DE CONTENIDO (texto + foto en row) ── */}
          <div className={styles.serviceContent}>
            <div
              className={`${styles.serviceContentRow} ${
                panelExiting ? styles.serviceContentRowExit : ""
              }`}
            >
              <div className={styles.serviceContentText}>
                <h3 className={styles.serviceContentTitle}>{active.title}</h3>
                <p className={styles.serviceContentDesc}>{active.desc}</p>
              </div>
              <img
                src={active.img}
                alt={active.title}
                className={styles.serviceContentImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── QUIÉNES SOMOS ── */}
      <section className={styles.about}>
        <div className={styles.aboutGrid}>
          <div ref={addReveal} className={`${styles.revealEl} ${styles.aboutLeft}`}>
            <span className={styles.tag}>Quiénes somos</span>
            <h2 className={styles.aboutTitle}>
              Problema complejo<br />
              Solución exacta
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
        <span className={styles.footerCopy}>
          © {new Date().getFullYear()} HECO. Todos los derechos reservados.
        </span>
      </footer>
    </div>
  );
}