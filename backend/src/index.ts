import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user-routes.js";
import chatRoutes from "./routes/chat-routes.js";
import extractionRoutes from "./routes/extraction-routes.js";

import { config } from "dotenv";
import ExtractedInfo from "./models/extracted-info-model.js";

config();

const app = express();

// Middlewares

app.use(cors({
	origin: ["http://localhost:5173", "https://ai.chatlinker.cloud"],
	credentials: true
}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(morgan("dev")); // for development

// routes
app.use("/api/user/", userRoutes);
app.use("/api/chat/", chatRoutes);
app.use("/api/extraction/", extractionRoutes);
console.log(process.env.MONGO_USER);


// Connections and Listeners
mongoose
	.connect(
		process.env.MONGO_URL
	)
	.then(() => {
		app.listen(process.env.PORT || 5000);
		console.log(
			`Server started on port ${
				process.env.PORT || 5000
			} and Mongo DB is connected`
		);
	})
	.catch((err) => {
		console.log(err);
	});
