'use client';

import { useActionState } from 'react';
import { updateProfile } from '@/lib/actions/profile';

const inputClass = 'w-full rounded border border-gray-300 px-3 py-2';
const labelClass = 'block text-sm font-medium mb-1';
const errorClass = 'text-sm text-red-600 mt-1';

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
    <form action={action} className="space-y-4">
      {state?.message && <p className="text-sm text-green-700">{state.message}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="firstName">
            First name
          </label>
          <input id="firstName" name="firstName" defaultValue={user.firstName} required className={inputClass} />
          {state?.errors?.firstName && <p className={errorClass}>{state.errors.firstName}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="lastName">
            Last name
          </label>
          <input id="lastName" name="lastName" defaultValue={user.lastName} required className={inputClass} />
          {state?.errors?.lastName && <p className={errorClass}>{state.errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" defaultValue={user.email} required className={inputClass} />
        {state?.errors?.email && <p className={errorClass}>{state.errors.email}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="companyId">
          Company / supplier
        </label>
        <select id="companyId" name="companyId" defaultValue={user.companyId} required className={inputClass}>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {state?.errors?.companyId && <p className={errorClass}>{state.errors.companyId}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="jobTitle">
            Job title
          </label>
          <input id="jobTitle" name="jobTitle" defaultValue={user.jobTitle} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">
            Phone
          </label>
          <input id="phone" name="phone" defaultValue={user.phone} className={inputClass} />
        </div>
      </div>

      <button
        disabled={pending}
        type="submit"
        className="w-full rounded bg-gray-900 text-white py-2 font-medium disabled:opacity-50"
      >
        Save changes
      </button>
    </form>
  );
}
