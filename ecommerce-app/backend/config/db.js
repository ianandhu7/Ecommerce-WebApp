// Database Connection
const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '../.env' }); // Load env vars from root

let dbUrl = process.env.DATABASE_URL;

if (dbUrl) {
  // Clean the URL from potential copy-paste errors (e.g. 'psql ' prefix)
  dbUrl = dbUrl.trim();
  if (dbUrl.startsWith("psql '")) {
    dbUrl = dbUrl.replace("psql '", "").replace("'", "");
  } else if (dbUrl.startsWith("psql ")) {
    dbUrl = dbUrl.replace("psql ", "");
  }
  if (dbUrl.startsWith("'") && dbUrl.endsWith("'")) {
    dbUrl = dbUrl.slice(1, -1);
  }
  if (dbUrl.startsWith('"') && dbUrl.endsWith('"')) {
    dbUrl = dbUrl.slice(1, -1);
  }
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Required for Neon/some cloud providers
    }
  },
  logging: false
});

module.exports = sequelize;
