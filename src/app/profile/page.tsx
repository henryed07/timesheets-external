import { requireUser } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import ProfileForm from './profile-form';

export default async function ProfilePage() {
  const user = await requireUser();
  const companies = await prisma.company.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold mb-6">My Profile</h1>
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
  );
}
