import express from "express"
import http from "http";
// import sequelize from "./utils/db.js";
import userRoutes from "./routes/user.routes.js";
import positionsRoute from "./routes/positions.routes.js";
import tokenRoutes from "./routes/token.routes.js";
import {sequelize} from "../models/index.mjs";
import cors from "cors"

import cookieParser from "cookie-parser";
import dotenv from "dotenv"

dotenv.config();

const PORT = process.env.PORT || 3005

const app = express();
app.set("trust proxy", 1);
const server = http.createServer(app);

const corsOptions ={
    credentials: true,
    optionSuccessStatus: 200,
    origin: true,
}


app.use('/images', express.static('images'));
app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser());

app.use("/api/v1", userRoutes)
app.use("/api/v1", positionsRoute)
app.use("/api/v1", tokenRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!')
})


async function testDatabaseConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database have been connected!');
    } catch (error) {

        console.error('Unable to connect to the database:', error);
    }
}

server.listen(PORT, async () => {
    console.log(`App is running at http://localhost:${PORT}`)

    await testDatabaseConnection()
})