'use client';

import { useEffect, useRef } from 'react';

const STEP_MS = 95;
const FINISH_DELAY_MS = 700;

export default function KidsPickerButton() {
  const timerRef = useRef<number | null>(null);
  const clearRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (clearRef.current) window.clearTimeout(clearRef.current);
    };
  }, []);

  const clearActiveCards = () => {
    document
      .querySelectorAll<HTMLElement>('[data-kids-game-card="true"]')
      .forEach((card) => card.classList.remove('kids-game-pick-active'));
  };

  const handleClick = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (clearRef.current) window.clearTimeout(clearRef.current);

    const grid = document.getElementById('kids-games');
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>('#kids-games [data-kids-game-card="true"]')
    );

    grid?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    clearActiveCards();

    if (cards.length === 0) return;

    let index = 0;
    cards[0].classList.add('kids-game-pick-active');

    timerRef.current = window.setInterval(() => {
      cards[index]?.classList.remove('kids-game-pick-active');
      index += 1;

      if (index >= cards.length) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        timerRef.current = null;
        clearRef.current = window.setTimeout(clearActiveCards, FINISH_DELAY_MS);
        return;
      }

      cards[index].classList.add('kids-game-pick-active');
    }, STEP_MS);
  };

  return (
    <button type="button" className="kids-play-button" onClick={handleClick}>
      Pick your games!
    </button>
  );
}
