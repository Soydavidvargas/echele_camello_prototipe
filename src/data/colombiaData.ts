/**
 * Datos geográficos y catálogos de Colombia para el proceso de registro y onboarding
 */

export interface DepartmentData {
  name: string;
  cities: string[];
}

export const COLOMBIA_REGIONS: Record<string, string[]> = {
  Huila: ['Neiva', 'Pitalito', 'Garzón', 'La Plata', 'Campoalegre', 'Palermo', 'Rivera', 'Aipe', 'Gigante', 'Algeciras'],
  'Bogotá D.C.': ['Bogotá D.C.', 'Usaquén', 'Suba', 'Chapinero', 'Kennedy', 'Engativá', 'Teusaquillo', 'Fontibón', 'Bosa'],
  Antioquia: ['Medellín', 'Envigado', 'Bello', 'Itagüí', 'Rionegro', 'Sabaneta', 'Apartadó', 'Turbo', 'Caucasia'],
  'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Buga', 'Jamundí', 'Cartago', 'Yumbo'],
  Atlántico: ['Barranquilla', 'Soledad', 'Malambo', 'Puerto Colombia', 'Baranoa', 'Sabanalarga'],
  Santander: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja', 'San Gil', 'Socorro'],
  Cundinamarca: ['Soacha', 'Chía', 'Zipaquirá', 'Facatativá', 'Fusagasugá', 'Mosquera', 'Madrid', 'Funza', 'Girardot'],
  Tolima: ['Ibagué', 'Espinal', 'Melgar', 'Chaparral', 'Mariquita', 'Honda', 'Líbano'],
  Bolívar: ['Cartagena', 'Magangué', 'Turbaco', 'Arjona', 'El Carmen de Bolívar'],
  Risaralda: ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia'],
  Caldas: ['Manizales', 'Villamaría', 'Chinchiná', 'La Dorada', 'Riosucio'],
  Quindío: ['Armenia', 'Calarcá', 'Montenegro', 'Quimbaya', 'Salento', 'Circasia'],
  Nariño: ['Pasto', 'Tumaco', 'Ipiales', 'Túquerres', 'La Unión'],
  Córdoba: ['Montería', 'Cereté', 'Lorica', 'Sahagún', 'Montelíbano'],
  Cesar: ['Valledupar', 'Aguachica', 'Agustín Codazzi', 'Bosconia'],
  Meta: ['Villavicencio', 'Acacías', 'Granada', 'Puerto López', 'San Martín'],
  'Norte de Santander': ['Cúcuta', 'Ocaña', 'Villa del Rosario', 'Los Patios', 'Pamplona'],
  Cauca: ['Popayán', 'Santander de Quilichao', 'Puerto Tejada', 'Piendamó'],
  Magdalena: ['Santa Marta', 'Ciénaga', 'Fundación', 'El Banco', 'Plato'],
  Boyacá: ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Villa de Leyva', 'Paipa'],
  Sucre: ['Sincelejo', 'Corozal', 'San Marcos', 'Tolú'],
};

export const COMMON_NEIGHBORHOODS: Record<string, string[]> = {
  Neiva: [
    'Quirinal',
    'Ipanema',
    'Las Ceibas',
    'Altico',
    'Cándido Leguízamo',
    'Santa Inés',
    'Las Granjas',
    'Prado Alto',
    'Canaima',
    'Timanco',
    'Campo Núñez',
    'Jardín',
    'Buganviles',
    'Microcentro',
    'Sevilla',
    'La Toma',
    'Álamos',
  ],
  'Bogotá D.C.': [
    'Cedritos',
    'Usaquén',
    'Chapinero Alto',
    'Chicó',
    'Teusaquillo',
    'Salitre',
    'Modelia',
    'Colina Campestre',
    'Suba Rincón',
    'Castilla',
  ],
  Medellín: [
    'El Poblado',
    'Laureles',
    'Belén',
    'Envigado Centro',
    'Sabaneta',
    'Robledo',
    'Buenos Aires',
    'Castilla',
  ],
  Cali: [
    'Granada',
    'San Antonio',
    'Valle del Lili',
    'Ciudad Jardín',
    'El Peñón',
    'Tequendama',
    'Santa Anita',
  ],
  Barranquilla: [
    'El Prado',
    'Alto Prado',
    'Villa Country',
    'Riomar',
    'Boston',
    'Recreo',
    'Miramar',
  ],
  Bucaramanga: [
    'Cabecera del Llano',
    'Sotomayor',
    'San Francisco',
    'Cañaveral',
    'Provenza',
    'Real de Minas',
  ],
};

export const SERVICES_CATALOG = [
  { id: 'plomeria', name: 'Plomería & Fugas', icon: 'Wrench', emoji: '🔧' },
  { id: 'electricidad', name: 'Electricidad & Aires', icon: 'Zap', emoji: '⚡' },
  { id: 'cerrajeria', name: 'Cerrajería 24/7', icon: 'KeyRound', emoji: '🔑' },
  { id: 'electrodomesticos', name: 'Neveras & Lavadoras', icon: 'Cpu', emoji: '🧊' },
  { id: 'pintura', name: 'Pintura & Drywall', icon: 'Paintbrush', emoji: '🎨' },
  { id: 'carpinteria', name: 'Carpintería & Muebles', icon: 'Hammer', emoji: '🪚' },
  { id: 'impermeabilizacion', name: 'Impermeabilización', icon: 'ShieldCheck', emoji: '🏠' },
  { id: 'aseo', name: 'Aseo & Desinfección', icon: 'Sparkles', emoji: '✨' },
  { id: 'albanileria', name: 'Obra Blanca & Enchapes', icon: 'Layers', emoji: '🧱' },
  { id: 'gas', name: 'Gasodomésticos & Estufas', icon: 'Flame', emoji: '🔥' },
  { id: 'jardineria', name: 'Jardinería & Motosierras', icon: 'Trees', emoji: '🌿' },
  { id: 'cerrajeria_auto', name: 'Cerrajería Vehicular', icon: 'Car', emoji: '🚗' },
];

export const LANGUAGES = [
  { id: 'es', label: 'Español (Predeterminado)' },
  { id: 'en', label: 'Inglés (English)' },
  { id: 'lsc', label: 'Lengua de Señas Colombiana (LSC)' },
  { id: 'pt', label: 'Portugués' },
  { id: 'indigena', label: 'Lengua Nativa / Indígena' },
];

export const HOW_HEARD_OPTIONS = [
  { id: 'ia', label: '🤖 Inteligencia Artificial (ChatGPT, Gemini, Copilot)', desc: 'Me la recomendó una IA' },
  { id: 'social', label: '📱 Redes Sociales (TikTok, Instagram, Facebook)', desc: 'Vi un video o publicación viral' },
  { id: 'ads', label: '📣 Anuncios y Publicidad Digital', desc: 'Vi un aviso en internet' },
  { id: 'friend', label: '🤝 Recomendación de Amigo o Familiar', desc: 'Boca a boca de confianza' },
  { id: 'local', label: '🏷️ Volante, Tarjeta o Letrero en la Calle', desc: 'Publicidad física en mi ciudad' },
  { id: 'google', label: '🔍 Búsqueda en Google', desc: 'Buscaba un técnico urgente' },
];

export const SERVICE_FREQUENCY_OPTIONS = [
  'Solo cuando ocurre una emergencia imprevista',
  '1 a 2 veces por mes (Mantenimiento continuo)',
  'Cada 6 meses / Anual',
  'Es la primera vez que voy a contratar',
];

export const PAYMENT_PREFERENCES = [
  { id: 'nequi_daviplata', label: 'Nequi / Daviplata (Transferencia Móvil)', icon: 'Smartphone' },
  { id: 'efectivo', label: 'Efectivo contraentrega al terminar', icon: 'Banknote' },
  { id: 'pse_tarjeta', label: 'PSE / Tarjeta Débito o Crédito', icon: 'CreditCard' },
  { id: 'wallet', label: 'Billetera Digital Échele Camello', icon: 'Wallet' },
];

export const WORKER_ROLES_CATALOG = [
  { id: 'plomero', title: 'Plomero & Redes Hidrosanitarias', category: 'plomeria' },
  { id: 'electricista', title: 'Electricista Domiciliario e Industrial (RETIE)', category: 'electricidad' },
  { id: 'cerrajero', title: 'Cerrajero Residencial y Vehicular 24/7', category: 'cerrajeria' },
  { id: 'tecnico_aires', title: 'Técnico en Refrigeración y Mini-Splits', category: 'electrodomesticos' },
  { id: 'tecnico_lavadoras', title: 'Técnico de Neveras, Lavadoras y Hornos', category: 'electrodomesticos' },
  { id: 'pintor', title: 'Maestro de Pintura, Estuco y Acabados Drywall', category: 'pintura' },
  { id: 'carpintero', title: 'Carpintero, Ebanista y Armado de Muebles', category: 'carpinteria' },
  { id: 'impermeabilizador', title: 'Especialista en Impermeabilización de Terrazas', category: 'impermeabilizacion' },
  { id: 'albanil', title: 'Maestro de Obra Blanca, Pegador de Piso y Enchape', category: 'albanileria' },
];

export const ESSENTIAL_TOOLS_KIT = [
  'Juego de Llaves Stilson / Expansivas metálicas',
  'Multímetro Digital calibrado & Probador de fase',
  'Taladro percutor con brocas para concreto y metal',
  'Juego de destornilladores aislados de seguridad 1000V',
  'Sonda eléctrica o guaya de destape de cañerías',
  'Bomba de vacío y manómetros para gas refrigerante',
  'Nivel láser o de burbuja & Cinta métrica de acero',
  'Pistola de calor / Soplete de soldadura en plata',
  'Caja de herramientas metálica con candado',
];

// Cookie helpers
export function setAuthCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function getAuthCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}
