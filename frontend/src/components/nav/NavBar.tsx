import React from "react";
import { ModeToggle } from "./ModeToggle";
import SettingsButton from "./SettingsButton";
import ChatButton from "./ChatButton.tsx";

function NavBar() {
	return (
		<div className="p-4 -mb-16 flex justify-start items-center gap-2 z-40 relative">
			<ChatButton />
			<SettingsButton />
			<ModeToggle />
		</div>
	);
}

export default NavBar;
