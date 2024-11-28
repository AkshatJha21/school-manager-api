import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();



const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    ca: process.env.DB_SSL_CERT,     // Path to SSL certificate if required
  },
});

(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    console.log('Connection successful:', rows[0].solution); // Should print "2"
  } catch (err) {
    console.error('Connection failed:', err);
  }
})();

export default pool;