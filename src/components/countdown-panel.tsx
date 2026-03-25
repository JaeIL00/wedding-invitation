"use client";

import { useEffect, useMemo, useState } from "react";

function getCountdownParts(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isPassed: true };
  }

  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return { days, hours, minutes, isPassed: false };
}

export function CountdownPanel({ targetDate }: { targetDate: string }) {
  const [countdown, setCountdown] = useState(() => getCountdownParts(targetDate));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdownParts(targetDate));
    }, 60000);

    return () => window.clearInterval(timer);
  }, [targetDate]);

  const cards = useMemo(
    () => [
      { label: "Days", value: countdown.days },
      { label: "Hours", value: countdown.hours },
      { label: "Mins", value: countdown.minutes },
    ],
    [countdown.days, countdown.hours, countdown.minutes],
  );

  if (countdown.isPassed) {
    return (
      <div className="surface-card px-5 py-4 text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
          Wedding Day
        </p>
        <p className="mt-2 font-display text-3xl text-[var(--foreground)]">
          D-DAY
        </p>
      </div>
    );
  }

  return (
    <div className="surface-card grid grid-cols-3 gap-3 px-4 py-4 text-center">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-[1.5rem] bg-white/70 px-3 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
        >
          <p className="font-display text-3xl text-[var(--foreground)]">
            {String(card.value).padStart(2, "0")}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
            {card.label}
          </p>
        </div>
      ))}
    </div>
  );
}
