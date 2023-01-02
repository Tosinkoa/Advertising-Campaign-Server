import express from "express"
import cookieParser from "cookie-parser"
import connectPgSimple from "connect-pg-simple"
import session from "express-session"
import dotenv from "dotenv"
import cors from "cors"
import "./src/LIB/DB-Client.js"
import "./src/LIB/DayjsConfig.js"
import rootRoute from "./src/rootRoute.js"

const connection = process.env.DATABASE_URL
const app = express()
dotenv.config()

const productionCorsConfig = {
  origin: [""],
  credentials: true,
  methods: "GET, PUT, POST, DELETE",
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"],
}

const developementCorsConfig = {
  origin: ["http://localhost:3000"],
  methods: ["GET, PUT, POST, DELETE"],
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"],
}

if (process.env.NODE_ENV === "production") app.use(cors(productionCorsConfig))
else app.use(cors(developementCorsConfig))

const PgStore = connectPgSimple(session)
const store = new PgStore({ conString: connection, createTableIfMissing: true })

app.use(express.json())
app.use(cookieParser(process.env.SESSION_SECRET))
app.set("trust proxy", 1)

app.use(
  session({
    store: store,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
  })
)

rootRoute(app)

const PORT = process.env.PORT || 5000
app.listen(PORT, (req, res) => console.log(`Server running on PORT:${PORT}...`))
