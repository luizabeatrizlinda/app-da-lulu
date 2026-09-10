import React, { useState, useEffect } from 'react';
import { UserProfile, Achievement } from '../../types';
import { db } from '../../services/storage';
import { triggerStarReward } from '../../utils/feedback';
import { ArrowLeft, Sparkles, Award, Star, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface AchievementsGardenProps {
  currentUser: UserProfile;
  onBack: () => void;
}

export const AchievementsGarden: React.FC<AchievementsGardenProps> = ({
  currentUser,
  onBack,
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    setAchievements(db.getAchievements(currentUser.id));
  }, [currentUser.id]);

  const allPossibleAchievements = [
    {
      title: 'Primeiro Raio de Sol',
      desc: 'Entrou no Espaço Aconchego e cuidou de si mesmo.',
      icon: '☀️',
    },
    {
      title: 'Estrela da Sinceridade',
      desc: 'Teve a coragem de expressar como o coração está batendo.',
      icon: '🌟',
    },
    {
      title: 'Mestre da Respiração Serena',
      desc: 'Praticou a respiração da florzinha e da velinha no Cantinho da Calma.',
      icon: '🦋',
    },
    {
      title: 'Guardião de Tesouros',
      desc: 'Guardou memórias queridas e motivos para ter esperança.',
      icon: '💎',
    },
    {
      title: 'Transformador de Nuvens',
      desc: 'Soltou um pensamento pesado e o transformou em luz.',
      icon: '☁️',
    },
    {
      title: 'Pequeno Artista do Coração',
      desc: 'Fez um desenho no Diário para acalmar a mente.',
      icon: '🎨',
    },
    {
      title: 'Abraço do Próprio Coração',
      desc: 'Praticou o Abraço da Borboleta para se acalmar.',
      icon: '💖',
    },
    {
      title: 'Laço de Confiança',
      desc: 'Conversou ou chamou um adulto seguro quando precisou.',
      icon: '🤝',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-emerald-50 text-slate-600 hover:text-slate-800 text-xs font-bold border border-slate-200/80 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Jardim das Conquistas
        </span>
      </div>

      {/* Visual Garden Banner */}
      <div className="bg-gradient-to-b from-emerald-100/80 via-teal-50 to-lime-50 rounded-3xl p-6 border border-emerald-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center text-4xl border border-emerald-200">
              🌻
            </div>
            <div>
              <h3 className="font-child text-2xl font-bold text-slate-800">
                Seu Jardim está Florescendo!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md">
                Cada vez que você respira, fala sobre seus sentimentos ou pede ajuda, uma nova flor ou estrelinha nasce aqui para te parabenizar!
              </p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xs px-5 py-3 rounded-2xl border border-emerald-200 text-center shrink-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Conquistas Ganhas
            </span>
            <div className="text-2xl font-child font-bold text-emerald-700 mt-0.5">
              {achievements.length} <span className="text-sm font-normal text-slate-400">/ {allPossibleAchievements.length}</span>
            </div>
          </div>
        </div>

        {/* Animated flowers in the garden background */}
        <div className="flex justify-around items-end pt-8 pb-1 text-3xl sm:text-4xl opacity-80">
          {['🌷', '🌻', '🌼', '🌱', '🌸', '💐', '🌺'].map((flower, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 + i * 0.4, ease: 'easeInOut' }}
            >
              {flower}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div>
        <h4 className="font-child text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Suas Medalhas & Conquistas do Coração</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {allPossibleAchievements.map((badge, idx) => {
            const unlocked = achievements.find((a) => a.title === badge.title);

            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.01 }}
                className={`p-4 rounded-3xl border transition-all flex items-start gap-3.5 ${
                  unlocked
                    ? 'bg-white border-emerald-200 shadow-xs ring-1 ring-emerald-100'
                    : 'bg-slate-50/60 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${
                    unlocked
                      ? 'bg-emerald-50 border-emerald-200 shadow-xs'
                      : 'bg-slate-100 border-slate-200 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-slate-800">{badge.title}</h5>
                    {unlocked ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Conquistada!
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        A florescer...
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {badge.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
