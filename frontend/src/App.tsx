import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import UploadKnowledge from "./pages/UploadKnowledge";
import { useAuth } from "./context/context";

import styles from "./App.module.css";

function App() {
	const auth = useAuth();
	
	useEffect(() => {
		axios.defaults.baseURL = "http://localhost:5001/api";
		axios.defaults.withCredentials = true;
	}, []);

	if (auth?.isLoading) {
		console.log("App: Showing loading screen");
		return (
			<div style={{ 
				display: 'flex', 
				justifyContent: 'center', 
				alignItems: 'center', 
				height: '100vh',
				backgroundColor: '#0f1419',
				color: 'white'
			}}>
				<div>Loading...</div>
			</div>
		);
	}

	let routes;
	if (auth?.isLoggedIn) {
		routes = (
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/chat' element={<Chat />} />
				<Route path='/upload' element={<UploadKnowledge />} />
				<Route path='/login' element={<Navigate to="/chat" replace />} />
				<Route path='/signup' element={<Navigate to="/chat" replace />} />
				<Route path='*' element={<Navigate to="/chat" replace />} />
			</Routes>
		);
	} else {
		routes = (
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Login />} />
				<Route path='/signup' element={<Signup />} />
				<Route path='/upload' element={<UploadKnowledge />} />
			</Routes>
		);
	}

	return (
		<div>
			<main className={styles.routes}>
                {routes}
            </main>
		</div>
	);
}

export default App;
