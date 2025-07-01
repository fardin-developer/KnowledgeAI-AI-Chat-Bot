import  { useState, useEffect } from "react";
import { useAuth } from "../../context/context";
import "./Header.css";

const Header = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const auth = useAuth();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		console.log(auth);
		
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);


	const handleLoginRedirect = () => {
		window.location.href = "/login";
	};

	const handleLogout = () => {
		if (auth && auth.logout) {
			auth.logout();
		}
	};

	return (
		<header className="header">
			<div className="container">
				<nav className={`nav ${isScrolled ? "scrolled" : ""}`}>
					<div className="logo">
						<div className="logo-icon">🧠</div>
						<span>KnowledgeAI</span>
					</div>
					<ul className="nav-links">
						{/* we can add links here in future */}
					</ul>
					{auth?.isLoggedIn ? (
						<button className="login-btn" onClick={handleLogout}>
							Logout
						</button>
					) : (
						<button className="login-btn" onClick={handleLoginRedirect}>
							Login
						</button>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Header;
