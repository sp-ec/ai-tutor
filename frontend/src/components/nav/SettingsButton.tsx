import { CiSettings } from "react-icons/ci";
import { FaGear } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

function SettingsButton() {
	return (
		<div>
			<Link to="/settings">
				<Button variant="outline" className="min-w-16">
					<FaGear />
				</Button>
			</Link>
		</div>
	);
}

export default SettingsButton;
