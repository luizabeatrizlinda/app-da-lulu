import React from 'react';
import { UserProfile } from '../../types';
import { Heart, Wind, Gift, Palette, Award, ShieldAlert, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ChildHomeProps {
  currentUser: UserProfile;
  onNavigate: (screen: 'checkin' | 'calm' | 'treasures' | 'drawing' | 'garden' | 'emergency') => void;
  recentMoodEmotion?: string;
}

export const ChildHome: React.FC<ChildHomeProps> = ({
  currentUser,
  onNavigate,
  recentMoodEmotion,
}) => {
  const cards = [
    {
      id: 'checkin',
      title: 'Como estou me sentindo?',
      subtitle: 'Conte para o Aconchego como o seu coração está batendo hoje.',
      emoji: '💖',
      colorBg: 'bg-emerald-50/90 hover:bg-emerald-100/80',
      colorBorder: 'border-emerald-200/80',
      colorIconBg: 'bg-emerald-200/70',
      textColor: 'text-emerald-950',
      tag: 'Check-in Diário',
      action: () => onNavigate('checkin'),
    },
    {
      id: 'calm',
      title: 'Cantinho da Calma',
      subtitle: 'Respire com a florzinha, solte nuvens pesadas e sinta a paz.',
      emoji: '🌸',
      colorBg: 'bg-sky-50/90 hover:bg-sky-100/80',
      colorBorder: 'border-sky-200/80',
      colorIconBg: 'bg-sky-200/70',
      textColor: 'text-sky-950',
      tag: 'Relaxamento',
      action: () => onNavigate('calm'),
    },
    {
      id: 'treasures',
      title: 'Meu Baú de Coisas Boas',
      subtitle: 'Guarde fotos, bichinhos, memórias e coisas que te fazem sorrir.',
      emoji: '🧸',
      colorBg: 'bg-amber-50/90 hover:bg-amber-100/80',
      colorBorder: 'border-amber-200/80',
      colorIconBg: 'bg-amber-200/70',
      textColor: 'text-amber-950',
      tag: 'Esperança & Amor',
      action: () => onNavigate('treasures'),
    },
    {
      id: 'drawing',
      title: 'Diário de Desenho',
      subtitle: 'Pinte com cores suaves e coloque no papel o que você sente.',
      emoji: '🎨',
      colorBg: 'bg-purple-50/90 hover:bg-purple-100/80',
      colorBorder: 'border-purple-200/80',
      colorIconBg: 'bg-purple-200/70',
      textColor: 'text-purple-950',
      tag: 'Arte & Expressão',
      action: () => onNavigate('drawing'),
    },
    {
      id: 'garden',
      title: 'Jardim das Conquistas',
      subtitle: 'Veja as florzinhas e medalhas que você ganhou cuidando de você.',
      emoji: '🌻',
      colorBg: 'bg-lime-50/90 hover:bg-lime-100/80',
      colorBorder: 'border-lime-200/80',
      colorIconBg: 'bg-lime-200/70',
      textColor: 'text-lime-950',
      tag: 'Recompensas',
      action: () => onNavigate('garden'),
    },
    {
      id: 'emergency',
      title: 'Meus Protetores & Ajuda',
      subtitle: 'Se a dor apertar, converse com os adultos que te amam agora.',
      emoji: '🤝',
      colorBg: 'bg-rose-50/90 hover:bg-rose-100/80',
      colorBorder: 'border-rose-200/80',
      colorIconBg: 'bg-rose-200/70',
      textColor: 'text-rose-950',
      tag: 'Segurança Imediata',
      action: () => onNavigate('emergency'),
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Friendly Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-100/80 via-teal-50 to-sky-100/80 rounded-3xl p-6 sm:p-7 border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white shadow-xs flex items-center justify-center text-4xl sm:text-5xl border border-emerald-200 shrink-0"
          >
            {currentUser.avatar}
          </motion.div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="font-child text-2xl sm:text-3xl font-bold text-slate-800">
                Olá, {currentUser.nickname}!
              </h2>
              <span className="text-xl">✨</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg leading-relaxed">
              Que bom que você está aqui no seu lugar seguro. Lembre-se: você é muito especial, e cada pedacinho do que você sente importa muito para nós.
            </p>
          </div>
        </div>

        {/* Quick check-in prompt button */}
        <button
          onClick={() => onNavigate('checkin')}
          className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center gap-2 transition-transform active:scale-95 shrink-0 cursor-pointer"
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>Fazer Check-in Agora</span>
        </button>
      </div>

      {/* Navigational Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-child text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>O que você gostaria de fazer agora?</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">Toque para explorar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={card.action}
              className={`p-5 rounded-3xl border ${card.colorBorder} ${card.colorBg} shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl ${card.colorIconBg} flex items-center justify-center text-2xl shadow-xs border border-white/60`}
                  >
                    {card.emoji}
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/80 text-slate-600 border border-slate-200/60">
                    {card.tag}
                  </span>
                </div>

                <h4 className={`font-child text-lg font-bold ${card.textColor}`}>
                  {card.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {card.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Abrir espaço</span>
                <span>→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Daily Affirmation / Warm Anchor */}
      <div className="p-4 rounded-2xl bg-white/80 border border-emerald-100 flex items-center gap-3 text-center sm:text-left">
        <span className="text-2xl shrink-0">☀️</span>
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          <strong>Lembrete carinhoso:</strong> Quando tudo parecer difícil e confuso, pare um minutinho, coloque a mãozinha no peito e sinta o seu coração bater. Você é corajoso(a) e nunca está sozinho(a)!
        </p>
      </div>
    </div>
  );
};
