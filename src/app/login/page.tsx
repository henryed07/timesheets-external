'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { login } from '@/lib/actions/auth';

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold mb-6">Log in</h1>
      <form action={action} className="space-y-4">
        {state?.message && <p className="text-sm text-red-600">{state.message}</p>}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
          {state?.errors?.email && <p className="text-sm text-red-600">{state.errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <button
          disabled={pending}
          type="submit"
          className="w-full rounded bg-gray-900 text-white py-2 font-medium disabled:opacity-50"
        >
          Log in
        </button>
      </form>
      <p className="mt-4 text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="underline">
          Register
        </Link>
      </p>
    </div>
  );
}
