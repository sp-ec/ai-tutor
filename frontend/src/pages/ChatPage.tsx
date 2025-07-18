import React, { useEffect } from "react";
import { useState } from "react";
import ResponseStep from "@/components/custom/ExplanationStep";
import type {
	Explanation,
	ExplanationStep,
	Formula,
} from "@/types/response.types";
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

				<div className="flex flex-row gap-4 mt-8">
					{!explanation?.concepts ||
					explanation?.concepts?.length == 0 ? null : (
						<Card className={explanation?.formulas ? "w-2/3" : "w-full"}>
							<CardHeader>
								<CardTitle>Concepts</CardTitle>
							</CardHeader>
							<CardContent
								className={
									explanation?.formulas
										? "w-full"
										: "w-full flex flex-row flex-wrap"
								}
							>
								{explanation?.concepts?.map((concept, index) => (
									<div
										key={`concept-${index}`}
										className="mb-4 rounded-md p-4 bg-red-100 mr-4"
									>
										<LatexText content={concept} />
									</div>
								))}
							</CardContent>
						</Card>
					)}

					{!explanation?.formulas ||
					explanation?.formulas?.length == 0 ? null : (
						<Card className="w-full">
							<CardHeader>
								<CardTitle>Formulas</CardTitle>
							</CardHeader>
							<CardContent className="w-full">
								{explanation?.formulas?.map((formula, index) => (
									<div
										className="mb-4 rounded-md p-4 bg-blue-100 mr-4"
										key={`formula-${index}`}
									>
										<LatexText
											content={formula.title}
											key={`formula-title-${index}`}
										/>
										<LatexText
											content={`${formula.math}`}
											key={`formula-math-${index}`}
										/>
									</div>
								))}
							</CardContent>
						</Card>
					)}
				</div>

				{explanation?.steps.map((step: ExplanationStep, index: number) => (
					<ResponseStep data={step} key={`step-${index}`} />
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
