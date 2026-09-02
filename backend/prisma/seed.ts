import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Admin Account ────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('qwertyuiop1234567890', SALT_ROUNDS);
  await prisma.user.upsert({
    where: { email: 'admin@ceritakita.id' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@ceritakita.id',
      passwordHash: adminHash,
      role: Role.ADMIN,
    },
  });

  // ─── User Account ─────────────────────────────────────────────────────────
  const userHash = await bcrypt.hash('user', SALT_ROUNDS);
  await prisma.user.upsert({
    where: { email: 'user@ceritakita.id' },
    update: {},
    create: {
      username: 'user',
      email: 'user@ceritakita.id',
      passwordHash: userHash,
      role: Role.USER, // Assuming role field is optional or defaults to USER, or we pass it if needed. Let's omit if Role.USER is default or pass it explicitly.
    },
  });

  console.log('✅ Accounts seeded successfully:');
  console.log('  Admin  → admin@ceritakita.id / qwertyuiop1234567890');
  console.log('  User   → user@ceritakita.id  / user');
  console.log('\n🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
