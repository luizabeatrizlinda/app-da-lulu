import confetti from 'canvas-confetti';

// Gentle web audio chimes for positive feedback without needing external assets
class SoundPlayer {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Gentle chime chord (marimba/harp-like soft sine wave)
  playChime(type: 'success' | 'soothe' | 'star' = 'success') {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      let notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Bright gentle chord)
      
      if (type === 'soothe') {
        notes = [329.63, 392.00, 440.00, 523.25]; // E4, G4, A4, C5 (Calming mellow chord)
      } else if (type === 'star') {
        notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6 (Sparkling reward)
      }

      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0, now + index * 0.08);
        gain.gain.linearRampToValueAtTime(0.08, now + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.95);
      });
    } catch {
      // Audio playback might be restricted if no user interaction yet, ignore safely
    }
  }
}

export const soundManager = new SoundPlayer();

// Soft pastel confetti
export function triggerPastelConfetti() {
  try {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#A7D7C5', '#FFD1DC', '#FFEAA7', '#D5EEFF', '#E2D4F0'],
      disableForReducedMotion: true,
    });
  } catch {
    // Ignore if not supported
  }
}

export function triggerStarReward() {
  soundManager.playChime('star');
  triggerPastelConfetti();
}
