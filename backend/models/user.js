const db = require('../db');

class User {
  static async findByUsername(username) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  static async create(username, password, role) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, password, role],
        function (err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  }
}

module.exports = User;
