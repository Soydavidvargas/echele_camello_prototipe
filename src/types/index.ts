export type UserRole = 'client' | 'worker';
export type CityId = 'neiva' | 'bogota' | 'medellin' | 'cali' | 'barranquilla' | 'bucaramanga';

export interface CityInfo {
  id: CityId;
  name: string;
  department: string;
  zones: string[];
}

export type CategoryId =
  | 'plomeria'
  | 'cerrajeria'
  | 'electricidad'
  | 'electrodomesticos'
  | 'pintura'
  | 'carpinteria'
  | 'impermeabilizacion'
  | 'aseo';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
  urgentAvailable: boolean;
  basePrice: number; // in COP
}

export interface TechnicianReview {
  id: string;
  author: string;
  neighborhood: string;
  city: string;
  rating: number;
  date: string;
  service: string;
  comment: string;
}

export interface ServiceTariff {
  title: string;
  description: string;
  priceCOP: number;
  estimatedTime: string;
}

export interface Technician {
  id: string;
  name: string;
  nickname?: string;
  title: string;
  categoryId: CategoryId;
  categoryName: string;
  city: CityId;
  cityName: string;
  neighborhoods: string[];
  photoUrl: string;
  avatarColor: string;
  initials: string;
  rating: number;
  completedJobs: number;
  experienceYears: number;
  isAvailableNow: boolean;
  responseTimeMinutes: number;
  idVerified: boolean;
  policeBackgroundCheck: boolean;
  senaCertified: boolean;
  arlActive: boolean;
  visitFeeCOP: number;
  bio: string;
  services: ServiceTariff[];
  recentReviews: TechnicianReview[];
  phone: string;
}

export type JobStatus =
  | 'solicitado'
  | 'en_camino'
  | 'en_diagnostico'
  | 'en_ejecucion'
  | 'completado'
  | 'cancelado';

export interface ActiveJob {
  id: string;
  code: string; // e.g. CAM-8492
  technician: Technician;
  category: CategoryId;
  problemTitle: string;
  description: string;
  address: string;
  city: string;
  neighborhood: string;
  scheduledTime: string; // "Inmediato (25 min)" or "Hoy 4:00 PM"
  status: JobStatus;
  etaMinutes: number;
  createdAt: string;
  estimatedCostCOP: number;
  paymentMethod: 'nequi' | 'daviplata' | 'pse' | 'tarjeta' | 'efectivo';
  isGuaranteeActive: boolean;
  chatMessages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  sender: 'client' | 'technician' | 'system';
  text: string;
  time: string;
}

export interface AvailableOpportunity {
  id: string | number;
  category: CategoryId;
  categoryName: string;
  title: string;
  description: string;
  neighborhood: string;
  city: string;
  distanceKm: number;
  offerCOP: number;
  urgency: 'alta' | 'media' | 'normal';
  postedAgo: string;
  clientName?: string;
  clientPhone?: string;
}

export interface WorkerAd {
  id: string;
  technicianName: string;
  title: string;
  category: CategoryId;
  categoryName: string;
  neighborhood: string;
  city: string;
  phone: string;
  startingPriceCOP: number;
  rating: number;
  completedJobs: number;
  features: string[];
  isGoldVip: boolean;
  paymentMethod: 'llave_nequi' | 'llave_daviplata' | 'transferencia_bancaria';
  paymentReference: string;
  createdAt: string;
}
