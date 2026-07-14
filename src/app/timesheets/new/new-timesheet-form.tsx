'use client';

import { useActionState } from 'react';
import { createTimesheet } from '@/lib/actions/timesheets';

export default function NewTimesheetForm() {
  const [state, action, pending] = useActionState(createTimesheet, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="weekStartDate">
          Week starting (Monday)
        </label>
        <input
          id="weekStartDate"
          name="weekStartDate"
          type="date"
          required
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
        {state?.errors?.weekStartDate && (
          <p className="text-sm text-red-600 mt-1">{state.errors.weekStartDate}</p>
        )}
      </div>
      <button
        disabled={pending}
        type="submit"
        className="w-full rounded bg-gray-900 text-white py-2 font-medium disabled:opacity-50"
      >
        Create
      </button>
    </form>
  );
}
