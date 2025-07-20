export interface PromptFormResponse {
	error_message: string | null;
	explanation: Explanation | null;
	quiz: Quiz | null;
}

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

export interface MultipleChoiceItem {
	item: string;
	correct: boolean;
}
export interface MultipleChoiceQuestion {
	question: string;
	choices: MultipleChoiceItem[];
	correct_answer_reason: string;
}

export interface FreeResponseQuestion {
	question: string;
}

export interface Quiz {
	multiple_choice_questions: MultipleChoiceQuestion[];
	free_response_questions: FreeResponseQuestion[];
}