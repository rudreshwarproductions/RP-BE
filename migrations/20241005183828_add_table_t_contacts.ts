import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE t_contacts (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES t_users(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      type VARCHAR(50) NOT NULL,
      contacted BOOLEAN DEFAULT FALSE,
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_contacts_user_id ON t_contacts(user_id);
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TABLE t_contacts;
    DROP INDEX IF EXISTS idx_contacts_user_id;
  `);
}
