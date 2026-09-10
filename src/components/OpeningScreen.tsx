import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager, triggerPastelConfetti } from '../utils/feedback';
import { Sparkles, Heart, Sun, Moon, Volume2, ArrowRight, Star } from 'lucide-react';

interface OpeningScreenProps {
  onEnter: () => void;
  childName?: string;
}

type SkyMode = 'all' | 'day' | 'night';

export const OpeningScreen: React.FC<OpeningScreenProps> = ({
  onEnter,
  childName = 'amiguinho(a)',
}) => {
  const [skyMode, setSkyMode] = useState<SkyMode>('all');
  const [dialogue, setDialogue] = useState<string>(
    'Olá! O Sol e a Lua estão tão felizes em ver você aqui hoje! ✨'
  );
  const [lastCharacterClicked, setLastCharacterClicked] = useState<'sun' | 'moon' | null>(null);

  const handleSunClick = () => {
    soundManager.playChime('star');
    triggerPastelConfetti();
    setLastCharacterClicked('sun');
    setDialogue(
      '☀️ Solzinho: "Bom dia, raio de luz! O seu coração é lindo e você tem uma força gigante dentro de você!"'
    );
  };

  const handleMoonClick = () => {
    soundManager.playChime('soothe');
    setLastCharacterClicked('moon');
    setDialogue(
      '🌙 Luazinha: "Oi, estrelinha! Quando a noite chegar ou o cansaço bater, respire bem fundo. Eu estou aqui cuidando do seu sono!"'
    );
  };

  const handleEnterApp = () => {
    soundManager.playChime('success');
    triggerPastelConfetti();
    onEnter();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-hidden select-none transition-colors duration-1000 bg-gradient-to-b from-sky-100 via-amber-50/70 to-indigo-100 p-4 sm:p-6 md:p-8">
      {/* Background Animated Sky Canvas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dynamic Sky Tone Overlay depending on mode */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            skyMode === 'night'
              ? 'bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950 opacity-90'
              : skyMode === 'day'
              ? 'bg-gradient-to-b from-sky-300 via-amber-100 to-rose-100 opacity-80'
              : 'opacity-0'
          }`}
        />

        {/* Floating background clouds */}
        <motion.div
          animate={{ x: [-30, 40, -30] }}
          transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
          className="absolute top-10 left-[8%] opacity-70"
        >
          <svg width="140" height="70" viewBox="0 0 140 70" fill="none">
            <path
              d="M30 60H115C126 60 135 51 135 40C135 30 127 22 117 21C115 11 106 3 95 3C87 3 80 8 76 15C72 10 65 7 57 7C45 7 35 16 35 28C24 29 15 38 15 49C15 55 21 60 30 60Z"
              fill="#FFFFFF"
            />
          </svg>
        </motion.div>

        <motion.div
          animate={{ x: [40, -30, 40] }}
          transition={{ repeat: Infinity, duration: 22, ease: 'easeInOut' }}
          className="absolute top-28 right-[10%] opacity-60"
        >
          <svg width="180" height="80" viewBox="0 0 180 80" fill="none">
            <path
              d="M35 70H150C164 70 175 59 175 45C175 32 165 22 152 21C149 10 138 2 125 2C115 2 106 8 101 16C96 11 88 7 78 7C64 7 52 17 50 31C37 32 27 42 27 55C27 63 31 70 35 70Z"
              fill="#FFFFFF"
            />
          </svg>
        </motion.div>

        {/* Twinkling Stars */}
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [0.8, 1.3, 0.8],
              opacity: [0.3, 0.9, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5 + (i % 4) * 0.7,
              delay: (i % 5) * 0.5,
              ease: 'easeInOut',
            }}
            className="absolute text-amber-300"
            style={{
              top: `${12 + ((i * 23) % 70)}%`,
              left: `${5 + ((i * 37) % 90)}%`,
              fontSize: `${14 + (i % 3) * 6}px`,
            }}
          >
            ★
          </motion.div>
        ))}
      </div>

      {/* Top Banner / Sky Controller */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-200/80 shadow-xs">
          <span className="text-xl">🏡</span>
          <span className="font-child text-xs sm:text-sm font-bold text-slate-700">
            Espaço Aconchego
          </span>
          <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/80">
            Lugar Seguro
          </span>
        </div>

        {/* Mood mode switchers */}
        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md p-1 rounded-full border border-slate-200/80 shadow-xs">
          <button
            onClick={() => setSkyMode('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              skyMode === 'all'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            ☀️ & 🌙 Céu Mágico
          </button>
          <button
            onClick={() => setSkyMode('day')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              skyMode === 'day'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            ☀️ Sol
          </button>
          <button
            onClick={() => setSkyMode('night')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              skyMode === 'night'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            🌙 Lua
          </button>
        </div>
      </header>

      {/* Main Showcase: Colorful Cute Characters (Sun & Moon) */}
      <main className="relative z-10 w-full max-w-4xl my-auto flex flex-col items-center justify-center text-center">
        {/* Colorful Rainbow Arch Bridge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg mb-2 sm:mb-4 px-4"
        >
          <svg viewBox="0 0 400 120" className="w-full h-auto drop-shadow-xs">
            <defs>
              <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F87171" stopOpacity="0.85" />
                <stop offset="25%" stopColor="#FBBF24" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#34D399" stopOpacity="0.85" />
                <stop offset="75%" stopColor="#60A5FA" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.85" />
              </linearGradient>
            </defs>
            <path
              d="M 30 110 A 170 100 0 0 1 370 110"
              fill="none"
              stroke="url(#rainbowGrad)"
              strokeWidth="16"
              strokeLinecap="round"
            />
            {/* White fluffy cloud anchors for the rainbow */}
            <circle cx="35" cy="108" r="16" fill="#FFFFFF" opacity="0.95" />
            <circle cx="50" cy="112" r="13" fill="#FFFFFF" opacity="0.95" />
            <circle cx="365" cy="108" r="16" fill="#FFFFFF" opacity="0.95" />
            <circle cx="350" cy="112" r="13" fill="#FFFFFF" opacity="0.95" />
          </svg>
        </motion.div>

        {/* Characters Center Stage: The Cute Sun and The Cute Moon */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-14 md:gap-20 my-2">
          {/* CUTE SMILING SUN (Solzinho) */}
          <motion.div
            whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
            whileTap={{ scale: 0.94 }}
            onClick={handleSunClick}
            className="group cursor-pointer flex flex-col items-center"
          >
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 flex items-center justify-center">
              {/* Animated Rotating Rays */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                    <ellipse
                      key={deg}
                      cx="100"
                      cy="20"
                      rx="8"
                      ry="16"
                      fill="#FBBF24"
                      transform={`rotate(${deg} 100 100)`}
                      className="opacity-90"
                    />
                  ))}
                </svg>
              </motion.div>

              {/* Glowing Aura */}
              <div className="absolute inset-4 rounded-full bg-amber-300/40 blur-xl animate-pulse" />

              {/* Sun Core Face */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="relative w-28 h-28 sm:w-34 sm:h-34 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 border-4 border-yellow-200 shadow-lg flex flex-col items-center justify-center"
              >
                {/* Cute Eyes */}
                <div className="flex items-center gap-5 sm:gap-7 mb-1">
                  <div className="w-3.5 h-4 sm:w-4 sm:h-5 rounded-full bg-slate-900 relative">
                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                  <div className="w-3.5 h-4 sm:w-4 sm:h-5 rounded-full bg-slate-900 relative">
                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>

                {/* Rosy Cheeks */}
                <div className="flex items-center justify-between w-20 sm:w-24 px-1 -mt-1 mb-1">
                  <div className="w-4 h-2.5 sm:w-5 sm:h-3 rounded-full bg-rose-400/70 blur-[1px]" />
                  <div className="w-4 h-2.5 sm:w-5 sm:h-3 rounded-full bg-rose-400/70 blur-[1px]" />
                </div>

                {/* Sweet Smile */}
                <div className="w-6 h-3 sm:w-8 sm:h-4 border-b-4 border-slate-900 rounded-b-full flex items-center justify-center">
                  <div className="w-3 h-2 bg-rose-400 rounded-b-full mt-2" />
                </div>

                {/* Sparkling Mini Flower or Star Pin */}
                <span className="absolute top-2 right-4 text-sm sm:text-base animate-bounce">
                  🌸
                </span>
              </motion.div>
            </div>

            <div className="mt-2 flex items-center gap-1.5 bg-amber-100/90 hover:bg-amber-200 text-amber-900 px-3.5 py-1 rounded-full text-xs font-bold border border-amber-300 shadow-xs transition-colors">
              <span>Toque no Solzinho</span>
              <span>✨</span>
            </div>
          </motion.div>

          {/* Friendly Heart Connector */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1 text-rose-500"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 shadow-md border border-rose-200 flex items-center justify-center text-2xl sm:text-3xl">
              💖
            </div>
            <span className="text-[11px] font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200 shadow-xs">
              Sempre com você
            </span>
          </motion.div>

          {/* CUTE SLEEPY MOON (Luazinha) */}
          <motion.div
            whileHover={{ scale: 1.08, rotate: [0, 3, -3, 0] }}
            whileTap={{ scale: 0.94 }}
            onClick={handleMoonClick}
            className="group cursor-pointer flex flex-col items-center"
          >
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 flex items-center justify-center">
              {/* Soft Moon Halo */}
              <div className="absolute inset-4 rounded-full bg-indigo-300/30 blur-xl animate-pulse" />

              {/* Floating Animation */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 3.4, ease: 'easeInOut' }}
                className="relative w-28 h-28 sm:w-34 sm:h-34 md:w-40 md:h-40 flex items-center justify-center"
              >
                {/* SVG Crescent Moon with Face */}
                <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
                  <defs>
                    <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#EDE9FE" />
                      <stop offset="60%" stopColor="#C4B5FD" />
                      <stop offset="100%" stopColor="#A78BFA" />
                    </linearGradient>
                  </defs>
                  {/* Crescent Path */}
                  <path
                    d="M 120 20 C 60 25 30 75 45 130 C 50 145 60 155 70 155 C 20 120 30 50 120 20 Z"
                    fill="url(#moonGrad)"
                    stroke="#8B5CF6"
                    strokeWidth="3"
                  />
                  {/* Sleeping Eyelash (closed smiling eye) */}
                  <path
                    d="M 54 82 Q 62 90 70 82"
                    fill="none"
                    stroke="#312E81"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Rosy Cheek */}
                  <circle cx="58" cy="94" r="7" fill="#F472B6" opacity="0.65" />
                  {/* Gentle sleepy smile */}
                  <path
                    d="M 64 102 Q 70 108 76 102"
                    fill="none"
                    stroke="#312E81"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Nightcap with star */}
                <motion.div
                  animate={{ rotate: [-4, 4, -4] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                  className="absolute top-1 left-3 text-2xl sm:text-3xl"
                >
                  ⭐
                </motion.div>

                {/* Floating Zzz */}
                <motion.span
                  animate={{ y: [-5, -20], opacity: [0, 1, 0], x: [0, 10] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeOut' }}
                  className="absolute top-2 right-4 text-xs font-bold text-indigo-700 bg-white/80 px-1.5 py-0.5 rounded-full shadow-xs"
                >
                  Zzz...
                </motion.span>
              </motion.div>
            </div>

            <div className="mt-2 flex items-center gap-1.5 bg-indigo-100/90 hover:bg-indigo-200 text-indigo-900 px-3.5 py-1 rounded-full text-xs font-bold border border-indigo-300 shadow-xs transition-colors">
              <span>Toque na Luazinha</span>
              <span>🌙</span>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Speech Dialogue Balloon */}
        <motion.div
          key={dialogue}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mt-4 sm:mt-6 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-3xl border-2 border-emerald-200 shadow-md max-w-xl mx-auto flex items-center gap-3"
        >
          <span className="text-2xl sm:text-3xl shrink-0 animate-bounce">
            {lastCharacterClicked === 'sun' ? '☀️' : lastCharacterClicked === 'moon' ? '🌙' : '✨'}
          </span>
          <p className="text-xs sm:text-sm font-semibold text-slate-700 text-left leading-relaxed">
            {dialogue}
          </p>
        </motion.div>

        {/* Core Welcoming Invitation */}
        <div className="mt-6 sm:mt-8 space-y-3">
          <h1 className="font-child text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-800 drop-shadow-xs">
            Seja muito bem-vindo(a), {childName}!
          </h1>
          <p className="text-xs sm:text-base text-slate-600 max-w-lg mx-auto font-medium leading-relaxed">
            Aqui é o seu cantinho de paz, carinho e acolhimento. De manhã com a luz do sol ou de noite com as estrelas, estamos sempre com você.
          </p>
        </div>
      </main>

      {/* Footer Actions: Big Enter Button & Reassurance */}
      <footer className="relative z-10 w-full max-w-md flex flex-col items-center gap-3 pb-2 pt-4">
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleEnterApp}
          className="w-full py-4 px-8 rounded-3xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-base sm:text-lg shadow-lg shadow-teal-500/25 flex items-center justify-center gap-3 transition-all cursor-pointer border-2 border-white/60"
        >
          <Sparkles className="w-5 h-5 fill-white" />
          <span>Entrar no Espaço Aconchego</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        <p className="text-[11px] sm:text-xs text-slate-500 font-medium flex items-center gap-1.5">
          <span>🌿 Toque no botão acima para começar seu dia com amor</span>
        </p>
      </footer>
    </div>
  );
};
