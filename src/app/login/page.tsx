'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { login } from '@/lib/actions/auth';
import { fieldInput, fieldLabel, fieldError, primaryButton } from '@/components/form-styles';

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="mx-auto max-w-sm py-6">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 flex h-2.5 w-2.5 rounded-full bg-brand" />
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-500">Log in to submit or review timesheets.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <form action={action} className="space-y-5">
          {state?.message && (
            <p className="rounded-lg bg-brand-tint px-3 py-2 text-sm text-brand">{state.message}</p>
          )}
          <div>
            <label className={fieldLabel} htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" required autoFocus className={fieldInput} />
            {state?.errors?.email && <p className={fieldError}>{state.errors.email}</p>}
          </div>
          <div>
            <label className={fieldLabel} htmlFor="password">
              Password
            </label>
            <input id="password" name="password" type="password" required className={fieldInput} />
          </div>
          <button disabled={pending} type="submit" className={primaryButton}>
            {pending ? 'Logging in…' : 'Log in'}
          </button>
        </form>
      </div>
      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-brand hover:text-brand-dark">
          Register
        </Link>
      </p>
    </div>
  );
}
