import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import type { MultipleChoiceQuestion } from "@/types/response.types";
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

function MultipleChoice({ data }: { data: MultipleChoiceQuestion }) {
	const [submitted, setSubmitted] = useState(false);

	return (
		<Card className="w-full mt-8">
			<CardHeader>
				<CardTitle>
					<LatexText content={data.question} />
				</CardTitle>
			</CardHeader>
			<CardContent>
				{data?.choices?.map((choice, index) => (
					<div
						key={`choice-${index}`}
						className="mb-2 p-4 bg-zinc-100 rounded-md border border-zinc-300"
					>
						<LatexText content={choice.item} />
					</div>
				))}
			</CardContent>
			{data.correct_answer_reason ? (
				<CardFooter className="flex-col gap-2 items-start">
					{submitted ? (
						<div className="w-full bg-zinc-100 rounded-lg p-8 border border-zinc-300">
							<LatexText content={`${data.correct_answer_reason}`} />
						</div>
					) : (
						<Button
							type="button"
							className=""
							onClick={() => setSubmitted(true)}
						>
							Submit
						</Button>
					)}
				</CardFooter>
			) : null}
		</Card>
	);
}

export default MultipleChoice;
