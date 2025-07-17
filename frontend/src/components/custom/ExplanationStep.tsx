import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import type { ExplanationStep } from "@/types/response.types";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
	CardAction,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import LaTeXParagraph from "./LaTeXDisplay";
import LatexText from "./LaTeXDisplay";
import { set } from "zod";

function ResponseStep({ data, key }: { data: ExplanationStep; key: number }) {
	const [showSolution, setShowSolution] = useState(false);
	const [solution, setSolution] = useState("");

	useEffect(() => {
		setSolution(data.solution);
	}, [showSolution]);

	return (
		<Card className="w-full mt-8" key={key}>
			<CardHeader>
				<CardTitle>
					<LatexText content={data.title} />
				</CardTitle>
			</CardHeader>
			<CardContent>
				<LatexText content={data.explanation} />
			</CardContent>
			<CardFooter className="flex-col gap-2 items-start">
				{showSolution ? (
					<div className="w-full bg-solution rounded-lg p-8">
						<LatexText content={solution} />
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
		</Card>
	);
}

export default ResponseStep;
