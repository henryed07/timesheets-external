import Link from 'next/link';
import { requireStaff } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import StatusBadge from '@/components/status-badge';

const STATUSES = ['SUBMITTED', 'APPROVED', 'REJECTED'] as const;

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; company?: string }>;
}) {
  await requireStaff();
  const { status, company } = await searchParams;

  const companies = await prisma.company.findMany({ orderBy: { name: 'asc' } });

  const timesheets = await prisma.timesheet.findMany({
    where: {
      status: status ? (status as (typeof STATUSES)[number]) : { in: [...STATUSES] },
      ...(company ? { user: { companyId: company } } : {}),
    },
    include: { user: { include: { company: true } }, entries: true },
    orderBy: { weekStartDate: 'desc' },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Review Dashboard</h1>

      <form className="flex gap-3 mb-4" method="get">
        <select name="status" defaultValue={status ?? ''} className="rounded border border-gray-300 px-2 py-1 text-sm">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <select name="company" defaultValue={company ?? ''} className="rounded border border-gray-300 px-2 py-1 text-sm">
          <option value="">All companies</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded border border-gray-400 px-3 py-1 text-sm">
          Filter
        </button>
      </form>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b border-gray-300">
            <th className="py-2">Employee</th>
            <th className="py-2">Company/Supplier</th>
            <th className="py-2">Week starting</th>
            <th className="py-2">Total hours</th>
            <th className="py-2">Status</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {timesheets.map((t) => {
            const total = t.entries.reduce((sum, e) => sum + Number(e.hours), 0);
            return (
              <tr key={t.id} className="border-b border-gray-200">
                <td className="py-2">
                  {t.user.firstName} {t.user.lastName}
                </td>
                <td className="py-2">{t.user.company?.name}</td>
                <td className="py-2">{t.weekStartDate.toISOString().slice(0, 10)}</td>
                <td className="py-2">{total}</td>
                <td className="py-2">
                  <StatusBadge status={t.status} />
                </td>
                <td className="py-2 text-right">
                  <Link href={`/admin/${t.id}`} className="underline">
                    Review
                  </Link>
                </td>
              </tr>
            );
          })}
          {timesheets.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-gray-500">
                No timesheets match.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
