import { readdir } from "node:fs/promises";
import path from "node:path";
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
  galleryPhotos: Array<{
    src: string;
    alt: string;
    title?: string;
    description?: string;
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

const GALLERY_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

async function getGalleryPhotos(
  groomName: string,
  brideName: string,
  galleryItems: InvitationViewModel["galleryItems"],
) {
  try {
    const galleryDir = path.join(process.cwd(), "public", "gallery");
    const entries = await readdir(galleryDir, { withFileTypes: true });
    const filenames = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((filename) => GALLERY_EXTENSIONS.has(path.extname(filename).toLowerCase()))
      .sort((left, right) => left.localeCompare(right, "ko"));

    return filenames.map((filename, index) => {
      const caption = galleryItems[index];

      return {
        src: `/gallery/${filename}`,
        alt: `${groomName}와 ${brideName}의 웨딩 사진 ${index + 1}`,
        title: caption?.title,
        description: caption?.description,
      };
    });
  } catch {
    return [];
  }
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
  const galleryItems = invitation.galleryItems.map((item) => ({
    id: item.id,
    order: item.order,
    layoutType: item.layoutType,
    title: item.title,
    description: item.description,
    accentColor: item.accentColor,
  }));
  const galleryPhotos = await getGalleryPhotos(
    invitation.groomName,
    invitation.brideName,
    galleryItems,
  );

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
    galleryItems,
    galleryPhotos,
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
