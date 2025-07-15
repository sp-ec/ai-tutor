import React from "react";
import { useState } from "react";
import ResponseStep from "@/components/custom/ExplanationStep";
import type { Explanation, ExplanationStep } from "@/types/response.types";
import { PromptForm } from "@/components/custom/promptform";

function ChatPage() {
	const [explanation, setExplanation] = useState<Explanation | null>(null);

	const handleData = (data: Explanation) => {
		setExplanation(data);
	};

	return (
		<div className="flex flex-col items-center justify-center w-full">
			<div className="w-full max-w-4xl px-4">
				<h1 className="text-3xl mt-8 mb-8">AI Tutor</h1>

				<PromptForm onDataFetched={handleData} />

				{explanation?.steps.map((step: ExplanationStep, index: number) => (
					<ResponseStep data={step} key={index} />
				))}
			</div>
		</div>
	);
}

export default ChatPage;
