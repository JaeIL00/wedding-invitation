"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
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
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="primary-button w-full disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "전송 중..." : "참석 의사 전달하기"}
    </button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-[#9a4c44]">{message}</p>;
}

function getChoiceClassName(isSelected: boolean) {
  return [
    "flex min-h-[3rem] items-center justify-center rounded-[1rem] border px-4 text-sm font-medium transition",
    isSelected
      ? "border-[var(--line-strong)] bg-[var(--accent-soft)] text-[var(--foreground)] shadow-[0_8px_24px_rgba(35,32,29,0.06)]"
      : "border-[var(--line)] bg-white text-[var(--foreground)] hover:border-[var(--line-strong)] hover:bg-[var(--surface-soft)]",
  ].join(" ");
}

function getFieldClassName(disabled = false) {
  return [
    "mt-2 w-full rounded-[1rem] border border-[var(--line)] bg-white px-4 text-[0.98rem] outline-none shadow-[0_10px_24px_rgba(13,20,17,0.03)]",
    "focus:border-[var(--line-strong)] focus:bg-white",
    disabled ? "opacity-55 shadow-none" : "",
  ].join(" ");
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
      className="rsvp-form"
    >
      <input type="hidden" name="invitationId" value={invitationId} />

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-[var(--foreground)]">
            성함
          </label>
          <input
            name="name"
            autoComplete="name"
            placeholder="예: 김하객"
            className={`${getFieldClassName()} min-h-[3rem]`}
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
            className={`${getFieldClassName()} min-h-[3rem]`}
          />
          <FieldError message={state.fieldErrors?.phone} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--foreground)]">
            참석 여부
          </label>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <label className={getChoiceClassName(status === RSVP_STATUS.ATTENDING)}>
              <input
                type="radio"
                name="status"
                value={RSVP_STATUS.ATTENDING}
                checked={status === RSVP_STATUS.ATTENDING}
                onChange={() => setStatus(RSVP_STATUS.ATTENDING)}
                className="sr-only"
              />
              참석 예정입니다
            </label>
            <label className={getChoiceClassName(status === RSVP_STATUS.DECLINED)}>
              <input
                type="radio"
                name="status"
                value={RSVP_STATUS.DECLINED}
                checked={status === RSVP_STATUS.DECLINED}
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
              className={`${getFieldClassName(status === RSVP_STATUS.DECLINED)} min-h-[3rem] disabled:cursor-not-allowed`}
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
              className={`${getFieldClassName(status === RSVP_STATUS.DECLINED)} min-h-[3rem] disabled:cursor-not-allowed`}
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
            className={`${getFieldClassName()} py-3`}
          />
          <FieldError message={state.fieldErrors?.note} />
        </div>
      </div>

      <p className="mt-6 text-[0.92rem] leading-6 text-[var(--muted)]">
        같은 연락처는 한 번만 등록됩니다. 수정이 필요하면 신랑 또는 신부에게
        직접 알려주세요.
      </p>

      {state.message ? (
        <div
          className={`mt-4 rounded-[1rem] px-4 py-3 text-[0.92rem] leading-6 ${
            state.status === "success"
              ? "border border-[var(--line)] bg-[var(--surface-soft)] text-[var(--foreground)]"
              : "border border-[#f0d2c8] bg-[#fdf1ec] text-[#925145]"
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
