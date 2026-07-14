import { prisma } from '@/lib/prisma';
import RegisterForm from './register-form';

export default async function RegisterPage() {
  const companies = await prisma.company.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="mx-auto max-w-lg py-6">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 flex h-2.5 w-2.5 rounded-full bg-brand" />
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Create your account</h1>
        <p className="mt-2 text-sm text-gray-500">
          Register once, then submit weekly timesheets under your company.
        </p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <RegisterForm companies={companies.map((c) => ({ id: c.id, name: c.name }))} />
      </div>
    </div>
  );
}
