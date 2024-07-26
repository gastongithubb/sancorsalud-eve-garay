import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { eq, and, desc } from 'drizzle-orm';
import { config } from './config';

// Type definitions
type Client = ReturnType<typeof createClient>;
type DB = ReturnType<typeof drizzle>;

// Variables for client and database
let client: Client | null = null;
let db: DB | null = null;

// Function to initialize the database
function initializeDatabase() {
  console.log('Initializing database configuration...');
  console.log('Connection URL:', config.tursoConnectionUrl);
  console.log('Auth token available:', !!config.tursoAuthToken);

  if (!config.tursoConnectionUrl) {
    throw new Error('Database connection URL is not defined');
  }

  if (!config.tursoAuthToken) {
    throw new Error('Database auth token is not defined');
  }

  try {
    client = createClient({
      url: config.tursoConnectionUrl,
      authToken: config.tursoAuthToken
    });
    console.log('Database client created successfully');

    db = drizzle(client);
    console.log('Drizzle instance created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Initialize the database
try {
  initializeDatabase();
} catch (error) {
  console.error('Critical error initializing database:', error);
}

// Function to get the database client
export function getClient(): Client {
  if (!client) {
    throw new Error('Database client not initialized');
  }
  return client;
}

// Function to get the database instance
export function getDB(): DB {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

// Table definitions
export const personnel = sqliteTable('personnel', {
  id: integer('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  dni: text('dni').notNull(),
  entryTime: text('entry_time').notNull(),
  exitTime: text('exit_time').notNull(),
  hoursWorked: integer('hours_worked').notNull(),
  xLite: text('x_lite').notNull(),
  responses: integer('responses').notNull().default(0),
  nps: integer('nps').notNull().default(0),
  csat: integer('csat').notNull().default(0),
  rd: integer('rd').notNull().default(0),
  month: text('month').notNull()
});

export const breakSchedules = sqliteTable('break_schedules', {
  id: integer('id').primaryKey(),
  personnelId: integer('personnel_id').notNull(),
  day: text('day').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  week: integer('week').notNull(),
  month: integer('month').notNull(),
  year: integer('year').notNull(),
});

export const news = sqliteTable('news', {
  id: integer('id').primaryKey(),
  url: text('url').notNull(),
  title: text('title').notNull(),
  publishDate: text('publish_date').notNull(),
  estado: text('estado').notNull().default('activa'),
});

export const syncLogs = sqliteTable('sync_logs', {
  id: integer('id').primaryKey(),
  syncDate: text('sync_date').notNull(),
  sheetName: text('sheet_name').notNull(),
  lastSyncedRow: integer('last_synced_row').notNull(),
  status: text('status').notNull(),
});

// Type definitions
export type PersonnelSelect = typeof personnel.$inferSelect;
export type PersonnelInsert = typeof personnel.$inferInsert;
export type BreakScheduleSelect = typeof breakSchedules.$inferSelect;
export type BreakScheduleInsert = typeof breakSchedules.$inferInsert;
export type NewsSelect = typeof news.$inferSelect;
export type NewsInsert = typeof news.$inferInsert;
export type SyncLogSelect = typeof syncLogs.$inferSelect;
export type SyncLogInsert = typeof syncLogs.$inferInsert;

// Database initialization
export async function ensureTablesExist() {
  const client = getClient();
  try {
    console.log('Starting table verification...');

    await client.execute(`
      CREATE TABLE IF NOT EXISTS personnel (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        dni TEXT NOT NULL,
        entry_time TEXT NOT NULL,
        exit_time TEXT NOT NULL,
        hours_worked INTEGER NOT NULL,
        x_lite TEXT NOT NULL,
        responses INTEGER NOT NULL DEFAULT 0,
        nps INTEGER NOT NULL DEFAULT 0,
        csat INTEGER NOT NULL DEFAULT 0,
        rd INTEGER NOT NULL DEFAULT 0,
        month TEXT NOT NULL
      )
    `);
    console.log('Personnel table verified/created');

    await client.execute(`
      CREATE TABLE IF NOT EXISTS break_schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personnel_id INTEGER NOT NULL,
        day TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        week INTEGER NOT NULL,
        month INTEGER NOT NULL,
        year INTEGER NOT NULL,
        FOREIGN KEY (personnel_id) REFERENCES personnel(id)
      )
    `);
    console.log('Break schedules table verified/created');

    await client.execute(`
      CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL,
        title TEXT NOT NULL,
        publish_date TEXT NOT NULL,
        estado TEXT NOT NULL DEFAULT 'activa'
      )
    `);
    console.log('News table verified/created');

    await client.execute(`
      CREATE TABLE IF NOT EXISTS sync_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sync_date TEXT NOT NULL,
        sheet_name TEXT NOT NULL,
        last_synced_row INTEGER NOT NULL,
        status TEXT NOT NULL
      )
    `);
    console.log('Sync logs table verified/created');

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Personnel operations
export async function getPersonnel(month?: string): Promise<PersonnelSelect[]> {
  const db = getDB();
  try {
    await ensureTablesExist();
    const query = db.select().from(personnel);
    
    if (month) {
      return await query.where(eq(personnel.month, month)).all();
    } else {
      return await query.all();
    }
  } catch (error: unknown) {
    console.error('Error fetching personnel:', error);
    throw new Error(`Failed to fetch personnel: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function addPersonnel(person: PersonnelInsert): Promise<void> {
  const db = getDB();
  try {
    await ensureTablesExist();
    await db.insert(personnel).values(person).run();
  } catch (error: unknown) {
    console.error('Error adding personnel:', error);
    throw new Error(`Failed to add personnel: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updatePersonnel(person: PersonnelSelect): Promise<void> {
  const db = getDB();
  try {
    await db
      .update(personnel)
      .set(person)
      .where(eq(personnel.id, person.id))
      .run();
  } catch (error: unknown) {
    console.error('Error updating personnel:', error);
    throw new Error(`Failed to update personnel: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updatePersonnelXLite(id: number, xLite: string): Promise<void> {
  const db = getDB();
  try {
    await db.update(personnel)
      .set({ xLite })
      .where(eq(personnel.id, id))
      .run();
  } catch (error: unknown) {
    console.error('Error updating personnel X LITE:', error);
    throw new Error(`Failed to update personnel X LITE: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Break schedule operations
export async function getBreakSchedules(personnelId: number, month: number, year: number): Promise<BreakScheduleSelect[]> {
  const db = getDB();
  try {
    await ensureTablesExist();
    return await db.select()
      .from(breakSchedules)
      .where(and(
        eq(breakSchedules.personnelId, personnelId),
        eq(breakSchedules.month, month),
        eq(breakSchedules.year, year)
      ))
      .all();
  } catch (error: unknown) {
    console.error('Error fetching break schedules:', error);
    throw new Error(`Failed to fetch break schedules: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateBreakSchedule(schedule: BreakScheduleInsert): Promise<void> {
  const db = getDB();
  try {
    console.log('Attempting to update break schedule:', schedule);
    
    const result = await db
      .update(breakSchedules)
      .set({
        startTime: schedule.startTime,
        endTime: schedule.endTime
      })
      .where(and(
        eq(breakSchedules.personnelId, schedule.personnelId),
        eq(breakSchedules.day, schedule.day),
        eq(breakSchedules.week, schedule.week),
        eq(breakSchedules.month, schedule.month),
        eq(breakSchedules.year, schedule.year)
      ))
      .run();

    if (result.rowsAffected === 0) {
      await db.insert(breakSchedules)
        .values(schedule)
        .run();
    }

    console.log('Break schedule updated or inserted successfully');
  } catch (error: unknown) {
    console.error('Detailed error updating break schedule:', error);
    throw new Error(`Failed to update break schedule: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// News operations
export async function getNews(page: number = 1, limit: number = 10): Promise<NewsSelect[]> {
  const db = getDB();
  try {
    await ensureTablesExist();
    const offset = (page - 1) * limit;
    return await db.select()
      .from(news)
      .limit(limit)
      .offset(offset)
      .all();
  } catch (error: unknown) {
    console.error('Error fetching news:', error);
    throw new Error(`Failed to fetch news: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function addNews(newsItem: NewsInsert): Promise<void> {
  const db = getDB();
  try {
    await ensureTablesExist();
    await db.insert(news).values(newsItem).run();
  } catch (error: unknown) {
    console.error('Error adding news:', error);
    throw new Error(`Failed to add news: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function deleteNews(id: number): Promise<void> {
  const db = getDB();
  try {
    await db.delete(news).where(eq(news.id, id)).run();
  } catch (error: unknown) {
    console.error('Error deleting news:', error);
    throw new Error(`Failed to delete news: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateNewsStatus(id: number, newStatus: NewsSelect['estado']): Promise<void> {
  const db = getDB();
  try {
    await db.update(news)
      .set({ estado: newStatus })
      .where(eq(news.id, id))
      .run();
    console.log(`News ${id} status updated to ${newStatus}`);
  } catch (error: unknown) {
    console.error('Error updating news status:', error);
    throw new Error(`Failed to update news status: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateNews(newsItem: NewsSelect): Promise<void> {
  const db = getDB();
  try {
    await db.update(news)
      .set({
        url: newsItem.url,
        title: newsItem.title,
        publishDate: newsItem.publishDate,
        estado: newsItem.estado
      })
      .where(eq(news.id, newsItem.id))
      .run();
    console.log(`News ${newsItem.id} updated successfully`);
  } catch (error: unknown) {
    console.error('Error updating news:', error);
    throw new Error(`Failed to update news: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Sync log operations
export async function logSync(sheetName: string, lastSyncedRow: number, status: string): Promise<void> {
  const db = getDB();
  try {
    await db.insert(syncLogs).values({
      syncDate: new Date().toISOString(),
      sheetName,
      lastSyncedRow,
      status
    }).run();
  } catch (error) {
    console.error('Error logging sync:', error);
    throw error;
  }
}

export async function getLastSyncedRow(sheetName: string): Promise<number> {
  const db = getDB();
  try {
    const result = await db.select({ lastSyncedRow: syncLogs.lastSyncedRow })
      .from(syncLogs)
      .where(eq(syncLogs.sheetName, sheetName))
      .orderBy(desc(syncLogs.syncDate))
      .limit(1)
      .all();
    
    return result.length > 0 ? result[0].lastSyncedRow : 0;
  } catch (error) {
    console.error('Error getting last synced row:', error);
    throw error;
  }
}

export async function syncSheetsToTurso(sheetName: string, data: any[]): Promise<void> {
  const db = getDB();
  try {
    const lastSyncedRow = await getLastSyncedRow(sheetName);
    const newData = data.slice(lastSyncedRow);

    for (const row of newData) {
      if (sheetName === 'personnel') {
        await db.insert(personnel).values(row).onConflictDoUpdate({
          target: [personnel.dni],
          set: row
        }).run();
      }
      // Add more conditions for other sheets as needed
    }

    await logSync(sheetName, data.length, 'success');
  } catch (error) {
    console.error('Error syncing data from Google Sheets to Turso:', error);
    await logSync(sheetName, await getLastSyncedRow(sheetName), 'error');
    throw error;
  }
}

// Function to close the database connection
export async function closeDatabase() {
  if (client) {
    try {
      await client.close();
      console.log('Database connection closed successfully');
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }
}

// Function to reset the database connection
export async function resetDatabaseConnection() {
  try {
    if (client) {
      await closeDatabase();
    }
    initializeDatabase();
    console.log('Database connection reset successfully');
  } catch (error) {
    console.error('Error resetting database connection:', error);
    throw error;
  }
}

// Utility function to run migrations
export async function runMigrations() {
  const client = getClient();
  try {
    console.log('Starting migrations...');
    // Add your specific migrations here
    // For example:
    // await client.execute(`ALTER TABLE personnel ADD COLUMN new_column TEXT`);
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
}

// Function to update a user
export async function updateUser(user: PersonnelSelect): Promise<void> {
  const db = getDB();
  try {
    await db
      .update(personnel)
      .set(user)
      .where(eq(personnel.id, user.id))
      .run();
    console.log(`User ${user.id} updated successfully`);
  } catch (error: unknown) {
    console.error('Error updating user:', error);
    throw new Error(`Failed to update user: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export { eq, and, desc };