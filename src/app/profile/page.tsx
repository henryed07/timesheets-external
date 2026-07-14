import { requireUser } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import ProfileForm from './profile-form';

export default async function ProfilePage() {
  const user = await requireUser();
  const companies = await prisma.company.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="mx-auto max-w-lg">
      <p className="tracking-label text-xs text-brand mb-2">Account</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink mb-8">My Profile</h1>
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <ProfileForm
          user={{
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            companyId: user.companyId ?? '',
            jobTitle: user.jobTitle ?? '',
            phone: user.phone ?? '',
          }}
          companies={companies.map((c) => ({ id: c.id, name: c.name }))}
        />
      </div>
    </div>
  );
}
