import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { Explanation, ExplanationResponse } from "@/types/response.types";
import { ModelSelector } from "./ModelSelector";
import { ActionSelector } from "./ActionSelector";
import { AutosizeTextarea } from "../ui/autosizetextarea";

const API_URL = import.meta.env.VITE_API_URL;

const FormSchema = z.object({
	prompt: z
		.string()
		.min(5, {
			message: "Prompt must be at least 5 characters.",
		})
		.max(10000, {
			message: "Prompt must not be longer than 10,000 characters.",
		}),
	model: z.enum(["gpt-4o", "gpt-4", "gpt-3.5-turbo"]),
	action: z.enum(["explain", "quiz", "tutor"]),
});

interface PromptFormProps {
	onDataFetched: (data: Explanation) => void;
}

export function PromptForm({ onDataFetched }: PromptFormProps) {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			model: "gpt-4o",
			action: "explain",
		},
	});

	const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
		console.log("Submitting prompt:", values.prompt);
		try {
			onDataFetched({
				steps: [],
				final_answer: "",
				concepts: [],
				formulas: [],
			});
			const res = await axios.post<ExplanationResponse>(`${API_URL}/openai`, {
				prompt: values.prompt,
				model: values.model,
				action: values.action,
			});
			onDataFetched(res.data.response);
			console.log("Response received:", res.data.response);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-6 mb-6"
			>
				<FormField
					control={form.control}
					name="prompt"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Prompt</FormLabel>
							<FormControl>
								<AutosizeTextarea
									placeholder="Explain your question in clear terms."
									className="resize-none h-36"
									maxHeight={600}
									{...field}
								/>
							</FormControl>
							<FormDescription>
								AI models may be innacurate or biased. Always verify the
								information provided.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex space-x-8 mb-8">
					{/* <FormField
						control={form.control}
						name="model"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Model</FormLabel>
								<FormControl>
									<ModelSelector {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/> */}
					<FormField
						control={form.control}
						name="action"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Action</FormLabel>
								<FormControl>
									<ActionSelector {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
