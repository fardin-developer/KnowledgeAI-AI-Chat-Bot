import { Request, Response, NextFunction } from "express";
import User from "../models/user-model.js";
import { configureOpenAI } from "../configs/open-ai-config.js";
import { OpenAIApi } from "openai";
import ExtractedInfo from "../models/extracted-info-model.js";

export const extractInformationFromText = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { text, fileName, fileType } = req.body;

		if (!text || !fileName || !fileType) {
			return res.status(400).json({
				message: "ERROR",
				cause: "Text, fileName, and fileType are required",
			});
		}

		const user = await User.findById(res.locals.jwtData.id);
		if (!user) {
			return res.status(401).json({
				message: "ERROR",
				cause: "User not registered / token malfunctioned",
			});
		}

		// Save the original text immediately in a new ExtractedInfo document
		const newExtractedInfo = new ExtractedInfo({
			user: user._id,
			originalText: text,
			extractedInfo: "Processing...",
			fileName,
			fileType,
		});
		await newExtractedInfo.save();

		// Return success immediately
		res.status(200).json({
			message: "OK",
			extractedInfo: newExtractedInfo,
		});

		// Process with OpenAI in the background
		processTextWithOpenAI(text, fileName, fileType, user._id.toString());

	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "ERROR",
			cause: error.message,
		});
	}
};

// Background processing function
const processTextWithOpenAI = async (text: string, fileName: string, fileType: string, userId: string) => {
	try {
		// Configure OpenAI
		const config = configureOpenAI();
		const openai = new OpenAIApi(config);

		// Create prompt for information extraction
		const extractionPrompt = `Please analyze the following text and extract the most important information, key points, and insights. Focus on:
1. Main topics and themes
2. Key facts and data
3. Important concepts
4. Actionable insights
5. Summary of the content

Text to analyze:
${text}

Please provide a comprehensive but concise extraction of the important information:`;

		// Make request to OpenAI
		const extractionResponse = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: "You are an expert at extracting and summarizing important information from text documents. Provide clear, structured, and comprehensive summaries."
				},
				{
					role: "user",
					content: extractionPrompt
				}
			],
			max_tokens: 1000,
			temperature: 0.3,
		});

		const extractedInfo = extractionResponse.data.choices[0].message?.content || "No information could be extracted";

		// Update the ExtractedInfo document in the collection
		const infoToUpdate = await ExtractedInfo.findOne({
			user: userId,
			fileName,
			originalText: text,
		});
		if (infoToUpdate) {
			infoToUpdate.extractedInfo = extractedInfo;
			await infoToUpdate.save();
			console.log(`Successfully processed and saved extracted info for ${fileName}`);
		}

	} catch (error) {
		console.error('Error processing text with OpenAI:', error);
		// Update with error message
		const infoToUpdate = await ExtractedInfo.findOne({
			user: userId,
			fileName,
			originalText: text,
		});
		if (infoToUpdate) {
			infoToUpdate.extractedInfo = "Error processing text with AI";
			await infoToUpdate.save();
		}
	}
};

export const getAllExtractedInfo = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findById(res.locals.jwtData.id);
		
		if (!user) {
			return res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});
		}

		if (user._id.toString() !== res.locals.jwtData.id) {
			return res.status(401).json({
				message: "ERROR",
				cause: "Permissions didn't match",
			});
		}

		const extractedInfo = await ExtractedInfo.find({ user: user._id });

		return res.status(200).json({
			message: "OK",
			extractedInfo,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "ERROR",
			cause: err.message,
		});
	}
};

export const deleteAllExtractedInfo = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findById(res.locals.jwtData.id);
		
		if (!user) {
			return res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});
		}

		if (user._id.toString() !== res.locals.jwtData.id) {
			return res.status(401).json({
				message: "ERROR",
				cause: "Permissions didn't match",
			});
		}

		await ExtractedInfo.deleteMany({ user: user._id });

		return res.status(200).json({
			message: "OK",
			extractedInfo: [],
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "ERROR",
			cause: err.message,
		});
	}
}; 