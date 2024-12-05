const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Connecter à SQLite
const db = new sqlite3.Database("./hotel.db", (err) => {
  if (err) console.error(err.message);
  console.log("Connecté à la base de données SQLite.");
});

// Créer les tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT
    )`);
  db.run(`CREATE TABLE IF NOT EXISTS Rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_number INTEGER,
        type TEXT,
        price_per_night REAL,
        is_available BOOLEAN DEFAULT 1
    )`);
  db.run(`CREATE TABLE IF NOT EXISTS Reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER,
        room_id INTEGER,
        check_in_date TEXT,
        check_out_date TEXT,
        FOREIGN KEY(client_id) REFERENCES Clients(id),
        FOREIGN KEY(room_id) REFERENCES Rooms(id)
    )`);
});

// Ajout de données initiales
db.serialize(() => {
  // Insérer des clients
  db.run(`
        INSERT INTO Clients (name, email, phone)
        VALUES 
        ('Alice Dupont', 'alice@example.com', '0612345678'),
        ('Jean Martin', 'jean@example.com', '0623456789');
    `);

  // Insérer des chambres
  db.run(`
        INSERT INTO Rooms (room_number, type, price_per_night, is_available)
        VALUES 
        (101, 'Simple', 50, 1),
        (102, 'Double', 80, 1),
        (201, 'Suite', 120, 1);
    `);
});

// Routes
app.get("/rooms", (req, res) => {
  db.all("SELECT * FROM Rooms WHERE is_available = 1", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/clients", (req, res) => {
  db.all("SELECT * FROM Clients", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/reservations", (req, res) => {
  db.all(
    `
        SELECT Reservations.id, Clients.name AS client_name, Rooms.room_number, 
               Reservations.check_in_date, Reservations.check_out_date
        FROM Reservations
        JOIN Clients ON Reservations.client_id = Clients.id
        JOIN Rooms ON Reservations.room_id = Rooms.id
    `,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.post("/reservations", (req, res) => {
  const { client_id, room_id, check_in_date, check_out_date } = req.body;

  if (!client_id || !room_id || !check_in_date || !check_out_date) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  const query = `
        INSERT INTO Reservations (client_id, room_id, check_in_date, check_out_date)
        VALUES (?, ?, ?, ?)
    `;

  db.run(
    query,
    [client_id, room_id, check_in_date, check_out_date],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        id: this.lastID,
        client_id,
        room_id,
        check_in_date,
        check_out_date,
      });
    }
  );
});

// Lancer le serveur
app.listen(3000, () => console.log("Serveur lancé sur http://localhost:3000"));
