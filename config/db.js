const mysql = require('mysql2/promise');

const mysqlPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'task_manager',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  module.exports = mysqlPool;