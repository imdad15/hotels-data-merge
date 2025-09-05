import express from "express";
import hotelsRouter from "./routes/hotels";

const app = express();
app.use(express.json());
app.use("/", hotelsRouter);

export default app;
