import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { DatabaseService } from '../database/database.service';
import { Contact } from 'src/models/contact.model';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly dbService: DatabaseService) {}

  async addContact(createContactDto: CreateContactDto) {
    const client = await this.dbService.pool.connect();
    try {
      await client.query('BEGIN');

      // Insert user data
      const userResult = await client.query(
        `INSERT INTO t_users (name, email, phone) VALUES ($1, $2, $3) RETURNING id`,
        [createContactDto.name, createContactDto.email, createContactDto.phone],
      );
      const userId = userResult.rows[0].id;

      // Insert contact data
      const contactResult = await client.query(
        `INSERT INTO t_contacts (user_id, message, type) 
         VALUES ($1, $2, $3) RETURNING id`,
        [userId, createContactDto.message, createContactDto.type],
      );

      await client.query('COMMIT');
      return contactResult.rows[0]; // Return newly created contact
    } catch (error) {
      await client.query('ROLLBACK');
      this.logger.error(error);
      throw new HttpException(
        'Failed to add contact',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      client.release();
    }
  }

  async toggleContacted(userId: string): Promise<Contact> {
    const client = await this.dbService.pool.connect();
    try {
      await client.query('BEGIN');

      // Fetch the current status of 'contacted'
      const { rows } = await client.query(
        `SELECT contacted FROM t_contacts WHERE user_id = $1 FOR UPDATE`,
        [userId],
      );

      if (rows.length === 0) {
        throw new Error(`No contact found with userId: ${userId}`);
      }

      const currentStatus = rows[0].contacted;
      const newStatus = !currentStatus;

      // Toggle the contacted status
      const result = await client.query(
        `UPDATE t_contacts SET contacted = $1 WHERE user_id = $2 RETURNING contacted`,
        [newStatus, userId],
      );

      await client.query('COMMIT');
      return result.rows[0]; // Return the updated row
    } catch (error) {
      await client.query('ROLLBACK');
      this.logger.error('Failed to toggle contacted status', error);
      throw new Error('Failed to toggle contacted status');
    } finally {
      client.release();
    }
  }

  async getContacts(
    page: number,
    limit: number,
    search?: string,
  ): Promise<any> {
    const offset = (page - 1) * limit;

    let query = `
    SELECT
      c.id as contact_id,
      c.message,
      c.type,
      c.contacted,
      c.created_at as contact_created_at,
      u.id as user_id,
      u.name,
      u.email,
      u.phone,
      u.location,
      u.age,
      u.gender,
      u.created_at as user_created_at
    FROM t_contacts c
    JOIN t_users u ON c.user_id = u.id
    WHERE c.active = true
  `;

    let countQuery = `
    SELECT COUNT(u.email) FROM t_contacts c
    JOIN t_users u ON c.user_id = u.id
    WHERE c.active = true
  `;

    if (search) {
      query += `
      AND (
        u.name ILIKE '%${search}%' OR
        u.email ILIKE '%${search}%' OR
        u.phone ILIKE '%${search}%' OR
        u.location ILIKE '%${search}%'
      )
    `;
      countQuery += `
      AND (
        u.name ILIKE '%${search}%' OR
        u.email ILIKE '%${search}%' OR
        u.phone ILIKE '%${search}%' OR
        u.location ILIKE '%${search}%'
      )
    `;
    }

    query += `
    ORDER BY c.created_at DESC
    LIMIT ${limit} OFFSET ${page};
  `;

    const contacts = await this.dbService.pool.query(query);

    const total = await this.dbService.pool.query(countQuery); // Remove limit and offset for count query
    return {
      data: contacts.rows,
      total: total.rows[0].count - 1,
      currentPage: page,
      totalPages: Math.ceil(total.rows[0].count / limit),
    };
  }
}
