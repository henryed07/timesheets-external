import { requireUser } from '@/lib/dal';
import NewTimesheetForm from './new-timesheet-form';

export default async function NewTimesheetPage() {
  await requireUser();
  return (
    <div className="mx-auto max-w-sm">
      <p className="tracking-label text-xs text-brand mb-2">New</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink mb-8">New Timesheet</h1>
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <NewTimesheetForm />
      </div>
    </div>
  );
}
