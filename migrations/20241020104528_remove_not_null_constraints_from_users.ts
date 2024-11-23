import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    ALTER TABLE t_users
    ALTER COLUMN phone DROP NOT NULL,
    ALTER COLUMN location DROP NOT NULL,
    ALTER COLUMN age DROP NOT NULL,
    ALTER COLUMN gender DROP NOT NULL;
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(``);
}
