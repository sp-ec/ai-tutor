import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import type { ExplanationStep } from "@/types/response.types";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
	CardAction,
} from "../../ui/card";
import LatexText from "../../utils/LaTeXDisplay";

function ResponseStep({ data }: { data: ExplanationStep }) {
	const [showSolution, setShowSolution] = useState(false);
	const [solution, setSolution] = useState("");

	useEffect(() => {
		if (data.solution) {
			setSolution(data.solution);
		}
	}, [data.solution]);

	return (
		<Card className="w-full mt-8">
			<CardHeader>
				<CardTitle>
					<LatexText content={data.title} />
				</CardTitle>
			</CardHeader>
			<CardContent>
				<LatexText content={data.explanation} />
			</CardContent>
			{data.solution ? (
				<CardFooter className="flex-col gap-2 items-start">
					{showSolution ? (
						<div className="w-full bg-amber-50 rounded-lg p-8 border border-zinc-300">
							<LatexText content={`${solution}`} />
						</div>
					) : (
						<Button
							type="button"
							className="w-full h-16"
							onClick={() => setShowSolution(true)}
						>
							Show Solution
						</Button>
					)}
				</CardFooter>
			) : null}
		</Card>
	);
}

export default ResponseStep;
