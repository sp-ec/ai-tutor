import "./App.css";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PromptForm } from "@/components/custom/promptform";

function App() {
	return (
		<>
			<h1 className="text-3xl mt-8">AI Tutor</h1>
			<div className="mt-8">
				<PromptForm />
			</div>
		</>
	);
}

export default App;
