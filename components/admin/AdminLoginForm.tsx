"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Lock, Mail } from "lucide-react";

import { loginAction, type LoginFormState } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";

type AdminLoginFormProps = {
  nextPath?: string;
};

const initialState: LoginFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="h-12 w-full" disabled={pending}>
      {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
    </Button>
  );
}

export function AdminLoginForm({ nextPath = "/admin" }: AdminLoginFormProps) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-7 space-y-4">
      <input type="hidden" name="next" value={nextPath} />

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-bimola-cream/45">
          E-posta
        </span>
        <div className="relative mt-2">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-bimola-cream/40" />
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="admin@bimolateras.com"
            className="h-12 w-full rounded-2xl border border-bimola-cream/10 bg-bimola-dark/45 pl-10 pr-4 text-sm text-bimola-cream placeholder:text-bimola-cream/35 focus:border-bimola-gold focus:outline-none"
          />
        </div>
      </label>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-bimola-cream/45">
          Şifre
        </span>
        <div className="relative mt-2">
          <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-bimola-cream/40" />
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-12 w-full rounded-2xl border border-bimola-cream/10 bg-bimola-dark/45 pl-10 pr-4 text-sm text-bimola-cream placeholder:text-bimola-cream/35 focus:border-bimola-gold focus:outline-none"
          />
        </div>
      </label>

      {state.error && (
        <div className="rounded-2xl border border-[#c45c4a]/25 bg-[#c45c4a]/12 px-4 py-3">
          <p className="text-sm text-[#f1b4aa]">{state.error}</p>
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
