"use client";

import { useState } from "react";

type CopyButtonProps = {
  value: string;
  label?: string;
  className?: string;
};

export function CopyButton({
  value,
  label = "복사",
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`min-h-12 rounded-full border border-[var(--line)] bg-white/80 px-4 text-sm font-medium text-[var(--foreground)] transition hover:bg-white ${className}`}
    >
      {copied ? "복사됨" : label}
    </button>
  );
}
