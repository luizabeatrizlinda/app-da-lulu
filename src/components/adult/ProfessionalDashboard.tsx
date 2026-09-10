import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  MoodEntry,
  SafetyContact,
  PedagogicalObservation,
  RiskLevel,
} from '../../types';
import { db } from '../../services/storage';
import { EMOTIONS } from '../../constants/emotions';
import {
  ShieldAlert,
  Users,
  Activity,
  Calendar,
  AlertTriangle,
  FileText,
  Phone,
  CheckCircle,
  Download,
  Upload,
  Plus,
  Heart,
  Eye,
  BookOpen,
  Sparkles,
  Lock,
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProfessionalDashboardProps {
  currentUser: UserProfile;
  onOpenSos: () => void;
}

export const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({
  currentUser,
  onOpenSos,
}) => {
  const [children, setChildren] = useState<UserProfile[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('child_leo');
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [observations, setObservations] = useState<PedagogicalObservation[]>([]);
  const [contacts, setContacts] = useState<SafetyContact[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'moods' | 'observations' | 'safety' | 'backup'>('overview');

  // New Observation Form State
  const [isAddingObs, setIsAddingObs] = useState(false);
  const [obsContext, setObsContext] = useState<PedagogicalObservation['context']>('classroom');
  const [obsRisk, setObsRisk] = useState<RiskLevel>('low');
  const [obsText, setObsText] = useState('');
  const [obsIntervention, setObsIntervention] = useState('');
  const [obsAction, setObsAction] = useState('');

  // New Contact Form State
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactRel, setContactRel] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSafeWord, setContactSafeWord] = useState('');

  // Load data
  const refreshData = () => {
    const allUsers = db.getUsers();
    const kids = allUsers.filter((u) => u.role === 'child');
    setChildren(kids);

    if (kids.length > 0 && !kids.some((k) => k.id === selectedChildId)) {
      setSelectedChildId(kids[0].id);
    }

    setMoods(db.getMoods(selectedChildId));
    setObservations(db.getObservations(selectedChildId));
    setContacts(db.getSafetyContacts(selectedChildId));
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = db.subscribe(refreshData);
    return () => unsubscribe();
  }, [selectedChildId]);

  const selectedChild = children.find((c) => c.id === selectedChildId) || children[0];

  // Critical alerts count
  const criticalAlerts = moods.filter((m) => m.isAlertTriggered && !m.reviewedByProfessional);

  const handleMarkMoodReviewed = (mood: MoodEntry) => {
    db.updateMood({
      ...mood,
      reviewedByProfessional: true,
      professionalNote: `Revisado por ${currentUser.name} em ${new Date().toLocaleDateString('pt-BR')}`,
    });
    refreshData();
  };

  const handleCreateObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!obsText.trim() || !selectedChild) return;

    db.addObservation({
      childId: selectedChild.id,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      context: obsContext,
      observation: obsText.trim(),
      intervention: obsIntervention.trim(),
      recommendedAction: obsAction.trim(),
      riskLevel: obsRisk,
    });

    setIsAddingObs(false);
    setObsText('');
    setObsIntervention('');
    setObsAction('');
    refreshData();
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim() || !selectedChild) return;

    db.saveContact({
      id: 'cnt_' + Date.now(),
      childId: selectedChild.id,
      name: contactName.trim(),
      relationship: contactRel.trim() || 'Adulto de Apoio',
      phone: contactPhone.trim(),
      isEmergencyLine: false,
      avatar: '🛡️',
      safeWord: contactSafeWord.trim() || undefined,
    });

    setIsAddingContact(false);
    setContactName('');
    setContactRel('');
    setContactPhone('');
    setContactSafeWord('');
    refreshData();
  };

  const handleExport = () => {
    const jsonStr = db.exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prontuario_aconchego_${selectedChild?.nickname || 'paciente'}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (db.importDatabaseJson(content)) {
        alert('Banco de dados local importado com sucesso!');
        refreshData();
      } else {
        alert('Erro ao importar arquivo. Verifique o formato JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header bar with role summary and child selector */}
      <div className="bg-white/90 backdrop-blur-xs rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🩺</span>
            <h2 className="font-child text-xl sm:text-2xl font-bold text-slate-800">
              Painel Multidisciplinar de Acompanhamento
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Logado como: <strong>{currentUser.name}</strong> ({currentUser.title})
          </p>
        </div>

        {/* Child Selector Dropdown */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-600 pl-2">Paciente / Criança:</span>
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white shadow-xs focus:ring-2 focus:ring-teal-200"
          >
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.avatar} {c.name} ({c.age} anos)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Critical Alert Banner (Suicide prevention & urgent distress flags) */}
      {criticalAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-5 shadow-xs space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center text-xl shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce" />
              </div>
              <div>
                <h3 className="font-child text-base sm:text-lg font-bold text-rose-950">
                  {criticalAlerts.length} Alerta(s) de Sofrimento Intenso / Ideação Identificados
                </h3>
                <p className="text-xs text-rose-700">
                  A criança registrou desabafo com indicadores de dor aguda ou pensamentos de sumir/morte.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenSos}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Ver Rede de Ajuda</span>
            </button>
          </div>

          <div className="space-y-2 pt-2">
            {criticalAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white p-3.5 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">🩹</span>
                    <span className="text-xs font-bold text-slate-800">
                      {new Date(alert.timestamp).toLocaleString('pt-BR')}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-rose-100 text-rose-800">
                      Risco Alto / Crítico
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium mt-1">
                    "{alert.note || 'Sem relato por escrito, mas marcou sensação extrema.'}"
                  </p>
                  {alert.bodySensation && (
                    <span className="text-[11px] text-slate-500">
                      Sensação corporal: {alert.bodySensation}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleMarkMoodReviewed(alert)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Marcar como Atendido</span>
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Visão Geral & Humor', icon: <Activity className="w-4 h-4" /> },
          { id: 'moods', label: 'Histórico & Diário Artístico', icon: <FileText className="w-4 h-4" /> },
          { id: 'observations', label: 'Observações Pedagógicas & Clínicas', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'safety', label: 'Plano de Segurança & Contatos', icon: <Phone className="w-4 h-4" /> },
          { id: 'backup', label: 'Exportação & Privacidade Local', icon: <Lock className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Registros de Humor
              </span>
              <div className="text-2xl font-bold font-child text-slate-800 mt-1">
                {moods.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">interações registradas</p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Alertas Ativos
              </span>
              <div className="text-2xl font-bold font-child text-rose-600 mt-1">
                {criticalAlerts.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">necessitam acolhimento</p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Observações Multidisciplinares
              </span>
              <div className="text-2xl font-bold font-child text-teal-700 mt-1">
                {observations.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">escola + clínica</p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Rede de Segurança
              </span>
              <div className="text-2xl font-bold font-child text-amber-700 mt-1">
                {contacts.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">adultos e canais 24h</p>
            </div>
          </div>

          {/* Visual Mood Timeline Graph */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-child text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              <span>Linha do Tempo Emocional de {selectedChild?.nickname}</span>
            </h3>

            {moods.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                Ainda não há registros de humor cadastrados para esta criança.
              </p>
            ) : (
              <div className="space-y-3">
                {moods.slice(0, 7).map((entry) => {
                  const meta = EMOTIONS.find((e) => e.key === entry.emotion);
                  return (
                    <div
                      key={entry.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-2xl border border-slate-200 shadow-xs">
                          {meta?.emoji || '💖'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">
                              {meta?.label || entry.emotion}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(entry.timestamp).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {entry.note || 'Sem anotação por extenso'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {entry.isAlertTriggered && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            Alerta Crítico
                          </span>
                        )}
                        <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-1 rounded-xl border border-slate-200">
                          Intensidade: {entry.intensity}/5
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Moods & Drawings */}
      {activeTab === 'moods' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-child text-lg font-bold text-slate-800">
            Relatos, Sentimentos & Diário de Arte
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moods.map((entry) => {
              const meta = EMOTIONS.find((e) => e.key === entry.emotion);
              return (
                <div
                  key={entry.id}
                  className="p-4 rounded-3xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{meta?.emoji}</span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{meta?.label}</h4>
                          <span className="text-[10px] text-slate-400">
                            {new Date(entry.timestamp).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      {entry.reviewedByProfessional ? (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Atendido</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleMarkMoodReviewed(entry)}
                          className="text-[10px] font-bold text-slate-600 hover:text-teal-700 bg-white px-2 py-1 rounded-lg border border-slate-200 cursor-pointer"
                        >
                          Marcar Revisado
                        </button>
                      )}
                    </div>

                    {entry.note && (
                      <p className="text-xs text-slate-700 bg-white p-3 rounded-2xl border border-slate-200 leading-relaxed">
                        "{entry.note}"
                      </p>
                    )}

                    {/* If drawing exists */}
                    {entry.drawingDataUrl && (
                      <div className="mt-2 border rounded-2xl overflow-hidden bg-white p-2">
                        <span className="text-[10px] font-bold text-slate-400 block mb-1">
                          Desenho Anexo:
                        </span>
                        <img
                          src={entry.drawingDataUrl}
                          alt="Desenho da criança"
                          className="w-full h-44 object-contain rounded-xl bg-slate-50"
                        />
                      </div>
                    )}

                    {entry.bodySensation && (
                      <span className="inline-block mt-2 text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                        Sensação: {entry.bodySensation}
                      </span>
                    )}
                  </div>

                  {entry.professionalNote && (
                    <div className="text-[11px] text-purple-900 bg-purple-50 p-2.5 rounded-xl border border-purple-200">
                      <strong>Evolução:</strong> {entry.professionalNote}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Pedagogical & Clinical Observations */}
      {activeTab === 'observations' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-child text-lg font-bold text-slate-800">
                Caderno de Observações Pedagógicas & Clínicas
              </h3>
              <p className="text-xs text-slate-500">
                Registro compartilhado entre psicologia escolar, professores e orientadores.
              </p>
            </div>

            <button
              onClick={() => setIsAddingObs(!isAddingObs)}
              className="px-4 py-2 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Observação</span>
            </button>
          </div>

          {/* Form to add observation */}
          {isAddingObs && (
            <form
              onSubmit={handleCreateObservation}
              className="p-5 bg-teal-50/60 rounded-3xl border border-teal-200 space-y-4"
            >
              <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wide">
                Registrar Nova Evolução / Intervenção
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contexto da Observação
                  </label>
                  <select
                    value={obsContext}
                    onChange={(e) => setObsContext(e.target.value as PedagogicalObservation['context'])}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="classroom">Sala de Aula</option>
                    <option value="recess">Recreio / Intervalo</option>
                    <option value="clinical_session">Sessão Clínica de Terapia</option>
                    <option value="home">Ambiente Familiar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Avaliação do Nível de Risco
                  </label>
                  <select
                    value={obsRisk}
                    onChange={(e) => setObsRisk(e.target.value as RiskLevel)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="low">Baixo (Estável / Observação rotineira)</option>
                    <option value="moderate">Moderado (Isolamento / Tristeza visível)</option>
                    <option value="high">Alto (Ideação expressa / Sofrimento agudo)</option>
                    <option value="immediate_attention">Atenção Imediata (Risco Crítico / Acolhimento Urgente)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Comportamento Observado
                </label>
                <textarea
                  rows={2}
                  required
                  value={obsText}
                  onChange={(e) => setObsText(e.target.value)}
                  placeholder="Descreva o que a criança demonstrou, palavras ditas ou mudanças de comportamento..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Intervenção Realizada no Momento
                  </label>
                  <input
                    type="text"
                    value={obsIntervention}
                    onChange={(e) => setObsIntervention(e.target.value)}
                    placeholder="Ex: Escuta ativa individual, convite para jogo cooperativo..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Encaminhamento / Próximo Passo
                  </label>
                  <input
                    type="text"
                    value={obsAction}
                    onChange={(e) => setObsAction(e.target.value)}
                    placeholder="Ex: Reunião com a família, alinhar com psicóloga..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingObs(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs"
                >
                  Salvar Observação
                </button>
              </div>
            </form>
          )}

          {/* List of Observations */}
          <div className="space-y-3">
            {observations.map((obs) => {
              const riskBadge = () => {
                switch (obs.riskLevel) {
                  case 'immediate_attention':
                    return 'bg-rose-100 text-rose-900 border-rose-300';
                  case 'high':
                    return 'bg-orange-100 text-orange-900 border-orange-300';
                  case 'moderate':
                    return 'bg-amber-100 text-amber-900 border-amber-300';
                  default:
                    return 'bg-emerald-100 text-emerald-900 border-emerald-300';
                }
              };

              return (
                <div
                  key={obs.id}
                  className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{obs.authorName}</span>
                      <span className="text-[10px] text-slate-500 font-medium capitalize">
                        ({obs.authorRole}) • {new Date(obs.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200 capitalize">
                        Contexto: {obs.context}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${riskBadge()}`}
                      >
                        Risco: {obs.riskLevel}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-2xl border border-slate-200">
                    {obs.observation}
                  </p>

                  {(obs.intervention || obs.recommendedAction) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                      {obs.intervention && (
                        <div className="bg-teal-50 p-2.5 rounded-xl border border-teal-200 text-teal-900">
                          <strong>Intervenção:</strong> {obs.intervention}
                        </div>
                      )}
                      {obs.recommendedAction && (
                        <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900">
                          <strong>Ação Recomendada:</strong> {obs.recommendedAction}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Safety Contacts & Plan */}
      {activeTab === 'safety' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-child text-lg font-bold text-slate-800">
                Plano de Segurança & Rede de Emergência
              </h3>
              <p className="text-xs text-slate-500">
                Pessoas de referência e palavras-chave de segurança para proteção da criança.
              </p>
            </div>

            <button
              onClick={() => setIsAddingContact(!isAddingContact)}
              className="px-4 py-2 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Contato</span>
            </button>
          </div>

          {isAddingContact && (
            <form
              onSubmit={handleCreateContact}
              className="p-5 bg-teal-50/60 rounded-3xl border border-teal-200 space-y-4"
            >
              <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wide">
                Cadastrar Novo Adulto de Confiança
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ex: Titia Fernanda"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vínculo</label>
                  <input
                    type="text"
                    required
                    value={contactRel}
                    onChange={(e) => setContactRel(e.target.value)}
                    placeholder="Ex: Tia Materna, Vizinha de Confiança..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Ex: (11) 98888-7777"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Palavra-Chave Segura</label>
                  <input
                    type="text"
                    value={contactSafeWord}
                    onChange={(e) => setContactSafeWord(e.target.value)}
                    placeholder="Ex: 'Abraço de Urso', 'Pudim'..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingContact(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs"
                >
                  Salvar Contato Seguro
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-2xl border border-slate-200 shadow-xs">
                    {contact.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{contact.name}</h4>
                    <p className="text-xs text-slate-500">{contact.relationship}</p>
                    <p className="text-xs font-bold text-teal-800 mt-0.5">{contact.phone}</p>
                    {contact.safeWord && (
                      <span className="inline-block mt-1 text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        Palavra Segura: "{contact.safeWord}"
                      </span>
                    )}
                  </div>
                </div>

                {!contact.isEmergencyLine && (
                  <button
                    onClick={() => {
                      if (confirm(`Remover contato ${contact.name}?`)) {
                        db.deleteContact(contact.id);
                        refreshData();
                      }
                    }}
                    className="text-xs text-rose-500 hover:underline cursor-pointer"
                  >
                    Excluir
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Local Backup & Privacy */}
      {activeTab === 'backup' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="font-child text-lg font-bold text-slate-800 flex items-center gap-2">
              <Lock className="w-5 h-5 text-teal-600" />
              <span>Ambiente Seguro & Banco de Dados Local</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
              Todas as interações, sentimentos, notas clínicas e pedagógicas são armazenadas de forma restrita e privada no dispositivo local do usuário.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Download className="w-4 h-4 text-teal-600" />
                <span>Exportar Prontuário em JSON</span>
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Baixe uma cópia completa dos registros locais para anexar ao prontuário médico, psicológico ou escolar com total segurança.
              </p>
              <button
                onClick={handleExport}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Dados Locais (.json)</span>
              </button>
            </div>

            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-600" />
                <span>Importar Backup Local</span>
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Restaure registros prévios a partir de um arquivo JSON exportado deste programa.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Selecionar Arquivo JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              Precisa reiniciar para os dados de teste da apresentação?
            </p>
            <button
              onClick={() => {
                if (confirm('Deseja restaurar os dados de demonstração padrão?')) {
                  db.resetToDefaults();
                  refreshData();
                }
              }}
              className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Restaurar Dados Padrão de Demonstração
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
