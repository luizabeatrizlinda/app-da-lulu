import React, { useRef, useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import { db } from '../../services/storage';
import { triggerStarReward } from '../../utils/feedback';
import { ArrowLeft, Eraser, RotateCcw, Save, Sparkles, Palette, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface DrawingJournalProps {
  currentUser: UserProfile;
  onBack: () => void;
}

const PASTEL_PALETTE = [
  { name: 'Céu Calmo', color: '#64B5F6' },
  { name: 'Folha Suave', color: '#81C784' },
  { name: 'Sol Dourado', color: '#FFD54F' },
  { name: 'Pétala Rosa', color: '#F06292' },
  { name: 'Lavanda', color: '#BA68C8' },
  { name: 'Terra Gentil', color: '#A1887F' },
  { name: 'Carvão Macio', color: '#455A64' },
];

export const DrawingJournal: React.FC<DrawingJournalProps> = ({
  currentUser,
  onBack,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState(PASTEL_PALETTE[0].color);
  const [brushSize, setBrushSize] = useState<number>(6);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawingTitle, setDrawingTitle] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Initial fill with soft clean background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else if ('clientX' in e) {
      return {
        x: (e as React.MouseEvent).clientX - rect.left,
        y: (e as React.MouseEvent).clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.strokeStyle = isEraser ? '#FFFFFF' : selectedColor;
    ctx.lineWidth = isEraser ? brushSize * 3 : brushSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  const handleSaveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');

    db.addMood({
      childId: currentUser.id,
      childName: currentUser.nickname || currentUser.name,
      timestamp: new Date().toISOString(),
      emotion: 'calm',
      intensity: 3,
      tags: ['Expressão Artística', 'Diário do Coração'],
      note: drawingTitle.trim() ? `Desenho: ${drawingTitle}` : 'Desenho livre no Diário do Coração',
      drawingDataUrl: dataUrl,
      isAlertTriggered: false,
      reviewedByProfessional: false,
    });

    triggerStarReward();
    setIsSaved(true);

    db.unlockAchievement(
      currentUser.id,
      'Pequeno Artista do Coração',
      'Expressou seus sentimentos em cores e formas no Diário do Coração.',
      '🎨',
      'journal'
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Back button & header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-emerald-50 text-slate-600 hover:text-slate-800 text-xs font-bold border border-slate-200/80 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
        <span className="text-xs font-bold text-teal-800 bg-teal-100/70 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-teal-600" />
          Diário de Desenho & Sentimentos
        </span>
      </div>

      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-child text-xl font-bold text-slate-800">
              Desenhe o que você está sentindo
            </h3>
            <p className="text-xs text-slate-500">
              Às vezes não existem palavras, mas as cores ajudam o coração a respirar.
            </p>
          </div>

          <input
            type="text"
            value={drawingTitle}
            onChange={(e) => setDrawingTitle(e.target.value)}
            placeholder="Nome do seu desenho (opcional)"
            className="px-3.5 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-teal-500"
          />
        </div>

        {/* Toolbar: Colors, Eraser, Brush sizes */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {/* Color swatches */}
          <div className="flex items-center gap-1.5">
            {PASTEL_PALETTE.map((p) => (
              <button
                key={p.color}
                type="button"
                onClick={() => {
                  setSelectedColor(p.color);
                  setIsEraser(false);
                }}
                className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                  !isEraser && selectedColor === p.color ? 'scale-125 border-slate-800 shadow-xs' : 'border-white'
                }`}
                style={{ backgroundColor: p.color }}
                title={p.name}
              />
            ))}
          </div>

          {/* Tools & Brush size */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEraser(!isEraser)}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                isEraser ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Borracha</span>
            </button>

            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
              {[3, 6, 12].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setBrushSize(size)}
                  className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
                    brushSize === size ? 'bg-teal-100 text-teal-800' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span
                    className="rounded-full bg-current"
                    style={{ width: size, height: size }}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={clearCanvas}
              className="p-2 rounded-xl text-xs font-bold bg-white text-slate-500 hover:text-rose-600 border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
              title="Limpar folha"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          </div>
        </div>

        {/* The Interactive Canvas */}
        <div className="relative border-2 border-dashed border-emerald-200/90 rounded-2xl overflow-hidden bg-white touch-none">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-80 sm:h-96 cursor-crosshair block"
          />
        </div>

        {/* Save & Feedback bar */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500">
            {isSaved ? '✨ Desenho salvo com sucesso no seu diário!' : 'Seu desenho ficará guardado com carinho no seu diário.'}
          </p>

          <button
            onClick={handleSaveDrawing}
            id="btn-save-drawing"
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Desenho no Meu Diário</span>
          </button>
        </div>
      </div>
    </div>
  );
};
