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

function formatCeremonySummary(targetDate: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(new Date(targetDate));
}

export function CountdownPanel({ targetDate }: { targetDate: string }) {
  const [countdown, setCountdown] = useState(() => getCountdownParts(targetDate));
  const ceremonySummary = useMemo(() => formatCeremonySummary(targetDate), [targetDate]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdownParts(targetDate));
    }, 60000);

    return () => window.clearInterval(timer);
  }, [targetDate]);

  const stats = [
    { label: "Days", value: countdown.days },
    { label: "Hours", value: countdown.hours },
    { label: "Mins", value: countdown.minutes },
  ];

  return (
    <div className="countdown-panel mt-8">
      <div className="countdown-panel__header">
        <p className="section-eyebrow">Countdown</p>
        <p className="countdown-panel__status">
          {countdown.isPassed ? "D-DAY" : `D-${countdown.days}`}
        </p>
      </div>

      <p className="countdown-panel__summary">
        {countdown.isPassed ? "오늘이 예식일입니다." : `${ceremonySummary} 예식까지`}
      </p>

      <div className="countdown-panel__stats">
        {stats.map((stat) => (
          <div key={stat.label} className="countdown-panel__stat">
            <p className="countdown-panel__value">{String(stat.value).padStart(2, "0")}</p>
            <p className="countdown-panel__label">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
