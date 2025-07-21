import React, { useEffect } from "react";
import { useState } from "react";
import ResponseStep from "@/components/response/explanation/ExplanationStep";
import type { Explanation, ExplanationStep } from "@/types/response.types";
import { Button } from "@/components/ui/button";
import LatexText from "@/components/utils/LaTeXDisplay";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
function ExplanationResponse({ data }: { data: Explanation | null }) {
	const [showFinalAnswer, setShowFinalAnswer] = useState(false);

	useEffect(() => {
		setShowFinalAnswer(false); // reset answer reveal when data changes
	}, [data?.final_answer]);

	if (!data) return null;

	return (
		<>
			{!data?.formulas || data?.formulas?.length == 0 ? null : (
				<Card className="w-full">
					<CardHeader>
						<CardTitle>Formulas</CardTitle>
					</CardHeader>
					<CardContent className="w-full flex flex-wrap">
						{data?.formulas?.map((formula, index) => (
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

			{data?.steps?.map((step: ExplanationStep, index: number) => (
				<ResponseStep data={step} key={`step-${index}`} />
			))}

			{!data?.final_answer ? null : (
				<Card className="w-full mt-8">
					<CardHeader>
						<CardTitle>
							<p>Final Answer</p>
						</CardTitle>
					</CardHeader>
					<CardContent className="flex-col items-start">
						{showFinalAnswer ? (
							<div className="w-full rounded-lg p-8 bg-amber-100 border border-zinc-300">
								<LatexText content={data.final_answer} />
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
