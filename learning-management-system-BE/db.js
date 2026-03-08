const {Pool} = require("pg");

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'testdb',
  password: "21872187",
  port: 5432,
});


module.exports = pool;
