import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const { userId } = req.query;
        
        // Get all data sources with their tables and schema fields
        const result = await pool.query(`
          WITH schema_fields AS (
            SELECT 
              dst.id as table_id,
              json_agg(
                json_build_object(
                  'name', tsf.field_name,
                  'type', tsf.field_type,
                  'description', tsf.field_description
                )
              ) as schema
            FROM data_source_tables dst
            LEFT JOIN table_schema_fields tsf ON tsf.table_id = dst.id
            GROUP BY dst.id
          )
          SELECT 
            ds.*,
            json_agg(
              json_build_object(
                'id', dst.id,
                'tableId', dst.table_id,
                'name', dst.table_name,
                'syncMode', dst.sync_mode,
                'syncInterval', dst.sync_interval,
                'primaryKey', dst.primary_key,
                'cursorField', dst.cursor_field,
                'isFullSync', dst.is_full_sync,
                'fullSyncSchedule', dst.full_sync_schedule,
                'isProtected', dst.is_protected,
                'lastSync', dst.last_sync,
                'rowCount', dst.row_count,
                'schema', sf.schema
              )
            ) as tables
          FROM data_sources ds
          LEFT JOIN data_source_tables dst ON dst.data_source_id = ds.id
          LEFT JOIN schema_fields sf ON sf.table_id = dst.id
          WHERE ds.user_id = $1
          GROUP BY ds.id
        `, [userId]);

        res.status(200).json(result.rows);
      } catch (error) {
        console.error('Failed to fetch data sources:', error);
        res.status(500).json({ error: 'Failed to fetch data sources' });
      }
      break;

    case 'POST':
      try {
        const { 
          name, 
          type, 
          connectionName, 
          integrationId, 
          userId,
          tables 
        } = req.body;

        // Start a transaction
        const client = await pool.connect();
        try {
          await client.query('BEGIN');

          // Create data source
          const dataSourceResult = await client.query(`
            INSERT INTO data_sources (name, type, connection_name, integration_id, user_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
          `, [name, type, connectionName, integrationId, userId]);

          const dataSourceId = dataSourceResult.rows[0].id;

          // Create tables and schema fields
          for (const table of tables) {
            // Insert table
            const tableResult = await client.query(`
              INSERT INTO data_source_tables (
                data_source_id, table_id, table_name, sync_mode, 
                sync_interval, primary_key, cursor_field, is_full_sync,
                full_sync_schedule, is_protected
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
              RETURNING id
            `, [
              dataSourceId,
              table.id,
              table.name,
              table.syncMode,
              table.syncInterval,
              table.primaryKey,
              table.cursorField,
              table.isFullSync,
              table.fullSyncSchedule,
              table.isProtected
            ]);

            const tableId = tableResult.rows[0].id;

            // Insert schema fields if available
            if (table.schema && table.schema.length > 0) {
              const schemaValues = table.schema.map(field => 
                `(${tableId}, '${field.name}', '${field.type}', ${field.description ? `'${field.description}'` : 'NULL'})`
              ).join(',');

              await client.query(`
                INSERT INTO table_schema_fields (table_id, field_name, field_type, field_description)
                VALUES ${schemaValues}
              `);
            }
          }

          await client.query('COMMIT');
          res.status(201).json({ success: true, dataSourceId });
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        } finally {
          client.release();
        }
      } catch (error) {
        console.error('Failed to create data source:', error);
        res.status(500).json({ error: 'Failed to create data source' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 