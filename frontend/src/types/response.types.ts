export interface ExplanationStep {
	title: string;
	explanation: string;
	solution: string;
}

export interface Explanation {
    steps: ExplanationStep[];
    final_answer: string;
	concepts: string[];
	formulas: string[];
}

export interface ExplanationResponse {
	prompt: string;
	response: Explanation;
	success: boolean;
}