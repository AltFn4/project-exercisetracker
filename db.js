const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.user,
    host: 'localhost',
    database: process.env.database,
    password: '',
    port: 5432,
});

module.exports = pool;