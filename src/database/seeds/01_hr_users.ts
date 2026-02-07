import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  await knex('hr_users').del();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin123', salt);

  await knex('hr_users').insert([
    {
      email: 'admin@hr.com',
      password_hash: passwordHash,
      name: 'HR Admin',
    },
    {
      email: 'manager@hr.com',
      password_hash: passwordHash,
      name: 'HR Manager',
    },
  ]);
}