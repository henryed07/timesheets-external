'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { reviewTimesheet } from '@/lib/actions/admin';
import { fieldInput, fieldLabel, primaryButton, secondaryButton } from '@/components/form-styles';

export default function ReviewForm({ timesheetId }: { timesheetId: string }) {
  const action = reviewTimesheet.bind(null, timesheetId);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-md space-y-5">
      <p className="text-xs tracking-label text-gray-500">Decision</p>
      {state?.message && (
        <p className="rounded-lg bg-brand-tint px-3 py-2 text-sm text-brand">{state.message}</p>
      )}
      <div>
        <label className={fieldLabel} htmlFor="decision">
          Outcome
        </label>
        <select id="decision" name="decision" className={fieldInput}>
          <option value="APPROVED">Approve</option>
          <option value="REJECTED">Reject</option>
        </select>
      </div>
      <div>
        <label className={fieldLabel} htmlFor="comment">
          Comment
        </label>
        <textarea id="comment" name="comment" rows={3} className={fieldInput} />
      </div>
      <div className="flex gap-3">
        <button disabled={pending} type="submit" className={`${primaryButton} w-auto`}>
          {pending ? 'Submitting…' : 'Submit review'}
        </button>
        <Link href="/admin" className={`${secondaryButton} flex items-center`}>
          Back
        </Link>
      </div>
    </form>
  );
}
