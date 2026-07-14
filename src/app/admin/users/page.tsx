import { requireStaff } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import NewUserForm from './new-user-form';
import UserRowActions from './user-row-actions';

export default async function AdminUsersPage() {
  const staff = await requireStaff();

  const [users, companies] = [
    await prisma.user.findMany({
      include: { company: true },
      orderBy: [{ role: 'asc' }, { firstName: 'asc' }],
    }),
    await prisma.company.findMany({ orderBy: { name: 'asc' } }),
  ];

  return (
    <div>
      <p className="tracking-label text-xs text-brand mb-2">Staff</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink mb-8">Manage Users</h1>

      <div className="mb-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/70 text-left text-[11px] tracking-label text-gray-500">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Company/Supplier</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-4 font-medium text-ink">
                  {u.firstName} {u.lastName}
                  {u.id === staff.id && <span className="ml-2 text-xs text-gray-400">(you)</span>}
                </td>
                <td className="px-6 py-4 text-ink-soft">{u.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-label ${
                      u.role === 'STAFF'
                        ? 'bg-ink text-white'
                        : 'bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-300'
                    }`}
                  >
                    {u.role === 'STAFF' ? 'Staff' : 'Employee'}
                  </span>
                </td>
                <td className="px-6 py-4 text-ink-soft">{u.company?.name ?? '—'}</td>
                <td className="px-6 py-4">
                  {u.id !== staff.id && <UserRowActions userId={u.id} role={u.role} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="tracking-label text-xs text-brand mb-2">New</p>
      <h2 className="text-xl font-semibold tracking-tight text-ink mb-6">Add a user</h2>
      <div className="max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <NewUserForm companies={companies.map((c) => ({ id: c.id, name: c.name }))} />
      </div>
    </div>
  );
}
