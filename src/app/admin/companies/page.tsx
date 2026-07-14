import { requireStaff } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import CompanyRow from './company-row';
import NewCompanyForm from './new-company-form';

export default async function AdminCompaniesPage() {
  await requireStaff();

  const companies = await prisma.company.findMany({
    include: { _count: { select: { users: true } } },
    orderBy: { name: 'asc' },
  });

  return (
    <div>
      <p className="tracking-label text-xs text-brand mb-2">Staff</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink mb-8">Manage Companies</h1>

      <div className="mb-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/70 text-left text-[11px] tracking-label text-gray-500">
              <th className="px-6 py-3 font-medium">Company / supplier</th>
              <th className="px-6 py-3 font-medium text-right">Users</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {companies.map((c) => (
              <CompanyRow
                key={c.id}
                company={{
                  id: c.id,
                  name: c.name,
                  contactEmail: c.contactEmail,
                  contactPhone: c.contactPhone,
                  userCount: c._count.users,
                }}
              />
            ))}
            {companies.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-12 text-center text-sm text-gray-400">
                  No companies yet — add the first one below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="tracking-label text-xs text-brand mb-2">New</p>
      <h2 className="text-xl font-semibold tracking-tight text-ink mb-6">Add a company</h2>
      <div className="max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <NewCompanyForm />
      </div>
    </div>
  );
}
