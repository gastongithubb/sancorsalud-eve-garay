import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { eq, and, desc } from 'drizzle-orm';
import { config } from './config';

// Database client setup
console.log('Configuración de la base de datos:', {
  url: config.tursoConnectionUrl,
  authToken: config.tursoAuthToken ? '***' : undefined
});

export const client = createClient({
  url: config.tursoConnectionUrl,
  authToken: config.tursoAuthToken
});

export const db = drizzle(client);

// Table definitions
export const employees = sqliteTable('employees', {
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

export const breakSchedules = sqliteTable('break_schedules', {
  id: integer('id').primaryKey(),
  employeeId: integer('employee_id').notNull(),
  day: text('day').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  week: integer('week').notNull(),
  month: integer('month').notNull(),
  year: integer('year').notNull(),
});

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  responses: integer('responses').notNull().default(0),
  nps: integer('nps').notNull().default(0),
  csat: integer('csat').notNull().default(0),
  rd: integer('rd').notNull().default(0),
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
  userId: integer('user_id').notNull(),
  month: text('month').notNull(),
  nps: integer('nps').notNull(),
});

// Type definitions
export type EmployeeRow = typeof employees.$inferSelect;
export type BreakScheduleRow = typeof breakSchedules.$inferSelect;
export type UserRow = typeof users.$inferSelect;
export type NovedadesRow = {
  id: number;
  url: string;
  title: string;
  publishDate: string;
  estado: 'activa' | 'actualizada' | 'fuera_de_uso';
};
export type NPSTrimestralRow = typeof npsTrimestral.$inferSelect;

// Database initialization
export async function ensureTablesExist() {
  try {
    console.log('Iniciando la verificación de tablas...');

    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        responses INTEGER NOT NULL DEFAULT 0,
        nps INTEGER NOT NULL DEFAULT 0,
        csat INTEGER NOT NULL DEFAULT 0,
        rd INTEGER NOT NULL DEFAULT 0
      )
    `);
    console.log('Tabla users verificada/creada');

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
        user_id INTEGER NOT NULL,
        month TEXT NOT NULL,
        nps INTEGER NOT NULL
      )
    `);
    console.log('Tabla nps_trimestral verificada/creada');

    console.log('Inicialización de la base de datos completada con éxito');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
}

// Employee operations
export async function getEmployees(): Promise<EmployeeRow[]> {
  try {
    await ensureTablesExist();
    return await db.select().from(employees).all();
  } catch (error: unknown) {
    console.error('Error al obtener empleados:', error);
    throw new Error(`No se pudieron obtener los empleados: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function addEmployee(employee: Omit<EmployeeRow, 'id'>): Promise<void> {
  try {
    await ensureTablesExist();
    await db.insert(employees).values(employee).run();
  } catch (error: unknown) {
    console.error('Error al agregar empleado:', error);
    throw new Error(`No se pudo agregar el empleado: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateEmployeeXLite(id: number, xLite: string): Promise<void> {
  try {
    await db.update(employees)
      .set({ xLite })
      .where(eq(employees.id, id))
      .run();
  } catch (error: unknown) {
    console.error('Error al actualizar X LITE del empleado:', error);
    throw new Error(`No se pudo actualizar X LITE del empleado: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Break schedule operations
export async function getBreakSchedules(employeeId: number, month: number, year: number): Promise<BreakScheduleRow[]> {
  try {
    await ensureTablesExist();
    return await db.select()
      .from(breakSchedules)
      .where(and(
        eq(breakSchedules.employeeId, employeeId),
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
  try {
    console.log('Intentando actualizar horario de break:', schedule);
    
    const result = await db
      .update(breakSchedules)
      .set({
        startTime: schedule.startTime,
        endTime: schedule.endTime
      })
      .where(and(
        eq(breakSchedules.employeeId, schedule.employeeId),
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

// User operations
export async function getUsers(): Promise<UserRow[]> {
  try {
    console.log('Iniciando getUsers()...');
    await ensureTablesExist();
    console.log('Tablas verificadas, procediendo a obtener usuarios...');
    const result = await db.select().from(users).all();
    console.log('Usuarios obtenidos:', result);
    return result;
  } catch (error: unknown) {
    console.error('Error detallado al obtener usuarios:', error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
    throw new Error(`No se pudieron obtener los usuarios: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateUser(user: UserRow): Promise<void> {
  try {
    await db
      .update(users)
      .set(user)
      .where(eq(users.id, user.id))
      .run();
  } catch (error: unknown) {
    console.error('Error al actualizar usuario:', error);
    throw new Error(`No se pudo actualizar el usuario: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function createUser(user: Omit<UserRow, 'id'>): Promise<void> {
  try {
    await ensureTablesExist();
    await db.insert(users).values(user).run();
  } catch (error: unknown) {
    console.error('Error al crear usuario:', error);
    throw new Error(`No se pudo crear el usuario: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getUserByEmail(email: string): Promise<UserRow | undefined> {
  try {
    await ensureTablesExist();
    return await db.select().from(users).where(eq(users.email, email)).get();
  } catch (error: unknown) {
    console.error('Error al obtener usuario por email:', error);
    throw new Error(`No se pudo obtener el usuario por email: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// News operations
export async function getNews(page: number = 1, limit: number = 10): Promise<NovedadesRow[]> {
  try {
    await ensureTablesExist();
    const offset = (page - 1) * limit;
    const result = await db.select()
      .from(news)
      .limit(limit)
      .offset(offset)
      .all();
    return result.map(item => ({
      ...item,
      estado: item.estado as NovedadesRow['estado']
    }));
  } catch (error: unknown) {
    console.error('Error al obtener novedades:', error);
    throw new Error(`No se pudieron obtener las novedades: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function addNews(newsItem: Omit<NovedadesRow, 'id'>): Promise<void> {
  try {
    await ensureTablesExist();
    await db.insert(news).values(newsItem).run();
  } catch (error: unknown) {
    console.error('Error al agregar novedad:', error);
    throw new Error(`No se pudo agregar la novedad: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function deleteNews(id: number): Promise<void> {
  try {
    await db.delete(news).where(eq(news.id, id)).run();
  } catch (error: unknown) {
    console.error('Error al eliminar novedad:', error);
    throw new Error(`No se pudo eliminar la novedad: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateNewsStatus(id: number, newStatus: NovedadesRow['estado']): Promise<void> {
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
export async function getNPSTrimestral(userId: number): Promise<NPSTrimestralRow[]> {
  try {
    await ensureTablesExist();
    return await db.select()
      .from(npsTrimestral)
      .where(eq(npsTrimestral.userId, userId))
      .orderBy(desc(npsTrimestral.month))
      .limit(3)
      .all();
  } catch (error: unknown) {
    console.error('Error al obtener NPS trimestral:', error);
    throw new Error(`No se pudo obtener el NPS trimestral: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateNPSTrimestral(userId: number, month: string, nps: number): Promise<void> {
  try {
    const result = await db
      .insert(npsTrimestral)
      .values({ userId, month, nps })
      .onConflictDoUpdate({
        target: [npsTrimestral.userId, npsTrimestral.month],
        set: { nps }
      })
      .run();
    console.log(`NPS trimestral actualizado para el usuario ${userId} en el mes ${month}`);
  } catch (error: unknown) {
    console.error('Error al actualizar NPS trimestral:', error);
    throw new Error(`No se pudo actualizar el NPS trimestral: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Alias exports for backwards compatibility
export const registerUser = createUser;
export const verifyUser = getUserByEmail;