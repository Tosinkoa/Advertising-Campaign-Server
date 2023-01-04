import express from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import cors from "cors"
import "./src/LIB/DB-Client.js"
import rootRoute from "./src/rootRoute.js"

const app = express()
dotenv.config()
const productionCorsConfig = {
  origin: ["https://advertisement-campaign.netlify.app"],
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

app.use(express.json())
app.use(cookieParser(process.env.SESSION_SECRET))
app.set("trust proxy", 1)

rootRoute(app)
const PORT = process.env.PORT || 5000
app.listen(PORT, (req, res) => console.log(`Server running on PORT:${PORT}...`))
