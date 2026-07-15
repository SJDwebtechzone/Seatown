// import { Pool } from "pg";
// import dotenv from "dotenv";

// dotenv.config();

// const pool = new Pool({
//   host: process.env.DB_HOST || "localhost",
//   port: Number(process.env.DB_PORT) || 5432,
//   user: process.env.DB_USER || "postgres",
//   password: process.env.DB_PASSWORD || "",
//   database: process.env.DB_NAME || "Seatown",
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 5000,
// });

// pool.on("connect", () => {
//   console.log("✅ PostgreSQL connected to Seatown");
// });

// pool.on("error", (err) => {
//   console.error("❌ Unexpected PostgreSQL error:", err.message);
//   process.exit(-1);
// });

// export default pool;

import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })
  : new Pool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "Seatown",
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

pool.on("connect", () => {
  console.log("✅ PostgreSQL connected");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected PostgreSQL error:", err.message);
});

export default pool;