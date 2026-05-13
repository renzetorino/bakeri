import { accounts, users } from '@/lib/db/schema';
import { hashPassword } from 'better-auth/crypto';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'techdiscussionpassword1234!@#';

export const seedAdminUser = async (connectionString: string) => {
  console.log('🔐 Seeding admin user...');

  const sql = postgres(connectionString, { prepare: false });
  const db = drizzle(sql, { schema: { users, accounts } });

  try {
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, ADMIN_EMAIL))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log('⚠️  Admin user already exists. Skipping seed...');
      return;
    }

    const hashedPassword = await hashPassword(ADMIN_PASSWORD);
    const now = new Date();

    const [createdUser] = await db
      .insert(users)
      .values({
        email: ADMIN_EMAIL,
        name: 'admin',
        image: '',
        emailVerified: now,
        createdAt: now,
        updatedAt: now,
      })
      .returning({
        id: users.id,
      });

    if (!createdUser) {
      throw new Error('Failed to create admin user.');
    }

    await db.insert(accounts).values({
      userId: createdUser.id,
      accountId: createdUser.id,
      providerId: 'credential',
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });

    console.log('✅ Successfully seeded admin user');
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    throw error;
  } finally {
    await sql.end();
  }
};
