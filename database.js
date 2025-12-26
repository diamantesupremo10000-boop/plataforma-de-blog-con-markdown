const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'blog.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

module.exports = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM posts ORDER BY created_at DESC", [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },
    getById: (id) => {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM posts WHERE id = ?", [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    create: (title, content) => {
        return new Promise((resolve, reject) => {
            db.run("INSERT INTO posts (title, content) VALUES (?, ?)", [title, content], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, title, content });
            });
        });
    }
};
