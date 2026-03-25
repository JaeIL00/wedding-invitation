"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type GalleryPhoto = {
  src: string;
  alt: string;
  title?: string;
  description?: string;
};

type PhotoGalleryProps = {
  photos: GalleryPhoto[];
};

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
        return;
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => {
          if (current === null) {
            return current;
          }

          return current === 0 ? photos.length - 1 : current - 1;
        });
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) => {
          if (current === null) {
            return current;
          }

          return current === photos.length - 1 ? 0 : current + 1;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, photos.length]);

  useEffect(() => {
    if (activeIndex === null || !scrollerRef.current) {
      return;
    }

    const scroller = scrollerRef.current;
    const slideWidth = scroller.clientWidth;
    scroller.scrollTo({
      left: slideWidth * activeIndex,
      behavior: "smooth",
    });
  }, [activeIndex]);

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller || activeIndex === null) {
      return;
    }

    const handleScroll = () => {
      const nextIndex = Math.min(
        photos.length - 1,
        Math.max(0, Math.round(scroller.scrollLeft / Math.max(scroller.clientWidth, 1))),
      );

      if (nextIndex !== activeIndex) {
        setActiveIndex(nextIndex);
      }
    };

    scroller.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scroller.removeEventListener("scroll", handleScroll);
    };
  }, [activeIndex, photos.length]);

  function openLightbox(index: number) {
    setActiveIndex(index);
  }

  function closeLightbox() {
    setActiveIndex(null);
  }

  function showPrevious() {
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return current === 0 ? photos.length - 1 : current - 1;
    });
  }

  function showNext() {
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return current === photos.length - 1 ? 0 : current + 1;
    });
  }

  if (!photos.length) {
    return null;
  }

  const currentIndex = activeIndex ?? 0;
  const activePhoto = activeIndex === null ? null : photos[currentIndex];

  return (
    <>
      <div className="photo-gallery-grid mt-8">
        {photos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => openLightbox(index)}
            className="photo-gallery-card"
            aria-label={`${index + 1}번째 사진 크게 보기`}
          >
            <div className="photo-gallery-card__image">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 50vw, 240px"
                className="object-cover"
              />
            </div>
          </button>
        ))}
      </div>

      {activePhoto ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="웨딩 사진 크게 보기"
        >
          <div className="lightbox__topbar">
            <p className="lightbox__counter">
              {currentIndex + 1} / {photos.length}
            </p>
            <button
              type="button"
              onClick={closeLightbox}
              className="lightbox__icon-button"
              aria-label="갤러리 닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={scrollerRef} className="lightbox__scroller">
            {photos.map((photo) => (
              <figure key={photo.src} className="lightbox__slide">
                <div className="lightbox__image-wrap">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              </figure>
            ))}
          </div>

          {photos.length > 1 ? (
            <>
              <button
                type="button"
                onClick={showPrevious}
                className="lightbox__nav lightbox__nav--left"
                aria-label="이전 사진"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={showNext}
                className="lightbox__nav lightbox__nav--right"
                aria-label="다음 사진"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}

          {activePhoto.title || activePhoto.description ? (
            <div className="lightbox__caption">
              {activePhoto.title ? <p className="lightbox__title">{activePhoto.title}</p> : null}
              {activePhoto.description ? (
                <p className="lightbox__description">{activePhoto.description}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
