import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import FormLabel from "../components/auth/FormLabel";
import Button from "../components/shared/Button";

import styles from "./AuthForm.module.css";

import axios from "axios";
axios.defaults.baseURL = "https://ai.chatlinker.cloud";
axios.defaults.withCredentials = true; 

import { useAuth } from "../context/context";

const Login = () => {
    const [buttonName, setButtonName] = useState('Login');
    
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        
        if (!auth?.isLoading && auth?.isLoggedIn && auth?.user) {
            navigate('/');
        }
    }, [auth?.isLoading, auth?.isLoggedIn, auth?.user, navigate]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            setButtonName('Loading ...');
            toast.loading("Signing in ..", { id: "login" });
            await auth?.login(email, password);
            setButtonName('Login');
            toast.success("Signed in successfully", { id: "login" });
            navigate('/');
        } catch (error: any) {
            setButtonName('Login');
            toast.error(error.message, { id: "login" });
            console.log(error, 'error');
        }
    };

    return (
        <>
            <div className={`${styles.parent} beautiful-login-container`}>
                <div className={`${styles.auth_container} beautiful-auth-wrapper`}>
                    {/* Header Section */}
                    <div className="login-header">
                        <div className="welcome-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h2>Welcome Back!</h2>
                        <p className="login-subtitle">Log into your account to continue</p>
                    </div>

                    <form className={`${styles.form} beautiful-form`} onSubmit={handleSubmit}>
                        <FormLabel
                            className={`${styles.auth_label} beautiful-form-field`}
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
                            className={`${styles.auth_label} beautiful-form-field`}
                            htmlFor='password'
                            id='password'
                            name='password'
                            type='password'
                            required={true}
                            maxLength={16}
                            minLength={8}
                            label='Password'
                            onChange={() => {}}
                            inputPH='Password'
                        />


                        <Button 
                            buttonLabel={buttonName} 
                            type='submit' 
                            className={`${styles.button} beautiful-submit-btn`} 
                        />
                    </form>
                    
                    <div className="signup-link-wrapper">
                        <p>
                            Don't have an account? <Link to='/signup'>Create One</Link> now
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                .beautiful-login-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                }

                .beautiful-auth-wrapper {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border-radius: 24px;
                    padding: 2.5rem;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    width: 100%;
                    max-width: 420px;
                    position: relative;
                    overflow: hidden;
                }

                .beautiful-auth-wrapper::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                }

                .login-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .welcome-icon {
                    margin-bottom: 1.5rem;
                    display: flex;
                    justify-content: center;
                }

                .welcome-icon svg {
                    color: #667eea;
                    filter: drop-shadow(0 2px 8px rgba(102, 126, 234, 0.3));
                }

                .login-header h2 {
                    font-size: 1.875rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0 0 0.5rem 0;
                    letter-spacing: -0.025em;
                }

                .login-subtitle {
                    color: #4b5563;
                    font-size: 0.9rem;
                    margin: 0;
                    font-weight: 400;
                }

                .beautiful-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .beautiful-form-field {
                    position: relative;
                }

                /* Enhanced form field styling */
                .beautiful-form-field :global(label) {
                    color: #222 !important;
                    font-weight: 500 !important;
                    margin-bottom: 0.5rem !important;
                    font-size: 0.875rem !important;
                    display: block !important;
                }

                .beautiful-form-field :global(input) {
                    background: rgba(255, 255, 255, 0.8) !important;
                    border: 1.5px solid #e5e7eb !important;
                    border-radius: 12px !important;
                    padding: 0.875rem 1rem !important;
                    font-size: 0.95rem !important;
                    color: #222 !important;
                    transition: all 0.2s ease !important;
                    width: 100% !important;
                    box-sizing: border-box !important;
                }

                .beautiful-form-field :global(input:focus) {
                    outline: none !important;
                    border-color: #667eea !important;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
                    background: rgba(255, 255, 255, 0.95) !important;
                    transform: translateY(-1px) !important;
                }

                .beautiful-form-field :global(input::placeholder) {
                    color: #6b7280 !important;
                    font-size: 0.875rem !important;
                }

                .forgot-password-link {
                    text-align: right;
                    margin: -0.5rem 0 0.5rem 0;
                }

                .forgot-password-link a {
                    color: #667eea;
                    text-decoration: none;
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }

                .forgot-password-link a:hover {
                    color: #764ba2;
                    text-decoration: underline;
                }

                .beautiful-submit-btn {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                    color: white !important;
                    border: none !important;
                    padding: 0.875rem 1.5rem !important;
                    border-radius: 12px !important;
                    font-size: 1rem !important;
                    font-weight: 600 !important;
                    cursor: pointer !important;
                    transition: all 0.2s ease !important;
                    text-transform: none !important;
                    margin-top: 0.5rem !important;
                    position: relative !important;
                    overflow: hidden !important;
                }

                .beautiful-submit-btn:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4) !important;
                }

                .beautiful-submit-btn:active {
                    transform: translateY(0) !important;
                }

                .beautiful-submit-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s ease;
                }

                .beautiful-submit-btn:hover::before {
                    left: 100%;
                }

                .signup-link-wrapper {
                    text-align: center;
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(0, 0, 0, 0.1);
                }

                .signup-link-wrapper p {
                    color: #4b5563;
                    font-size: 0.875rem;
                    margin: 0;
                }

                .signup-link-wrapper a {
                    color: #667eea;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    position: relative;
                }

                .signup-link-wrapper a:hover {
                    color: #764ba2;
                }

                .signup-link-wrapper a::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: linear-gradient(90deg, #667eea, #764ba2);
                    transition: width 0.3s ease;
                }

                .signup-link-wrapper a:hover::after {
                    width: 100%;
                }

                /* Mobile Responsive Styles */
                @media (max-width: 768px) {
                    .beautiful-login-container {
                        padding: 0.5rem;
                        background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
                    }

                    .beautiful-auth-wrapper {
                        padding: 2rem 1.5rem;
                        border-radius: 20px;
                        max-width: 100%;
                    }

                    .login-header h2 {
                        font-size: 1.625rem;
                    }

                    .beautiful-form {
                        gap: 1rem;
                    }

                    .beautiful-form-field :global(input) {
                        padding: 1rem !important;
                        font-size: 1rem !important;
                    }

                    .beautiful-submit-btn {
                        padding: 1rem 1.5rem !important;
                        font-size: 1rem !important;
                    }
                }

                @media (max-width: 480px) {
                    .beautiful-auth-wrapper {
                        padding: 1.5rem 1.25rem;
                        border-radius: 16px;
                    }

                    .login-header {
                        margin-bottom: 1.5rem;
                    }

                    .login-header h2 {
                        font-size: 1.5rem;
                    }

                    .login-subtitle {
                        font-size: 0.85rem;
                    }

                    .welcome-icon {
                        margin-bottom: 1rem;
                    }

                    .welcome-icon svg {
                        width: 40px;
                        height: 40px;
                    }

                    .beautiful-form {
                        gap: 0.875rem;
                    }

                    .signup-link-wrapper {
                        margin-top: 1.5rem;
                        padding-top: 1.25rem;
                    }

                    .signup-link-wrapper p {
                        font-size: 0.8rem;
                    }
                }

                /* Very small screens */
                @media (max-width: 320px) {
                    .beautiful-auth-wrapper {
                        padding: 1.25rem 1rem;
                    }

                    .login-header h2 {
                        font-size: 1.375rem;
                    }

                    .beautiful-form {
                        gap: 0.75rem;
                    }
                }

                /* Focus styles for accessibility */
                .beautiful-form-field :global(input:focus-visible) {
                    outline: 2px solid #667eea !important;
                    outline-offset: 2px !important;
                }

                .beautiful-submit-btn:focus-visible {
                    outline: 2px solid #667eea !important;
                    outline-offset: 2px !important;
                }

                /* Loading state animation */
                .beautiful-submit-btn:disabled {
                    opacity: 0.7 !important;
                    cursor: not-allowed !important;
                    transform: none !important;
                }
            `}</style>
        </>
    );
};

export default Login;