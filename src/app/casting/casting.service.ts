import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCastingDto } from './dto/create-casting.dto';
import { UpdateCastingDto } from './dto/update-casting.dto';
import { Casting } from 'src/models/cast.model';

@Injectable()
export class CastingService {
  private readonly logger = new Logger(CastingService.name);

  constructor(private readonly dbService: DatabaseService) {}

  async addCasting(castingDto: CreateCastingDto) {
    const {
      name,
      email,
      phone,
      location,
      age,
      gender,
      height,
      weight,
      hairColor,
      eyeColor,
      languageSpoken,
      occupationStatus,
      actingExperience,
      actingComfortZone,
      specialSkills,
    } = castingDto;

    const client = await this.dbService.pool.connect(); // Get a client from the pool
    try {
      await client.query('BEGIN'); // Start the transaction

      // Insert into the users table
      const insertUserQuery = `
      INSERT INTO t_users (name, email, phone, location, age, gender)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
      RETURNING id;
    `;
      const userValues = [name, email, phone, location, age, gender];

      const userResult = await client.query(insertUserQuery, userValues);
      let userId = userResult.rows[0]?.id; // Get the inserted user ID

      if (!userId) {
        // User already exists, fetch the existing user ID
        const fetchUserQuery = 'SELECT id FROM t_users WHERE email = $1';
        const fetchUserResult = await client.query(fetchUserQuery, [email]);
        userId = fetchUserResult.rows[0].id;
      }

      // Insert into the castings table
      const insertCastingQuery = `
      INSERT INTO t_castings (
        user_id,
        height,
        weight,
        hair_color,
        eye_color,
        language_spoken,
        occupation_status,
        acting_experience,
        acting_comfort_zone,
        special_skills
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `;
      const castingValues = [
        userId,
        height,
        weight,
        hairColor,
        eyeColor,
        languageSpoken,
        occupationStatus,
        actingExperience,
        actingComfortZone,
        specialSkills,
      ];

      await client.query(insertCastingQuery, castingValues);
      await client.query('COMMIT'); // Commit the transaction
      return { message: 'Casting data inserted successfully.' };
    } catch (error) {
      await client.query('ROLLBACK'); // Rollback on error
      this.logger.error('Failed to insert casting data', error);
      throw new Error('Failed to insert casting data'); // Throw a meaningful error
    } finally {
      client.release(); // Release the client back to the pool
    }
  }

  async updateCasting(userId: string, castingDto: UpdateCastingDto) {
    const {
      height,
      weight,
      hairColor,
      eyeColor,
      languageSpoken,
      occupationStatus,
      actingExperience,
      actingComfortZone,
      specialSkills,
    } = castingDto;

    const client = await this.dbService.pool.connect(); // Get a client from the pool
    try {
      await client.query('BEGIN'); // Start the transaction

      // Prepare update query (removed file links)
      const updateCastingQuery = `
      UPDATE t_castings
      SET
        height = $1,
        weight = $2,
        hair_color = $3,
        eye_color = $4,
        language_spoken = $5,
        occupation_status = $6,
        acting_experience = $7,
        acting_comfort_zone = $8,
        special_skills = $9
      WHERE user_id = $10;
    `;

      const castingValues = [
        height,
        weight,
        hairColor,
        eyeColor,
        languageSpoken,
        occupationStatus,
        actingExperience,
        actingComfortZone,
        specialSkills,
        userId,
      ];

      const result = await client.query(updateCastingQuery, castingValues); // Execute update

      if (result.rowCount === 0) {
        throw new Error('No casting data found for the provided user ID.'); // Handle case where no rows are updated
      }

      await client.query('COMMIT'); // Commit the transaction
      return { message: 'Casting data updated successfully.', userId }; // Return success message and userId
    } catch (error) {
      await client.query('ROLLBACK'); // Rollback on error
      this.logger.error('Failed to update casting data', error);
      throw new Error('Failed to update casting data'); // Throw a generic error to keep details from the client
    } finally {
      client.release(); // Release the client back to the pool
    }
  }

  async toggleHighlight(userId: string) {
    const client = await this.dbService.pool.connect();
    try {
      await client.query('BEGIN');

      // Check current highlighted users
      const highlightCountQuery = `
      SELECT COUNT(*) FROM t_castings WHERE highlight = true;
    `;
      const highlightCountResult = await client.query(highlightCountQuery);
      const currentHighlightCount = parseInt(
        highlightCountResult.rows[0].count,
        10,
      );

      // Check if the user is currently highlighted
      const checkHighlightQuery = `
      SELECT highlight FROM t_castings WHERE user_id = $1;
    `;
      const checkHighlightResult = await client.query(checkHighlightQuery, [
        userId,
      ]);

      if (checkHighlightResult.rows.length > 0) {
        const isHighlighted = checkHighlightResult.rows[0].highlight;

        if (isHighlighted) {
          // If the user is already highlighted, remove the highlight
          const removeHighlightQuery = `
          UPDATE t_castings SET highlight = false WHERE user_id = $1;
        `;
          await client.query(removeHighlightQuery, [userId]);
          await client.query('COMMIT');
          return {
            status: 'success',
            message: 'User highlight removed successfully.',
          };
        } else {
          // If less than 5 users are highlighted, highlight the user
          if (currentHighlightCount < 5) {
            const highlightQuery = `
            UPDATE t_castings SET highlight = true WHERE user_id = $1;
          `;
            await client.query(highlightQuery, [userId]);
            await client.query('COMMIT');
            return {
              status: 'success',
              message: 'User highlighted successfully.',
            };
          } else {
            return {
              status: 'error',
              message:
                'Maximum number of highlighted users reached. Please un-highlight a user before highlighting another.',
            };
          }
        }
      } else {
        return { status: 'error', message: 'User not found.' };
      }
    } catch (error) {
      this.logger.error('Failed to toggle highlight', error);
      return {
        status: 'error',
        message: 'Failed to toggle highlight due to a server error.',
      };
    } finally {
      client.release();
    }
  }

  async getHighlightedCastingUsers() {
    const client = await this.dbService.pool.connect(); // Get a client from the pool
    try {
      // Query to fetch users who are highlighted
      const query = `
      SELECT u.id, u.name, u.email, u.phone, u.location, u.age, u.gender
      FROM t_users u
      JOIN t_castings c ON u.id = c.user_id
      WHERE c.highlight = TRUE; 
    `;

      const result = await client.query(query);
      return result.rows; // Return the array of highlighted users
    } catch (error) {
      this.logger.error('Failed to fetch highlighted casting users', error);
      throw new Error('Failed to fetch highlighted casting users'); // Throw an error for the controller to catch
    } finally {
      client.release(); // Release the client back to the pool
    }
  }

  async updateCastingFiles(
    castingId: string,
    fileUrls: {
      resumeLink?: string[];
      imageLinks?: string[];
      videoLink?: string[];
    },
  ): Promise<void> {
    const client = await this.dbService.pool.connect(); // Get a client from the pool
    try {
      await client.query('BEGIN'); // Start the transaction

      // Update the casting entity with the new file URLs
      const result = await client.query(
        `
      UPDATE t_castings SET
        resume_links = COALESCE($1, resume_links),
        image_links = COALESCE($2, image_links),
        video_links = COALESCE($3, video_links)
      WHERE id = $4;`,
        [
          fileUrls.resumeLink?.length ? fileUrls.resumeLink : null, // If no new link, keep existing
          fileUrls.imageLinks?.length ? fileUrls.imageLinks : null, // If no new links, keep existing
          fileUrls.videoLink?.length ? fileUrls.videoLink : null, // If no new link, keep existing
          castingId,
        ],
      );

      // Check if any row was updated
      if (result.rowCount === 0) {
        throw new Error(`No casting record found with ID ${castingId}`);
      }

      await client.query('COMMIT'); // Commit the transaction
    } catch (error) {
      await client.query('ROLLBACK'); // Rollback on error
      this.logger.error('Failed to update casting files', error); // Log the error
      throw new Error(
        'Failed to update casting files. Please try again later.',
      ); // Rethrow the error with a generic message
    } finally {
      client.release(); // Release the client back to the pool
    }
  }
}
