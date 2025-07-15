import React from "react";
import { Button } from "../ui/button";
import type { ExplanationStep } from "@/types/response.types";

function ResponseStep({ data, key }: { data: ExplanationStep; key: number }) {
	return (
		<div>
			<h3 className="text-xl mb-1">{data.title}</h3>
			<p className="text-md mb-4">{data.explanation}</p>
			<p className="text-md mb-4">Solution: {data.solution}</p>
		</div>
	);
}

export default ResponseStep;
