import { UserModel } from '../models/UserModel.js';

export const UsersController = {
  async index(req, res, next) {
    try {
      const users = await UserModel.findAll();
      res.json(users);
    } catch (e) { next(e); }
  },

  async show(req, res, next) {
    try {
      const user = await UserModel.findById(Number(req.params.id));
      if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
      res.json(user);
    } catch (e) { next(e); }
  },

  async create(req, res, next) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'name, email e password são obrigatórios' });
      }
      const created = await UserModel.create({ name, email, password });
      res.status(201).json(created);
    } catch (e) {
      if (String(e.message).includes('UNIQUE')) {
        return res.status(409).json({ message: 'Email já cadastrado' });
      }
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const id = Number(req.params.id);
      const updated = await UserModel.update(id, req.body);
      if (!updated) return res.status(404).json({ message: 'Usuário não encontrado' });
      res.json(updated);
    } catch (e) { next(e); }
  },

  async destroy(req, res, next) {
    try {
      const ok = await UserModel.remove(Number(req.params.id));
      if (!ok) return res.status(404).json({ message: 'Usuário não encontrado' });
      res.status(204).send();
    } catch (e) { next(e); }
  }
};
