import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('hr_users', (table) => {
    table.increments('id').primary();
    table.string('email', 255).unique().notNullable();
    table.string('password_hash', 255).notNullable();
    table.string('name', 255).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);

  await knex.raw(`
    CREATE TRIGGER update_hr_users_updated_at
    BEFORE UPDATE ON hr_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('hr_users');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;');
}