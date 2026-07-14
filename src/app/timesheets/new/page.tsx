import { requireUser } from '@/lib/dal';
import NewTimesheetForm from './new-timesheet-form';

export default async function NewTimesheetPage() {
  await requireUser();
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold mb-6">New Timesheet</h1>
      <NewTimesheetForm />
    </div>
  );
}
