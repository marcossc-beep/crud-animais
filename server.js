import Fastify from "fastify";
import pkg from "pg";

const { Pool } = pkg;
const servidor = Fastify({
  logger: true, // ajuda a ver as requisições no console
});

// Conexão com o banco
const pool = new Pool({
  user: "local",
  host: "localhost",
  database: "maispet",
  password: "12345",
  port: 5432,
});

// Rota de teste
servidor.get("/", () => {
  return "Servidor rodando 🚀";
});

// ------------------- CRUD ANIMAIS -------------------

// CREATE - inserir animal
servidor.post("/animais", async (req, reply) => {
  const { nome, especie } = req.body;
  const result = await pool.query(
    "INSERT INTO animais (nome, especie) VALUES ($1, $2) RETURNING *",
    [nome, especie]
  );
  return result.rows[0];
});

// READ - listar todos
servidor.get("/animais", async () => {
  const result = await pool.query("SELECT * FROM animais ORDER BY id");
  return result.rows;
});

// READ - buscar por id
servidor.get("/animais/:id", async (req) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM animais WHERE id = $1", [id]);
  return result.rows[0] || { mensagem: "Animal não encontrado" };
});

// UPDATE - atualizar por id
servidor.put("/animais/:id", async (req) => {
  const { id } = req.params;
  const { nome, especie } = req.body;
  const result = await pool.query(
    "UPDATE animais SET nome = $1, especie = $2 WHERE id = $3 RETURNING *",
    [nome, especie, id]
  );
  return result.rows[0] || { mensagem: "Animal não encontrado" };
});

// DELETE - remover por id
servidor.delete("/animais/:id", async (req) => {
  const { id } = req.params;
  const result = await pool.query(
    "DELETE FROM animais WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0] || { mensagem: "Animal não encontrado" };
});

// ---------------------------------------------------

// Subir servidor
servidor.listen({ port: 3000 });
