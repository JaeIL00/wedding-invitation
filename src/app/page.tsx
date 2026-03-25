import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Heart,
  ImageIcon,
  MapPinned,
  Phone,
  Route,
  Sparkles,
  TrainFront,
  Wallet,
} from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { CountdownPanel } from "@/components/countdown-panel";
import { RsvpForm } from "@/components/rsvp-form";
import { getInvitationViewModel } from "@/lib/invitation";

export const dynamic = "force-dynamic";

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
    <div className="mb-5 px-1">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-[1.85rem] leading-tight text-[var(--foreground)]">
        {title}
      </h2>
      <p className="mt-3 text-[0.95rem] leading-7 text-[var(--muted)]">
        {description}
      </p>
    </div>
  );
}

function getGalleryLayoutClass(layoutType: string) {
  switch (layoutType) {
    case "HERO":
      return "gallery-hero md:col-span-2";
    case "WIDE":
      return "gallery-wide md:col-span-2";
    case "TALL":
      return "gallery-tall";
    default:
      return "gallery-grid";
  }
}

export default async function Home() {
  const invitation = await getInvitationViewModel();

  if (!invitation) {
    return (
      <main className="section-shell flex min-h-screen items-center px-5 py-16">
        <div className="surface-card w-full px-6 py-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Setup Needed
          </p>
          <h1 className="mt-3 font-display text-3xl">청첩장 데이터가 아직 없습니다.</h1>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            `yarn db:up`, `yarn db:migrate --name init`, `yarn db:seed` 순서로
            실행하면 첫 화면이 채워집니다.
          </p>
        </div>
      </main>
    );
  }

  const quickLinks = [
    { href: "#invitation", label: "초대말" },
    { href: "#schedule", label: "예식안내" },
    { href: "#location", label: "오시는 길" },
    { href: "#gallery", label: "사진" },
    { href: "#rsvp", label: "RSVP" },
  ];

  return (
    <main className="relative flex-1 pb-28">
      <section className="section-shell px-5 pt-6">
        <div className="surface-card overflow-hidden px-5 pb-6 pt-6">
          <div className="flex items-center justify-between">
            <span className="gradient-tag">
              <Sparkles className="h-3.5 w-3.5" />
              WEDDING DAY
            </span>
            <span className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
              Mobile Invitation
            </span>
          </div>

          <p className="mt-6 text-sm leading-7 text-[var(--muted)]">
            {invitation.subtitle}
          </p>

          <h1 className="mt-4 font-display text-[2.65rem] leading-none text-[var(--foreground)]">
            {invitation.groomName}
            <span className="mx-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-xl text-[var(--accent-strong)]">
              &
            </span>
            {invitation.brideName}
          </h1>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-[1.4rem] bg-white/75 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                Date
              </p>
              <p className="mt-2 text-sm font-semibold leading-6">
                {invitation.scheduleSummary}
              </p>
            </div>
            <div className="rounded-[1.4rem] bg-white/75 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                Place
              </p>
              <p className="mt-2 text-sm font-semibold leading-6">
                {invitation.venueName}
                {invitation.venueFloor ? ` · ${invitation.venueFloor}` : ""}
              </p>
            </div>
          </div>

          <div className="hero-placeholder mt-5 px-5 py-5">
            <div className="soft-pill inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[var(--foreground)]">
              <ImageIcon className="h-4 w-4 text-[var(--accent-strong)]" />
              사진 placeholder
            </div>
            <div className="absolute inset-x-5 bottom-5 rounded-[1.5rem] bg-white/70 p-4 backdrop-blur">
              <p className="font-display text-xl text-[var(--foreground)]">
                {invitation.heroMoodTitle}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {invitation.heroMoodDescription}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <a
              href="#rsvp"
              className="flex min-h-12 items-center justify-center rounded-full bg-[var(--foreground)] px-5 text-sm font-semibold text-white"
            >
              참석 회신하기
            </a>
            <a
              href="#location"
              className="flex min-h-12 items-center justify-center rounded-full border border-[var(--line)] bg-white/80 px-5 text-sm font-semibold text-[var(--foreground)]"
            >
              길찾기 보기
            </a>
          </div>
        </div>
      </section>

      <nav className="sticky top-0 z-20 mt-5 border-y border-white/60 bg-[rgba(255,250,242,0.82)] backdrop-blur">
        <div className="section-shell flex gap-2 overflow-x-auto px-5 py-3">
          {quickLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="soft-pill flex min-h-12 shrink-0 items-center px-4 text-sm font-medium text-[var(--foreground)]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      <section id="invitation" className="section-shell px-5 pt-8">
        <SectionHeading
          eyebrow="Invitation"
          title={invitation.welcomeTitle}
          description="예식에 오시는 분들이 첫 화면부터 기분 좋게 읽을 수 있도록 문장을 짧고 따뜻하게 배치했습니다."
        />
        <div className="surface-card px-5 py-6">
          <p className="font-display text-2xl leading-10 text-[var(--foreground)]">
            {invitation.title}
          </p>
          <p className="mt-5 text-[0.98rem] leading-8 text-[var(--muted)]">
            {invitation.welcomeMessage}
          </p>
          {invitation.hostMessage ? (
            <div className="mt-5 rounded-[1.5rem] bg-white/70 p-4">
              <p className="text-sm leading-7 text-[var(--muted)]">
                {invitation.hostMessage}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section id="schedule" className="section-shell px-5 pt-9">
        <SectionHeading
          eyebrow="Schedule"
          title="예식 일정"
          description="모바일에서 가장 먼저 확인하는 일정과 장소 정보를 한 영역에 모았습니다."
        />
        <CountdownPanel targetDate={invitation.ceremonyAt} />
        <div className="mt-4 grid gap-3">
          <div className="surface-card flex gap-4 px-5 py-4">
            <div className="mt-1 rounded-full bg-white/75 p-3 text-[var(--accent-strong)]">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                Ceremony
              </p>
              <p className="mt-2 text-sm font-semibold leading-6">
                {invitation.ceremonyLabel}
              </p>
            </div>
          </div>
          <div className="surface-card flex gap-4 px-5 py-4">
            <div className="mt-1 rounded-full bg-white/75 p-3 text-[var(--accent-strong)]">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                Place
              </p>
              <p className="mt-2 text-sm font-semibold leading-6">
                {invitation.venueName}
                {invitation.venueFloor ? ` · ${invitation.venueFloor}` : ""}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="location" className="section-shell px-5 pt-9">
        <SectionHeading
          eyebrow="Location"
          title="오시는 길"
          description="임베드 지도 대신 주소 복사와 외부 지도 앱 이동을 바로 제공해 접근성을 높였습니다."
        />
        <div className="surface-card px-5 py-5">
          <div className="flex gap-4">
            <div className="mt-1 rounded-full bg-white/75 p-3 text-[var(--accent-strong)]">
              <MapPinned className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-6">
                {invitation.venueName}
                {invitation.venueFloor ? ` · ${invitation.venueFloor}` : ""}
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                {invitation.address}
                <br />
                {invitation.addressDetail}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <CopyButton value={invitation.address} label="주소 복사" />
            <a
              href={invitation.mapLinks.naver}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-12 items-center rounded-full border border-[var(--line)] bg-white/80 px-4 text-sm font-medium text-[var(--foreground)]"
            >
              네이버지도
            </a>
            <a
              href={invitation.mapLinks.kakao}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-12 items-center rounded-full border border-[var(--line)] bg-white/80 px-4 text-sm font-medium text-[var(--foreground)]"
            >
              카카오맵
            </a>
            <a
              href={invitation.mapLinks.tmap}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-12 items-center rounded-full border border-[var(--line)] bg-white/80 px-4 text-sm font-medium text-[var(--foreground)]"
            >
              티맵
            </a>
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-[1.5rem] bg-white/70 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Route className="h-4 w-4 text-[var(--accent-strong)]" />
                길안내
              </div>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                {invitation.directions}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-white/70 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <TrainFront className="h-4 w-4 text-[var(--accent-strong)]" />
                교통 팁
              </div>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                {invitation.transitTips}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="section-shell px-5 pt-9">
        <SectionHeading
          eyebrow="Gallery"
          title="사진 자리 미리보기"
          description="실제 사진 업로드 전에는 레이아웃과 분위기 설명만 유지합니다. 이미지 파일을 추가하면 같은 슬롯에 교체할 수 있습니다."
        />
        <div className="grid gap-3 md:grid-cols-2">
          {invitation.galleryItems.map((item) => (
            <article
              key={item.id}
              className={`gallery-card ${getGalleryLayoutClass(item.layoutType)}`}
              style={{ ["--card-accent" as string]: item.accentColor }}
            >
              <span className="soft-pill inline-flex min-h-10 items-center px-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]">
                {item.layoutType}
              </span>
              <h3 className="mt-6 font-display text-2xl leading-tight text-[var(--foreground)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="contacts" className="section-shell px-5 pt-9">
        <SectionHeading
          eyebrow="Contact"
          title="연락처 안내"
          description="바로 연락이 필요한 손님을 위해 신랑, 신부, 가족 연락처를 카드형으로 정리합니다."
        />
        <div className="grid gap-3">
          {invitation.contactCards.map((contact) => (
            <div key={contact.label} className="surface-card px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    {contact.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                    {contact.name}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {contact.relation}
                  </p>
                </div>
                <div className="rounded-full bg-white/75 p-3 text-[var(--accent-strong)]">
                  <Phone className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-sm font-medium text-[var(--foreground)]">
                {contact.phone}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="gift" className="section-shell px-5 pt-9">
        <SectionHeading
          eyebrow="Gift"
          title="마음 전하실 곳"
          description="계좌 안내는 과하게 전면에 두지 않고, 필요한 분들만 바로 확인할 수 있게 차분하게 배치합니다."
        />
        <div className="grid gap-3">
          {invitation.giftAccounts.map((account) => (
            <div key={account.accountNumber} className="surface-card px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    {account.bank}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                    {account.accountHolder}
                  </p>
                  <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                    {account.accountNumber}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="rounded-full bg-white/75 p-3 text-[var(--accent-strong)]">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <CopyButton value={account.accountNumber} label="계좌 복사" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="section-shell px-5 pt-9">
        <SectionHeading
          eyebrow="FAQ"
          title="자주 묻는 안내"
          description="모바일 청첩장에서 이탈을 줄이기 위해 문의가 많은 항목은 접기/펼치기 형태로 제공합니다."
        />
        <div className="space-y-3">
          {invitation.faqItems.map((item) => (
            <details key={item.id} className="surface-card px-5 py-4">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-[var(--foreground)]">
                {item.question}
                <ChevronRight className="h-5 w-5 text-[var(--muted)]" />
              </summary>
              <p className="pt-3 text-sm leading-7 text-[var(--muted)]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section id="rsvp" className="section-shell px-5 pb-6 pt-9">
        <SectionHeading
          eyebrow="RSVP"
          title="참석 여부를 알려주세요"
          description="이름, 연락처, 참석 여부만 빠르게 입력할 수 있게 구성하고, 필요 정보만 추가로 받도록 단순화했습니다."
        />
        <RsvpForm invitationId={invitation.id} />
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 px-5">
        <div className="section-shell">
          <div className="surface-card pointer-events-auto flex items-center gap-3 px-4 py-3">
            <a
              href="#rsvp"
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-4 text-sm font-semibold text-white"
            >
              <Heart className="h-4 w-4" />
              RSVP
            </a>
            <a
              href={invitation.mapLinks.naver}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white/80 px-4 text-sm font-semibold text-[var(--foreground)]"
            >
              <MapPinned className="h-4 w-4" />
              길찾기
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
