import React from "react";
import type {
	Quiz,
	MultipleChoiceQuestion,
	FreeResponseQuestion,
} from "@/types/response.types";
import MultipleChoice from "./MultipleChoice";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../../ui/form";
import { Button } from "../../ui/button";

function QuizResponse({ data }: { data: Quiz | null }) {
	const formSchema = z.object({
		answers: z.array(z.string()).min(1, {
			message: "At least one answer must be selected.",
		}),
	});

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			answers: [],
		},
	});

	const onSubmit = (values: any) => {
		console.log("Submitted values:", values);
		// Handle form submission logic here
	};

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					{data?.multiple_choice_questions?.map(
						(question: MultipleChoiceQuestion, index: number) => (
							<MultipleChoice
								data={question}
								form={form}
								key={`step-${index}`}
							/>
						)
					)}
					<Button type="submit">Submit</Button>
				</form>
			</Form>
		</>
	);
}

export default QuizResponse;
