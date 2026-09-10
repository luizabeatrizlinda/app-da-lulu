import React, { useState, useEffect } from 'react';
import { SafetyContact, UserProfile } from '../types';
import { db } from '../services/storage';
import { X, Phone, Heart, Wind, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [contacts, setContacts] = useState<SafetyContact[]>([]);
  const [breathingPhase, setBreathingPhase] = useState<'inspire' | 'hold' | 'expire'>('inspire');
  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    if (isOpen) {
      const list = db.getSafetyContacts(currentUser.id);
      setContacts(list);
    }
  }, [isOpen, currentUser.id]);

  // Gentle breathing cycle inside emergency modal (4s in, 4s hold, 4s out)
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setBreathingPhase((curr) => {
            if (curr === 'inspire') return 'hold';
            if (curr === 'hold') return 'expire';
            return 'inspire';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const isChild = currentUser.role === 'child';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-[#FFFDF9] rounded-3xl max-w-xl w-full border border-rose-100 shadow-xl overflow-hidden my-auto"
        >
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-rose-100/90 via-pink-100/80 to-amber-100/80 px-6 py-5 border-b border-rose-200/60 relative">
            <button
              onClick={onClose}
              id="btn-close-emergency"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/90 shadow-xs flex items-center justify-center text-2xl border border-rose-200/60">
                💝
              </div>
              <div>
                <h2 className="font-child text-xl sm:text-2xl font-bold text-slate-800">
                  {isChild ? 'Você é Muito Importante!' : 'Plano de Acolhimento & Segurança'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {isChild
                    ? 'Está tudo bem sentir dor, mas você não precisa passar por isso sozinho(a).'
                    : 'Contatos prioritários para assistência psicológica e familiar imediata.'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Gentle child reassurance note */}
            {isChild && (
              <div className="bg-amber-50/80 border border-amber-200/70 rounded-2xl p-4 flex items-start gap-3">
                <span className="text-2xl">🧸</span>
                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                  <strong>Respire fundo.</strong> Essa tristeza ou angústia forte é como uma tempestade: ela faz barulho e assusta, mas <strong>ela vai passar</strong>. Tem pessoas que amam você e querem te dar um abraço agora.
                </p>
              </div>
            )}

            {/* Quick interactive breathing soother */}
            <div className="bg-gradient-to-b from-sky-50 to-teal-50/60 border border-sky-100 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2 text-sky-800 font-bold text-sm">
                <Wind className="w-4 h-4 text-sky-500" />
                <span>Respire comigo um pouquinho:</span>
              </div>
              <div className="relative w-24 h-24 mx-auto my-2 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: breathingPhase === 'inspire' ? 1.35 : breathingPhase === 'hold' ? 1.35 : 0.85,
                  }}
                  transition={{ duration: 3.8, ease: 'easeInOut' }}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-200 to-teal-200 shadow-inner flex items-center justify-center"
                >
                  <Heart className="w-7 h-7 text-teal-600 fill-teal-400/40" />
                </motion.div>
              </div>
              <p className="text-sm font-bold text-slate-700">
                {breathingPhase === 'inspire' && 'Inspirando o ar com calma... (cheirando a florzinha)'}
                {breathingPhase === 'hold' && 'Segurando a calma dentro do peito...'}
                {breathingPhase === 'expire' && 'Soltando bem devagar... (soprando a velinha)'}
              </p>
              <span className="text-xs font-semibold text-slate-400 mt-1 block">
                {seconds}s
              </span>
            </div>

            {/* Priority Emergency Helplines (CVV 188 & SAMU 192) */}
            <div>
              <h3 className="font-child text-sm font-bold text-slate-700 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Linhas de Apoio Gratuitas (24 Horas)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href="tel:188"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-200/80 flex items-center justify-center text-xl">
                      💛
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-950 group-hover:text-emerald-800">
                        CVV - Apoio Emocional
                      </h4>
                      <p className="text-xs text-emerald-700">Ligue 188 (Grátis 24h)</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Phone className="w-4 h-4" />
                  </div>
                </a>

                <a
                  href="tel:192"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-200/80 flex items-center justify-center text-xl">
                      🚑
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-rose-950 group-hover:text-rose-800">
                        SAMU - Emergência
                      </h4>
                      <p className="text-xs text-rose-700">Ligue 192 (Urgência)</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs">
                    <Phone className="w-4 h-4" />
                  </div>
                </a>
              </div>
            </div>

            {/* Personal Trusted Safe Adults */}
            <div>
              <h3 className="font-child text-sm font-bold text-slate-700 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {isChild ? 'Meus Protetores de Confiança' : 'Rede de Apoio da Criança'}
              </h3>
              <div className="space-y-2">
                {contacts
                  .filter((c) => !c.isEmergencyLine)
                  .map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-emerald-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl border border-slate-200">
                          {contact.avatar}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">{contact.name}</h4>
                          <p className="text-xs text-slate-500">
                            {contact.relationship} • {contact.availableHours || 'Sempre disponível'}
                          </p>
                          {contact.safeWord && (
                            <span className="inline-block mt-0.5 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.2 rounded-md border border-teal-200/60">
                              Palavra-chave: <strong>"{contact.safeWord}"</strong>
                            </span>
                          )}
                        </div>
                      </div>
                      <a
                        href={`tel:${contact.phone.replace(/\D/g, '')}`}
                        className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Chamar</span>
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Ambiente seguro, privado e protegido localmente.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Voltar ao Aconchego
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
