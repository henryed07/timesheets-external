'use client';

import { useActionState } from 'react';
import { createTimesheet } from '@/lib/actions/timesheets';
import { fieldInput, fieldLabel, fieldError, primaryButton } from '@/components/form-styles';

export default function NewTimesheetForm() {
  const [state, action, pending] = useActionState(createTimesheet, undefined);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label className={fieldLabel} htmlFor="weekStartDate">
          Week starting (Monday)
        </label>
        <input
          id="weekStartDate"
          name="weekStartDate"
          type="date"
          required
          className={fieldInput}
        />
        {state?.errors?.weekStartDate && <p className={fieldError}>{state.errors.weekStartDate}</p>}
      </div>
      <button disabled={pending} type="submit" className={primaryButton}>
        {pending ? 'Creating…' : 'Create'}
      </button>
    </form>
  );
}
