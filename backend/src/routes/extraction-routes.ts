import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import {
	extractInformationFromText,
	getAllExtractedInfo,
	deleteAllExtractedInfo,
} from "../controllers/extraction-controllers.js";

const extractionRoutes = Router();

// Apply verifyToken middleware to all routes
extractionRoutes.use(verifyToken);

// Route to extract information from text
extractionRoutes.post("/extract", extractInformationFromText);

// Route to get all extracted information for the user
extractionRoutes.get("/all", getAllExtractedInfo);

// Route to delete all extracted information for the user
extractionRoutes.delete("/all", deleteAllExtractedInfo);

export default extractionRoutes; 