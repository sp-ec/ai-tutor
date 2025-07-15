import "./App.css";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PromptForm } from "@/components/custom/promptform";
import ResponseStep from "./components/custom/responsestep";
import { useState } from "react";

function App() {
	const [steps, setSteps] = useState<ResponseStep[]>([]);

	const handleData = (
		data: { title: string; explanation: string; solution: string }[]
	) => {
		setSteps(data);
	};

	return (
		<div className="flex flex-col items-center justify-center w-full">
			<div className="w-full max-w-4xl px-4">
				<h1 className="text-3xl mt-8 mb-8">AI Tutor</h1>
				<PromptForm onDataFetched={handleData}/>
				{steps.map((step) => (
					<ResponseStep
						data={step}
					/>
				))}
			</div>
		</div>
	);
}

export default App;
