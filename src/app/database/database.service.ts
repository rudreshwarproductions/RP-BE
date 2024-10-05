import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client, Pool, QueryResult } from 'pg';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async executeQuery(queryText: string, values: any[] = []): Promise<any[]> {
    this.logger.debug(`Executing query: ${queryText} [${values}]`);

    try {
      const result: QueryResult = await this.pool.query(queryText, values);
      this.logger.debug(`Executed query, result size ${result.rows.length}`);
      return result.rows;
    } catch (err) {
      this.logger.error(`Error executing query: ${queryText}`, err.stack);
      throw new Error('Query execution failed');
    }
  }
}
