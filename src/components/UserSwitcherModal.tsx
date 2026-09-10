import React, { useState } from 'react';
import { UserProfile, Role } from '../types';
import { db } from '../services/storage';
import { X, Lock, UserPlus, Check, Sparkles, Shield, GraduationCap, HeartHandshake } from 'lucide-react';

interface UserSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
}

export const UserSwitcherModal: React.FC<UserSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  const users = db.getUsers();
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [newRole, setNewRole] = useState<Role>('child');
  const [newAvatar, setNewAvatar] = useState('🌟');
  const [newAge, setNewAge] = useState<number>(8);
  const [newTitle, setNewTitle] = useState('');
  const [newPin, setNewPin] = useState('1234');

  if (!isOpen) return null;

  const handleUserClick = (user: UserProfile) => {
    if (user.id === currentUser.id) {
      onClose();
      return;
    }

    // If target user is an adult (therapist, pedagogue, guardian) and has a PIN
    if (user.role !== 'child' && user.pin) {
      setSelectedUser(user);
      setPinInput('');
      setPinError(false);
    } else {
      // Direct switch for child profiles
      onSelectUser(user);
      onClose();
    }
  };

  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (selectedUser.pin === pinInput) {
      onSelectUser(selectedUser);
      setSelectedUser(null);
      onClose();
    } else {
      setPinError(true);
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newUser: UserProfile = {
      id: 'user_' + Date.now(),
      name: newName.trim(),
      nickname: newNickname.trim() || newName.trim().split(' ')[0],
      role: newRole,
      avatar: newAvatar,
      age: newRole === 'child' ? newAge : undefined,
      title: newTitle.trim() || (newRole === 'child' ? 'Pequeno Explorador' : 'Profissional de Cuidado'),
      pin: newRole !== 'child' ? newPin : undefined,
      assignedChildId: newRole !== 'child' ? 'child_leo' : undefined,
    };

    db.saveUser(newUser);
    onSelectUser(newUser);
    setIsCreating(false);
    onClose();
  };

  const roleLabel = (role: Role) => {
    switch (role) {
      case 'child':
        return { label: 'Criança (Explorador)', icon: <Sparkles className="w-3.5 h-3.5 text-emerald-600" />, badge: 'bg-emerald-100 text-emerald-800' };
      case 'therapist':
        return { label: 'Psicologia Clínica', icon: <Shield className="w-3.5 h-3.5 text-purple-600" />, badge: 'bg-purple-100 text-purple-800' };
      case 'pedagogue':
        return { label: 'Equipe Pedagógica', icon: <GraduationCap className="w-3.5 h-3.5 text-amber-600" />, badge: 'bg-amber-100 text-amber-800' };
      case 'guardian':
        return { label: 'Família / Responsável', icon: <HeartHandshake className="w-3.5 h-3.5 text-sky-600" />, badge: 'bg-sky-100 text-sky-800' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFDF9] rounded-3xl max-w-lg w-full border border-emerald-100 shadow-xl overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-100/90 via-teal-100/80 to-sky-100/80 px-6 py-5 border-b border-emerald-200/60 flex items-center justify-between">
          <div>
            <h2 className="font-child text-xl font-bold text-slate-800">
              {isCreating ? 'Cadastrar Novo Usuário' : selectedUser ? 'Acesso Seguro ao Perfil' : 'Perfis & Controle de Acesso'}
            </h2>
            <p className="text-xs text-slate-600">
              {isCreating
                ? 'Adicione uma nova criança ou profissional pedagógico/clínico'
                : selectedUser
                ? `Digite o PIN do perfil de ${selectedUser.nickname}`
                : 'Selecione quem está utilizando o Espaço Aconchego agora'}
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedUser(null);
              setIsCreating(false);
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {/* PIN Verification Step for Adult Profiles */}
          {selectedUser ? (
            <form onSubmit={handleConfirmPin} className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl border border-amber-200">
                  {selectedUser.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{selectedUser.name}</h4>
                  <p className="text-xs text-slate-500">{selectedUser.title}</p>
                  <span className="text-[11px] font-semibold text-amber-800">
                    Perfil com sigilo e monitoramento clínico
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Digite o PIN de Segurança (Padrão: 1234)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={6}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setPinError(false);
                    }}
                    placeholder="PIN numérico"
                    autoFocus
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-center text-lg tracking-widest font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                </div>
                {pinError && (
                  <p className="text-xs text-rose-600 font-bold mt-1.5">
                    PIN incorreto. (Dica de demonstração: use 1234)
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Confirmar Acesso
                </button>
              </div>
            </form>
          ) : isCreating ? (
            /* Creation Form */
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex: Clara Mendes"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Como prefere ser chamado?</label>
                  <input
                    type="text"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    placeholder="Ex: Clarinha"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Perfil de Acesso</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['child', 'therapist', 'pedagogue', 'guardian'] as Role[]).map((r) => {
                    const info = roleLabel(r);
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setNewRole(r)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                          newRole === r
                            ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-200'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {info.icon}
                        <span className="text-xs font-bold text-slate-800">{info.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {newRole === 'child' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Idade da Criança</label>
                  <input
                    type="number"
                    min={4}
                    max={17}
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Cargo / Especialidade</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ex: Psicólogo Escolar"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">PIN de Proteção</label>
                    <input
                      type="password"
                      maxLength={6}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono text-center"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Escolha um Mascote / Ícone</label>
                <div className="flex gap-2 flex-wrap">
                  {['🐰', '🦊', '🐻', '🐼', '🦁', '🦉', '🌟', '🌸', '👩‍⚕️', '📚'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewAvatar(emoji)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-transform cursor-pointer ${
                        newAvatar === emoji ? 'bg-teal-100 border-2 border-teal-500 scale-110' : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
                >
                  Salvar Cadastro
                </button>
              </div>
            </form>
          ) : (
            /* User List */
            <div className="space-y-4">
              <div className="space-y-2">
                {users.map((user) => {
                  const isCurrent = user.id === currentUser.id;
                  const info = roleLabel(user.role);
                  return (
                    <div
                      key={user.id}
                      onClick={() => handleUserClick(user)}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        isCurrent
                          ? 'bg-teal-50/80 border-teal-400 ring-2 ring-teal-200'
                          : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-100 to-sky-100 flex items-center justify-center text-2xl border border-emerald-200">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-800">{user.name}</h4>
                            {isCurrent && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-teal-600 text-white">
                                Ativo
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            {user.title || (user.age ? `${user.age} anos` : '')}
                          </p>
                          <span className={`inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.2 rounded-md ${info.badge}`}>
                            {info.label}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {user.role !== 'child' && (
                          <span className="p-1.5 rounded-lg bg-slate-100 text-slate-500" title="Protegido por PIN">
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {isCurrent ? (
                          <div className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-teal-700 hover:underline">
                            Entrar
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setIsCreating(true)}
                id="btn-add-new-user"
                className="w-full py-3 rounded-2xl border-2 border-dashed border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Cadastrar Novo Perfil (Criança ou Profissional)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
