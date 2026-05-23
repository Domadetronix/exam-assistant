import { openDB, type IDBPDatabase } from 'idb';
import type { Ticket, PracticeCategory } from '../types';

const DB_NAME = 'exam-assistant-db';
const DB_VERSION = 1;

interface AppDB {
  tickets: Ticket;
  practice: PracticeCategory;
  meta: { key: string; value: unknown };
}

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('tickets')) {
          const store = db.createObjectStore('tickets', { keyPath: 'id' });
          store.createIndex('category', 'category');
        }
        if (!db.objectStoreNames.contains('practice')) {
          db.createObjectStore('practice', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' });
        }
      }
    });
  }
  return dbPromise;
}

export async function getAllTickets(): Promise<Ticket[]> {
  const db = await getDB();
  return db.getAll('tickets');
}

export async function getTicket(id: number): Promise<Ticket | undefined> {
  const db = await getDB();
  return db.get('tickets', id);
}

export async function putTickets(tickets: Ticket[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('tickets', 'readwrite');
  await Promise.all(tickets.map((t) => tx.store.put(t)));
  await tx.done;
}

export async function clearTickets(): Promise<void> {
  const db = await getDB();
  await db.clear('tickets');
}

export async function getAllPractice(): Promise<PracticeCategory[]> {
  const db = await getDB();
  return db.getAll('practice');
}

export async function getPractice(id: string): Promise<PracticeCategory | undefined> {
  const db = await getDB();
  return db.get('practice', id);
}

export async function putPractice(items: PracticeCategory[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('practice', 'readwrite');
  await Promise.all(items.map((p) => tx.store.put(p)));
  await tx.done;
}

export async function getMeta<T>(key: string): Promise<T | undefined> {
  const db = await getDB();
  const rec = await db.get('meta', key);
  return rec?.value as T | undefined;
}

export async function setMeta(key: string, value: unknown): Promise<void> {
  const db = await getDB();
  await db.put('meta', { key, value });
}

export async function wipeAllData(): Promise<void> {
  const db = await getDB();
  await Promise.all([db.clear('tickets'), db.clear('practice'), db.clear('meta')]);
  localStorage.clear();
  if ('caches' in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
  }
  if ('serviceWorker' in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((r) => r.unregister()));
  }
}

// Re-export AppDB type for usage if needed
export type { AppDB };
