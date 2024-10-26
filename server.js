// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let db = new sqlite3.Database('./db.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

db.run(`CREATE TABLE IF NOT EXISTS agenda_aluno (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    nota INTEGER NOT NULL
)`, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Created tasks agenda_aluno.');
});

app.get('/alunos', (req, res) => {
  db.all('SELECT * FROM agenda_aluno', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

app.post('/aluno', (req, res) => {
  const { nome, nota } = req.body;
  db.run(`INSERT INTO agenda_aluno(nome, nota) VALUES(?, ?)`, [nome, nota], function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.json({ id: this.lastID, nome, nota });
  });
});

app.delete('/aluno/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM agenda_aluno WHERE id = ?`, id, function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.json({ id });
  });
});


app.listen(3000, () => {
  console.log('Server running on port 3000');
});