import React from 'react';
import { UserProfile } from '../types';
import { Heart, ShieldAlert, Users, Sparkles, LogOut } from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  onOpenSos: () => void;
  onOpenSwitchUser: () => void;
  onOpenOpeningScreen?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenSos,
  onOpenSwitchUser,
  onOpenOpeningScreen,
}) => {
  const isChild = currentUser.role === 'child';

  const roleBadge = () => {
    switch (currentUser.role) {
      case 'child':
        return { label: 'Explorador(a)', bg: 'bg-emerald-100 text-emerald-800' };
      case 'therapist':
        return { label: 'Psicologia Clínica', bg: 'bg-purple-100 text-purple-800' };
      case 'pedagogue':
        return { label: 'Equipe Pedagógica', bg: 'bg-amber-100 text-amber-800' };
      case 'guardian':
        return { label: 'Família / Responsável', bg: 'bg-sky-100 text-sky-800' };
    }
  };

  const badge = roleBadge();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-emerald-100/70 shadow-xs px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Logo & App Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-100 via-teal-100 to-sky-100 flex items-center justify-center text-xl shadow-xs border border-emerald-200/60">
            <Heart className="w-6 h-6 text-emerald-600 fill-emerald-400/40" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-child text-lg sm:text-xl font-bold tracking-tight text-slate-800">
                Espaço Aconchego
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                Lugar Seguro
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Apoio emocional, escuta empática e proteção à infância
            </p>
          </div>
        </div>

        {/* Right actions: Opening Screen, SOS Button & User Profile Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Re-open animated opening screen */}
          {onOpenOpeningScreen && (
            <button
              onClick={onOpenOpeningScreen}
              id="btn-opening-screen"
              className="flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 text-xs font-bold shadow-xs hover:shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
              title="Ver Céu do Sol e da Lua"
            >
              <span className="text-base sm:text-lg">☀️🌙</span>
              <span className="hidden sm:inline">Abertura</span>
            </button>
          )}

          {/* Always-visible gentle emergency SOS button */}
          <button
            onClick={onOpenSos}
            id="btn-sos-emergency"
            className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-rose-100/90 hover:bg-rose-200 text-rose-800 border border-rose-200 text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
            title="Preciso de ajuda urgente"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
            <span className="whitespace-nowrap">
              {isChild ? 'Preciso de Ajuda' : 'Plano de Emergência'}
            </span>
          </button>

          {/* User profile selector */}
          <button
            onClick={onOpenSwitchUser}
            id="btn-switch-user"
            className="flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 rounded-full bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 transition-all cursor-pointer text-left group"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-base border border-emerald-200">
              {currentUser.avatar}
            </div>
            <div className="hidden md:block pr-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-700 leading-tight">
                  {currentUser.nickname || currentUser.name}
                </span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block leading-none mt-0.5">
                Trocar perfil
              </span>
            </div>
            <Users className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
};
