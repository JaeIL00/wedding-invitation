"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  initialRsvpState,
  submitRsvp,
  type RsvpSubmitResult,
} from "@/app/actions";

const RSVP_STATUS = {
  ATTENDING: "ATTENDING",
  DECLINED: "DECLINED",
} as const;

const MEAL_PREFERENCE = {
  YES: "YES",
  NO: "NO",
  TBD: "TBD",
} as const;

function SubmitButton() {
  return (
    <button
      type="submit"
      className="min-h-12 w-full rounded-full bg-[var(--foreground)] px-5 text-sm font-semibold text-white transition hover:opacity-90"
    >
      참석 의사 전달하기
    </button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-[#b6493d]">{message}</p>;
}

export function RsvpForm({ invitationId }: { invitationId: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<(typeof RSVP_STATUS)[keyof typeof RSVP_STATUS]>(
    RSVP_STATUS.ATTENDING,
  );
  const [state, formAction] = useActionState<RsvpSubmitResult, FormData>(
    submitRsvp,
    initialRsvpState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form
      ref={formRef}
      action={formAction}
      onReset={() => setStatus(RSVP_STATUS.ATTENDING)}
      className="surface-card px-5 py-5"
    >
      <input type="hidden" name="invitationId" value={invitationId} />

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[var(--foreground)]">
            성함
          </label>
          <input
            name="name"
            autoComplete="name"
            placeholder="예: 김하객"
            className="mt-2 min-h-12 w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 text-base outline-none transition focus:border-[var(--accent-strong)]"
          />
          <FieldError message={state.fieldErrors?.name} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--foreground)]">
            연락처
          </label>
          <input
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            placeholder="010-1234-5678"
            className="mt-2 min-h-12 w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 text-base outline-none transition focus:border-[var(--accent-strong)]"
          />
          <FieldError message={state.fieldErrors?.phone} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--foreground)]">
            참석 여부
          </label>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <label className="flex min-h-12 items-center justify-center rounded-[1.2rem] border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--foreground)]">
              <input
                type="radio"
                name="status"
                value={RSVP_STATUS.ATTENDING}
                defaultChecked
                onChange={() => setStatus(RSVP_STATUS.ATTENDING)}
                className="sr-only"
              />
              참석 예정입니다
            </label>
            <label className="flex min-h-12 items-center justify-center rounded-[1.2rem] border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--foreground)]">
              <input
                type="radio"
                name="status"
                value={RSVP_STATUS.DECLINED}
                onChange={() => setStatus(RSVP_STATUS.DECLINED)}
                className="sr-only"
              />
              참석이 어렵습니다
            </label>
          </div>
          <FieldError message={state.fieldErrors?.status} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-[var(--foreground)]">
              동행 인원
            </label>
            <input
              name="companionCount"
              type="number"
              min={0}
              max={6}
              defaultValue={0}
              disabled={status === RSVP_STATUS.DECLINED}
              className="mt-2 min-h-12 w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 text-base outline-none transition disabled:opacity-50 focus:border-[var(--accent-strong)]"
            />
            <FieldError message={state.fieldErrors?.companionCount} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--foreground)]">
              식사 여부
            </label>
            <select
              name="mealPreference"
              defaultValue={MEAL_PREFERENCE.YES}
              disabled={status === RSVP_STATUS.DECLINED}
              className="mt-2 min-h-12 w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 text-base outline-none transition disabled:opacity-50 focus:border-[var(--accent-strong)]"
            >
              <option value={MEAL_PREFERENCE.YES}>식사 예정</option>
              <option value={MEAL_PREFERENCE.NO}>식사 안 함</option>
              <option value={MEAL_PREFERENCE.TBD}>미정</option>
            </select>
            <FieldError message={state.fieldErrors?.mealPreference} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--foreground)]">
            메모
          </label>
          <textarea
            name="note"
            rows={4}
            placeholder="전달하고 싶은 메시지가 있다면 남겨주세요."
            className="mt-2 w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3 text-base outline-none transition focus:border-[var(--accent-strong)]"
          />
          <FieldError message={state.fieldErrors?.note} />
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
        같은 연락처는 한 번만 등록됩니다. 수정이 필요하면 신랑 또는 신부에게
        직접 알려주세요.
      </p>

      {state.message ? (
        <div
          className={`mt-4 rounded-[1.25rem] px-4 py-3 text-sm leading-6 ${
            state.status === "success"
              ? "bg-[#e9f3e2] text-[#3f5f2d]"
              : "bg-[#fff0ea] text-[#9d4d41]"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <div className="mt-5">
        <SubmitButton />
      </div>
    </form>
  );
}
