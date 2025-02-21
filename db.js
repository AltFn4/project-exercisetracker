const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.user,
    host: 'localhost',
    database: process.env.database,
    password: '',
    port: 5432,
});

console.log("User:", process.env.user);
console.log("Database:", process.env.database);

module.exports = pool;