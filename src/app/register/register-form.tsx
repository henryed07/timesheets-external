'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { register } from '@/lib/actions/auth';

const inputClass = 'w-full rounded border border-gray-300 px-3 py-2';
const labelClass = 'block text-sm font-medium mb-1';
const errorClass = 'text-sm text-red-600 mt-1';

export default function RegisterForm({ companies }: { companies: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(register, undefined);
  const [companyMode, setCompanyMode] = useState<'existing' | 'new'>(
    companies.length > 0 ? 'existing' : 'new',
  );

  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="firstName">
            First name
          </label>
          <input id="firstName" name="firstName" required className={inputClass} />
          {state?.errors?.firstName && <p className={errorClass}>{state.errors.firstName}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="lastName">
            Last name
          </label>
          <input id="lastName" name="lastName" required className={inputClass} />
          {state?.errors?.lastName && <p className={errorClass}>{state.errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
        {state?.errors?.email && <p className={errorClass}>{state.errors.email}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="password">
          Password
        </label>
        <input id="password" name="password" type="password" required className={inputClass} />
        {state?.errors?.password && <p className={errorClass}>{state.errors.password}</p>}
      </div>

      <fieldset className="rounded border border-gray-200 p-3">
        <legend className="text-sm font-medium px-1">Company / supplier</legend>
        {companies.length > 0 && (
          <div className="flex gap-4 text-sm mb-3">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                checked={companyMode === 'existing'}
                onChange={() => setCompanyMode('existing')}
              />
              Existing company
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                checked={companyMode === 'new'}
                onChange={() => setCompanyMode('new')}
              />
              New company
            </label>
          </div>
        )}
        {companyMode === 'existing' && companies.length > 0 ? (
          <select name="companyId" className={inputClass} defaultValue="">
            <option value="" disabled>
              Select a company&hellip;
            </option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            name="newCompanyName"
            placeholder="Company / supplier name"
            className={inputClass}
          />
        )}
        {state?.errors?.newCompanyName && <p className={errorClass}>{state.errors.newCompanyName}</p>}
      </fieldset>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="jobTitle">
            Job title
          </label>
          <input id="jobTitle" name="jobTitle" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">
            Phone
          </label>
          <input id="phone" name="phone" className={inputClass} />
        </div>
      </div>

      <button
        disabled={pending}
        type="submit"
        className="w-full rounded bg-gray-900 text-white py-2 font-medium disabled:opacity-50"
      >
        Register
      </button>

      <p className="text-sm">
        Already have an account?{' '}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
