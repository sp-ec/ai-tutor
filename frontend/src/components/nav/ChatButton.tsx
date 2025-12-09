import { PiChatDotsBold } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function ChatButton() {
	return (
		<div>
			<Link to="/chat">
				<Button variant="outline" className="min-w-16">
					<PiChatDotsBold />
				</Button>
			</Link>
		</div>
	);
}

export default ChatButton;
