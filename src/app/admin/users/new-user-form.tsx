'use client';

import { useActionState, useState } from 'react';
import { createUserByAdmin } from '@/lib/actions/admin';
import { fieldInput, fieldLabel, fieldError, primaryButton } from '@/components/form-styles';

export default function NewUserForm({ companies }: { companies: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(createUserByAdmin, undefined);
  const [role, setRole] = useState<'EMPLOYEE' | 'STAFF'>('EMPLOYEE');
  const [companyMode, setCompanyMode] = useState<'existing' | 'new'>(
    companies.length > 0 ? 'existing' : 'new',
  );

  return (
    <form action={action} className="space-y-5">
      {state?.message && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{state.message}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={fieldLabel} htmlFor="firstName">
            First name
          </label>
          <input id="firstName" name="firstName" required className={fieldInput} />
          {state?.errors?.firstName && <p className={fieldError}>{state.errors.firstName}</p>}
        </div>
        <div>
          <label className={fieldLabel} htmlFor="lastName">
            Last name
          </label>
          <input id="lastName" name="lastName" required className={fieldInput} />
          {state?.errors?.lastName && <p className={fieldError}>{state.errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className={fieldLabel} htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required className={fieldInput} />
        {state?.errors?.email && <p className={fieldError}>{state.errors.email}</p>}
      </div>

      <div>
        <label className={fieldLabel} htmlFor="password">
          Temporary password
        </label>
        <input id="password" name="password" type="password" required className={fieldInput} />
        {state?.errors?.password && <p className={fieldError}>{state.errors.password}</p>}
      </div>

      <div>
        <label className={fieldLabel} htmlFor="role">
          Role
        </label>
        <select
          id="role"
          name="role"
          className={fieldInput}
          value={role}
          onChange={(e) => setRole(e.target.value as 'EMPLOYEE' | 'STAFF')}
        >
          <option value="EMPLOYEE">Employee (submits timesheets)</option>
          <option value="STAFF">Staff (reviews timesheets)</option>
        </select>
      </div>

      {role === 'EMPLOYEE' && (
        <fieldset className="rounded-xl border border-gray-200 p-4">
          <legend className="px-1 text-xs font-medium tracking-label text-gray-500">Company / supplier</legend>
          {companies.length > 0 && (
            <div className="mb-3 flex gap-5 text-sm text-ink-soft">
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  className="accent-brand"
                  checked={companyMode === 'existing'}
                  onChange={() => setCompanyMode('existing')}
                />
                Existing company
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  className="accent-brand"
                  checked={companyMode === 'new'}
                  onChange={() => setCompanyMode('new')}
                />
                New company
              </label>
            </div>
          )}
          {companyMode === 'existing' && companies.length > 0 ? (
            <select name="companyId" className={fieldInput} defaultValue="">
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
            <input name="newCompanyName" placeholder="Company / supplier name" className={fieldInput} />
          )}
          {state?.errors?.newCompanyName && <p className={fieldError}>{state.errors.newCompanyName}</p>}
        </fieldset>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={fieldLabel} htmlFor="jobTitle">
            Job title
          </label>
          <input id="jobTitle" name="jobTitle" className={fieldInput} />
        </div>
        <div>
          <label className={fieldLabel} htmlFor="phone">
            Phone
          </label>
          <input id="phone" name="phone" className={fieldInput} />
        </div>
      </div>

      <button disabled={pending} type="submit" className={primaryButton}>
        {pending ? 'Adding…' : 'Add user'}
      </button>
    </form>
  );
}
