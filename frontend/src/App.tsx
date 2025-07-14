import "./App.css";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PromptForm } from "@/components/custom/promptform";
import ResponseStep from "./components/custom/responseStep";

function App() {
	return (
		<div className="flex flex-col items-center justify-center w-full">
			<div className="w-full max-w-4xl px-4">
				<h1 className="text-3xl mt-8 mb-8">AI Tutor</h1>
				<PromptForm />
				<ResponseStep
					title="Understand the problem"
					explanation="Try to understand the core issue that the problem is trying to solve."
					solution="Kill yourself"
				/>
			</div>
		</div>
	);
}

export default App;
