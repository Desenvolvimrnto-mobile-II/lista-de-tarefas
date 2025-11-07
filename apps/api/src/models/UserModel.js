import { getDb } from '../database/index.js';

export const UserModel = {
  async create({ name, email, password }) {
    const db = await getDb();
    const res = await db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    return { id: res.lastID, name, email };
  },

  async findAll() {
    const db = await getDb();
    return db.all('SELECT id, name, email, created_at, updated_at FROM users');
  },

  async findById(id) {
    const db = await getDb();
    return db.get(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE id=?',
      [id]
    );
  },

  async update(id, { name, email, password }) {
    const db = await getDb();
    const fields = [];
    const vals = [];
    if (name !== undefined) { fields.push('name=?'); vals.push(name); }
    if (email !== undefined) { fields.push('email=?'); vals.push(email); }
    if (password !== undefined) { fields.push('password=?'); vals.push(password); }
    if (!fields.length) return this.findById(id);

    vals.push(id);
    await db.run(
      `UPDATE users SET ${fields.join(', ')}, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
      vals
    );
    return this.findById(id);
  },

  async remove(id) {
    const db = await getDb();
    const res = await db.run('DELETE FROM users WHERE id=?', [id]);
    return res.changes > 0;
  }
};
