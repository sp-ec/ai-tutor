import React from "react";
import { Button } from "../ui/button";

interface ResponseStepProps {
	title: string;
	explanation: string;
	solution: string;
}

function ResponseStep({ title, explanation, solution }: ResponseStepProps) {
	return (
		<div>
			<h3 className="text-xl mb-1">{title}</h3>
			<p className="text-md mb-4">{explanation}</p>
			<Button>Reveal</Button>
		</div>
	);
}

export default ResponseStep;
