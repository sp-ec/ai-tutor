export interface ExplanationStep {
	title: string;
	explanation: string;
	solution: string;
}

export interface Formula {
	math: string;
	title: string;
}
export interface Explanation {
    steps: ExplanationStep[];
    final_answer: string;
	formulas: Formula[];
}

export interface ExplanationResponse {
	prompt: string;
	response: Explanation;
	success: boolean;
}