import app from './app.js';   // <-- note o ./ aqui
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ API escutando em http://localhost:${PORT}`);
});
