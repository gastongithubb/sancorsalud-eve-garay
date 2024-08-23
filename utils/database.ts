import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { gte, lte, sql, like, or } from 'drizzle-orm';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
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
  xLite: text('x_lite').notNull()
});

export const nps_diario = sqliteTable('nps_diario', {
  id: integer('id').primaryKey(),
  employeeName: text('employee_name').notNull(),
  date: text('date').notNull(),
  Q: integer('Q').notNull(),
  NPS: integer('NPS').notNull(),
  SAT: real('SAT').notNull(),
  RD: real('RD').notNull(),
});

export const trimetralMetrics = sqliteTable('trimestral_metrics', {
  id: integer('id').primaryKey(),
  employeeName: text('employee_name').notNull(),
  month: text('month').notNull(),
  Q: integer('Q').notNull(),
  NPS: integer('NPS').notNull(),
  SAT: real('SAT').notNull(),
  RD: real('RD').notNull(),
});

export const employeeMetrics = sqliteTable('employee_metrics', {
  id: integer('id').primaryKey(),
  nombre: text('nombre').notNull(),
  Atendidas: integer('Atendidas').notNull(),
  TiempoAtencion: integer('TiempoAtencion').notNull(),
  PromTAtencionMin: real('PromTAtencionMin'),
  PromTRingingSeg: real('PromTRingingSeg'),
  QdeEncuestas: integer('QdeEncuestas'),
  NPS: integer('NPS').notNull(),
  SAT: real('SAT').notNull(),
  RD: real('RD').notNull(),
  DiasLogueado: integer('DiasLogueado').notNull(),
  PromLogueo: text('PromLogueo').notNull(),
  PorcentajeReady: real('PorcentajeReady').notNull(),
  PorcentajeACD: real('PorcentajeACD').notNull(),
  PorcentajeNoDispTotal: real('PorcentajeNoDispTotal').notNull(),
  PorcentajeNoDispNoProductivo: real('PorcentajeNoDispNoProductivo').notNull(),
  PorcentajeNoDispProductivo: real('PorcentajeNoDispProductivo').notNull(),
  PromedioCalidad: real('PromedioCalidad').notNull(),
  EvActitudinal: text('EvActitudinal'),
  PromLlamXHora: real('PromLlamXHora').notNull(),
  Priorizacion: text('Priorizacion').notNull()
});



export const news = sqliteTable('news', {
  id: integer('id').primaryKey(),
  url: text('url').notNull(),
  title: text('title').notNull(),
  publishDate: text('publish_date').notNull(),
  estado: text('estado').notNull().default('activa'),
});



export const breaks = sqliteTable('breaks', {
  id: integer('id').primaryKey(),
  employeeName: text('employee_name').notNull(),
  date: text('date').notNull(),
  breakTime: text('break_time').notNull(),
});


// Type definitions
export type PersonnelSelect = typeof personnel.$inferSelect;
export type PersonnelInsert = typeof personnel.$inferInsert;
export type NewsSelect = typeof news.$inferSelect;
export type NewsInsert = typeof news.$inferInsert;
export type NPSDiarioSelect = typeof nps_diario.$inferSelect;
export type NPSDiarioInsert = typeof nps_diario.$inferInsert;
export type BreakSelect = typeof breaks.$inferSelect;
export type BreakInsert = typeof breaks.$inferInsert;
export type EmployeeMetricInsert = typeof employeeMetrics.$inferInsert;
export type EmployeeMetrics = {
  id?: number;
  nombre: string;
  Atendidas: number;
  TiempoAtencion: number;
  PromTAtencionMin?: number | null | undefined;
  PromTRingingSeg?: number | null | undefined;
  QdeEncuestas?: number | null | undefined;
  NPS: number;
  SAT: number;
  RD: number;
  DiasLogueado: number;
  PromLogueo: string;
  PorcentajeReady: number;
  PorcentajeACD: number;
  PorcentajeNoDispTotal: number;
  PorcentajeNoDispNoProductivo: number;
  PorcentajeNoDispProductivo: number;
  PromedioCalidad: number;
  EvActitudinal?: string | null | undefined;  // Allow null
  PromLlamXHora: number;
  Priorizacion: string;
};
export type EmployeeMetricSelect = typeof employeeMetrics.$inferSelect;
export type TrimestralMetricSelect = typeof trimetralMetrics.$inferSelect;
export type TrimestralMetricInsert = typeof trimetralMetrics.$inferInsert;
export type NovedadesRow = NewsSelect;
export type MonthlyData = {
  month: string;
  nps: number;
  csat: number;
  rd: number;
};

// Database initialization and table creation functions
export async function ensureTablesExist() {
  const client = getClient();
  try {
    console.log('Starting table verification...');

    // Create personnel table
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
      )
    `);
    console.log('Personnel table verified/created');

    // Create nps_diario table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS nps_diario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_name TEXT NOT NULL,
        date TEXT NOT NULL,
        Q INTEGER NOT NULL,
        NPS INTEGER NOT NULL,
        SAT REAL NOT NULL,
        RD REAL NOT NULL
      )
    `);
    console.log('NPS Diario table verified/created');

    await client.execute(`
      CREATE TABLE IF NOT EXISTS breaks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_name TEXT NOT NULL,
        date TEXT NOT NULL,
        break_time TEXT NOT NULL
      )
    `);
    console.log('Breaks table verified/created');

    // Create news table
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

    


    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export async function createOrUpdateEmployeeMetricsTable() {
  const client = getClient();
  try {
    // Verificar si la tabla existe
    const tableExists = await client.execute(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='employee_metrics';
    `);

    if (tableExists.rows.length === 0) {
      // Si la tabla no existe, créala
      await client.execute(`
        CREATE TABLE employee_metrics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          Atendidas INTEGER NOT NULL,
          TiempoAtencion INTEGER NOT NULL,
          PromTAtencionMin REAL,
          PromTRingingSeg REAL,
          QdeEncuestas INTEGER,
          NPS INTEGER NOT NULL,
          SAT REAL NOT NULL,
          RD REAL NOT NULL,
          DiasLogueado INTEGER NOT NULL,
          PromLogueo TEXT NOT NULL,
          PorcentajeReady REAL NOT NULL,
          PorcentajeACD REAL NOT NULL,
          PorcentajeNoDispTotal REAL NOT NULL,
          PorcentajeNoDispNoProductivo REAL NOT NULL,
          PorcentajeNoDispProductivo REAL NOT NULL,
          PromedioCalidad REAL NOT NULL,
          EvActitudinal TEXT,
          PromLlamXHora REAL NOT NULL,
          Priorizacion TEXT NOT NULL
        )
      `);
      console.log('Employee metrics table created successfully');
    } else {
      console.log('Employee metrics table already exists');
    }
  } catch (error) {
    console.error('Error creating or updating employee metrics table:', error);
    throw error;
  }
}

export async function createTrimestralMetricsTable() {
  const client = getClient();
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS trimestral_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_name TEXT NOT NULL,
        month TEXT NOT NULL,
        Q INTEGER NOT NULL,
        NPS INTEGER NOT NULL,
        SAT REAL NOT NULL,
        RD REAL NOT NULL
      )
    `);
    console.log('Trimestral metrics table created successfully');
  } catch (error) {
    console.error('Error creating trimestral metrics table:', error);
    throw error;
  }
}

export async function initializeAllTables() {
  await ensureTablesExist();
  await createOrUpdateEmployeeMetricsTable();
  await createTrimestralMetricsTable();
  console.log('All tables initialized successfully');
}

// Database operations

export async function getPersonnel(): Promise<PersonnelSelect[]> {
  const db = getDB();
  try {
    await ensureTablesExist();
    return await db.select().from(personnel).all();
  } catch (error: unknown) {
    console.error('Error fetching personnel:', error);
    throw new Error(`Failed to fetch personnel: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function addPersonnel(person: PersonnelInsert): Promise<void> {
  const db = getDB();
  try {
    await ensureTablesExist();
    await db.insert(personnel).values({
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email,
      dni: person.dni,
      entryTime: person.entryTime,
      exitTime: person.exitTime,
      hoursWorked: person.hoursWorked,
      xLite: person.xLite
    }).run();
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
      .set({
        firstName: person.firstName,
        lastName: person.lastName,
        email: person.email,
        dni: person.dni,
        entryTime: person.entryTime,
        exitTime: person.exitTime,
        hoursWorked: person.hoursWorked,
        xLite: person.xLite
      })
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

export async function getEmployeeMetrics(nombre?: string): Promise<EmployeeMetricSelect[]> {
  const db = getDB();
  try {
    await ensureTablesExist();
    const query = db.select().from(employeeMetrics);
    
    if (nombre) {
      return await query.where(eq(employeeMetrics.nombre, nombre)).all();
    } else {
      return await query.all();
    }
  } catch (error: unknown) {
    console.error('Error fetching employee metrics:', error);
    throw new Error(`Failed to fetch employee metrics: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function insertEmployeeMetric(metric: EmployeeMetrics): Promise<void> {
  const db = getDB();
  try {
    await db.insert(employeeMetrics).values({
      nombre: metric.nombre,
      Atendidas: metric.Atendidas,
      TiempoAtencion: metric.TiempoAtencion,
      PromTAtencionMin: metric.PromTAtencionMin,
      PromTRingingSeg: metric.PromTRingingSeg,
      QdeEncuestas: metric.QdeEncuestas,
      NPS: metric.NPS,
      SAT: metric.SAT,
      RD: metric.RD,
      DiasLogueado: metric.DiasLogueado,
      PromLogueo: metric.PromLogueo,
      PorcentajeReady: metric.PorcentajeReady,
      PorcentajeACD: metric.PorcentajeACD,
      PorcentajeNoDispTotal: metric.PorcentajeNoDispTotal,
      PorcentajeNoDispNoProductivo: metric.PorcentajeNoDispNoProductivo,
      PorcentajeNoDispProductivo: metric.PorcentajeNoDispProductivo,
      PromedioCalidad: metric.PromedioCalidad,
      EvActitudinal: metric.EvActitudinal,
      PromLlamXHora: metric.PromLlamXHora,
      Priorizacion: metric.Priorizacion
    }).run();
    console.log('Employee metric inserted successfully');
  } catch (error) {
    console.error('Error inserting employee metric:', error);
    throw new Error(`Failed to insert employee metric: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateEmployeeMetric(metric: EmployeeMetricSelect): Promise<void> {
  const db = getDB();
  try {
    await db
      .update(employeeMetrics)
      .set(metric)
      .where(eq(employeeMetrics.id, metric.id))
      .run();
  } catch (error: unknown) {
    console.error('Error updating employee metric:', error);
    throw new Error(`Failed to update employee metric: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function deleteEmployeeMetric(id: number): Promise<void> {
  const db = getDB();
  try {
    await db.delete(employeeMetrics).where(eq(employeeMetrics.id, id)).run();
  } catch (error: unknown) {
    console.error('Error deleting employee metric:', error);
    throw new Error(`Failed to delete employee metric: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function insertTrimestralMetric(metric: TrimestralMetricInsert): Promise<void> {
  const db = getDB();
  try {
    await db.insert(trimetralMetrics).values(metric).run();
  } catch (error: unknown) {
    console.error('Error inserting trimestral metric:', error);
    throw new Error(`Failed to insert trimestral metric: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getTrimestralMetrics(month?: string): Promise<TrimestralMetricSelect[]> {
  const db = getDB();
  try {
    const query = db.select().from(trimetralMetrics);
    if (month) {
      return query.where(eq(trimetralMetrics.month, month)).all();
    }
    return query.all();
  } catch (error) {
    console.error('Error fetching trimestral metrics:', error);
    throw new Error(`Failed to fetch trimestral metrics: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateTrimestralMetric(metric: TrimestralMetricSelect): Promise<void> {
  const db = getDB();
  try {
    await db
      .update(trimetralMetrics)
      .set(metric)
      .where(eq(trimetralMetrics.id, metric.id))
      .run();
  } catch (error: unknown) {
    console.error('Error updating trimestral metric:', error);
    throw new Error(`Failed to update trimestral metric: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function deleteTrimestralMetric(id: number): Promise<void> {
  const db = getDB();
  try {
    await db.delete(trimetralMetrics).where(eq(trimetralMetrics.id, id)).run();
  } catch (error: unknown) {
    console.error('Error deleting trimestral metric:', error);
    throw new Error(`Failed to delete trimestral metric: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getEmployeeMetricsCount(): Promise<number> {
  const db = getDB();
  try {
    const result = await db.select({ count: sql<number>`count(*)` }).from(employeeMetrics).all();
    return result[0].count;
  } catch (error) {
    console.error('Error getting employee metrics count:', error);
    throw new Error(`Failed to get employee metrics count: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getPaginatedEmployeeMetrics(page: number, pageSize: number): Promise<EmployeeMetricSelect[]> {
  const db = getDB();
  try {
    const offset = (page - 1) * pageSize;
    return await db.select()
      .from(employeeMetrics)
      .limit(pageSize)
      .offset(offset)
      .all();
  } catch (error) {
    console.error('Error fetching paginated employee metrics:', error);
    throw new Error(`Failed to fetch paginated employee metrics: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getEmployeeMetricsByDateRange(startDate: number, endDate: number): Promise<EmployeeMetricSelect[]> {
  const db = getDB();
  try {
    return await db.select()
      .from(employeeMetrics)
      .where(
        and(
          gte(employeeMetrics.DiasLogueado, startDate),
          lte(employeeMetrics.DiasLogueado, endDate)
        )
      )
      .all();
  } catch (error) {
    console.error('Error fetching employee metrics by date range:', error);
    throw new Error(`Failed to fetch employee metrics by date range: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getEmployeeMetricsStats(): Promise<{
  totalEmployees: number,
  averageNPS: number,
  averageSAT: number,
  averageRD: number,
  totalAtendidas: number
}> {
  const db = getDB();
  try {
    const result = await db.select({
      totalEmployees: sql<number>`COUNT(DISTINCT ${employeeMetrics.nombre})`,
      averageNPS: sql<number>`AVG(${employeeMetrics.NPS})`,
      averageSAT: sql<number>`AVG(${employeeMetrics.SAT})`,
      averageRD: sql<number>`AVG(${employeeMetrics.RD})`,
      totalAtendidas: sql<number>`SUM(${employeeMetrics.Atendidas})`
    }).from(employeeMetrics).get();

    return result || {
      totalEmployees: 0,
      averageNPS: 0,
      averageSAT: 0,
      averageRD: 0,
      totalAtendidas: 0
    };
  } catch (error) {
    console.error('Error getting employee metrics stats:', error);
    throw new Error(`Failed to get employee metrics stats: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function searchPersonnel(searchTerm: string): Promise<PersonnelSelect[]> {
  const db = getDB();
  try {
    return await db.select()
      .from(personnel)
      .where(
        or(
          like(personnel.firstName, `%${searchTerm}%`),
          like(personnel.lastName, `%${searchTerm}%`),
          like(personnel.dni, `%${searchTerm}%`)
        )
      )
      .all();
  } catch (error) {
    console.error('Error searching personnel:', error);
    throw new Error(`Failed to search personnel: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getTrimestralMetricById(id: number): Promise<TrimestralMetricSelect | undefined> {
  const db = getDB();
  try {
    return await db.select().from(trimetralMetrics).where(eq(trimetralMetrics.id, id)).get();
  } catch (error) {
    console.error('Error fetching trimestral metric by id:', error);
    throw new Error(`Failed to fetch trimestral metric by id: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateTrimestralMetricById(id: number, metric: Partial<TrimestralMetricInsert>): Promise<void> {
  const db = getDB();
  try {
    await db.update(trimetralMetrics).set(metric).where(eq(trimetralMetrics.id, id)).run();
  } catch (error) {
    console.error('Error updating trimestral metric by id:', error);
    throw new Error(`Failed to update trimestral metric by id: ${error instanceof Error ? error.message : String(error)}`);
  }
}



export async function insertNPSDiario(metric: NPSDiarioInsert): Promise<void> {
  const db = getDB();
  try {
    await db.insert(nps_diario).values(metric).run();
  } catch (error) {
    console.error('Error inserting NPS diario:', error);
    throw new Error(`Failed to insert NPS diario: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getNPSDiario(): Promise<NPSDiarioSelect[]> {
  const db = getDB();
  try {
    return await db.select().from(nps_diario).all();
  } catch (error) {
    console.error('Error fetching NPS diario:', error);
    throw new Error(`Failed to fetch NPS diario: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function clearNPSDiario(): Promise<void> {
  const db = getDB();
  try {
    await db.delete(nps_diario).run();
  } catch (error) {
    console.error('Error clearing NPS diario:', error);
    throw new Error(`Failed to clear NPS diario: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function insertBreak(breakData: BreakInsert): Promise<void> {
  const db = getDB();
  try {
    await db.insert(breaks).values(breakData).run();
  } catch (error) {
    console.error('Error inserting break:', error);
    throw new Error(`Failed to insert break: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Function to get all breaks
export async function getBreaks(): Promise<BreakSelect[]> {
  const db = getDB();
  try {
    return await db.select().from(breaks).all();
  } catch (error) {
    console.error('Error fetching breaks:', error);
    throw new Error(`Failed to fetch breaks: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Function to clear all breaks
export async function clearBreaks(): Promise<void> {
  const db = getDB();
  try {
    await db.delete(breaks).run();
  } catch (error) {
    console.error('Error clearing breaks:', error);
    throw new Error(`Failed to clear breaks: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Function to get breaks by date
export async function getBreaksByDate(date: string): Promise<BreakSelect[]> {
  const db = getDB();
  try {
    return await db.select().from(breaks).where(eq(breaks.date, date)).all();
  } catch (error) {
    console.error('Error fetching breaks by date:', error);
    throw new Error(`Failed to fetch breaks by date: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Function to update a break
export async function updateBreak(id: number, breakData: Partial<BreakInsert>): Promise<void> {
  const db = getDB();
  try {
    await db.update(breaks).set(breakData).where(eq(breaks.id, id)).run();
  } catch (error) {
    console.error('Error updating break:', error);
    throw new Error(`Failed to update break: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Function to delete a break
export async function deleteBreak(id: number): Promise<void> {
  const db = getDB();
  try {
    await db.delete(breaks).where(eq(breaks.id, id)).run();
  } catch (error) {
    console.error('Error deleting break:', error);
    throw new Error(`Failed to delete break: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Export all necessary functions and types
export {
  eq,
  and,
  desc,
  sql,
  like,
  or,
  gte,
  lte
};