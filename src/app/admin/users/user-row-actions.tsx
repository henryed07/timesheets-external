'use client';

import { deleteUser, setUserRole } from '@/lib/actions/admin';
import type { Role } from '@/generated/prisma/enums';

export default function UserRowActions({ userId, role }: { userId: string; role: Role }) {
  const nextRole: Role = role === 'STAFF' ? 'EMPLOYEE' : 'STAFF';
  const toggleAction = setUserRole.bind(null, userId, nextRole);
  const deleteAction = deleteUser.bind(null, userId);

  return (
    <div className="flex items-center justify-end gap-4">
      <form action={toggleAction}>
        <button type="submit" className="text-sm font-medium text-brand hover:text-brand-dark">
          {role === 'STAFF' ? 'Make employee' : 'Make admin'}
        </button>
      </form>
      <form
        action={deleteAction}
        onSubmit={(e) => {
          if (!confirm('Remove this user? Their timesheets will be permanently deleted too.')) {
            e.preventDefault();
          }
        }}
      >
        <button type="submit" className="text-sm font-medium text-gray-400 hover:text-ink">
          Remove
        </button>
      </form>
    </div>
  );
}
