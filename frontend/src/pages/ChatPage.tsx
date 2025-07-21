import { useState } from "react";
import type { Explanation, PromptFormResponse, Quiz } from "@/types/response.types";
import { PromptForm } from "@/components/forms/PromptForm";
import ExplanationResponse from "@/components/response/explanation/ExplanationResponse";
import QuizResponse from "@/components/response/quiz/QuizResponse";

function ChatPage() {
	const [response, setResponse] = useState<PromptFormResponse | null>(null);

	const handleDataFetched = (data: PromptFormResponse) => {
		setResponse({ ...data });
		console.log("Data fetched:", JSON.stringify(data));
	};

	return (
		<div className="flex flex-col items-center justify-center w-full mb-64">
			<div className="w-full max-w-4xl px-4">
				<h1 className="text-3xl mt-8 mb-8">AI Tutor</h1>

				<PromptForm onDataFetched={handleDataFetched} />

				{response?.explanation && (
					<ExplanationResponse data={response.explanation as Explanation} />
				)}

				{response?.quiz && (
					<QuizResponse data={response.quiz as Quiz} />
				)}
			</div>
		</div>
	);
}

export default ChatPage;
