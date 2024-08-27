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
  xLite: text('x_lite').notNull(),
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

export const customerExperience = sqliteTable('customer_experience', {
  id: integer('id').primaryKey(),
  ExperienciaColaborador: text('ExperienciaColaborador').notNull(),
  NpsDescripcionEncuestaWit: text('NpsDescripcionEncuestaWit').notNull(),
  NumeroCasoCRM: text('NumeroCasoCRM').notNull(),
  ResolucionDeclaradaEncuestaWit: text('ResolucionDeclaradaEncuestaWit').notNull(),
  SatisfaccionCsatEncuestaWit: text('SatisfaccionCsatEncuestaWit').notNull(),
  SubtipoCasoCRM: text('SubtipoCasoCRM').notNull(),
  SubtipoFinalCasoCRM: text('SubtipoFinalCasoCRM').notNull(),
  TipoCaso: text('TipoCaso').notNull(),
  TipoRegistro: text('TipoRegistro').notNull(),
  NpsEncuestaWit: text('NpsEncuestaWit').notNull(),
  DiaSinHora: text('DiaSinHora').notNull(),
  EsfuerzoCesEncuestaWit: text('EsfuerzoCesEncuestaWit').notNull(),
  DescCESAgrupado: text('DescCESAgrupado').notNull(),
  DescSATAgrupado: text('DescSATAgrupado').notNull(),
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

export const employeeScores = sqliteTable('employee_scores', {
  id: integer('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  month: text('month').notNull(),
  week: text('week').notNull(),
  call: text('call').notNull(),
  score: real('score'),
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
export type CustomerExperienceSelect = typeof customerExperience.$inferSelect;
export type CustomerExperienceInsert = typeof customerExperience.$inferInsert;
export type EmployeeScoreInsert = typeof employeeScores.$inferInsert;
export type EmployeeScoreSelect = typeof employeeScores.$inferSelect
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
        x_lite TEXT NOT NULL
      )
    `);
    console.log('Personnel table verified/created');

    await client.execute(`
      CREATE TABLE IF NOT EXISTS employee_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        name TEXT NOT NULL,
        month TEXT NOT NULL,
        week TEXT NOT NULL,
        call TEXT NOT NULL,
        score REAL
      )
    `);
    console.log('Employee scores table verified/created');

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
      CREATE TABLE IF NOT EXISTS customer_experience (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ExperienciaColaborador TEXT NOT NULL,
        NpsDescripcionEncuestaWit TEXT NOT NULL,
        NumeroCasoCRM TEXT NOT NULL,
        ResolucionDeclaradaEncuestaWit TEXT NOT NULL,
        SatisfaccionCsatEncuestaWit TEXT NOT NULL,
        SubtipoCasoCRM TEXT NOT NULL,
        SubtipoFinalCasoCRM TEXT NOT NULL,
        TipoCaso TEXT NOT NULL,
        TipoRegistro TEXT NOT NULL,
        NpsEncuestaWit TEXT NOT NULL,
        DiaSinHora TEXT NOT NULL,
        EsfuerzoCesEncuestaWit TEXT NOT NULL,
        DescCESAgrupado TEXT NOT NULL,
        DescSATAgrupado TEXT NOT NULL
      )
    `);
    console.log('CUSTOMER EXPERIENCE table verified/created');

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



export async function insertNPSDiario(metric: {
  employeeName: string;
  date: string;
  Q: number;
  NPS: number;
  SAT: number | null;
  RD: number;
}): Promise<void> {
  const db = getDB();
  try {
    await db.insert(nps_diario).values({
      employeeName: metric.employeeName,
      date: metric.date,
      Q: metric.Q,
      NPS: metric.NPS,
      SAT: metric.SAT ?? 0, // Use 0 as default if SAT is null or undefined
      RD: metric.RD
    }).run();
    console.log('NPS diario inserted successfully');
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

export async function deletePersonnel(id: number): Promise<void> {
  const db = getDB();
  try {
    await db.delete(personnel).where(eq(personnel.id, id)).run();
    console.log(`Personnel with id ${id} deleted successfully`);
  } catch (error: unknown) {
    console.error('Error deleting personnel:', error);
    throw new Error(`Failed to delete personnel: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Función para insertar datos de experiencia del cliente
export async function insertCustomerExperience(data: CustomerExperienceInsert): Promise<void> {
  const db = getDB();
  try {
    await db.insert(customerExperience).values(data).run();
    console.log('Customer Experience data inserted successfully');
  } catch (error) {
    console.error('Error inserting Customer Experience data:', error);
    throw new Error(`Failed to insert Customer Experience data: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Función para obtener todos los datos de experiencia del cliente
export async function getCustomerExperienceData(): Promise<CustomerExperienceSelect[]> {
  const db = getDB();
  try {
    return await db.select().from(customerExperience).all();
  } catch (error) {
    console.error('Error fetching Customer Experience data:', error);
    throw new Error(`Failed to fetch Customer Experience data: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Función para obtener datos de experiencia del cliente paginados
export async function getPaginatedCustomerExperienceData(page: number, pageSize: number): Promise<CustomerExperienceSelect[]> {
  const db = getDB();
  try {
    const offset = (page - 1) * pageSize;
    return await db.select()
      .from(customerExperience)
      .limit(pageSize)
      .offset(offset)
      .all();
  } catch (error) {
    console.error('Error fetching paginated Customer Experience data:', error);
    throw new Error(`Failed to fetch paginated Customer Experience data: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Función para obtener el conteo total de registros de experiencia del cliente
export async function getCustomerExperienceCount(): Promise<number> {
  const db = getDB();
  try {
    const result = await db.select({ count: sql<number>`count(*)` }).from(customerExperience).all();
    return result[0].count;
  } catch (error) {
    console.error('Error getting Customer Experience count:', error);
    throw new Error(`Failed to get Customer Experience count: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Función para actualizar un registro de experiencia del cliente
export async function updateCustomerExperience(id: number, data: Partial<CustomerExperienceInsert>): Promise<void> {
  const db = getDB();
  try {
    await db.update(customerExperience).set(data).where(eq(customerExperience.id, id)).run();
    console.log(`Customer Experience record with id ${id} updated successfully`);
  } catch (error) {
    console.error('Error updating Customer Experience record:', error);
    throw new Error(`Failed to update Customer Experience record: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Función para eliminar un registro de experiencia del cliente
export async function deleteCustomerExperience(id: number): Promise<void> {
  const db = getDB();
  try {
    await db.delete(customerExperience).where(eq(customerExperience.id, id)).run();
    console.log(`Customer Experience record with id ${id} deleted successfully`);
  } catch (error) {
    console.error('Error deleting Customer Experience record:', error);
    throw new Error(`Failed to delete Customer Experience record: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Function to insert a new score
export async function insertEmployeeScore(score: EmployeeScoreInsert): Promise<void> {
  const db = getDB();
  try {
    await db.insert(employeeScores).values(score).run();
    console.log('Employee score inserted successfully');
  } catch (error) {
    console.error('Error inserting employee score:', error);
    throw new Error(`Failed to insert employee score: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Function to get scores for a specific employee and month
export async function getEmployeeScores(email: string, month: string): Promise<EmployeeScoreSelect[]> {
  const db = getDB();
  try {
    return await db.select()
      .from(employeeScores)
      .where(and(
        eq(employeeScores.email, email),
        eq(employeeScores.month, month)
      ))
      .all();
  } catch (error) {
    console.error('Error fetching employee scores:', error);
    throw new Error(`Failed to fetch employee scores: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Function to update an existing score
export async function updateEmployeeScore(id: number, score: Partial<EmployeeScoreInsert>): Promise<void> {
  const db = getDB();
  try {
    await db.update(employeeScores)
      .set(score)
      .where(eq(employeeScores.id, id))
      .run();
    console.log(`Employee score with id ${id} updated successfully`);
  } catch (error) {
    console.error('Error updating employee score:', error);
    throw new Error(`Failed to update employee score: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Function to delete a score
export async function deleteEmployeeScore(id: number): Promise<void> {
  const db = getDB();
  try {
    await db.delete(employeeScores)
      .where(eq(employeeScores.id, id))
      .run();
    console.log(`Employee score with id ${id} deleted successfully`);
  } catch (error) {
    console.error('Error deleting employee score:', error);
    throw new Error(`Failed to delete employee score: ${error instanceof Error ? error.message : String(error)}`);
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