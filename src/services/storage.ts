import {
  UserProfile,
  MoodEntry,
  SafetyContact,
  TreasureItem,
  Achievement,
  PedagogicalObservation,
} from '../types';

const STORAGE_KEYS = {
  USERS: 'aconchego_users_v1',
  CURRENT_USER: 'aconchego_current_user_v1',
  MOODS: 'aconchego_moods_v1',
  CONTACTS: 'aconchego_contacts_v1',
  TREASURES: 'aconchego_treasures_v1',
  ACHIEVEMENTS: 'aconchego_achievements_v1',
  OBSERVATIONS: 'aconchego_observations_v1',
};

// Initial realistic default data
const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'child_leo',
    name: 'Léo Albuquerque',
    nickname: 'Léo',
    role: 'child',
    avatar: '🐰',
    age: 8,
    title: 'Explorador Curioso',
  },
  {
    id: 'child_bia',
    name: 'Beatriz Lima',
    nickname: 'Bia',
    role: 'child',
    avatar: '🦊',
    age: 10,
    title: 'Pequena Artista',
  },
  {
    id: 'therapist_marina',
    name: 'Dra. Marina Silva',
    nickname: 'Dra. Marina',
    role: 'therapist',
    avatar: '👩‍⚕️',
    title: 'Psicóloga Clínica Infantil (CRP 06/14298)',
    pin: '1234',
    assignedChildId: 'child_leo',
  },
  {
    id: 'pedagogue_helena',
    name: 'Profª Helena Ramos',
    nickname: 'Tia Helena',
    role: 'pedagogue',
    avatar: '📚',
    title: 'Orientadora Educacional & Psicopedagoga',
    pin: '1234',
    assignedChildId: 'child_leo',
  },
  {
    id: 'guardian_mariana',
    name: 'Mariana Albuquerque',
    nickname: 'Mamãe',
    role: 'guardian',
    avatar: '🌸',
    title: 'Mãe e Protetora do Léo',
    pin: '1234',
    assignedChildId: 'child_leo',
  },
];

const DEFAULT_SAFETY_CONTACTS: SafetyContact[] = [
  {
    id: 'cvv_emergency',
    childId: 'all',
    name: 'CVV - Apoio Emocional',
    relationship: 'Apoio 24 Horas Gratuito',
    phone: '188',
    isEmergencyLine: true,
    avatar: '💛',
    availableHours: '24 horas por dia, 7 dias por semana (Ligação gratuita)',
    safeWord: 'Luz',
  },
  {
    id: 'samu_emergency',
    childId: 'all',
    name: 'SAMU - Emergência Médica',
    relationship: 'Pronto Atendimento',
    phone: '192',
    isEmergencyLine: true,
    avatar: '🚑',
    availableHours: 'Atendimento médico de urgência 24h',
  },
  {
    id: 'contact_mamae',
    childId: 'child_leo',
    name: 'Mamãe Mariana',
    relationship: 'Mãe (Contato Principal)',
    phone: '(11) 98765-4321',
    isEmergencyLine: false,
    avatar: '🌸',
    availableHours: 'Sempre disponível',
    safeWord: 'Abraço de Urso',
  },
  {
    id: 'contact_psico',
    childId: 'child_leo',
    name: 'Dra. Marina Silva',
    relationship: 'Psicóloga do Léo',
    phone: '(11) 99123-4567',
    isEmergencyLine: false,
    avatar: '👩‍⚕️',
    availableHours: 'Seg a Sex das 08h às 19h (WhatsApp de apoio)',
  },
  {
    id: 'contact_helena',
    childId: 'child_leo',
    name: 'Tia Helena Ramos',
    relationship: 'Orientadora Escolar',
    phone: '(11) 97654-3210',
    isEmergencyLine: false,
    avatar: '📚',
    availableHours: 'Horário escolar (07h às 17h)',
  },
];

const DEFAULT_TREASURES: TreasureItem[] = [
  {
    id: 'tr_1',
    childId: 'child_leo',
    title: 'Pipoca (Meu cachorrinho)',
    category: 'pet',
    description: 'Ele sempre abana o rabinho quando chego triste e lambe minha mão.',
    emoji: '🐶',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'tr_2',
    childId: 'child_leo',
    title: 'Bolo de cenoura da vovó',
    category: 'memory',
    description: 'Com muita calda de chocolate quente quando chove.',
    emoji: '🍰',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'tr_3',
    childId: 'child_leo',
    title: 'Passeio no parque com a mamãe',
    category: 'place',
    description: 'Quando andamos de bicicleta e tomamos sorvete de morango.',
    emoji: '🚲',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'tr_4',
    childId: 'child_leo',
    title: '"A tempestade sempre passa"',
    category: 'phrase',
    description: 'A frase que a Dra. Marina me ensinou a lembrar quando o coração apertar.',
    emoji: '🌈',
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_1',
    childId: 'child_leo',
    title: 'Primeiro Raio de Sol',
    description: 'Entrou no Espaço Aconchego e expressou como estava se sentindo.',
    icon: '☀️',
    color: 'bg-amber-100 text-amber-700 border-amber-300',
    earnedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    category: 'checkin',
  },
  {
    id: 'ach_2',
    childId: 'child_leo',
    title: 'Respiração da Borboleta',
    description: 'Completou um ciclo de respiração profunda no Cantinho da Calma.',
    icon: '🦋',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    earnedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    category: 'breathing',
  },
  {
    id: 'ach_3',
    childId: 'child_leo',
    title: 'Guardião da Coragem',
    description: 'Guardou uma lembrança querida no Baú de Coisas Boas.',
    icon: '💎',
    color: 'bg-sky-100 text-sky-700 border-sky-300',
    earnedAt: new Date().toISOString(),
    category: 'courage',
  },
];

const DEFAULT_MOODS: MoodEntry[] = [
  {
    id: 'mood_1',
    childId: 'child_leo',
    childName: 'Léo',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    emotion: 'sad',
    intensity: 3,
    bodySensation: 'Nó na garganta',
    tags: ['Escola / Tarefas', 'Sentimento de solidão'],
    note: 'Hoje ninguém quis brincar comigo no recreio e me senti invisível.',
    isAlertTriggered: false,
    reviewedByProfessional: true,
    professionalNote: 'Acolhido na sessão de quarta-feira. Reforçamos habilidades de convite para brincadeiras e identificação de amigos seguros.',
  },
  {
    id: 'mood_2',
    childId: 'child_leo',
    childName: 'Léo',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    emotion: 'calm',
    intensity: 2,
    bodySensation: 'Corpo relaxado e quentinho',
    tags: ['Família em casa'],
    note: 'Fiz bolo com a mamãe e brinquei com o Pipoca.',
    isAlertTriggered: false,
    reviewedByProfessional: true,
  },
  {
    id: 'mood_3',
    childId: 'child_leo',
    childName: 'Léo',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    emotion: 'critical',
    intensity: 5,
    bodySensation: 'Cabeça cheia / pesada',
    tags: ['Sentimento de solidão', 'Escola / Tarefas'],
    note: 'Tive um dia muito difícil, estou com vontade de sumir para não dar trabalho pra ninguém.',
    isAlertTriggered: true,
    reviewedByProfessional: false,
    professionalNote: '🚨 Alerta prioritário ativado. Mensagem de emergência visualizada pela psicóloga e pela mãe.',
  },
];

const DEFAULT_OBSERVATIONS: PedagogicalObservation[] = [
  {
    id: 'obs_1',
    childId: 'child_leo',
    authorId: 'therapist_marina',
    authorName: 'Dra. Marina Silva',
    authorRole: 'therapist',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    context: 'clinical_session',
    observation: 'Léo apresentou discurso com sentimentos de inadequação social e baixa autoeficácia no recreio escolar. Expressou ideação passiva ("queria sumir").',
    intervention: 'Trabalhada técnica de reestruturação de pensamentos automáticos ("Se hoje foi ruim, amanhã é uma nova folha em branco"). Atualizado plano de segurança e reforçado o uso do Cantinho da Calma.',
    recommendedAction: 'Alinhar com a orientadora escolar Helena para supervisionar a integração no recreio e orientar a família a não deixar Léo isolado no quarto.',
    riskLevel: 'high',
  },
  {
    id: 'obs_2',
    childId: 'child_leo',
    authorId: 'pedagogue_helena',
    authorName: 'Profª Helena Ramos',
    authorRole: 'pedagogue',
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    context: 'recess',
    observation: 'Durante o recreio, Léo sentou-se próximo à biblioteca com olhar cabisbaixo. A equipe pedagógica convidou-o para a roda de jogos de tabuleiro com colegas acolhedores.',
    intervention: 'Inclusão mediada por monitor pedagógico. Léo sorriu e participou ativamente no jogo de cartas por 20 minutos.',
    recommendedAction: 'Manter a estratégia de duplas acolhedoras nas tarefas escolares.',
    riskLevel: 'moderate',
  },
];

// Helper to safely access and cache localStorage
class LocalStorageDatabase {
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONTACTS)) {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(DEFAULT_SAFETY_CONTACTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TREASURES)) {
      localStorage.setItem(STORAGE_KEYS.TREASURES, JSON.stringify(DEFAULT_TREASURES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS)) {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(DEFAULT_ACHIEVEMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MOODS)) {
      localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(DEFAULT_MOODS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.OBSERVATIONS)) {
      localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(DEFAULT_OBSERVATIONS));
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    const notifyListeners = () => {
      this.listeners.forEach((l) => {
        try {
          l();
        } catch (err) {
          console.error('Error notifying database listener', err);
        }
      });
    };

    if (typeof queueMicrotask === 'function') {
      queueMicrotask(notifyListeners);
    } else {
      setTimeout(notifyListeners, 0);
    }
  }

  // Users
  getUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  }

  saveUser(user: UserProfile) {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    // Update current user if matching
    const curr = this.getCurrentUser();
    if (curr && curr.id === user.id) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
    this.notify();
  }

  getCurrentUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : DEFAULT_USERS[0];
    } catch {
      return DEFAULT_USERS[0];
    }
  }

  setCurrentUser(user: UserProfile) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    this.notify();
  }

  // Moods
  getMoods(childId?: string): MoodEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MOODS);
      const all: MoodEntry[] = data ? JSON.parse(data) : [];
      if (childId) {
        return all.filter((m) => m.childId === childId);
      }
      return all;
    } catch {
      return [];
    }
  }

  addMood(mood: Omit<MoodEntry, 'id'>): MoodEntry {
    const all = this.getMoods();
    const newEntry: MoodEntry = {
      ...mood,
      id: 'mood_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    };
    all.unshift(newEntry);
    localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(all));
    this.notify();
    return newEntry;
  }

  updateMood(updated: MoodEntry) {
    const all = this.getMoods();
    const idx = all.findIndex((m) => m.id === updated.id);
    if (idx >= 0) {
      all[idx] = updated;
      localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(all));
      this.notify();
    }
  }

  // Contacts
  getSafetyContacts(childId?: string): SafetyContact[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      const all: SafetyContact[] = data ? JSON.parse(data) : DEFAULT_SAFETY_CONTACTS;
      if (childId) {
        return all.filter((c) => c.childId === 'all' || c.childId === childId);
      }
      return all;
    } catch {
      return DEFAULT_SAFETY_CONTACTS;
    }
  }

  saveContact(contact: SafetyContact) {
    const all = this.getSafetyContacts();
    const idx = all.findIndex((c) => c.id === contact.id);
    if (idx >= 0) {
      all[idx] = contact;
    } else {
      all.push(contact);
    }
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(all));
    this.notify();
  }

  deleteContact(id: string) {
    const all = this.getSafetyContacts().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(all));
    this.notify();
  }

  // Treasures (Baú de Coisas Boas)
  getTreasures(childId?: string): TreasureItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TREASURES);
      const all: TreasureItem[] = data ? JSON.parse(data) : [];
      if (childId) {
        return all.filter((t) => t.childId === childId);
      }
      return all;
    } catch {
      return [];
    }
  }

  addTreasure(item: Omit<TreasureItem, 'id' | 'createdAt'>): TreasureItem {
    const all = this.getTreasures();
    const newTreasure: TreasureItem = {
      ...item,
      id: 'tr_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    all.unshift(newTreasure);
    localStorage.setItem(STORAGE_KEYS.TREASURES, JSON.stringify(all));
    this.notify();
    return newTreasure;
  }

  deleteTreasure(id: string) {
    const all = this.getTreasures().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TREASURES, JSON.stringify(all));
    this.notify();
  }

  // Achievements (Jardim das Conquistas)
  getAchievements(childId?: string): Achievement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      const all: Achievement[] = data ? JSON.parse(data) : [];
      if (childId) {
        return all.filter((a) => a.childId === childId);
      }
      return all;
    } catch {
      return [];
    }
  }

  unlockAchievement(childId: string, title: string, description: string, icon: string, category: Achievement['category']): Achievement | null {
    const all = this.getAchievements();
    const alreadyUnlocked = all.some((a) => a.childId === childId && a.title === title);
    if (alreadyUnlocked) return null;

    const newAch: Achievement = {
      id: 'ach_' + Date.now(),
      childId,
      title,
      description,
      icon,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      earnedAt: new Date().toISOString(),
      category,
    };
    all.unshift(newAch);
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(all));
    this.notify();
    return newAch;
  }

  // Pedagogical & Clinical Observations
  getObservations(childId?: string): PedagogicalObservation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OBSERVATIONS);
      const all: PedagogicalObservation[] = data ? JSON.parse(data) : [];
      if (childId) {
        return all.filter((o) => o.childId === childId);
      }
      return all;
    } catch {
      return [];
    }
  }

  addObservation(obs: Omit<PedagogicalObservation, 'id' | 'date'>): PedagogicalObservation {
    const all = this.getObservations();
    const newObs: PedagogicalObservation = {
      ...obs,
      id: 'obs_' + Date.now(),
      date: new Date().toISOString(),
    };
    all.unshift(newObs);
    localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(all));
    this.notify();
    return newObs;
  }

  // Backup & Reset
  exportDatabaseJson(): string {
    const dump = {
      users: this.getUsers(),
      moods: this.getMoods(),
      contacts: this.getSafetyContacts(),
      treasures: this.getTreasures(),
      achievements: this.getAchievements(),
      observations: this.getObservations(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(dump, null, 2);
  }

  importDatabaseJson(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.users) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users));
      if (data.moods) localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(data.moods));
      if (data.contacts) localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(data.contacts));
      if (data.treasures) localStorage.setItem(STORAGE_KEYS.TREASURES, JSON.stringify(data.treasures));
      if (data.achievements) localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(data.achievements));
      if (data.observations) localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(data.observations));
      this.notify();
      return true;
    } catch (err) {
      console.error('Import failed', err);
      return false;
    }
  }

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(DEFAULT_SAFETY_CONTACTS));
    localStorage.setItem(STORAGE_KEYS.TREASURES, JSON.stringify(DEFAULT_TREASURES));
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(DEFAULT_ACHIEVEMENTS));
    localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(DEFAULT_MOODS));
    localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(DEFAULT_OBSERVATIONS));
    this.notify();
  }
}

export const db = new LocalStorageDatabase();
