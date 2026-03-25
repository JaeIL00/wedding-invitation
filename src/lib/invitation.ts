import { z } from "zod";
import { prisma } from "@/lib/prisma";

const contactCardSchema = z.object({
  label: z.string(),
  name: z.string(),
  relation: z.string(),
  phone: z.string(),
});

const giftAccountSchema = z.object({
  bank: z.string(),
  accountHolder: z.string(),
  accountNumber: z.string(),
});

export type ContactCard = z.infer<typeof contactCardSchema>;
export type GiftAccount = z.infer<typeof giftAccountSchema>;

export type InvitationViewModel = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  groomName: string;
  brideName: string;
  ceremonyAt: string;
  ceremonyLabel: string;
  scheduleSummary: string;
  venueName: string;
  venueFloor: string | null;
  address: string;
  addressDetail: string | null;
  directions: string;
  transitTips: string;
  heroMoodTitle: string;
  heroMoodDescription: string;
  welcomeTitle: string;
  welcomeMessage: string;
  hostMessage: string | null;
  contactCards: ContactCard[];
  giftAccounts: GiftAccount[];
  galleryItems: Array<{
    id: number;
    order: number;
    layoutType: "HERO" | "WIDE" | "TALL" | "GRID";
    title: string;
    description: string;
    accentColor: string;
  }>;
  faqItems: Array<{
    id: number;
    question: string;
    answer: string;
  }>;
  mapLinks: {
    kakao: string;
    naver: string;
    tmap: string;
  };
};

function buildMapLinks(venueName: string, address: string) {
  const destination = encodeURIComponent(`${venueName} ${address}`);

  return {
    kakao: `https://map.kakao.com/link/search/${destination}`,
    naver: `https://map.naver.com/p/search/${destination}`,
    tmap: `https://www.tmap.co.kr/tmap2/mobile/route.jsp?name=${destination}`,
  };
}

export async function getInvitationViewModel(
  slug = "main",
): Promise<InvitationViewModel | null> {
  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    include: {
      galleryItems: {
        orderBy: { order: "asc" },
      },
      faqItems: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!invitation || !invitation.isPublished) {
    return null;
  }

  const contactCards = z.array(contactCardSchema).parse(invitation.contactCards);
  const giftAccounts = z.array(giftAccountSchema).parse(invitation.giftAccounts);
  const mapLinks = buildMapLinks(invitation.venueName, invitation.address);

  return {
    id: invitation.id,
    slug: invitation.slug,
    title: invitation.title,
    subtitle: invitation.subtitle,
    groomName: invitation.groomName,
    brideName: invitation.brideName,
    ceremonyAt: invitation.ceremonyAt.toISOString(),
    ceremonyLabel: new Intl.DateTimeFormat("ko-KR", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Seoul",
    }).format(invitation.ceremonyAt),
    scheduleSummary: invitation.scheduleSummary,
    venueName: invitation.venueName,
    venueFloor: invitation.venueFloor,
    address: invitation.address,
    addressDetail: invitation.addressDetail,
    directions: invitation.directions,
    transitTips: invitation.transitTips,
    heroMoodTitle: invitation.heroMoodTitle,
    heroMoodDescription: invitation.heroMoodDescription,
    welcomeTitle: invitation.welcomeTitle,
    welcomeMessage: invitation.welcomeMessage,
    hostMessage: invitation.hostMessage,
    contactCards,
    giftAccounts,
    galleryItems: invitation.galleryItems.map((item) => ({
      id: item.id,
      order: item.order,
      layoutType: item.layoutType,
      title: item.title,
      description: item.description,
      accentColor: item.accentColor,
    })),
    faqItems: invitation.faqItems.map((item) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
    })),
    mapLinks: {
      kakao: mapLinks.kakao,
      naver: mapLinks.naver,
      tmap: mapLinks.tmap,
    },
  };
}
