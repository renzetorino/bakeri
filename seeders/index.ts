import postgres from 'postgres';
import { seedAdminUser } from './seed-admin-user';

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Please check your .env.local file.',
  );
}

const client = postgres(connectionString, { prepare: false });

export const seed = async () => {
  console.log('🌱 Starting database seeding...');

  try {
    // Pass connection string to seeders
    await seedAdminUser(connectionString);

    console.log('✅ Database seeding completed!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    await client.end();
  }
};

if (require.main === module) {
  seed()
    .then(() => {
      console.log('🎉 Seeding process completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding process failed:', error);
      process.exit(1);
    });
}
