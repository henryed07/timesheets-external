import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma';

async function main() {
  const email = 'admin@example.com';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Staff user already exists:', email);
    return;
  }
  const passwordHash = await bcrypt.hash('AdminPass123!', 10);
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'STAFF',
    },
  });
  console.log('Created staff user:', email, '/ AdminPass123!');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
