'use client';

import { useActionState } from 'react';
import { createCompany } from '@/lib/actions/admin';
import { fieldInput, fieldLabel, fieldError, primaryButton } from '@/components/form-styles';

export default function NewCompanyForm() {
  const [state, action, pending] = useActionState(createCompany, undefined);

  return (
    <form action={action} className="space-y-5">
      {state?.message && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{state.message}</p>
      )}
      <div>
        <label className={fieldLabel} htmlFor="name">
          Company / supplier name
        </label>
        <input id="name" name="name" required className={fieldInput} />
        {state?.errors?.name && <p className={fieldError}>{state.errors.name}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={fieldLabel} htmlFor="contactEmail">
            Contact email
          </label>
          <input id="contactEmail" name="contactEmail" type="email" className={fieldInput} />
        </div>
        <div>
          <label className={fieldLabel} htmlFor="contactPhone">
            Contact phone
          </label>
          <input id="contactPhone" name="contactPhone" className={fieldInput} />
        </div>
      </div>
      <button disabled={pending} type="submit" className={primaryButton}>
        {pending ? 'Adding…' : 'Add company'}
      </button>
    </form>
  );
}
