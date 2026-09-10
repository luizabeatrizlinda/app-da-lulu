import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import { db } from './services/storage';
import { Header } from './components/Header';
import { EmergencyModal } from './components/EmergencyModal';
import { UserSwitcherModal } from './components/UserSwitcherModal';
import { ChildHome } from './components/child/ChildHome';
import { EmotionCheckIn } from './components/child/EmotionCheckIn';
import { CalmCorner } from './components/child/CalmCorner';
import { TreasuresBox } from './components/child/TreasuresBox';
import { DrawingJournal } from './components/child/DrawingJournal';
import { AchievementsGarden } from './components/child/AchievementsGarden';
import { ProfessionalDashboard } from './components/adult/ProfessionalDashboard';
import { OpeningScreen } from './components/OpeningScreen';
import { Heart, Shield, Phone, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ChildScreen = 'home' | 'checkin' | 'calm' | 'treasures' | 'drawing' | 'garden' | 'emergency';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => db.getCurrentUser());
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isSwitchUserOpen, setIsSwitchUserOpen] = useState(false);
  const [childScreen, setChildScreen] = useState<ChildScreen>('home');
  const [showOpeningScreen, setShowOpeningScreen] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setCurrentUser(db.getCurrentUser());
    });
    return () => unsubscribe();
  }, []);

  const handleSelectUser = (user: UserProfile) => {
    db.setCurrentUser(user);
    setCurrentUser(user);
    setChildScreen('home');
  };

  const handleChildNavigate = (screen: ChildScreen) => {
    if (screen === 'emergency') {
      setIsSosOpen(true);
    } else {
      setChildScreen(screen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isChild = currentUser.role === 'child';

  if (showOpeningScreen) {
    return (
      <OpeningScreen
        onEnter={() => setShowOpeningScreen(false)}
        childName={currentUser.nickname || currentUser.name}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FBF9] text-slate-800">
      {/* Top Navigation & Profile Bar */}
      <Header
        currentUser={currentUser}
        onOpenSos={() => setIsSosOpen(true)}
        onOpenSwitchUser={() => setIsSwitchUserOpen(true)}
        onOpenOpeningScreen={() => setShowOpeningScreen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          {isChild ? (
            /* Child View Experience */
            <motion.div
              key={childScreen}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {childScreen === 'home' && (
                <ChildHome
                  currentUser={currentUser}
                  onNavigate={handleChildNavigate}
                  onOpenOpeningScreen={() => setShowOpeningScreen(true)}
                />
              )}

              {childScreen === 'checkin' && (
                <EmotionCheckIn
                  currentUser={currentUser}
                  onBack={() => setChildScreen('home')}
                  onOpenSos={() => setIsSosOpen(true)}
                  onGoToCalmCorner={() => setChildScreen('calm')}
                />
              )}

              {childScreen === 'calm' && (
                <CalmCorner
                  currentUser={currentUser}
                  onBack={() => setChildScreen('home')}
                  onOpenSos={() => setIsSosOpen(true)}
                />
              )}

              {childScreen === 'treasures' && (
                <TreasuresBox
                  currentUser={currentUser}
                  onBack={() => setChildScreen('home')}
                />
              )}

              {childScreen === 'drawing' && (
                <DrawingJournal
                  currentUser={currentUser}
                  onBack={() => setChildScreen('home')}
                />
              )}

              {childScreen === 'garden' && (
                <AchievementsGarden
                  currentUser={currentUser}
                  onBack={() => setChildScreen('home')}
                />
              )}
            </motion.div>
          ) : (
            /* Adult Professional (Therapist, Pedagogue, Guardian) Portal */
            <motion.div
              key="professional-dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ProfessionalDashboard
                currentUser={currentUser}
                onOpenSos={() => setIsSosOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Reassuring Footer */}
      <footer className="border-t border-emerald-100/70 bg-white/70 backdrop-blur-xs py-4 px-4 sm:px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-300/40" />
            <span>
              <strong>Espaço Aconchego:</strong> Cada vida é preciosa. Se precisar de apoio imediato gratuito, ligue <strong>188 (CVV)</strong> ou <strong>192 (SAMU)</strong>.
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-teal-600" />
              Banco de Dados Seguro Local
            </span>
            <span>•</span>
            <button
              onClick={() => setIsSwitchUserOpen(true)}
              className="text-teal-700 hover:underline cursor-pointer"
            >
              Perfis Pedagógicos
            </button>
          </div>
        </div>
      </footer>

      {/* Emergency Crisis / Safety Network Modal */}
      <EmergencyModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        currentUser={currentUser}
      />

      {/* Multi-Profile User Switcher & Management Modal */}
      <UserSwitcherModal
        isOpen={isSwitchUserOpen}
        onClose={() => setIsSwitchUserOpen(false)}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
      />
    </div>
  );
}
