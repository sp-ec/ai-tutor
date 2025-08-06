import React from "react";
import { ModeToggle } from "./ModeToggle";
import SettingsButton from "./SettingsButton";

function NavBar() {
	return (
		<div className="p-4 -mb-16 flex justify-end items-center gap-2 z-40 relative">
			<ModeToggle />
			<SettingsButton />
		</div>
	);
}

export default NavBar;
