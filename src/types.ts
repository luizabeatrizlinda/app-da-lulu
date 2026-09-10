export type Role = 'child' | 'therapist' | 'pedagogue' | 'guardian';

export interface UserProfile {
  id: string;
  name: string;
  nickname: string;
  role: Role;
  avatar: string;
  age?: number;
  assignedChildId?: string; // Para responsáveis ou profissionais que acompanham uma criança específica
  pin?: string; // PIN para proteger perfis adultos e garantir sigilo clínico
  title?: string; // Ex: "Psicóloga Clínica Infantil (CRP 06/12345)", "Orientadora Educacional", "Mãe do Léo"
}

export type EmotionKey = 
  | 'radiant'   // Radiante / Muito Feliz
  | 'calm'      // Calminho / Em Paz
  | 'tired'     // Cansadinho / Sem Energia
  | 'sad'       // Coração Apertado / Triste
  | 'angry'     // Bravo / Vulcãozinho
  | 'scared'    // Com Medo / Inseguro
  | 'critical'; // Muito Machucado por dentro / Pensando em sumir

export interface EmotionMeta {
  key: EmotionKey;
  label: string;
  childDescription: string;
  emoji: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface MoodEntry {
  id: string;
  childId: string;
  childName: string;
  timestamp: string;
  emotion: EmotionKey;
  intensity: number; // 1 to 5
  bodySensation?: string;
  tags: string[];
  note?: string;
  drawingDataUrl?: string;
  isAlertTriggered: boolean;
  reviewedByProfessional: boolean;
  professionalNote?: string;
}

export interface SafetyContact {
  id: string;
  childId: string;
  name: string;
  relationship: string;
  phone: string;
  isEmergencyLine: boolean;
  avatar: string;
  availableHours?: string;
  safeWord?: string;
}

export interface TreasureItem {
  id: string;
  childId: string;
  title: string;
  category: 'memory' | 'pet' | 'hobby' | 'person' | 'place' | 'phrase';
  description: string;
  emoji: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  childId: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: string;
  category: 'checkin' | 'breathing' | 'calm' | 'journal' | 'courage';
}

export type RiskLevel = 'low' | 'moderate' | 'high' | 'immediate_attention';

export interface PedagogicalObservation {
  id: string;
  childId: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  date: string;
  context: 'classroom' | 'clinical_session' | 'home' | 'recess';
  observation: string;
  intervention: string;
  recommendedAction: string;
  riskLevel: RiskLevel;
}
