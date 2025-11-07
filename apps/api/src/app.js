import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app = express();
app.use(cors());
app.use(express.json());

// healthcheck
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// rotas da API
app.use('/api', routes);

export default app;
