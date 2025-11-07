import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { env } from '../config/env.js';

sqlite3.verbose();

let db;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: env.dbFile,
      driver: sqlite3.Database,
    });
  }
  return db;
}
