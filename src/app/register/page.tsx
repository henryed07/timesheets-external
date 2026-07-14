import { prisma } from '@/lib/prisma';
import RegisterForm from './register-form';

export default async function RegisterPage() {
  const companies = await prisma.company.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold mb-6">Create an account</h1>
      <RegisterForm companies={companies.map((c) => ({ id: c.id, name: c.name }))} />
    </div>
  );
}
