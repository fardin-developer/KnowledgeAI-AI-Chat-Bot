import mongoose from "mongoose";
import { randomUUID } from "crypto";

const extractedInfoSchema = new mongoose.Schema({
	id: {
		type: String,
		default: randomUUID(),
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	originalText: {
		type: String,
		required: true,
	},
	extractedInfo: {
		type: String,
		required: true,
	},
	fileName: {
		type: String,
		required: true,
	},
	fileType: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model("ExtractedInfo", extractedInfoSchema); 