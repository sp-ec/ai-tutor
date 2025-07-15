import React from "react";
import { Button } from "../ui/button";

interface ResponseStep {
	title: string;
	explanation: string;
	solution: string;
}

interface ResponseStepProps {
	data: ResponseStep
}

function ResponseStep({ data }: ResponseStepProps) {
	return (
		<div>
			<h3 className="text-xl mb-1">{data.title}</h3>
			<p className="text-md mb-4">{data.explanation}</p>
			<Button>Reveal</Button>
		</div>
	);
}

export default ResponseStep;
