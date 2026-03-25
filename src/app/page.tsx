import { access } from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPinned,
  Phone,
  Route,
  TrainFront,
  Wallet,
} from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { CountdownPanel } from "@/components/countdown-panel";
import { PhotoGallery } from "@/components/photo-gallery";
import { RsvpForm } from "@/components/rsvp-form";
import { SectionNav } from "@/components/section-nav";
import { getInvitationViewModel, type InvitationViewModel } from "@/lib/invitation";

export const dynamic = "force-dynamic";

const HERO_IMAGE_PATH = "/hero-main.jpg";

async function hasPublicAsset(assetPath: string) {
  try {
    await access(path.join(process.cwd(), "public", assetPath.replace(/^\//, "")));
    return true;
  } catch {
    return false;
  }
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="section-heading">
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      <p className="section-description">{description}</p>
    </div>
  );
}

function HeroImage({
  hasHeroImage,
  invitation,
}: {
  hasHeroImage: boolean;
  invitation: InvitationViewModel;
}) {
  if (!hasHeroImage) {
    return (
      <div className="hero-fallback">
        <p className="section-eyebrow">Hero image</p>
        <p className="hero-fallback__title">{invitation.heroMoodTitle}</p>
        <p className="hero-fallback__description">
          대표 사진을 `public/hero-main.jpg`에 추가하면 첫 화면에서 바로 보여드립니다.
        </p>
      </div>
    );
  }

  return (
    <figure className="hero-image">
      <div className="hero-image__frame">
        <Image
          src={HERO_IMAGE_PATH}
          alt={`${invitation.groomName}와 ${invitation.brideName}의 웨딩 사진`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 34rem"
          className="object-cover"
        />
      </div>
    </figure>
  );
}

function Hero({
  invitation,
  hasHeroImage,
}: {
  invitation: InvitationViewModel;
  hasHeroImage: boolean;
}) {
  return (
    <section className="section-shell px-5 pt-5">
      <div className="hero-shell">
        <HeroImage invitation={invitation} hasHeroImage={hasHeroImage} />

        <div className="hero-copy">
          <p className="hero-kicker">Wedding invitation</p>
          <p className="hero-date">{invitation.scheduleSummary}</p>
          <h1 className="hero-title">
            <span>{invitation.groomName}</span>
            <span className="hero-title__ampersand">&</span>
            <span>{invitation.brideName}</span>
          </h1>
          <p className="hero-description">{invitation.subtitle}</p>
        </div>

        <div className="hero-meta">
          <div className="hero-meta__item">
            <CalendarDays className="h-4 w-4" />
            <div>
              <p className="hero-meta__label">예식 일시</p>
              <p className="hero-meta__value">{invitation.ceremonyLabel}</p>
            </div>
          </div>
          <div className="hero-meta__item">
            <MapPinned className="h-4 w-4" />
            <div>
              <p className="hero-meta__label">예식 장소</p>
              <p className="hero-meta__value">
                {invitation.venueName}
                {invitation.venueFloor ? ` · ${invitation.venueFloor}` : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InvitationIntro({
  invitation,
}: {
  invitation: InvitationViewModel;
}) {
  return (
    <section id="invitation" className="section-shell section-block px-5">
      <SectionHeading
        eyebrow="Invitation"
        title={invitation.welcomeTitle}
        description="첫 인상은 사진이 맡고, 초대말은 더 차분한 리듬으로 읽히도록 다시 정리했습니다."
      />

      <div className="editorial-copy">
        <p className="editorial-copy__title">{invitation.title}</p>
        <p className="editorial-copy__body">{invitation.welcomeMessage}</p>
        {invitation.hostMessage ? (
          <blockquote className="editorial-quote">{invitation.hostMessage}</blockquote>
        ) : null}
      </div>
    </section>
  );
}

function ScheduleAndLocation({
  invitation,
}: {
  invitation: InvitationViewModel;
}) {
  return (
    <section id="schedule" className="section-shell section-block px-5">
      <SectionHeading
        eyebrow="Schedule"
        title="예식 안내"
        description="날짜와 위치, 길찾기와 교통 팁을 한 흐름 안에서 빠르게 확인할 수 있게 정리했습니다."
      />

      <CountdownPanel targetDate={invitation.ceremonyAt} />

      <div id="location" className="fact-list mt-8">
        <div className="fact-row">
          <div className="fact-row__icon">
            <Clock3 className="h-4 w-4" />
          </div>
          <div className="fact-row__content">
            <p className="fact-row__label">Ceremony</p>
            <p className="fact-row__title">{invitation.ceremonyLabel}</p>
          </div>
        </div>

        <div className="fact-row">
          <div className="fact-row__icon">
            <MapPinned className="h-4 w-4" />
          </div>
          <div className="fact-row__content">
            <p className="fact-row__label">Venue</p>
            <p className="fact-row__title">
              {invitation.venueName}
              {invitation.venueFloor ? ` · ${invitation.venueFloor}` : ""}
            </p>
            <p className="fact-row__detail">
              {invitation.address}
              {invitation.addressDetail ? (
                <>
                  <br />
                  {invitation.addressDetail}
                </>
              ) : null}
            </p>
          </div>
        </div>
      </div>

      <div className="action-row mt-8">
        <a
          href={invitation.mapLinks.naver}
          target="_blank"
          rel="noreferrer"
          className="primary-button"
        >
          네이버지도로 길찾기
        </a>
        <CopyButton value={invitation.address} label="주소 복사" />
      </div>

      <details className="inline-disclosure mt-4">
        <summary className="inline-disclosure__summary">
          <span>다른 지도 앱 보기</span>
          <ChevronRight className="inline-disclosure__chevron h-4 w-4" />
        </summary>
        <div className="action-row mt-4">
          <a
            href={invitation.mapLinks.kakao}
            target="_blank"
            rel="noreferrer"
            className="secondary-button"
          >
            카카오맵
          </a>
          <a
            href={invitation.mapLinks.tmap}
            target="_blank"
            rel="noreferrer"
            className="secondary-button"
          >
            티맵
          </a>
        </div>
      </details>

      <div className="narrative-list mt-8">
        <div className="narrative-item">
          <div className="narrative-item__title">
            <Route className="h-4 w-4" />
            길안내
          </div>
          <p className="narrative-item__body">{invitation.directions}</p>
        </div>

        <div className="narrative-item">
          <div className="narrative-item__title">
            <TrainFront className="h-4 w-4" />
            교통 팁
          </div>
          <p className="narrative-item__body">{invitation.transitTips}</p>
        </div>
      </div>
    </section>
  );
}

function GallerySection({
  invitation,
}: {
  invitation: InvitationViewModel;
}) {
  if (!invitation.galleryPhotos.length) {
    return null;
  }

  return (
    <section id="gallery" className="section-shell section-block px-5">
      <SectionHeading
        eyebrow="Gallery"
        title="웨딩 갤러리"
        description="사진을 가볍게 둘러본 뒤, 터치해서 전체 화면으로 넘겨보실 수 있게 구성했습니다."
      />
      <PhotoGallery photos={invitation.galleryPhotos} />
    </section>
  );
}

function AdditionalInfoSection({
  invitation,
}: {
  invitation: InvitationViewModel;
}) {
  return (
    <section className="section-shell section-block px-5">
      <SectionHeading
        eyebrow="More"
        title="추가 안내"
        description="연락처, 계좌, 자주 묻는 안내는 필요한 분들만 펼쳐보실 수 있게 한곳에 모았습니다."
      />

      <div className="accordion-list mt-8">
        <details className="accordion-row">
          <summary className="accordion-row__summary">
            <div>
              <p className="accordion-row__eyebrow">Contact</p>
              <p className="accordion-row__title">연락처 안내</p>
            </div>
            <ChevronRight className="accordion-row__chevron h-4 w-4" />
          </summary>
          <div className="accordion-row__content">
            <div className="detail-list">
              {invitation.contactCards.map((contact) => (
                <a
                  key={contact.label}
                  href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                  className="detail-item"
                >
                  <div className="detail-item__icon">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="detail-item__content">
                    <p className="detail-item__label">{contact.label}</p>
                    <p className="detail-item__title">{contact.name}</p>
                    <p className="detail-item__meta">
                      {contact.relation} · {contact.phone}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </details>

        <details className="accordion-row">
          <summary className="accordion-row__summary">
            <div>
              <p className="accordion-row__eyebrow">Gift</p>
              <p className="accordion-row__title">마음 전하실 곳</p>
            </div>
            <ChevronRight className="accordion-row__chevron h-4 w-4" />
          </summary>
          <div className="accordion-row__content">
            <div className="detail-list">
              {invitation.giftAccounts.map((account) => (
                <div key={account.accountNumber} className="detail-item">
                  <div className="detail-item__icon">
                    <Wallet className="h-4 w-4" />
                  </div>
                  <div className="detail-item__content">
                    <p className="detail-item__label">{account.bank}</p>
                    <p className="detail-item__title">{account.accountHolder}</p>
                    <p className="detail-item__meta">{account.accountNumber}</p>
                  </div>
                  <CopyButton value={account.accountNumber} label="복사" className="shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </details>

        <details className="accordion-row">
          <summary className="accordion-row__summary">
            <div>
              <p className="accordion-row__eyebrow">FAQ</p>
              <p className="accordion-row__title">자주 묻는 안내</p>
            </div>
            <ChevronRight className="accordion-row__chevron h-4 w-4" />
          </summary>
          <div className="accordion-row__content">
            <div className="faq-list">
              {invitation.faqItems.map((item) => (
                <div key={item.id} className="faq-item">
                  <p className="faq-item__question">{item.question}</p>
                  <p className="faq-item__answer">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}

export default async function Home() {
  const invitation = await getInvitationViewModel();

  if (!invitation) {
    return (
      <main className="section-shell flex min-h-screen items-center px-5 py-16">
        <div className="empty-state w-full">
          <p className="section-eyebrow">Setup needed</p>
          <h1 className="empty-state__title">청첩장 데이터가 아직 없습니다.</h1>
          <p className="empty-state__body">
            `yarn db:up`, `yarn db:migrate --name init`, `yarn db:seed` 순서로
            실행하면 첫 화면이 채워집니다.
          </p>
        </div>
      </main>
    );
  }

  const hasHeroImage = await hasPublicAsset(HERO_IMAGE_PATH);
  const quickLinks = [
    { href: "#invitation", label: "초대말" },
    { href: "#schedule", label: "예식안내" },
    ...(invitation.galleryPhotos.length ? [{ href: "#gallery", label: "사진" }] : []),
    { href: "#rsvp", label: "RSVP" },
  ];

  return (
    <main className="flex-1 pb-20">
      <Hero invitation={invitation} hasHeroImage={hasHeroImage} />
      <SectionNav links={quickLinks} />
      <InvitationIntro invitation={invitation} />
      <ScheduleAndLocation invitation={invitation} />
      <GallerySection invitation={invitation} />
      <section id="rsvp" className="section-shell section-block px-5">
        <SectionHeading
          eyebrow="RSVP"
          title="참석 여부를 알려주세요"
          description="입력은 단순하게 유지하고, 마지막까지 편하게 작성할 수 있도록 시각적 무게를 줄였습니다."
        />
        <div className="mt-8">
          <RsvpForm invitationId={invitation.id} />
        </div>
      </section>
      <AdditionalInfoSection invitation={invitation} />
    </main>
  );
}
