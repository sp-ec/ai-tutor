import "./App.css";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";
import ProfileNav from "./components/nav/SettingsButton";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useState, useEffect } from "react";
import NavBar from "./components/nav/NavBar";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<BrowserRouter>
				<NavBar />
				<Routes>
					<Route path="/chat" element={<ChatPage />} />
					<Route path="/settings" element={<SettingsPage />} />
					<Route path="*" element={<Navigate to="/chat" replace />} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
