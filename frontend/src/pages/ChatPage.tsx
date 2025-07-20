import React, { useEffect } from "react";
import { useState } from "react";
import ResponseStep from "@/components/explanation/ExplanationStep";
import type {
	Explanation,
	ExplanationStep,
	Formula,
} from "@/types/response.types";
import { PromptForm } from "@/components/forms/PromptForm";
import { Button } from "@/components/ui/button";
import LatexText from "@/components/utils/LaTeXDisplay";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { set } from "zod";
import ExplanationResponse from "@/components/explanation/ExplanationResponse";

function ChatPage() {
	const [explanation, setExplanation] = useState<Explanation | null>(null);

	const handleDataFetched = (data: Explanation) => {
		setExplanation(data);
	};

	return (
		<div className="flex flex-col items-center justify-center w-full mb-64">
			<div className="w-full max-w-4xl px-4">
				<h1 className="text-3xl mt-8 mb-8">AI Tutor</h1>

				<PromptForm onDataFetched={handleDataFetched} />

				{explanation && <ExplanationResponse data={explanation} />}
			</div>
		</div>
	);
}

export default ChatPage;
