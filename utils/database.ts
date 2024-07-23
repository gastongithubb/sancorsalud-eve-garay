import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { sql, SQL } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { eq, and, desc } from 'drizzle-orm';
import { config } from './config';

// Definición de tipos
type Client = ReturnType<typeof createClient>;
type DB = ReturnType<typeof drizzle>;

// Variables para el cliente y la base de datos
let client: Client | null = null;
let db: DB | null = null;

// Función para inicializar el cliente y la base de datos
function initializeDatabase() {
  console.log('Iniciando la configuración de la base de datos...');
  console.log('URL de conexión:', config.tursoConnectionUrl);
  console.log('Token de autenticación disponible:', !!config.tursoAuthToken);

  if (!config.tursoConnectionUrl) {
    throw new Error('La URL de conexión a la base de datos no está definida');
  }

  if (!config.tursoAuthToken) {
    throw new Error('El token de autenticación de la base de datos no está definido');
  }

  try {
    client = createClient({
      url: config.tursoConnectionUrl,
      authToken: config.tursoAuthToken
    });
    console.log('Cliente de base de datos creado con éxito');

    db = drizzle(client);
    console.log('Instancia de Drizzle creada con éxito');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
}

// Inicializar la base de datos
try {
  initializeDatabase();
} catch (error) {
  console.error('Error crítico al inicializar la base de datos:', error);
}

// Función para obtener el cliente de la base de datos
export function getClient(): Client {
  if (!client) {
    throw new Error('Cliente de base de datos no inicializado');
  }
  return client;
}

// Función para obtener la instancia de la base de datos
export function getDB(): DB {
  if (!db) {
    throw new Error('Base de datos no inicializada');
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
  rd: integer('rd').notNull().default(0)
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

export const npsTrimestral = sqliteTable('nps_trimestral', {
  id: integer('id').primaryKey(),
  personnelId: integer('personnel_id').notNull(),
  month: text('month').notNull(),
  nps: integer('nps').notNull(),
});

export const uploadedFiles = sqliteTable('uploaded_files', {
  id: integer('id').primaryKey(),
  fileName: text('file_name').notNull(),
  fileType: text('file_type').notNull(),
  filePath: text('file_path').notNull(),
  uploadDate: text('upload_date').notNull(),
  processedData: text('processed_data'),
  personnelId: integer('personnel_id').references(() => personnel.id),
});

// Type definitions
export type PersonnelRow = typeof personnel.$inferSelect;
export type BreakScheduleRow = typeof breakSchedules.$inferSelect;
export type NovedadesRow = typeof news.$inferSelect;
export type NPSTrimestralRow = typeof npsTrimestral.$inferSelect;
export type UploadedFileRow = typeof uploadedFiles.$inferSelect;

// Database initialization
export async function ensureTablesExist() {
  const client = getClient();
  try {
    console.log('Iniciando la verificación de tablas...');

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
        rd INTEGER NOT NULL DEFAULT 0
      )
    `);
    console.log('Tabla personnel verificada/creada');

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
    console.log('Tabla break_schedules verificada/creada');

    await client.execute(`
      CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL,
        title TEXT NOT NULL,
        publish_date TEXT NOT NULL,
        estado TEXT NOT NULL DEFAULT 'activa'
      )
    `);
    console.log('Tabla news verificada/creada');

    await client.execute(`
      CREATE TABLE IF NOT EXISTS nps_trimestral (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personnel_id INTEGER NOT NULL,
        month TEXT NOT NULL,
        nps INTEGER NOT NULL,
        FOREIGN KEY (personnel_id) REFERENCES personnel(id)
      )
    `);
    console.log('Tabla nps_trimestral verificada/creada');

    await client.execute(`
      CREATE TABLE IF NOT EXISTS uploaded_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_name TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_path TEXT NOT NULL,
        upload_date TEXT NOT NULL,
        processed_data TEXT,
        personnel_id INTEGER,
        FOREIGN KEY (personnel_id) REFERENCES personnel(id)
      )
    `);
    console.log('Tabla uploaded_files verificada/creada');

    console.log('Inicialización de la base de datos completada con éxito');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
}

// Personnel operations
export async function getPersonnel(): Promise<PersonnelRow[]> {
  const db = getDB();
  try {
    await ensureTablesExist();
    return await db.select().from(personnel).all();
  } catch (error: unknown) {
    console.error('Error al obtener personal:', error);
    throw new Error(`No se pudo obtener el personal: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function addPersonnel(person: Omit<PersonnelRow, 'id'>): Promise<void> {
  const db = getDB();
  try {
    await ensureTablesExist();
    await db.insert(personnel).values(person).run();
  } catch (error: unknown) {
    console.error('Error al agregar personal:', error);
    throw new Error(`No se pudo agregar el personal: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updatePersonnel(person: PersonnelRow): Promise<void> {
  const db = getDB();
  try {
    await db
      .update(personnel)
      .set(person)
      .where(eq(personnel.id, person.id))
      .run();
  } catch (error: unknown) {
    console.error('Error al actualizar personal:', error);
    throw new Error(`No se pudo actualizar el personal: ${error instanceof Error ? error.message : String(error)}`);
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
    console.error('Error al actualizar X LITE del personal:', error);
    throw new Error(`No se pudo actualizar X LITE del personal: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Break schedule operations
export async function getBreakSchedules(personnelId: number, month: number, year: number): Promise<BreakScheduleRow[]> {
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
    console.error('Error al obtener horarios de break:', error);
    throw new Error(`No se pudieron obtener los horarios de break: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateBreakSchedule(schedule: Omit<BreakScheduleRow, 'id'>): Promise<void> {
  const db = getDB();
  try {
    console.log('Intentando actualizar horario de break:', schedule);
    
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

    console.log('Horario de break actualizado o insertado con éxito');
  } catch (error: unknown) {
    console.error('Error detallado al actualizar horario de break:', error);
    throw new Error(`No se pudo actualizar el horario de break: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// News operations
export async function getNews(page: number = 1, limit: number = 10): Promise<NovedadesRow[]> {
  const db = getDB();
  try {
    await ensureTablesExist();
    const offset = (page - 1) * limit;
    const result = await db.select()
      .from(news)
      .limit(limit)
      .offset(offset)
      .all();
    return result;
  } catch (error: unknown) {
    console.error('Error al obtener novedades:', error);
    throw new Error(`No se pudieron obtener las novedades: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function addNews(newsItem: Omit<NovedadesRow, 'id'>): Promise<void> {
  const db = getDB();
  try {
    await ensureTablesExist();
    await db.insert(news).values(newsItem).run();
  } catch (error: unknown) {
    console.error('Error al agregar novedad:', error);
    throw new Error(`No se pudo agregar la novedad: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function deleteNews(id: number): Promise<void> {
  const db = getDB();
  try {
    await db.delete(news).where(eq(news.id, id)).run();
  } catch (error: unknown) {
    console.error('Error al eliminar novedad:', error);
    throw new Error(`No se pudo eliminar la novedad: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateNewsStatus(id: number, newStatus: NovedadesRow['estado']): Promise<void> {
  const db = getDB();
  try {
    await db.update(news)
      .set({ estado: newStatus })
      .where(eq(news.id, id))
      .run();
    console.log(`Estado de la noticia ${id} actualizado a ${newStatus}`);
  } catch (error: unknown) {
    console.error('Error al actualizar el estado de la noticia:', error);
    throw new Error(`No se pudo actualizar el estado de la noticia: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateNews(newsItem: NovedadesRow): Promise<void> {
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
    console.log(`Noticia ${newsItem.id} actualizada con éxito`);
  } catch (error: unknown) {
    console.error('Error al actualizar la noticia:', error);
    throw new Error(`No se pudo actualizar la noticia: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// NPS Trimestral operations
export async function getNPSTrimestral(personnelId: number): Promise<NPSTrimestralRow[]> {
  const db = getDB();
  try {
    await ensureTablesExist();
    return await db.select()
      .from(npsTrimestral)
      .where(eq(npsTrimestral.personnelId, personnelId))
      .orderBy(desc(npsTrimestral.month))
      .limit(3)
      .all();
  } catch (error: unknown) {
    console.error('Error al obtener NPS trimestral:', error);
    throw new Error(`No se pudo obtener el NPS trimestral: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateNPSTrimestral(personnelId: number, month: string, nps: number): Promise<void> {
  const db = getDB();
  try {
    const result = await db
      .insert(npsTrimestral)
      .values({ personnelId, month, nps })
      .onConflictDoUpdate({
        target: [npsTrimestral.personnelId, npsTrimestral.month],
        set: { nps }
      })
      .run();
    console.log(`NPS trimestral actualizado para el personal ${personnelId} en el mes ${month}`);
  } catch (error: unknown) {
    console.error('Error al actualizar NPS trimestral:', error);
    throw new Error(`No se pudo actualizar el NPS trimestral: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Operaciones para archivos subidos
export async function addUploadedFile(file: Omit<UploadedFileRow, 'id'>): Promise<number> {
  const db = getDB();
  try {
    const result = await db.insert(uploadedFiles).values(file).run();
    console.log('Archivo subido agregado con éxito');
    const insertedId = result.lastInsertRowid;
    if (insertedId === undefined) {
      throw new Error('No se pudo obtener el ID del archivo insertado');
    }
    return Number(insertedId);
  } catch (error: unknown) {
    console.error('Error al agregar archivo subido:', error);
    throw new Error(`No se pudo agregar el archivo subido: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getUploadedFiles(personnelId?: number): Promise<UploadedFileRow[]> {
  const db = getDB();
  try {
    let query;
    if (personnelId !== undefined) {
      query = sql`SELECT * FROM uploaded_files WHERE personnel_id = ${personnelId}`;
    } else {
      query = sql`SELECT * FROM uploaded_files`;
    }
    
    const result = await db.execute(query);
    return result as UploadedFileRow[];
  } catch (error: unknown) {
    console.error('Error al obtener archivos subidos:', error);
    throw new Error(`No se pudieron obtener los archivos subidos: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateProcessedData(fileId: number, processedData: string): Promise<void> {
  const db = getDB();
  try {
    await db.update(uploadedFiles)
      .set({ processedData })
      .where(eq(uploadedFiles.id, fileId))
      .run();
    console.log(`Datos procesados actualizados para el archivo ${fileId}`);
  } catch (error: unknown) {
    console.error('Error al actualizar datos procesados:', error);
    throw new Error(`No se pudieron actualizar los datos procesados: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Función de utilidad para ejecutar migraciones
export async function runMigrations() {
  const client = getClient();
  try {
    console.log('Iniciando migraciones...');
    // Aquí puedes añadir tus migraciones específicas
    // Por ejemplo:
    // await client.execute(`ALTER TABLE personnel ADD COLUMN new_column TEXT`);
    console.log('Migraciones completadas con éxito');
  } catch (error) {
    console.error('Error al ejecutar migraciones:', error);
    throw error;
  }
}

// Función para cerrar la conexión de la base de datos
export async function closeDatabase() {
  if (client) {
    try {
      await client.close();
      console.log('Conexión a la base de datos cerrada con éxito');
    } catch (error) {
      console.error('Error al cerrar la conexión de la base de datos:', error);
    }
  }
}

// Función para reiniciar la conexión de la base de datos
export async function resetDatabaseConnection() {
  try {
    if (client) {
      await closeDatabase();
    }
    initializeDatabase();
    console.log('Conexión a la base de datos reiniciada con éxito');
  } catch (error) {
    console.error('Error al reiniciar la conexión de la base de datos:', error);
    throw error;
  }
}

export async function updateUser(user: PersonnelRow): Promise<void> {
  const db = getDB();
  try {
    await db
      .update(personnel)
      .set(user)
      .where(eq(personnel.id, user.id))
      .run();
    console.log(`Usuario ${user.id} actualizado con éxito`);
  } catch (error: unknown) {
    console.error('Error al actualizar el usuario:', error);
    throw new Error(`No se pudo actualizar el usuario: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export { eq };