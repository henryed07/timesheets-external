'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { reviewTimesheet } from '@/lib/actions/admin';

export default function ReviewForm({ timesheetId }: { timesheetId: string }) {
  const action = reviewTimesheet.bind(null, timesheetId);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-4 max-w-md">
      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="decision">
          Decision
        </label>
        <select id="decision" name="decision" className="w-full rounded border border-gray-300 px-3 py-2">
          <option value="APPROVED">Approve</option>
          <option value="REJECTED">Reject</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="comment">
          Comment
        </label>
        <textarea id="comment" name="comment" rows={3} className="w-full rounded border border-gray-300 px-3 py-2" />
      </div>
      <div className="flex gap-3">
        <button
          disabled={pending}
          type="submit"
          className="rounded bg-gray-900 text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          Submit review
        </button>
        <Link href="/admin" className="rounded border border-gray-400 px-4 py-2 text-sm font-medium">
          Back
        </Link>
      </div>
    </form>
  );
}
