// PHOTOS — add a photo by dropping the file in public/photos/ and adding a line here.
// src: '/photos/yourfile.jpg'  |  emoji fallback shows if file missing
export interface Photo {
  src: string;
  title: string;
  tag: string;
  emoji: string;
}

export const PHOTOS: Photo[] = [
  { src: '/og-image.png', title: 'Site banner', tag: 'Site', emoji: '🌐' },
  { src: '/qr-jay.png', title: 'Scan me', tag: 'Site', emoji: '📱' },
  { src: '', title: 'My gaming setup', tag: 'Setup', emoji: '🎮' },
  { src: '', title: 'FF Max squad wipe', tag: 'Gaming', emoji: '🔥' },
  { src: '', title: 'FC Mobile team', tag: 'Gaming', emoji: '⚽' },
  { src: '', title: 'Winter Arc tracker', tag: 'Life', emoji: '📓' },
  { src: '', title: 'Night sky from the terrace', tag: 'Life', emoji: '🌙' },
  { src: '', title: 'Desk chaos while coding', tag: 'Code', emoji: '💻' },
];