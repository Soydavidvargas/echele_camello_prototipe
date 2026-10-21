import React, { useEffect, useRef, useState } from 'react';
import { motion, MotionConfig, Variants } from 'motion/react';
import {
  Wrench,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Wallet,
  BadgeCheck,
  Clock,
  CalendarCheck,
  Search,
  Handshake,
  HardHat,
  Users,
  Smartphone,
  Info,
  Home as HomeIcon,
  LifeBuoy,
} from 'lucide-react';

interface HomeProps {
  /** El usuario quiere contratar: la app lleva a la vista de cliente (requiere login). */
  onHire: () => void;
  /** El usuario quiere trabajar: la app lleva a la vista de trabajador (requiere login). */
  onWork: () => void;
}

/* ------------------------------------------------------------------ */
/* Sistema de diseño                                                   */
/* Primario #c2410c: contraste 5.2:1 con texto blanco (WCAG AA).       */
/* ------------------------------------------------------------------ */
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#c2410c] focus-visible:ring-offset-slate-50';
const FOCUS_ON_PRIMARY =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-[#c2410c]';
const FOCUS_ON_DARK =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-slate-900';

const CARD_SHADOW = 'shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_24px_60px_rgb(0,0,0,0.10)]';
const CARD_HOVER = 'transition-[translate,box-shadow,border-color] duration-300 ease-in-out hover:-translate-y-2';

/* ------------------------------------------------------------------ */
/* Variantes de animación (definidas una sola vez, fuera del render)   */
/* ------------------------------------------------------------------ */
const heroContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
};

const revealContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const revealItem: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

const VIEWPORT = { once: true, amount: 0.25 } as const;

/* ------------------------------------------------------------------ */
/* Datos                                                               */
/* ------------------------------------------------------------------ */
const TRUST_BRANDS = ['Constructora Huila', 'HogarPlus', 'Ferretería Andina', 'ElectroSur', 'Conjuntos Neiva'];

const BRAND_MENU = [
  { id: 'inicio', label: 'Inicio', desc: 'Volver arriba', icon: HomeIcon },
  { id: 'nosotros', label: 'Acerca de nosotros', desc: 'Quiénes somos y qué creemos', icon: Info },
  { id: 'propuesta', label: 'Clientes y técnicos', desc: 'Qué ganas en cada lado', icon: Users },
  { id: 'como-funciona', label: 'Cómo funciona', desc: 'Tan fácil como suena', icon: Handshake },
  { id: 'app', label: 'La app', desc: 'Todo desde tu celular', icon: Smartphone },
  { id: 'soporte', label: 'Soporte', desc: 'Estamos para ayudarte', icon: LifeBuoy },
];

const STEPS = [
  { n: '1', title: 'Regístrate', text: 'Crea tu cuenta en minutos y verifica tu identidad con tu correo.', icon: BadgeCheck },
  { n: '2', title: 'Conecta', text: 'Encuentra al técnico ideal o el proyecto que mejor se ajuste a ti.', icon: Search },
  { n: '3', title: 'Empieza a trabajar', text: 'Acuerden, trabajen y paguen o cobren con total protección.', icon: CalendarCheck },
];

/* ------------------------------------------------------------------ */
/* Botón reutilizable con microinteracciones                           */
/* ------------------------------------------------------------------ */
type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'white' | 'outlineWhite';

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary: `bg-[#c2410c] text-white hover:bg-[#9a3412] hover:shadow-lg hover:shadow-orange-900/25 ${FOCUS}`,
  outline: `border-2 border-[#c2410c] text-[#c2410c] bg-transparent hover:bg-[#c2410c] hover:text-white hover:shadow-lg ${FOCUS}`,
  ghost: `text-slate-900 hover:bg-slate-200/70 ${FOCUS}`,
  white: `bg-[#fff] text-[#9a3412] hover:bg-orange-50 hover:shadow-lg ${FOCUS_ON_PRIMARY}`,
  outlineWhite: `border-2 border-white text-white hover:bg-white/15 hover:shadow-lg ${FOCUS_ON_PRIMARY}`,
};

interface MotionButtonProps {
  variant?: ButtonVariant;
  onClick: () => void;
  className?: string;
  id?: string;
  children: React.ReactNode;
}

const MotionButton: React.FC<MotionButtonProps> = ({ variant = 'primary', onClick, className = '', id, children }) => (
  <motion.button
    id={id}
    type="button"
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
    className={`inline-flex items-center justify-center gap-2 rounded-full font-bold cursor-pointer transition-[background-color,color,box-shadow] duration-300 ${BUTTON_STYLES[variant]} ${className}`}
  >
    {children}
  </motion.button>
);

/* ------------------------------------------------------------------ */
/* Componente principal                                                */
/* ------------------------------------------------------------------ */
export const Home: React.FC<HomeProps> = ({ onHire, onWork }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Navbar: transparente arriba, con fondo + blur + sombra al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cerrar el desplegable al hacer clic fuera o con Escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const goTo = (id: string) => {
    setMenuOpen(false);
    if (id === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    // reducedMotion="user": respeta la preferencia del sistema (accesibilidad)
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-orange-200">
        {/* Skip link para teclado / lectores de pantalla */}
        <a
          href="#contenido"
          className={`sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-full focus:bg-[#c2410c] focus:text-white focus:font-bold ${FOCUS_ON_PRIMARY}`}
        >
          Saltar al contenido
        </a>

        {/* ============ NAV ============ */}
        <header
          className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out ${
            scrolled
              ? 'bg-white/85 backdrop-blur-xl shadow-[0_4px_20px_rgb(0,0,0,0.06)] border-b border-slate-200'
              : 'bg-transparent border-b border-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
            {/* Casilla 1: desplegable EcheleCamello */}
            <div className="relative" ref={menuRef}>
              <button
                id="home-brand-menu"
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                aria-controls="home-brand-menu-list"
                aria-label="Menú de EcheleCamello"
                className={`flex items-center gap-2.5 px-2 sm:px-3 py-2 rounded-2xl hover:bg-slate-200/60 transition-colors duration-300 cursor-pointer ${FOCUS}`}
              >
                <span className="w-10 h-10 rounded-2xl bg-[#c2410c] flex items-center justify-center shadow-md shadow-orange-900/20">
                  <Wrench className="w-5 h-5 text-white" aria-hidden="true" />
                </span>
                <span className="text-lg sm:text-xl font-extrabold tracking-tight">EcheleCamello</span>
                <ChevronDown
                  aria-hidden="true"
                  className={`w-4 h-4 text-slate-600 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {menuOpen && (
                <motion.div
                  id="home-brand-menu-list"
                  role="menu"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                  className="absolute left-0 top-full mt-2 w-[19rem] bg-[#fff] rounded-3xl border border-slate-200 shadow-[0_20px_60px_rgb(0,0,0,0.12)] p-2"
                >
                  {BRAND_MENU.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="menuitem"
                      onClick={() => goTo(item.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left hover:bg-orange-50 transition-colors duration-300 cursor-pointer group ${FOCUS}`}
                    >
                      <span className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-[#fff] flex items-center justify-center shrink-0 transition-colors duration-300">
                        <item.icon className="w-5 h-5 text-[#c2410c]" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-slate-900">{item.label}</span>
                        <span className="block text-xs text-slate-600">{item.desc}</span>
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Casillas 2 y 3 */}
            <nav className="flex items-center gap-2 sm:gap-3" aria-label="Acceso principal">
              <MotionButton id="home-nav-hire" variant="ghost" onClick={onHire} className="px-4 sm:px-6 py-2.5 text-sm">
                Contratar
              </MotionButton>
              <MotionButton id="home-nav-work" variant="primary" onClick={onWork} className="px-4 sm:px-6 py-2.5 text-sm shadow-md shadow-orange-900/20">
                Trabajar
              </MotionButton>
            </nav>
          </div>
        </header>

        <main id="contenido">
          {/* ============ 1. HERO (stagger de carga) ============ */}
          <section id="inicio" aria-labelledby="hero-title" className="relative overflow-hidden pt-28 sm:pt-36 pb-20 sm:pb-28">
            <div aria-hidden="true" className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                variants={heroContainer}
                initial="hidden"
                animate="show"
                className="text-center lg:text-left"
              >
                <motion.p
                  variants={heroItem}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fff] border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                >
                  <span aria-hidden="true" className="w-2 h-2 rounded-full bg-green-600" />
                  +480 técnicos verificados en Colombia
                </motion.p>

                <motion.h1
                  id="hero-title"
                  variants={heroItem}
                  className="mt-8 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05] text-slate-900"
                >
                  Conectamos el talento con las{' '}
                  <span className="text-[#c2410c]">mejores oportunidades</span>
                </motion.h1>

                <motion.p
                  variants={heroItem}
                  className="mt-8 text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                >
                  La plataforma donde clientes encuentran técnicos y maestros certificados, y los profesionales
                  consiguen proyectos reales con pago protegido.
                </motion.p>

                <motion.div variants={heroItem} className="mt-12 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <MotionButton id="home-cta-hire" variant="primary" onClick={onHire} className="px-8 py-4 text-base sm:text-lg shadow-xl shadow-orange-900/25">
                    Quiero Contratar
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </MotionButton>
                  <MotionButton id="home-cta-work" variant="outline" onClick={onWork} className="px-8 py-4 text-base sm:text-lg">
                    Quiero Trabajar
                    <HardHat className="w-5 h-5" aria-hidden="true" />
                  </MotionButton>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE_OUT, delay: 0.5 }}
                className="relative"
              >
                <div className="rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_rgb(0,0,0,0.12)] bg-[#fff] border border-slate-200">
                  <img
                    src="/hero.jpg"
                    alt="Técnico con casco naranja y caja de herramientas junto a un celular que muestra un perfil verificado con cinco estrellas"
                    width={1200}
                    height={896}
                    className="w-full h-auto object-cover"
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* ============ 2. SOCIAL PROOF ============ */}
          <section aria-labelledby="trust-title" className="border-y border-slate-200 bg-[#fff]">
            <motion.div
              variants={revealContainer}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
            >
              <motion.h2 id="trust-title" variants={revealItem} className="text-sm font-bold uppercase tracking-widest text-slate-600">
                Empresas y profesionales confían en nosotros
              </motion.h2>
              <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
                {TRUST_BRANDS.map((b) => (
                  <motion.li
                    key={b}
                    variants={revealItem}
                    className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-500 grayscale hover:text-slate-700 transition-colors duration-300"
                  >
                    {b}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </section>

          {/* ============ ACERCA DE NOSOTROS ============ */}
          <section id="nosotros" aria-labelledby="about-title" className="scroll-mt-24">
            <motion.div
              variants={revealContainer}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center"
            >
              <motion.p variants={revealItem} className="text-sm font-bold uppercase tracking-widest text-[#c2410c]">
                Acerca de nosotros
              </motion.p>
              <motion.h2 id="about-title" variants={revealItem} className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Nacimos para que el buen trabajo se encuentre fácil
              </motion.h2>
              <motion.p variants={revealItem} className="mt-8 text-lg sm:text-xl text-gray-600 leading-relaxed">
                Échele Camello nace en Neiva (Huila) con una idea simple: que cualquier persona pueda contratar un
                técnico de confianza, y que cualquier maestro pueda vivir de su oficio con dignidad, pagos seguros y
                reputación real.
              </motion.p>
            </motion.div>
          </section>

          {/* ============ 3. PROPUESTA DUAL ============ */}
          <section id="propuesta" aria-labelledby="value-title" className="scroll-mt-24 bg-slate-100/70">
            <motion.div
              variants={revealContainer}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32"
            >
              <motion.h2 id="value-title" variants={revealItem} className="text-center text-3xl sm:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto">
                Una plataforma, dos formas de ganar
              </motion.h2>

              <div className="mt-16 grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* Clientes */}
                <motion.article
                  variants={revealItem}
                  className={`bg-[#fff] rounded-[2rem] p-8 sm:p-12 border border-slate-200 flex flex-col ${CARD_SHADOW} ${CARD_HOVER}`}
                >
                  <span className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center">
                    <Search className="w-8 h-8 text-[#c2410c]" aria-hidden="true" />
                  </span>
                  <h3 className="mt-8 text-2xl sm:text-3xl font-extrabold tracking-tight">Para quienes buscan talento</h3>
                  <p className="mt-4 text-gray-600 text-base sm:text-lg leading-relaxed">
                    Encuentra al profesional indicado para tu hogar o negocio, sin sorpresas.
                  </p>
                  <ul className="mt-8 space-y-4">
                    {[
                      { icon: BadgeCheck, t: 'Perfiles verificados y con antecedentes cotejados' },
                      { icon: Wallet, t: 'Pagos seguros con depósito en custodia' },
                      { icon: Clock, t: 'Llegada rápida y atención de urgencias 24/7' },
                    ].map((b) => (
                      <li key={b.t} className="flex items-start gap-3 text-slate-800 font-medium leading-relaxed">
                        <b.icon className="w-5 h-5 text-green-700 mt-1 shrink-0" aria-hidden="true" />
                        {b.t}
                      </li>
                    ))}
                  </ul>
                  <MotionButton variant="primary" onClick={onHire} className="mt-10 self-start px-6 py-3">
                    Contratar ahora <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </MotionButton>
                </motion.article>

                {/* Trabajadores */}
                <motion.article
                  variants={revealItem}
                  className={`bg-slate-900 text-white rounded-[2rem] p-8 sm:p-12 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_24px_60px_rgb(0,0,0,0.25)] ${CARD_HOVER}`}
                >
                  <span className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                    <HardHat className="w-8 h-8 text-amber-400" aria-hidden="true" />
                  </span>
                  <h3 className="mt-8 text-2xl sm:text-3xl font-extrabold tracking-tight">Para quienes buscan proyectos</h3>
                  <p className="mt-4 text-gray-300 text-base sm:text-lg leading-relaxed">
                    Recibe oportunidades cerca de ti y trabaja bajo tus propios términos.
                  </p>
                  <ul className="mt-8 space-y-4">
                    {[
                      { icon: CalendarCheck, t: 'Flexibilidad total: tú eliges cuándo y dónde' },
                      { icon: ShieldCheck, t: 'Cobro garantizado por cada trabajo terminado' },
                      { icon: Users, t: 'Clientes nuevos todos los días en tu ciudad' },
                    ].map((b) => (
                      <li key={b.t} className="flex items-start gap-3 font-medium leading-relaxed">
                        <b.icon className="w-5 h-5 text-amber-400 mt-1 shrink-0" aria-hidden="true" />
                        {b.t}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    type="button"
                    onClick={onWork}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className={`mt-10 self-start inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#fff] text-slate-900 hover:bg-slate-100 hover:shadow-lg font-bold cursor-pointer transition-[background-color,box-shadow] duration-300 ${FOCUS_ON_DARK}`}
                  >
                    Quiero trabajar <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </motion.button>
                </motion.article>
              </div>
            </motion.div>
          </section>

          {/* ============ 4. CÓMO FUNCIONA ============ */}
          <section id="como-funciona" aria-labelledby="steps-title" className="scroll-mt-24">
            <motion.div
              variants={revealContainer}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32"
            >
              <motion.h2 id="steps-title" variants={revealItem} className="text-center text-3xl sm:text-5xl font-extrabold tracking-tight">
                Tan fácil como suena
              </motion.h2>
              <ol className="mt-20 grid md:grid-cols-3 gap-12">
                {STEPS.map((s) => (
                  <motion.li key={s.n} variants={revealItem} className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <span aria-hidden="true" className="text-7xl sm:text-8xl font-extrabold text-[#c2410c] leading-none">
                        {s.n}
                      </span>
                      <span className="w-12 h-12 rounded-2xl bg-[#fff] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 flex items-center justify-center">
                        <s.icon className="w-6 h-6 text-slate-900" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-6 text-2xl font-extrabold tracking-tight">
                      <span className="sr-only">Paso {s.n}: </span>
                      {s.title}
                    </h3>
                    <p className="mt-3 text-gray-600 text-lg leading-relaxed">{s.text}</p>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          </section>

          {/* ============ LA APP ============ */}
          <section id="app" aria-labelledby="app-title" className="scroll-mt-24 bg-slate-100/70">
            <motion.div
              variants={revealContainer}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center"
            >
              <motion.span variants={revealItem} className="mx-auto w-16 h-16 rounded-2xl bg-[#fff] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-[#c2410c]" aria-hidden="true" />
              </motion.span>
              <motion.h2 id="app-title" variants={revealItem} className="mt-8 text-3xl sm:text-5xl font-extrabold tracking-tight">
                Todo en la palma de tu mano
              </motion.h2>
              <motion.p variants={revealItem} className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Agenda, chatea, sigue a tu técnico en tiempo real y paga desde el celular. Sin llamadas, sin
                intermediarios.
              </motion.p>
            </motion.div>
          </section>

          {/* ============ 5. CTA FINAL ============ */}
          <section aria-labelledby="cta-title">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
              <motion.div
                variants={revealContainer}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
                className="bg-[#c2410c] rounded-[2rem] sm:rounded-[3rem] px-6 sm:px-16 py-16 sm:py-24 text-center text-white shadow-[0_24px_60px_rgb(194,65,12,0.35)] relative overflow-hidden"
              >
                <div aria-hidden="true" className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/10" />
                <div aria-hidden="true" className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10" />
                <motion.h2 id="cta-title" variants={revealItem} className="relative text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                  Únete hoy a Échele Camello
                </motion.h2>
                <motion.p variants={revealItem} className="relative mt-6 text-lg sm:text-xl text-white max-w-2xl mx-auto leading-relaxed">
                  Miles de personas ya encontraron a su técnico ideal o su próximo proyecto. Empieza en minutos.
                </motion.p>
                <motion.div variants={revealItem} className="relative mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                  <MotionButton variant="white" onClick={onHire} className="px-8 py-4 text-lg">
                    Quiero Contratar
                  </MotionButton>
                  <MotionButton variant="outlineWhite" onClick={onWork} className="px-8 py-4 text-lg">
                    Quiero Trabajar
                  </MotionButton>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </main>

        {/* ============ FOOTER ============ */}
        <footer id="soporte" className="scroll-mt-24 border-t border-slate-200 bg-[#fff]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-[#c2410c] flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" aria-hidden="true" />
              </span>
              <span className="font-extrabold tracking-tight">EcheleCamello</span>
            </div>
            <nav aria-label="Enlaces legales y soporte" className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-slate-700">
              {[
                { href: '#terminos', label: 'Términos' },
                { href: '#privacidad', label: 'Privacidad' },
                { href: 'mailto:soporte@echelecamello.co', label: 'Soporte' },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className={`rounded-md px-1 py-0.5 hover:text-[#c2410c] transition-colors duration-300 ${FOCUS.replace('ring-offset-slate-50', 'ring-offset-white')}`}
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <p className="text-sm text-slate-600">© {new Date().getFullYear()} Échele Camello. Hecho en Colombia.</p>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
};
