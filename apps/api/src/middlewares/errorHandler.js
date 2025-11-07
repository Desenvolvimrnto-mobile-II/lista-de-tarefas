export function errorHandler(err, req, res, next) {
  // Log simples (pode trocar por morgan/winston)
  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor' });
}
