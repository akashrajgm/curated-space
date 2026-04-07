import { Howl, Howler } from 'howler';

// Using extremely lightweight, ultra-high quality mixkit fragments explicitly targeting spatial UI actions
export const snapSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'],
  volume: 0.15,
});

export const clickSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'],
  volume: 0.35,
});

export const toggleMute = (isMuted) => {
  Howler.mute(isMuted);
};
