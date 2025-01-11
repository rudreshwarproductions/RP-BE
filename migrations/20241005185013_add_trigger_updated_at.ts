import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Trigger for the users table
    CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON t_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

    -- Trigger for the casts table
    CREATE TRIGGER trigger_castings_updated_at
    BEFORE UPDATE ON t_castings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

    -- Trigger for the contacts table
    CREATE TRIGGER trigger_contacts_updated_at
    BEFORE UPDATE ON t_contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    -- Drop the triggers
    DROP TRIGGER IF EXISTS trigger_users_updated_at ON t_users;
    DROP TRIGGER IF EXISTS trigger_casts_updated_at ON t_castings;
    DROP TRIGGER IF EXISTS trigger_contacts_updated_at ON t_contacts;

    -- Drop the function
    DROP FUNCTION IF EXISTS update_updated_at_column;
  `);
}
