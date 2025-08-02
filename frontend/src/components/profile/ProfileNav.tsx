import { CgProfile } from "react-icons/cg";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ProfileNav() {
	return (
		<div className="fixed top-4 right-6">
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Button className="flex items-center gap-2">
						<CgProfile size={24} />
						Noah Martineau
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Settings</DropdownMenuItem>
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Billing</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export default ProfileNav;
