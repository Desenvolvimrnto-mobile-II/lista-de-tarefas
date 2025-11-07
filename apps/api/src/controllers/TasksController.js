import { TaskModel } from '../models/TaskModel.js';

export const TasksController = {
  async index(req, res, next) {
    try {
      const { user_id, status } = req.query;
      const tasks = await TaskModel.findAll({ user_id, status });
      res.json(tasks);
    } catch (e) { next(e); }
  },

  async show(req, res, next) {
    try {
      const t = await TaskModel.findById(Number(req.params.id));
      if (!t) return res.status(404).json({ message: 'Tarefa não encontrada' });
      res.json(t);
    } catch (e) { next(e); }
  },

  async create(req, res, next) {
    try {
      const { user_id, title, description } = req.body;
      if (!user_id || !title) {
        return res.status(400).json({ message: 'user_id e title são obrigatórios' });
      }
      const created = await TaskModel.create({ user_id, title, description });
      res.status(201).json(created);
    } catch (e) { next(e); }
  },

  async update(req, res, next) {
    try {
      const id = Number(req.params.id);
      const updated = await TaskModel.update(id, req.body);
      if (!updated) return res.status(404).json({ message: 'Tarefa não encontrada' });
      res.json(updated);
    } catch (e) { next(e); }
  },

  async destroy(req, res, next) {
    try {
      const ok = await TaskModel.remove(Number(req.params.id));
      if (!ok) return res.status(404).json({ message: 'Tarefa não encontrada' });
      res.status(204).send();
    } catch (e) { next(e); }
  }
};
