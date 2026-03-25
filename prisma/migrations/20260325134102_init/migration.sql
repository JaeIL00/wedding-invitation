-- CreateEnum
CREATE TYPE "GalleryLayoutType" AS ENUM ('HERO', 'WIDE', 'TALL', 'GRID');

-- CreateEnum
CREATE TYPE "RsvpStatus" AS ENUM ('ATTENDING', 'DECLINED');

-- CreateEnum
CREATE TYPE "MealPreference" AS ENUM ('YES', 'NO', 'TBD');

-- CreateTable
CREATE TABLE "Invitation" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "groomName" TEXT NOT NULL,
    "brideName" TEXT NOT NULL,
    "ceremonyAt" TIMESTAMP(3) NOT NULL,
    "venueName" TEXT NOT NULL,
    "venueFloor" TEXT,
    "address" TEXT NOT NULL,
    "addressDetail" TEXT,
    "directions" TEXT NOT NULL,
    "transitTips" TEXT NOT NULL,
    "heroMoodTitle" TEXT NOT NULL,
    "heroMoodDescription" TEXT NOT NULL,
    "welcomeTitle" TEXT NOT NULL,
    "welcomeMessage" TEXT NOT NULL,
    "scheduleSummary" TEXT NOT NULL,
    "hostMessage" TEXT,
    "contactCards" JSONB NOT NULL,
    "giftAccounts" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryPlaceholder" (
    "id" SERIAL NOT NULL,
    "invitationId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "layoutType" "GalleryLayoutType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "accentColor" TEXT NOT NULL,

    CONSTRAINT "GalleryPlaceholder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqItem" (
    "id" SERIAL NOT NULL,
    "invitationId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "FaqItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rsvp" (
    "id" SERIAL NOT NULL,
    "invitationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "normalizedPhone" TEXT NOT NULL,
    "status" "RsvpStatus" NOT NULL,
    "companionCount" INTEGER NOT NULL DEFAULT 0,
    "mealPreference" "MealPreference" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rsvp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_slug_key" ON "Invitation"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryPlaceholder_invitationId_order_key" ON "GalleryPlaceholder"("invitationId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "FaqItem_invitationId_order_key" ON "FaqItem"("invitationId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Rsvp_invitationId_normalizedPhone_key" ON "Rsvp"("invitationId", "normalizedPhone");

-- AddForeignKey
ALTER TABLE "GalleryPlaceholder" ADD CONSTRAINT "GalleryPlaceholder_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FaqItem" ADD CONSTRAINT "FaqItem_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rsvp" ADD CONSTRAINT "Rsvp_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
