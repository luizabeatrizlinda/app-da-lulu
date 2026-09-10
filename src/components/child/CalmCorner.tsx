import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import { db } from '../../services/storage';
import { soundManager, triggerStarReward } from '../../utils/feedback';
import { ArrowLeft, Wind, Eye, CloudRain, Heart, Sparkles, Check, RotateCcw, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CalmCornerProps {
  currentUser: UserProfile;
  onBack: () => void;
  onOpenSos: () => void;
}

type TabType = 'breathing' | 'grounding' | 'cloud' | 'hug';

export const CalmCorner: React.FC<CalmCornerProps> = ({
  currentUser,
  onBack,
  onOpenSos,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('breathing');

  // Breathing state
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathTimer, setBreathTimer] = useState<number>(4);
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(true);

  // Grounding 5-4-3-2-1 state
  const [groundingStep, setGroundingStep] = useState<number>(5);
  const [groundingInputs, setGroundingInputs] = useState<{ [key: number]: string[] }>({
    5: [],
    4: [],
    3: [],
    2: [],
    1: [],
  });
  const [currentInputText, setCurrentInputText] = useState('');

  // Heavy Cloud state
  const [heavyThought, setHeavyThought] = useState('');
  const [isCloudFloating, setIsCloudFloating] = useState(false);
  const [cloudTransformed, setCloudTransformed] = useState(false);

  // Breathing timer countdown
  useEffect(() => {
    if (!isBreathingActive || activeTab !== 'breathing') return;

    const interval = setInterval(() => {
      setBreathTimer((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingActive, activeTab]);

  // Handle phase transitions when countdown reaches 0
  useEffect(() => {
    if (!isBreathingActive || activeTab !== 'breathing') return;
    if (breathTimer > 0) return;

    if (breathPhase === 'inhale') {
      soundManager.playChime('soothe');
      setBreathPhase('hold');
      setBreathTimer(4);
    } else if (breathPhase === 'hold') {
      setBreathPhase('exhale');
      setBreathTimer(4);
    } else if (breathPhase === 'exhale') {
      soundManager.playChime('soothe');
      setBreathPhase('inhale');
      setBreathTimer(4);
      setCycleCount((c) => c + 1);
    }
  }, [breathTimer, breathPhase, isBreathingActive, activeTab]);

  // Unlock achievement on completing 3 cycles
  useEffect(() => {
    if (cycleCount === 3) {
      triggerStarReward();
      db.unlockAchievement(
        currentUser.id,
        'Mestre da Respiração Serena',
        'Completou 3 ciclos no Cantinho da Calma e ajudou seu corpinho a relaxar.',
        '🦋',
        'breathing'
      );
    }
  }, [cycleCount, currentUser.id]);

  const handleTransformCloud = () => {
    if (!heavyThought.trim()) return;
    setIsCloudFloating(true);
    soundManager.playChime('soothe');
    setTimeout(() => {
      setCloudTransformed(true);
      setIsCloudFloating(false);
      triggerStarReward();
      db.unlockAchievement(
        currentUser.id,
        'Transformador de Nuvens',
        'Soltou um pensamento pesado e o transformou em luz no céu.',
        '☁️',
        'calm'
      );
    }, 3200);
  };

  const handleAddGroundingItem = () => {
    if (!currentInputText.trim()) return;
    setGroundingInputs((prev) => ({
      ...prev,
      [groundingStep]: [...prev[groundingStep], currentInputText.trim()],
    }));
    setCurrentInputText('');
    soundManager.playChime('soothe');

    // Check if completed this step
    const currentList = groundingInputs[groundingStep] || [];
    if (currentList.length + 1 >= groundingStep) {
      if (groundingStep > 1) {
        setGroundingStep((s) => s - 1);
      } else {
        // Grounding complete!
        triggerStarReward();
        db.unlockAchievement(
          currentUser.id,
          'Explorador dos Sentidos',
          'Completou a jornada dos 5 sentidos e voltou com segurança ao momento presente.',
          '🧭',
          'calm'
        );
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top back & tab buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-emerald-50 text-slate-600 hover:text-slate-800 text-xs font-bold border border-slate-200/80 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
        <span className="text-xs font-bold text-teal-800 bg-teal-100/70 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          Cantinho da Calma
        </span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => setActiveTab('breathing')}
          className={`p-2.5 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
            activeTab === 'breathing'
              ? 'bg-sky-100 text-sky-900 border-2 border-sky-400 shadow-xs'
              : 'bg-white/80 text-slate-600 hover:bg-sky-50/50 border border-slate-200/80'
          }`}
        >
          <Wind className="w-5 h-5 text-sky-500" />
          <span>Respiração Suave</span>
        </button>

        <button
          onClick={() => setActiveTab('grounding')}
          className={`p-2.5 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
            activeTab === 'grounding'
              ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-400 shadow-xs'
              : 'bg-white/80 text-slate-600 hover:bg-emerald-50/50 border border-slate-200/80'
          }`}
        >
          <Eye className="w-5 h-5 text-emerald-500" />
          <span>5 Sentidos (Presente)</span>
        </button>

        <button
          onClick={() => setActiveTab('cloud')}
          className={`p-2.5 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
            activeTab === 'cloud'
              ? 'bg-indigo-100 text-indigo-900 border-2 border-indigo-400 shadow-xs'
              : 'bg-white/80 text-slate-600 hover:bg-indigo-50/50 border border-slate-200/80'
          }`}
        >
          <CloudRain className="w-5 h-5 text-indigo-500" />
          <span>Soltar Pensamento</span>
        </button>

        <button
          onClick={() => setActiveTab('hug')}
          className={`p-2.5 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
            activeTab === 'hug'
              ? 'bg-pink-100 text-pink-900 border-2 border-pink-400 shadow-xs'
              : 'bg-white/80 text-slate-600 hover:bg-pink-50/50 border border-slate-200/80'
          }`}
        >
          <Heart className="w-5 h-5 text-pink-500" />
          <span>Abraço Borboleta</span>
        </button>
      </div>

      {/* Tab 1: Breathing */}
      {activeTab === 'breathing' && (
        <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm text-center space-y-6">
          <div>
            <span className="text-3xl">🌸</span>
            <h3 className="font-child text-2xl font-bold text-slate-800 mt-1">
              Respiração da Florzinha & da Velinha
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
              Cheire a florzinha bem devagar, guarde a calmaria no peito e assopre a velinha suavemente.
            </p>
          </div>

          {/* Interactive Breathing Sphere / Flower */}
          <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
            {/* Outer soft ring */}
            <div className="absolute inset-0 rounded-full bg-sky-50 border-2 border-dashed border-sky-200 animate-spin-slow opacity-60" />

            {/* Expanding/Contracting Animated Core */}
            <motion.div
              animate={{
                scale: breathPhase === 'inhale' ? 1.45 : breathPhase === 'hold' ? 1.45 : 0.85,
              }}
              transition={{ duration: 3.9, ease: 'easeInOut' }}
              className="w-32 h-32 rounded-full bg-gradient-to-tr from-sky-200 via-teal-100 to-emerald-200 shadow-lg flex flex-col items-center justify-center text-teal-800 p-2"
            >
              <span className="text-3xl">
                {breathPhase === 'inhale' ? '🌺' : breathPhase === 'hold' ? '✨' : '🕯️'}
              </span>
              <span className="font-child text-xl font-bold mt-1">{breathTimer}s</span>
            </motion.div>
          </div>

          {/* Phase instruction */}
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-slate-700">
              {breathPhase === 'inhale' && 'Cheirando a florzinha... (Puxando o ar)'}
              {breathPhase === 'hold' && 'Segurando a calma quentinha...'}
              {breathPhase === 'exhale' && 'Soprando a velinha bem devagar...'}
            </h4>
            <p className="text-xs text-slate-400 font-semibold">
              Ciclos completados: {cycleCount} de 3 {cycleCount >= 3 ? '🎉 (Parabéns!)' : ''}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className="px-5 py-2.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-bold transition-all cursor-pointer"
            >
              {isBreathingActive ? 'Pausar Respiração' : 'Continuar Respirando'}
            </button>
            <button
              onClick={() => {
                setCycleCount(0);
                setBreathPhase('inhale');
                setBreathTimer(4);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recomeçar</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Grounding 5-4-3-2-1 */}
      {activeTab === 'grounding' && (
        <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
          <div className="text-center">
            <span className="text-3xl">🧭</span>
            <h3 className="font-child text-2xl font-bold text-slate-800 mt-1">
              Missão dos 5 Sentidos (Voltar ao Presente)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
              Quando os pensamentos estão rápidos demais, usamos nossos sentidos para ancorar nosso corpinho no lugar seguro.
            </p>
          </div>

          {/* Current Step Instruction */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
              Etapa {6 - groundingStep} de 5
            </span>
            <h4 className="text-base sm:text-lg font-bold text-emerald-950 mt-1">
              {groundingStep === 5 && 'Olhe ao seu redor e encontre 5 coisas que você VÊ:'}
              {groundingStep === 4 && 'Procure 4 coisas que você pode TOCAR agora:'}
              {groundingStep === 3 && 'Feche os olhos e ouça 3 SONS pertinho ou longe:'}
              {groundingStep === 2 && 'Pense ou sinta 2 CHEIROS agradáveis:'}
              {groundingStep === 1 && 'Diga 1 COISA BOA e carinhosa sobre VOCÊ:'}
            </h4>
            <p className="text-xs text-emerald-700 mt-1">
              Já anotou {(groundingInputs[groundingStep] || []).length} de {groundingStep}
            </p>
          </div>

          {/* Input field */}
          <div className="flex gap-2">
            <input
              type="text"
              value={currentInputText}
              onChange={(e) => setCurrentInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGroundingItem())}
              placeholder={
                groundingStep === 5
                  ? 'Ex: O tapete azul, a janela, meu sapato...'
                  : groundingStep === 4
                  ? 'Ex: O tecido macio da blusa, a parede fria...'
                  : groundingStep === 3
                  ? 'Ex: O som do vento lá fora, o relógio...'
                  : groundingStep === 2
                  ? 'Ex: Cheiro de sabonete, cheiro de bolo...'
                  : 'Ex: "Eu sou um menino carinhoso e amo desenhar"'
              }
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-sm"
            />
            <button
              onClick={handleAddGroundingItem}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Adicionar
            </button>
          </div>

          {/* List of found items */}
          <div className="space-y-1.5">
            {(groundingInputs[groundingStep] || []).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-700"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {groundingStep === 1 && (groundingInputs[1] || []).length >= 1 && (
            <div className="p-4 bg-emerald-100/70 border border-emerald-300 rounded-2xl text-center space-y-2">
              <span className="text-3xl">🌟</span>
              <h4 className="font-child text-lg font-bold text-emerald-900">
                Você completou a Missão dos Sentidos!
              </h4>
              <p className="text-xs text-emerald-800">
                Seu corpinho agora está seguro e presente. Parabéns pela sua dedicação!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Heavy Cloud */}
      {activeTab === 'cloud' && (
        <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm space-y-6 text-center">
          <div>
            <span className="text-3xl">☁️</span>
            <h3 className="font-child text-2xl font-bold text-slate-800 mt-1">
              A Nuvem dos Pensamentos Pesados
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
              Coloque aqui algo que está pesando no seu peito. Nós vamos transformar esse peso em uma nuvem que flutua para bem longe.
            </p>
          </div>

          {cloudTransformed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-gradient-to-tr from-indigo-50 via-sky-50 to-amber-50 rounded-3xl border border-indigo-200 space-y-4"
            >
              <span className="text-4xl animate-bounce inline-block">✨🌈✨</span>
              <h4 className="font-child text-xl font-bold text-indigo-900">
                O pensamento pesado se transformou em luz!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                "Você é muito mais forte e especial do que qualquer pensamento passageiro. Nuvens vêm e vão, mas o céu azul continua sempre dentro de você."
              </p>
              <button
                onClick={() => {
                  setCloudTransformed(false);
                  setHeavyThought('');
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Soltar Outro Pensamento
              </button>
            </motion.div>
          ) : isCloudFloating ? (
            <div className="py-12 space-y-4">
              <motion.div
                animate={{
                  y: [-10, -80],
                  opacity: [1, 0.2],
                  scale: [1, 1.4],
                }}
                transition={{ duration: 3, ease: 'easeOut' }}
                className="text-6xl"
              >
                ☁️
              </motion.div>
              <p className="text-xs font-bold text-indigo-700">
                A nuvem está subindo e se desfazendo no vento suave...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                rows={3}
                value={heavyThought}
                onChange={(e) => setHeavyThought(e.target.value)}
                placeholder="Ex: 'Estou com medo de não conseguir', 'Estou triste com meu amigo', 'Quero que essa dor pare'..."
                className="w-full p-4 rounded-2xl border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm bg-indigo-50/30"
              />
              <button
                onClick={handleTransformCloud}
                disabled={!heavyThought.trim()}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Transformar em Luz e Deixar Ir</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Butterfly Hug */}
      {activeTab === 'hug' && (
        <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-sm space-y-6">
          <div className="text-center">
            <span className="text-3xl">🦋</span>
            <h3 className="font-child text-2xl font-bold text-slate-800 mt-1">
              O Abraço da Borboleta (Acalmar o Coração)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
              Esta é uma técnica mágica usada por psicólogos no mundo todo para ajudar crianças a se sentirem protegidas e calmas.
            </p>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            <div className="flex items-start gap-3 p-3.5 bg-pink-50/70 rounded-2xl border border-pink-200/80">
              <span className="w-6 h-6 rounded-full bg-pink-200 text-pink-800 font-bold text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>Cruze os braços sobre o peito</strong>, como se suas mãos fossem as asas de uma borboleta pousada logo abaixo da sua clavícula.
              </p>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-pink-50/70 rounded-2xl border border-pink-200/80">
              <span className="w-6 h-6 rounded-full bg-pink-200 text-pink-800 font-bold text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>Dê toques suaves e alternados</strong> com as mãos: mão direita... depois mão esquerda... como as asas de uma borboleta batendo devagarzinho.
              </p>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-pink-50/70 rounded-2xl border border-pink-200/80">
              <span className="w-6 h-6 rounded-full bg-pink-200 text-pink-800 font-bold text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>Respire bem fundo</strong> e diga baixinho para si mesmo(a): <em>"Eu estou seguro(a) aqui. Tudo vai ficar bem."</em>
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                triggerStarReward();
                db.unlockAchievement(
                  currentUser.id,
                  'Abraço do Próprio Coração',
                  'Praticou o carinho e acolhimento com o Abraço da Borboleta.',
                  '💖',
                  'courage'
                );
              }}
              className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              Fiz o Abraço da Borboleta! ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
