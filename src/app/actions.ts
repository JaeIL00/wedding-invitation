"use server";

import { revalidatePath } from "next/cache";
import { MealPreference, RsvpStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizePhone, type RsvpFormInput, rsvpFormSchema } from "@/lib/rsvp";

export type RsvpSubmitResult = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof RsvpFormInput, string>>;
};

export const initialRsvpState: RsvpSubmitResult = {
  status: "idle",
};

export async function submitRsvp(
  _previousState: RsvpSubmitResult,
  formData: FormData,
): Promise<RsvpSubmitResult> {
  const parsed = rsvpFormSchema.safeParse({
    invitationId: formData.get("invitationId"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    status: formData.get("status"),
    companionCount: formData.get("companionCount"),
    mealPreference: formData.get("mealPreference"),
    note: formData.get("note"),
  });

  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;

    return {
      status: "error",
      message: "입력 내용을 다시 확인해 주세요.",
      fieldErrors: {
        invitationId: flattened.invitationId?.[0],
        name: flattened.name?.[0],
        phone: flattened.phone?.[0],
        status: flattened.status?.[0],
        companionCount: flattened.companionCount?.[0],
        mealPreference: flattened.mealPreference?.[0],
        note: flattened.note?.[0],
      },
    };
  }

  const normalizedPhone = normalizePhone(parsed.data.phone);
  const existing = await prisma.rsvp.findUnique({
    where: {
      invitationId_normalizedPhone: {
        invitationId: parsed.data.invitationId,
        normalizedPhone,
      },
    },
  });

  if (existing) {
    return {
      status: "error",
      message: "같은 연락처로 이미 RSVP가 접수되어 있습니다.",
      fieldErrors: {
        phone: "이미 응답한 연락처입니다. 수정이 필요하면 직접 연락해 주세요.",
      },
    };
  }

  try {
    await prisma.rsvp.create({
      data: {
        invitationId: parsed.data.invitationId,
        name: parsed.data.name,
        phone: parsed.data.phone,
        normalizedPhone,
        status: parsed.data.status,
        companionCount:
          parsed.data.status === RsvpStatus.DECLINED
            ? 0
            : parsed.data.companionCount,
        mealPreference:
          parsed.data.status === RsvpStatus.DECLINED
            ? MealPreference.NO
            : parsed.data.mealPreference,
        note: parsed.data.note || null,
      },
    });

    revalidatePath("/");

    return {
      status: "success",
      message: "소중한 답변 감사합니다. 결혼식에서 반갑게 인사드릴게요.",
    };
  } catch (error) {
    console.error(error);

    return {
      status: "error",
      message: "응답 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }
}
