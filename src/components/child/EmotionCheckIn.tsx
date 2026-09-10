import React, { useState } from 'react';
import { UserProfile, EmotionKey } from '../../types';
import { EMOTIONS, BODY_SENSATIONS, CONTEXT_TAGS } from '../../constants/emotions';
import { db } from '../../services/storage';
import { triggerStarReward } from '../../utils/feedback';
import { Heart, Sparkles, Send, ShieldAlert, ArrowLeft, CheckCircle2, MessageCircleHeart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EmotionCheckInProps {
  currentUser: UserProfile;
  onBack: () => void;
  onOpenSos: () => void;
  onGoToCalmCorner: () => void;
}

export const EmotionCheckIn: React.FC<EmotionCheckInProps> = ({
  currentUser,
  onBack,
  onOpenSos,
  onGoToCalmCorner,
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionKey | null>(null);
  const [intensity, setIntensity] = useState<number>(3);
  const [selectedSensation, setSelectedSensation] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showGentleCareAlert, setShowGentleCareAlert] = useState<boolean>(false);

  const currentEmotionMeta = EMOTIONS.find((e) => e.key === selectedEmotion);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmotion) return;

    // Check if distress triggers safety protocols
    const isCritical =
      selectedEmotion === 'critical' ||
      intensity === 5 ||
      note.toLowerCase().includes('sumir') ||
      note.toLowerCase().includes('morrer') ||
      note.toLowerCase().includes('machucar') ||
      note.toLowerCase().includes('acabar com tudo') ||
      note.toLowerCase().includes('não aguento');

    db.addMood({
      childId: currentUser.id,
      childName: currentUser.nickname || currentUser.name,
      timestamp: new Date().toISOString(),
      emotion: selectedEmotion,
      intensity,
      bodySensation: selectedSensation,
      tags: selectedTags,
      note: note.trim() || undefined,
      isAlertTriggered: isCritical,
      reviewedByProfessional: false,
    });

    // Award positive achievement for being brave and expressing feelings
    db.unlockAchievement(
      currentUser.id,
      'Estrela da Sinceridade',
      'Teve a coragem de compartilhar como o coração está batendo hoje.',
      '🌟',
      'courage'
    );

    triggerStarReward();

    if (isCritical) {
      setShowGentleCareAlert(true);
    } else {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top back & title */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-emerald-50 text-slate-600 hover:text-slate-800 text-xs font-bold border border-slate-200/80 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Início</span>
        </button>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
          Diário do Coração Seguro
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* State 1: Critical Empathy & Loving Support Screen */}
        {showGentleCareAlert ? (
          <motion.div
            key="care-alert"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FFFBF5] rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md text-center space-y-5"
          >
            <div className="w-16 h-16 rounded-full bg-amber-100 text-3xl flex items-center justify-center mx-auto border-2 border-amber-300">
              🫂
            </div>
            <div>
              <h3 className="font-child text-2xl font-bold text-slate-800 mb-2">
                Obrigado por me contar, {currentUser.nickname}!
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
                Você foi muito corajoso(a) de expressar o que está doendo. Seu sentimento é real, mas <strong>essa dor pesada não vai durar para sempre</strong>. Tem pessoas que te amam muito e estão prontas para te dar a mão agora.
              </p>
            </div>

            <div className="bg-white/90 rounded-2xl p-4 border border-amber-200/60 max-w-md mx-auto text-left flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <p className="text-xs text-slate-600 leading-normal">
                Sua psicóloga e sua família já foram avisadas com muito carinho para estarem pertinho de você com toda segurança e sigilo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onOpenSos}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Conversar com Meu Adulto Seguro</span>
              </button>
              <button
                onClick={onGoToCalmCorner}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ir para o Cantinho da Calma</span>
              </button>
            </div>
          </motion.div>
        ) : isSubmitted ? (
          /* State 2: Success Celebration Screen */
          <motion.div
            key="success-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-md text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-3xl flex items-center justify-center mx-auto border-2 border-emerald-300">
              🌻
            </div>
            <div>
              <h3 className="font-child text-2xl font-bold text-slate-800 mb-1">
                Registro Guardado com Amor!
              </h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Parabéns, {currentUser.nickname}! Você cuidou de si mesmo hoje e conquistou uma nova estrelinha no seu Jardim de Conquistas.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 inline-block text-xs font-bold text-emerald-800">
              🌟 +1 Estrela da Sinceridade adicionada ao seu jardim!
            </div>

            <div className="pt-3 flex justify-center gap-3">
              <button
                onClick={onBack}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
              >
                Ir para o Início
              </button>
              <button
                onClick={onGoToCalmCorner}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
              >
                Relaxar no Cantinho da Calma
              </button>
            </div>
          </motion.div>
        ) : (
          /* State 3: Interactive Emotion Check-in Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Emojis Selection */}
            <div className="bg-white/90 backdrop-blur-xs rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xs">
              <div className="text-center max-w-md mx-auto mb-5">
                <span className="text-3xl inline-block mb-1">💖</span>
                <h3 className="font-child text-xl sm:text-2xl font-bold text-slate-800">
                  Como está seu coração agora, {currentUser.nickname}?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Toque na carinha que mais parece com o que você está sentindo por dentro.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {EMOTIONS.map((emotion) => {
                  const isSelected = selectedEmotion === emotion.key;
                  return (
                    <motion.button
                      key={emotion.key}
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedEmotion(emotion.key)}
                      className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                        isSelected
                          ? `${emotion.colorBg} border-teal-500 ring-2 ring-teal-200 shadow-xs`
                          : 'bg-slate-50/70 hover:bg-white border-slate-200/80 hover:border-teal-200'
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl filter drop-shadow-xs">
                        {emotion.emoji}
                      </span>
                      <div>
                        <h4 className={`text-xs font-bold ${emotion.colorText}`}>
                          {emotion.label}
                        </h4>
                        <p className="text-[10px] text-slate-500 leading-tight mt-0.5 hidden sm:block line-clamp-2">
                          {emotion.childDescription}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Intensity & Sensations */}
            {selectedEmotion && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-xs rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xs space-y-5"
              >
                {/* Intensity Slider with Hearts */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                    Qual é o tamanho desse sentimento? (Do menorzinho até o grandão)
                  </label>
                  <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setIntensity(lvl)}
                        className={`flex-1 py-2 rounded-xl text-center font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                          intensity >= lvl
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 scale-105 shadow-xs'
                            : 'bg-white text-slate-400 border border-slate-200'
                        }`}
                      >
                        <span className="text-base sm:text-lg block">⭐</span>
                        <span>Nível {lvl}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Body Sensation */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                    Em qual lugar do seu corpinho você sente isso?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {BODY_SENSATIONS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedSensation(s.label)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          selectedSensation === s.label
                            ? 'bg-teal-100 text-teal-900 border border-teal-300 ring-1 ring-teal-200'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        <span>{s.icon}</span>
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Context Tags */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                    Tem a ver com alguma dessas coisas? (Pode escolher mais de uma)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CONTEXT_TAGS.map((tag) => {
                      const isTagSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isTagSelected
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Free Expression Notes */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                    Quer escrever ou desabafar mais alguma coisa? (Só se você quiser!)
                  </label>
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Escreva aqui tudo o que vier na sua cabecinha... Este é um espaço seguro e acolhedor."
                    className="w-full p-3 text-sm rounded-2xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 bg-white placeholder:text-slate-400"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    id="btn-submit-mood"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Guardar no Meu Coração</span>
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        )}
      </AnimatePresence>
    </div>
  );
};
