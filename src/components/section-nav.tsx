"use client";

import { useEffect, useState } from "react";

type SectionNavProps = {
  links: Array<{ href: string; label: string }>;
};

export function SectionNav({ links }: SectionNavProps) {
  const [activeHref, setActiveHref] = useState(links[0]?.href ?? "");

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.href.replace("#", "")))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) {
      return;
    }

    const syncActiveSection = () => {
      const triggerLine = window.innerHeight * 0.32;
      const currentSection =
        [...sections].reverse().find((section) => section.getBoundingClientRect().top <= triggerLine) ??
        sections[0];

      setActiveHref(`#${currentSection.id}`);
    };

    const observer = new IntersectionObserver(syncActiveSection, {
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0.1, 0.35, 0.6],
    });

    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", syncActiveSection, { passive: true });
    syncActiveSection();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", syncActiveSection);
    };
  }, [links]);

  return (
    <nav className="section-nav-shell" aria-label="청첩장 주요 섹션">
      <div className="section-shell px-4">
        <div className="section-nav">
          {links.map((link) => {
            const isActive = activeHref === link.href;

            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`section-nav__link ${isActive ? "section-nav__link--active" : ""}`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
