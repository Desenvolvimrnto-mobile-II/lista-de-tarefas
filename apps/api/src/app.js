import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app = express();

// CORS amplo para DEV (libera qualquer origem e lida com preflight)
app.use(cors({
  origin: (origin, cb) => cb(null, true), // libera tudo em dev
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // mantenha false se não usa cookies/autenticação via navegador
}));

// Trata preflight manualmente (alguns proxies gostam disso)
app.options('*', cors());

app.use(express.json());

// healthcheck
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// rotas da API
app.use('/api', routes);

export default app;
