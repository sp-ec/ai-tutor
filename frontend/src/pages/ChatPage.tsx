import React, { useEffect } from "react";
import { useState } from "react";
import ResponseStep from "@/components/custom/ExplanationStep";
import type { Explanation, ExplanationStep } from "@/types/response.types";
import { PromptForm } from "@/components/custom/PromptForm";
import { Button } from "@/components/ui/button";
import LatexText from "@/components/custom/LaTeXDisplay";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { set } from "zod";

function ChatPage() {
	const [explanation, setExplanation] = useState<Explanation | null>(null);
	const [showFinalAnswer, setShowFinalAnswer] = useState(false);
	const [finalAnswer, setFinalAnswer] = useState("");

	const handleData = (data: Explanation) => {
		setShowFinalAnswer(false);
		setExplanation(data);
	};

	useEffect(() => {
		if (!explanation) return;
		setFinalAnswer(explanation.final_answer);
	}, [showFinalAnswer]);

	return (
		<div className="flex flex-col items-center justify-center w-full mb-64">
			<div className="w-full max-w-4xl px-4">
				<h1 className="text-3xl mt-8 mb-8">AI Tutor</h1>

				<PromptForm onDataFetched={handleData} />

				{explanation?.steps.map((step: ExplanationStep, index: number) => (
					<ResponseStep data={step} key={index} />
				))}

				{!explanation?.final_answer ? null : (
					<Card className="w-full mt-8">
						<CardHeader>
							<CardTitle>
								<p>Final Answer</p>
							</CardTitle>
						</CardHeader>
						<CardContent className="flex-col items-start">
							{showFinalAnswer ? (
								<div className="w-full rounded-lg p-8 bg-amber-200">
									<LatexText content={finalAnswer} />
								</div>
							) : (
								<Button
									type="button"
									className="w-full h-16"
									onClick={() => setShowFinalAnswer(true)}
								>
									Show Final Answer
								</Button>
							)}
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}

export default ChatPage;
