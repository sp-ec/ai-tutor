import { useState, useEffect } from "react";
import type {
	Explanation,
	PromptFormResponse,
	Quiz,
} from "@/types/response.types";
import { PromptForm } from "@/components/forms/PromptForm";
import ExplanationResponse from "@/components/response/explanation/ExplanationResponse";
import QuizResponse from "@/components/response/quiz/QuizResponse";
import { set } from "zod";
import { RiQuillPenAiFill } from "react-icons/ri";

function ChatPage() {
	const [response, setResponse] = useState<PromptFormResponse | null>(null);
	const [loading, setLoading] = useState(false);

	const handleDataFetched = (data: PromptFormResponse) => {
		setResponse({ ...data });
		//console.log("Data fetched:", JSON.stringify(data));
	};

	const handleLoading = (isLoading: boolean) => {
		setLoading(isLoading);
	};

	useEffect(() => {
		console.log("Loading updated:", loading);
	}, [loading]);

	return (
		<>
			<div className="flex flex-col items-center justify-center w-full mb-64">
				<div className="w-full max-w-4xl px-4">
					<h1 className="text-3xl mt-8  mozilla-headline flex items-center gap-2">
						<RiQuillPenAiFill />
						AI Tutor
					</h1>
					<h2 className="mb-8 text-xl text-zinc-500 mozilla-headline">Chat</h2>

					<PromptForm
						onDataFetched={handleDataFetched}
						handleLoading={handleLoading}
					/>

					{response?.error_message && (
						<div className="text-red-500 mb-8">{response.error_message}</div>
					)}

					{response?.explanation && (
						<ExplanationResponse data={response.explanation as Explanation} />
					)}

					{response?.quiz && <QuizResponse data={response.quiz as Quiz} />}
				</div>
			</div>
		</>
	);
}

export default ChatPage;
