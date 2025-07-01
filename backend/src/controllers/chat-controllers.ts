import { Request, Response, NextFunction } from "express";
import User from "../models/user-model.js";
import { configureOpenAI } from "../configs/open-ai-config.js";
import { ChatCompletionRequestMessage, OpenAIApi } from "openai";
import ExtractedInfo from "../models/extracted-info-model.js";

export const generateChatCompletion = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { message } = req.body;

		const user = await User.findById(res.locals.jwtData.id);
		if (!user) {
			return res.status(401).json("User not registered / token malfunctioned");
		}

		// Fetch the latest extractedInfo for this user
		const latestExtractedInfo = await ExtractedInfo.findOne({ user: user._id })
			.sort({ createdAt: -1 });


		console.log("latestExtractedInfo: " +  latestExtractedInfo);
		

		// grab chats of users
		const chats = user.chats.map(({ role, content }) => ({
			role,
			content,
		})) as ChatCompletionRequestMessage[];

		// Prepend the latest extracted info as a system message if available
		if (latestExtractedInfo && latestExtractedInfo.extractedInfo && latestExtractedInfo.extractedInfo !== "Processing...") {
			chats.unshift({
				role: "system",
				content: `Knowledge Base for this user: ${latestExtractedInfo.extractedInfo}`,
			});
		}

		chats.push({ content: message, role: "user" });

		// save chats inside real user object
		user.chats.push({ content: message, role: "user" });

		// send all chats with new ones to OpenAI API
		const config = configureOpenAI();
		const openai = new OpenAIApi(config);

		// make request to openAi
		// get latest response
		const chatResponse = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: chats,
		});

		// push latest response to db
		user.chats.push(chatResponse.data.choices[0].message);
		await user.save();

		return res.status(200).json({ chats: user.chats });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};

export const getAllChats = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findById(res.locals.jwtData.id); // get variable stored in previous middleware
        
		if (!user)
			return res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});

		if (user._id.toString() !== res.locals.jwtData.id) {
			return res
				.status(401)
				.json({ message: "ERROR", cause: "Permissions didn't match" });
		}
		return res.status(200).json({ message: "OK", chats: user.chats });
	} catch (err) {
		console.log(err);
		return res.status(200).json({ message: "ERROR", cause: err.message });
	}
};

export const deleteAllChats = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findById(res.locals.jwtData.id); // get variable stored in previous middleware
        
		if (!user)
			return res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});

		if (user._id.toString() !== res.locals.jwtData.id) {
			return res
				.status(401)
				.json({ message: "ERROR", cause: "Permissions didn't match" });
		}

        //@ts-ignore
        user.chats = []
        await user.save()
		return res.status(200).json({ message: "OK", chats: user.chats });
	} catch (err) {
		console.log(err);
		return res.status(200).json({ message: "ERROR", cause: err.message });
	}
};