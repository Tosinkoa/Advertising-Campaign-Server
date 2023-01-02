import pkg from "pg"
const { Pool } = pkg
import dotenv from "dotenv"
dotenv.config()

const connection = process.env.DATABASE_URL

const pool = new Pool({
  connectionString: connection,
})

console.log("Connected to database... ✅✅✅")
export default pool
