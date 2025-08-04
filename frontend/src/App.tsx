import "./App.css";
import ChatPage from "./pages/ChatPage";
import ProfileNav from "./components/nav/ProfileNav";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useState, useEffect } from "react";
import NavBar from "./components/nav/NavBar";

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<NavBar />
			<ChatPage />
		</ThemeProvider>
	);
}

export default App;
