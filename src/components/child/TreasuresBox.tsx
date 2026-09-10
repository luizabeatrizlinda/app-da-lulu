import React, { useState, useEffect } from 'react';
import { UserProfile, TreasureItem } from '../../types';
import { db } from '../../services/storage';
import { triggerStarReward } from '../../utils/feedback';
import { ArrowLeft, Sparkles, Plus, Trash2, Heart, Gift, Smile, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TreasuresBoxProps {
  currentUser: UserProfile;
  onBack: () => void;
}

export const TreasuresBox: React.FC<TreasuresBoxProps> = ({
  currentUser,
  onBack,
}) => {
  const [treasures, setTreasures] = useState<TreasureItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TreasureItem['category']>('memory');
  const [description, setDescription] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🌟');

  useEffect(() => {
    setTreasures(db.getTreasures(currentUser.id));
  }, [currentUser.id]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTreasure = db.addTreasure({
      childId: currentUser.id,
      title: title.trim(),
      category,
      description: description.trim(),
      emoji: selectedEmoji,
    });

    setTreasures((prev) => [newTreasure, ...prev]);
    setIsAdding(false);
    setTitle('');
    setDescription('');
    triggerStarReward();

    db.unlockAchievement(
      currentUser.id,
      'Guardião de Tesouros',
      'Guardou uma lembrança ou pessoa querida no Baú de Coisas Boas.',
      '💎',
      'courage'
    );
  };

  const handleDelete = (id: string) => {
    db.deleteTreasure(id);
    setTreasures((prev) => prev.filter((t) => t.id !== id));
  };

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
        <span className="text-xs font-bold text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Gift className="w-3.5 h-3.5 text-amber-600" />
          Meu Baú de Coisas Boas
        </span>
      </div>

      {/* Intro Card */}
      <div className="bg-gradient-to-r from-amber-100/80 via-yellow-50 to-orange-100/70 rounded-3xl p-6 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-white/90 shadow-xs flex items-center justify-center text-3xl border border-amber-200 shrink-0">
            🧸
          </div>
          <div>
            <h3 className="font-child text-xl sm:text-2xl font-bold text-slate-800">
              Coisas que Aquecem Meu Coração
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-md">
              Aqui você guarda tudo o que te faz sorrir: seus bichinhos, pessoas favoritas, memórias felizes e motivos para ter esperança!
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          id="btn-add-treasure"
          className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Guardar Novo Tesouro</span>
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSave}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-md space-y-4"
          >
            <h4 className="font-child text-lg font-bold text-slate-800">
              O que você quer guardar no seu Baú?
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nome do Tesouro
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Meu gato Miau, O abraço do vovô, A praia com ondas calmas..."
                className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tipo de Tesouro
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TreasureItem['category'])}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  <option value="memory">Lembrança Feliz</option>
                  <option value="pet">Bichinho de Estimação</option>
                  <option value="person">Pessoa Especial</option>
                  <option value="place">Lugar Aconchegante</option>
                  <option value="phrase">Palavra / Frase que Acalma</option>
                  <option value="hobby">Brincadeira / Desenho Favorito</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Escolha um Símbolo
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {['🐶', '🐱', '🌈', '🍦', '🚲', '🏖️', '🎮', '🌻', '⭐', '🎈'].map((emo) => (
                    <button
                      key={emo}
                      type="button"
                      onClick={() => setSelectedEmoji(emo)}
                      className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-transform cursor-pointer ${
                        selectedEmoji === emo
                          ? 'bg-amber-100 border-2 border-amber-400 scale-110'
                          : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      {emo}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Por que isso faz seu coração ficar quentinho?
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Conte um pouquinho sobre esse tesouro..."
                className="w-full p-3 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
              >
                Guardar no Baú ✨
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Grid of Treasures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {treasures.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -3 }}
            className="bg-white rounded-3xl p-5 border border-amber-100/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl">
                  {item.emoji}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-slate-300 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                  title="Remover tesouro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h4 className="font-child text-lg font-bold text-slate-800 mt-3">
                {item.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                {item.description || 'Um momento muito especial guardado no coração.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span className="capitalize">{item.category}</span>
              <span>Lembrança Segura</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
