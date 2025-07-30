// Audio utility for button feedback sounds
class AudioManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = true;

  constructor() {
    this.initializeSounds();
  }

  private initializeSounds() {
    // Create audio objects for different sounds
    // Using data URLs for simple beep sounds to avoid external dependencies
    const clickSound = this.createBeep(800, 50);
    const equalsSound = this.createBeep(1000, 100);
    const clearSound = this.createBeep(600, 100);
    const memorySound = this.createBeep(1200, 75);

    this.sounds = {
      click: clickSound,
      equals: equalsSound,
      clear: clearSound,
      memory: memorySound
    };
  }

  private createBeep(frequency: number, duration: number): HTMLAudioElement {
    // Create a simple beep using Web Audio API and convert to audio element
    try {
      // For production, you would load actual sound files
      // This creates a basic beep sound
      const audio = new Audio();
      audio.volume = 0.1; // Keep volume low
      
      // Generate a simple tone data URL
      const sampleRate = 44100;
      const samples = sampleRate * (duration / 1000);
      const buffer = new ArrayBuffer(samples * 2);
      const view = new DataView(buffer);
      
      for (let i = 0; i < samples; i++) {
        const sample = Math.sin(frequency * 2 * Math.PI * i / sampleRate) * 0.1;
        const intSample = Math.round(sample * 32767);
        view.setInt16(i * 2, intSample, true);
      }
      
      // Create a minimal WAV header and data
      const wavHeader = this.createWavHeader(samples, sampleRate);
      const wavBuffer = new ArrayBuffer(wavHeader.length + buffer.byteLength);
      const wavView = new Uint8Array(wavBuffer);
      wavView.set(wavHeader, 0);
      wavView.set(new Uint8Array(buffer), wavHeader.length);
      
      const blob = new Blob([wavBuffer], { type: 'audio/wav' });
      audio.src = URL.createObjectURL(blob);
      
      return audio;
    } catch (error) {
      // Fallback to silent audio if generation fails
      return new Audio();
    }
  }

  private createWavHeader(samples: number, sampleRate: number): Uint8Array {
    const header = new ArrayBuffer(44);
    const view = new DataView(header);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples * 2, true);
    
    return new Uint8Array(header);
  }

  play(soundType: string) {
    if (!this.enabled || !this.sounds[soundType]) return;
    
    try {
      const sound = this.sounds[soundType].cloneNode() as HTMLAudioElement;
      sound.volume = 0.05; // Very quiet
      sound.play().catch(() => {
        // Ignore play errors (user interaction required, etc.)
      });
    } catch (error) {
      // Silently fail if audio can't play
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

const audioManager = new AudioManager();

export const playSound = (type: string) => {
  audioManager.play(type);
};

export const setSoundEnabled = (enabled: boolean) => {
  audioManager.setEnabled(enabled);
};

export const isSoundEnabled = () => {
  return audioManager.isEnabled();
};