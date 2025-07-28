const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'lunchbox.db'));

// Initialize tables if they do not exist
const init = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Users (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      Username TEXT UNIQUE NOT NULL,
      PasswordHash TEXT NOT NULL,
      FullName TEXT NOT NULL,
      Department TEXT,
      Extension TEXT,
      Role TEXT CHECK (Role IN ('admin','user')) DEFAULT 'user'
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Menus (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      Name TEXT NOT NULL,
      Price INTEGER NOT NULL,
      AvailableDate DATE NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Orders (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      UserId INTEGER NOT NULL,
      MenuId INTEGER NOT NULL,
      OrderDate DATE NOT NULL,
      Note TEXT,
      FOREIGN KEY(UserId) REFERENCES Users(Id),
      FOREIGN KEY(MenuId) REFERENCES Menus(Id)
    )`);
  });
};

module.exports = { db, init };
