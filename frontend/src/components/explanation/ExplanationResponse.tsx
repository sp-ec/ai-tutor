import React, { useEffect } from "react";
import { useState } from "react";
import ResponseStep from "@/components/explanation/ExplanationStep";
import type { Explanation, ExplanationStep } from "@/types/response.types";
import { Button } from "@/components/ui/button";
import LatexText from "@/components/utils/LaTeXDisplay";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
function ExplanationResponse({ data }: { data: Explanation | null }) {
	const [explanation, setExplanation] = useState<Explanation | null>(data);
	const [showFinalAnswer, setShowFinalAnswer] = useState(false);
	const [finalAnswer, setFinalAnswer] = useState("");

	useEffect(() => {
		setExplanation(data);
		setFinalAnswer(data?.final_answer || "");
	}, [data]);

	useEffect(() => {
		if (!explanation) return;
		setFinalAnswer(explanation.final_answer);
	}, [showFinalAnswer]);

	return (
		<>
			{!explanation?.formulas || explanation?.formulas?.length == 0 ? null : (
				<Card className="w-full">
					<CardHeader>
						<CardTitle>Formulas</CardTitle>
					</CardHeader>
					<CardContent className="w-full flex flex-wrap">
						{explanation?.formulas?.map((formula, index) => (
							<div
								className="mb-4 rounded-md p-4 bg-zinc-100 pl-6 pr-6 grow text-start border border-zinc-300 ml-2 mr-2"
								key={`formula-${index}`}
							>
								<div className="mb-8">
									<em>
										<LatexText
											content={formula.title}
											key={`formula-title-${index}`}
										/>
									</em>
								</div>
								<LatexText
									content={`$$${formula.math}$$`}
									key={`formula-math-${index}`}
								/>
							</div>
						))}
					</CardContent>
				</Card>
			)}

			{explanation?.steps?.map((step: ExplanationStep, index: number) => (
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
							<div className="w-full rounded-lg p-8 bg-amber-100 border border-zinc-300">
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
		</>
	);
}

export default ExplanationResponse;
