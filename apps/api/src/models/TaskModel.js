import { getDb } from '../database/index.js';

export const TaskModel = {
  async create({ user_id, title, description }) {
    const db = await getDb();
    const res = await db.run(
      'INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)',
      [user_id, title, description ?? null]
    );
    return this.findById(res.lastID);
  },

  async findAll({ user_id, status }) {
    const db = await getDb();
    const clauses = [];
    const vals = [];
    if (user_id) { clauses.push('user_id=?'); vals.push(user_id); }
    if (status)  { clauses.push('status=?');  vals.push(status); }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    return db.all(`SELECT * FROM tasks ${where} ORDER BY created_at DESC`, vals);
  },

  async findById(id) {
    const db = await getDb();
    return db.get('SELECT * FROM tasks WHERE id=?', [id]);
  },

  async update(id, { title, description, status }) {
    const db = await getDb();
    const sets = [];
    const vals = [];
    if (title !== undefined)       { sets.push('title=?');       vals.push(title); }
    if (description !== undefined) { sets.push('description=?'); vals.push(description); }
    if (status !== undefined)      { sets.push('status=?');      vals.push(status); }
    if (!sets.length) return this.findById(id);

    vals.push(id);
    await db.run(
      `UPDATE tasks SET ${sets.join(', ')}, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
      vals
    );
    return this.findById(id);
  },

  async remove(id) {
    const db = await getDb();
    const res = await db.run('DELETE FROM tasks WHERE id=?', [id]);
    return res.changes > 0;
  }
};
