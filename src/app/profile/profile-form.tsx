'use client';

import { useActionState } from 'react';
import { updateProfile } from '@/lib/actions/profile';
import { fieldInput, fieldLabel, fieldError, primaryButton } from '@/components/form-styles';

type ProfileFormProps = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    companyId: string;
    jobTitle: string;
    phone: string;
  };
  companies: { id: string; name: string }[];
};

export default function ProfileForm({ user, companies }: ProfileFormProps) {
  const [state, action, pending] = useActionState(updateProfile, undefined);

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
          <input id="firstName" name="firstName" defaultValue={user.firstName} required className={fieldInput} />
          {state?.errors?.firstName && <p className={fieldError}>{state.errors.firstName}</p>}
        </div>
        <div>
          <label className={fieldLabel} htmlFor="lastName">
            Last name
          </label>
          <input id="lastName" name="lastName" defaultValue={user.lastName} required className={fieldInput} />
          {state?.errors?.lastName && <p className={fieldError}>{state.errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className={fieldLabel} htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" defaultValue={user.email} required className={fieldInput} />
        {state?.errors?.email && <p className={fieldError}>{state.errors.email}</p>}
      </div>

      <div>
        <label className={fieldLabel} htmlFor="companyId">
          Company / supplier
        </label>
        <select id="companyId" name="companyId" defaultValue={user.companyId} required className={fieldInput}>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {state?.errors?.companyId && <p className={fieldError}>{state.errors.companyId}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={fieldLabel} htmlFor="jobTitle">
            Job title
          </label>
          <input id="jobTitle" name="jobTitle" defaultValue={user.jobTitle} className={fieldInput} />
        </div>
        <div>
          <label className={fieldLabel} htmlFor="phone">
            Phone
          </label>
          <input id="phone" name="phone" defaultValue={user.phone} className={fieldInput} />
        </div>
      </div>

      <button disabled={pending} type="submit" className={primaryButton}>
        {pending ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}
