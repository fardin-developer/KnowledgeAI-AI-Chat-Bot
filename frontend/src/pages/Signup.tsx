import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import bot2 from "/page-photos/robot-2.png";

import PageImage from "../components/auth/PageImage";
import FormLabel from "../components/auth/FormLabel";

import Button from "../components/shared/Button";

import { useAuth } from "../context/context";

import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = "https://ai.chatlinker.cloud";
axios.defaults.withCredentials = true;

const Signup = () => {
	const [buttonName, setButtonName] = useState("SignUp");

	const navigate = useNavigate();
	const auth = useAuth();

	const handleSubmit = async (event: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const username = formData.get("username");
		const email = formData.get("email");
		const password = formData.get("password");

		try {
			setButtonName("Loading ...");
			toast.loading("Signing up ..", { id: "signup" });
			await auth?.signup(username as string, email as string, password as string);
			setButtonName("SignUp");
			toast.success("Account created and Logged In", { id: "signup" });
			navigate('/login');
		} catch (error) {
			setButtonName("SignUp");
			toast.error((error as Error).message, { id: "signup" });
			console.log(error, "error");
		}
	};

	return (
		<div className="signup-container">
			{/* Image Section */}
			<div className="image-section">
				<PageImage
					src={bot2}
					alt='signup chat bot image'
					className="bot-image"
				/>
			</div>

			{/* Form Section */}
			<div className="form-section">
				<div className="form-wrapper">
					<div className="header">
						<h2>Create New Account</h2>
						<p className="subtitle">Join us and start your journey</p>
					</div>

					<form className="signup-form" onSubmit={handleSubmit}>
						<FormLabel
							className="form-field"
							htmlFor='username'
							id='username'
							name='username'
							type='text'
							required={true}
							maxLength={25}
							minLength={2}
							label='Your Name'
							onChange={() => {}}
							inputPH='John Doe'
						/>

						<FormLabel
							className="form-field"
							htmlFor='email'
							id='email'
							name='email'
							type='email'
							required={true}
							maxLength={50}
							minLength={5}
							label='E-Mail'
							onChange={() => {}}
							inputPH='name@example.com'
						/>

						<FormLabel
							className="form-field"
							htmlFor='password'
							name='password'
							id='password'
							type='password'
							required={true}
							maxLength={16}
							minLength={8}
							label='Password'
							onChange={() => {}}
							inputPH='Password'
						/>

						<FormLabel
							className="form-field"
							htmlFor='confirm-password'
							id='confirm-password'
							name='confirm-password'
							type='password'
							required={true}
							maxLength={16}
							minLength={8}
							label='Confirm Password'
							onChange={() => {}}
							inputPH='Confirm Password'
						/>

						<Button
							buttonLabel={buttonName}
							type='submit'
							className="submit-button"
						/>
					</form>

					<div className="login-link">
						<p>
							Already have an account? <Link to='/login'>Login</Link> now
						</p>
					</div>
				</div>
			</div>

			<style>{`
				.signup-container {
					min-height: 100vh;
					display: flex;
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
				}

				.image-section {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 2rem;
					background: rgba(255, 255, 255, 0.1);
					backdrop-filter: blur(10px);
				}

				.bot-image {
					max-width: 100%;
					height: auto;
					max-height: 400px;
					object-fit: contain;
					filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2));
				}

				.form-section {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 2rem;
				}

				.form-wrapper {
					width: 100%;
					max-width: 400px;
					background: rgba(255, 255, 255, 0.95);
					backdrop-filter: blur(10px);
					border-radius: 20px;
					padding: 2.5rem;
					box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
					border: 1px solid rgba(255, 255, 255, 0.2);
				}

				.header {
					text-align: center;
					margin-bottom: 2rem;
				}

				.header h2 {
					font-size: 1.875rem;
					font-weight: 700;
					color: #1f2937;
					margin: 0 0 0.5rem 0;
					letter-spacing: -0.025em;
				}

				.subtitle {
					color: #6b7280;
					font-size: 0.875rem;
					margin: 0;
					font-weight: 400;
				}

				.signup-form {
					display: flex;
					flex-direction: column;
					gap: 1.25rem;
				}

				.form-field {
					display: flex;
					flex-direction: column;
				}

				/* Form field styling for better visibility */
				.form-field label {
					color: #374151;
					font-weight: 500;
					margin-bottom: 0.5rem;
					font-size: 0.875rem;
				}

				.form-field input {
					background: rgba(255, 255, 255, 0.8);
					border: 1.5px solid #e5e7eb;
					border-radius: 8px;
					padding: 0.75rem 1rem;
					font-size: 0.95rem;
					color: #1f2937;
					transition: all 0.2s ease;
				}

				.form-field input:focus {
					outline: none;
					border-color: #667eea;
					box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
					background: rgba(255, 255, 255, 0.95);
				}

				.form-field input::placeholder {
					color: #9ca3af;
					font-size: 0.875rem;
				}

				.submit-button {
					margin-top: 0.5rem;
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					color: white;
					border: none;
					padding: 0.875rem 1.5rem;
					border-radius: 12px;
					font-size: 1rem;
					font-weight: 600;
					cursor: pointer;
					transition: all 0.2s ease;
					text-transform: none;
				}

				.submit-button:hover {
					transform: translateY(-2px);
					box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
				}

				.submit-button:active {
					transform: translateY(0);
				}

				.login-link {
					text-align: center;
					margin-top: 1.5rem;
					padding-top: 1.5rem;
					border-top: 1px solid rgba(0, 0, 0, 0.1);
				}

				.login-link p {
					color: #6b7280;
					font-size: 0.875rem;
					margin: 0;
				}

				.login-link a {
					color: #667eea;
					text-decoration: none;
					font-weight: 600;
					transition: color 0.2s ease;
				}

				.login-link a:hover {
					color: #764ba2;
					text-decoration: underline;
				}

				/* Mobile Responsive Styles */
				@media (max-width: 768px) {
					.signup-container {
						flex-direction: column;
						min-height: 100vh;
					}

					.image-section {
						flex: 0 0 auto;
						min-height: 200px;
						padding: 1.5rem 1rem;
					}

					.bot-image {
						max-height: 150px;
					}

					.form-section {
						flex: 1;
						padding: 1rem;
						align-items: flex-start;
						padding-top: 0;
					}

					.form-wrapper {
						padding: 1.5rem;
						margin-top: 0;
						border-radius: 20px 20px 0 0;
						min-height: calc(100vh - 200px);
						display: flex;
						flex-direction: column;
						justify-content: center;
					}

					.header h2 {
						font-size: 1.625rem;
					}

					.signup-form {
						gap: 1rem;
					}

					.submit-button {
						padding: 1rem 1.5rem;
						font-size: 1rem;
					}
				}

				@media (max-width: 480px) {
					.signup-container {
						background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
					}

					.image-section {
						min-height: 150px;
						padding: 1rem;
					}

					.bot-image {
						max-height: 120px;
					}

					.form-section {
						padding: 0.5rem;
					}

					.form-wrapper {
						padding: 1.25rem;
						border-radius: 16px 16px 0 0;
						box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);
					}

					.header {
						margin-bottom: 1.5rem;
					}

					.header h2 {
						font-size: 1.5rem;
					}

					.subtitle {
						font-size: 0.8rem;
					}

					.signup-form {
						gap: 0.875rem;
					}

					.submit-button {
						padding: 0.875rem 1.25rem;
						font-size: 0.95rem;
					}

					.login-link {
						margin-top: 1.25rem;
						padding-top: 1.25rem;
					}

					.login-link p {
						font-size: 0.8rem;
					}
				}

				/* Landscape mobile */
				@media (max-width: 768px) and (orientation: landscape) {
					.signup-container {
						flex-direction: row;
					}

					.image-section {
						flex: 0 0 200px;
						min-height: auto;
					}

					.form-wrapper {
						border-radius: 20px;
						min-height: auto;
					}
				}

				/* Very small screens */
				@media (max-width: 320px) {
					.form-wrapper {
						padding: 1rem;
					}

					.header h2 {
						font-size: 1.375rem;
					}

					.signup-form {
						gap: 0.75rem;
					}
				}
			`}</style>
		</div>
	);
};

export default Signup;