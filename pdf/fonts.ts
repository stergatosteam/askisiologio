'use client';
import { Font } from '@react-pdf/renderer';

let registered = false;

export function ensureFontsRegistered() {
  if (registered) return;
  Font.register({
    family: 'NotoSans',
    fonts: [
      { src: '/fonts/NotoSans-Regular.ttf' },
      { src: '/fonts/NotoSans-Bold.ttf', fontWeight: 'bold' },
    ],
  });
  registered = true;
}
