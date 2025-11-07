import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

const db = await getDb();
await db.exec(schema);

const result = await db.get('SELECT COUNT(*) as c FROM users');
if (result.c === 0) {
  await db.run(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    ['Usuário Demo', 'demo@example.com', 'senha-hash-aqui']
  );
}

console.log('✅ Banco criado com sucesso usando sqlite3!');
await db.close();
