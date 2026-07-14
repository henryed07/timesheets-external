'use client';

import { useActionState } from 'react';
import { updateCompany } from '@/lib/actions/admin';
import { fieldInput, fieldError } from '@/components/form-styles';

type CompanyRowProps = {
  company: {
    id: string;
    name: string;
    contactEmail: string | null;
    contactPhone: string | null;
    userCount: number;
  };
};

export default function CompanyRow({ company }: CompanyRowProps) {
  const action = updateCompany.bind(null, company.id);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <tr>
      <td className="px-6 py-3">
        <form action={formAction} className="flex flex-wrap items-start gap-2">
          <div>
            <input name="name" defaultValue={company.name} required className={`${fieldInput} w-48`} />
            {state?.errors?.name && <p className={fieldError}>{state.errors.name}</p>}
          </div>
          <input
            name="contactEmail"
            type="email"
            defaultValue={company.contactEmail ?? ''}
            placeholder="Contact email"
            className={`${fieldInput} w-48`}
          />
          <input
            name="contactPhone"
            defaultValue={company.contactPhone ?? ''}
            placeholder="Contact phone"
            className={`${fieldInput} w-36`}
          />
          <button
            disabled={pending}
            type="submit"
            className="rounded-full border border-gray-300 px-4 py-2 text-xs font-medium tracking-label text-ink hover:border-ink transition-colors disabled:opacity-50"
          >
            {pending ? 'Saving…' : 'Save'}
          </button>
          {state?.message && <span className="self-center text-xs text-emerald-600">{state.message}</span>}
        </form>
      </td>
      <td className="px-6 py-3 text-right text-ink-soft">{company.userCount}</td>
    </tr>
  );
}
