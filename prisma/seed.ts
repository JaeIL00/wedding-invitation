import { GalleryLayoutType, PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const invitationSlug = "main";

async function main() {
  await prisma.rsvp.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.galleryPlaceholder.deleteMany();
  await prisma.invitation.deleteMany();

  await prisma.invitation.create({
    data: {
      slug: invitationSlug,
      title: "재일 그리고 수민",
      subtitle: "햇살처럼 환한 하루에, 소중한 분들을 초대합니다.",
      groomName: "재일",
      brideName: "수민",
      ceremonyAt: new Date("2026-11-14T13:00:00+09:00"),
      venueName: "가든 라이트 홀",
      venueFloor: "2층 오로라 가든",
      address: "서울시 중구 예시로 120",
      addressDetail: "실제 장소 정보와 약도로 교체해주세요.",
      directions:
        "지하철 3호선 예시역 4번 출구에서 도보 6분입니다. 행사 당일에는 역 앞 셔틀이 20분 간격으로 운행됩니다.",
      transitTips:
        "자가용 이용 시 건물 지하 주차장을 2시간 무료로 이용하실 수 있습니다. 대중교통 이용 손님은 역 출구 기준 안내 표지를 따라오시면 편하게 도착하실 수 있습니다.",
      heroMoodTitle: "따뜻한 봄빛이 머무는 필름 웨딩 무드",
      heroMoodDescription:
        "실제 사진이 들어갈 자리입니다. 부드러운 자연광, 밝은 아이보리 플라워, 미소가 편안하게 담기는 컷을 기준으로 교체해주세요.",
      welcomeTitle: "초대합니다",
      welcomeMessage:
        "서로의 계절이 되어준 저희가 이제 한 걸음 더 나아가 한 가정을 이루려 합니다. 그 시작의 자리에 함께해 주셔서 축복해 주시면 더없는 기쁨이겠습니다.",
      scheduleSummary: "2026년 11월 14일 토요일 오후 1시",
      hostMessage:
        "가까이에서 축하해 주시는 마음만으로도 큰 선물이 됩니다. 편한 마음으로 오셔서 따뜻한 하루를 함께 나눠주세요.",
      contactCards: [
        {
          label: "신랑에게 연락",
          name: "재일",
          relation: "신랑",
          phone: "010-1234-5678",
        },
        {
          label: "신부에게 연락",
          name: "수민",
          relation: "신부",
          phone: "010-8765-4321",
        },
        {
          label: "혼주 안내",
          name: "양가 혼주",
          relation: "가족 연락처",
          phone: "실제 연락처로 교체해주세요.",
        },
      ],
      giftAccounts: [
        {
          bank: "국민은행",
          accountHolder: "김재일",
          accountNumber: "123456-78-123456",
        },
        {
          bank: "신한은행",
          accountHolder: "이수민",
          accountNumber: "987-654-321000",
        },
      ],
      galleryItems: {
        create: [
          {
            order: 1,
            layoutType: GalleryLayoutType.HERO,
            title: "햇살이 부드럽게 번지는 메인 컷",
            description:
              "첫 화면에 배치할 대표 이미지 슬롯입니다. 밝은 배경, 가벼운 미소, 공간감이 느껴지는 세로형 인물 컷을 넣어주세요.",
            accentColor: "#f7c7b7",
          },
          {
            order: 2,
            layoutType: GalleryLayoutType.WIDE,
            title: "꽃과 함께한 산책 컷",
            description:
              "화이트와 연한 살구색 꽃 장식이 있는 야외 또는 채광 좋은 실내 배경을 추천합니다.",
            accentColor: "#f4d8a8",
          },
          {
            order: 3,
            layoutType: GalleryLayoutType.TALL,
            title: "눈맞춤 클로즈업 컷",
            description:
              "표정이 잘 보이는 근거리 사진, 피부 톤이 맑게 보이는 부드러운 필름 톤이 잘 어울립니다.",
            accentColor: "#d7e6c5",
          },
          {
            order: 4,
            layoutType: GalleryLayoutType.GRID,
            title: "장난스럽고 가벼운 무드 컷",
            description:
              "너무 정적인 포즈보다 두 사람이 자연스럽게 웃고 움직이는 장면을 권장합니다.",
            accentColor: "#bfdcf6",
          },
        ],
      },
      faqItems: {
        create: [
          {
            order: 1,
            question: "주차는 가능한가요?",
            answer:
              "건물 지하 주차장을 예식 당일 2시간 무료로 이용할 수 있습니다. 혼잡 시 인근 공영주차장을 안내해 드립니다.",
          },
          {
            order: 2,
            question: "식사는 언제부터 가능한가요?",
            answer:
              "예식 30분 전부터 같은 층 연회장에서 식사가 가능합니다. RSVP에 식사 여부를 남겨주시면 준비에 큰 도움이 됩니다.",
          },
          {
            order: 3,
            question: "아이와 함께 가도 괜찮을까요?",
            answer:
              "물론입니다. 유모차 이동이 가능하며, 행사장 입구에 아기 의자 요청 안내가 준비될 예정입니다.",
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
