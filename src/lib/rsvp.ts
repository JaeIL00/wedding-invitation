import { MealPreference, RsvpStatus } from "@/generated/prisma/client";
import { z } from "zod";

export function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

export const rsvpFormSchema = z.object({
  invitationId: z.coerce.number().int().positive(),
  name: z
    .string()
    .trim()
    .min(2, "성함을 2자 이상 입력해 주세요.")
    .max(24, "성함은 24자 이하로 입력해 주세요."),
  phone: z
    .string()
    .trim()
    .min(10, "연락처를 입력해 주세요.")
    .max(20, "연락처 형식을 확인해 주세요.")
    .refine((value) => normalizePhone(value).length >= 10, {
      message: "연락처 숫자를 정확히 입력해 주세요.",
    }),
  status: z.nativeEnum(RsvpStatus),
  companionCount: z.coerce
    .number()
    .int()
    .min(0, "동행 인원은 0명 이상이어야 합니다.")
    .max(6, "동행 인원은 최대 6명까지 입력할 수 있습니다."),
  mealPreference: z.nativeEnum(MealPreference),
  note: z
    .string()
    .trim()
    .max(180, "메모는 180자 이내로 입력해 주세요.")
    .optional()
    .or(z.literal("")),
});

export type RsvpFormInput = z.infer<typeof rsvpFormSchema>;
