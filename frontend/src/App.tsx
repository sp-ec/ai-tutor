import "./App.css";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PromptForm } from "@/components/custom/promptform";
import ResponseStep from "./components/custom/responseStep";
import { useState } from "react";

interface ResponseStep {
	title: string;
	explanation: string;
	solution: string;
}

function App() {
	const [steps, setSteps] = useState<ResponseStep[]>([]);

	const handleData = (
		data: { title: string; explanation: string; solution: string }[]
	) => {
		setSteps(data); // assumes data is an array of objects with 3 string fields
	};

	return (
		<div className="flex flex-col items-center justify-center w-full">
			<div className="w-full max-w-4xl px-4">
				<h1 className="text-3xl mt-8 mb-8">AI Tutor</h1>
				<PromptForm />
				{steps.map((step) => (
					<ResponseStep
						title={step.title}
						explanation={step.explanation}
						solution={step.solution}
					/>
				))}
			</div>
		</div>
	);
}

export default App;
