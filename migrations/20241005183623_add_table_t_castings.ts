import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE t_castings (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES t_users(id) ON DELETE CASCADE,
      height INT NOT NULL,
      weight INT NOT NULL,
      hair_color VARCHAR(50),
      eye_color VARCHAR(50),
      language_spoken VARCHAR(255) NOT NULL,
      occupation_status VARCHAR(255),
      acting_experience TEXT NOT NULL,
      acting_comfort_zone TEXT NOT NULL,
      special_skills TEXT,
      image_links TEXT[],  -- Array of image URLs
      video_links TEXT[],  -- Array of video URLs
      resume_links TEXT[], -- Array of resume URLs
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      order_no INT DEFAULT 1000,
      highlight BOOLEAN DEFAULT FALSE
    );

    CREATE INDEX idx_castings_user_id ON t_castings(user_id);
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TABLE t_castings;
    DROP INDEX IF EXISTS idx_castings_user_id;
  `);
}
