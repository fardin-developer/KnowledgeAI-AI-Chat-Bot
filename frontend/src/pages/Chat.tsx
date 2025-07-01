import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./Chat.module.css";
import { getAllChats, postChatRequest } from "../../helpers/api-functions";
import { useAuth } from "../context/context";
import { useNavigate } from "react-router-dom";

type Message = {
	id: string;
	role: "user" | "assistant";
	content: string;
	_id: string;
};

const Chat = () => {
	const auth = useAuth();
	const navigate = useNavigate();
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingChats, setIsLoadingChats] = useState(true);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Always focus the textarea when chat is open or messages change
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.focus();
		}
	}, [messages, isLoadingChats]);

	// Check authentication
	useEffect(() => {
		if (!auth?.isLoggedIn) {
			navigate("/login");
		}
	}, [auth, navigate]);

	// Fetch existing chats
	useEffect(() => {
		const fetchChats = async () => {
			try {
				if (auth?.isLoggedIn) {
					const data = await getAllChats();
					console.log("Fetched chats:", data);
					if (data && data.chats) {
						setMessages(data.chats);
					}
				}
			} catch (error) {
				console.error("Error fetching chats:", error);
			} finally {
				setIsLoadingChats(false);
			}
		};

		fetchChats();
	}, [auth?.isLoggedIn]);

	const handleSendMessage = async () => {
		if (!newMessage.trim() || isLoading) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			role: "user",
			content: newMessage,
			_id: Date.now().toString()
		};

		// Add user message immediately
		setMessages(prev => [...prev, userMessage]);
		setNewMessage("");
		setIsLoading(true);

		// Focus the textarea after sending
		if (textareaRef.current) {
			textareaRef.current.focus();
		}

		try {
			// Send to API
			const response = await postChatRequest(newMessage);
			console.log("API response:", response);
			
			// Update with the complete chat history from API
			if (response && response.chats) {
				setMessages(response.chats);
			}
		} catch (error) {
			console.error("Error sending message:", error);
			// Remove the user message if the request failed
			setMessages(prev => prev.slice(0, -1));
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const handleBackToHome = () => {
		navigate("/");
	};

	if (isLoadingChats) {
		return (
			<div className={styles.chat_container}>
				<div className={styles.chat_header}>
					<motion.button
						className={styles.back_btn}
						onClick={handleBackToHome}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						← Back to Home
					</motion.button>
					<h2 className={styles.chat_title}>
						<span className={styles.title_icon}>💬</span>
						Chat with built-in company knowledge
					</h2>
				</div>
				<div className={styles.chat_messages}>
					<div className={styles.loading_container}>
						<div className={styles.loading_dots}>
							<span></span>
							<span></span>
							<span></span>
						</div>
						<p className={styles.loading_text}>Loading your conversations...</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.chat_container}>
			<div className={styles.chat_header}>
				<motion.button
					className={styles.back_btn}
					onClick={handleBackToHome}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					← Back to Home
				</motion.button>
			</div>

			<div className={styles.chat_messages}>
				{messages.length === 0 && !isLoading && (
					<div className={styles.empty_state}>
						<div className={styles.empty_icon}>🤖</div>
						<h3>Welcome to your AI Assistant!</h3>
						<p>Start a conversation by typing a message below.</p>
					</div>
				)}

				{messages.map((message, index) => (
					<div
						key={message._id || index}
						className={`${styles.message} ${
							message.role === "user" ? styles.user_message : styles.bot_message
						}`}
					>
						<div className={styles.message_avatar}>
							{message.role === "user" ? "👤" : "🤖"}
						</div>
						<div className={styles.message_content}>
							<div className={styles.message_role}>
								{message.role === "user" ? "You" : "Assistant"}
							</div>
							<div className={styles.message_text}>
								{message.content}
							</div>
						</div>
					</div>
				))}
				
				{isLoading && (
					<div className={`${styles.message} ${styles.bot_message}`}>
						<div className={styles.message_avatar}>🤖</div>
						<div className={styles.message_content}>
							<div className={styles.message_role}>Assistant</div>
							<div className={styles.loading_dots}>
								<span></span>
								<span></span>
								<span></span>
							</div>
						</div>
					</div>
				)}
				
				<div ref={messagesEndRef} />
			</div>

			<div className={styles.chat_input_container}>
				<div className={styles.input_wrapper}>
					<textarea
						ref={textareaRef}
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder="Type your message here... (Press Enter to send)"
						className={styles.chat_input}
						disabled={isLoading}
						rows={1}
					/>
					<motion.button
						className={`${styles.send_btn} ${newMessage.trim() ? styles.send_btn_active : ''}`}
						onClick={handleSendMessage}
						disabled={isLoading || !newMessage.trim()}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						{isLoading ? (
							<span className={styles.sending_icon}>⏳</span>
						) : (
							<span className={styles.send_icon}>📤</span>
						)}
					</motion.button>
				</div>
				<div className={styles.input_helper}>
					<span className={styles.helper_text}>Press Enter to send • Shift + Enter for new line</span>
				</div>
			</div>
		</div>
	);
};

export default Chat;