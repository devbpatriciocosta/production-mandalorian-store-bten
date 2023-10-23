import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/dataBase.js';
import authRoute from './routes/authRoute.js';
import productsCategoriesRoutes from './routes/productsCategoriesRoute.js';
import productsDetailsRoute from './routes/productsDetailsRoute.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from "url";


//Env Configuration
dotenv.config();

//Database Configuration
connectDB();

//To fix ES Module and deploy correctly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//REST Object
const app = express();

//Middlewares configuration
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './client/build')))


//Routes Configuration
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", productsCategoriesRoutes);
app.use("/api/v1/product", productsDetailsRoute);


//REST API
app.use('*', function(req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
});

//PORT server configuration
const PORT = process.env.PORT || 4000;

//Listener
app.listen(PORT, () => {
    console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgYellow.white);
});