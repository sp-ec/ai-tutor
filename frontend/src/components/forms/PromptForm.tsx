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
import type {
	Explanation,
	PromptFormResponse,
	Quiz,
} from "@/types/response.types";
import { ActionSelector } from "@/components/forms/ActionSelector";
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
	onDataFetched: (data: PromptFormResponse) => void;
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
		console.log(
			`Submitting prompt: ${values.prompt} with action ${values.action}`
		);
		try {
			let currentData: PromptFormResponse = {
				error_message: null,
				explanation: null,
				quiz: null,
			};

			onDataFetched(currentData); // reset state

			const response = await fetch(`${API_URL}/openai/${values.action}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					prompt: values.prompt,
					model: values.model,
					action: values.action,
				}),
			});

			if (!response.body) throw new Error("Readable stream not available");

			const reader = response.body.getReader();
			const decoder = new TextDecoder("utf-8");
			let raw = "";
			let parsedSoFar: any = {};

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				let chunk = decoder.decode(value, { stream: true });

				raw += chunk;
				//console.log("Raw chunk:", raw);
				// Split the chunk by newlines to handle multiple JSON objects
				const parts = raw.split(/\r?\n\n(?=\{)/);
				raw = parts.pop() || ""; // Keep the last part for next iteration

				// Process each complete JSON object
				for (const part of parts) {
					if (part.trim() === "") continue; // Skip empty parts
					try {
						const result = JSON.parse(part);
						if (result !== undefined) {
							if (values.action === "explain") {
								// For explanation, we expect an Explanation object
								parsedSoFar = result as Explanation;
								currentData.explanation = parsedSoFar;
							} else if (values.action === "quiz") {
								// For quiz, we expect a Quiz object
								parsedSoFar = result as Quiz;
								currentData.quiz = parsedSoFar;
							}
							onDataFetched(currentData);
						}
					} catch (err) {
						console.warn("Partial JSON parsing error:", err);
					}
				}

				// Log the current chunk for debugging
				// console.log("Received chunk:", chunk);
			}
		} catch (error) {
			console.error("Error fetching OpenAI response:", error);
			onDataFetched({
				explanation: null,
				quiz: null,
				error_message: "Failed to fetch response from OpenAI.",
			} as PromptFormResponse);
		}
	};

	return (
		<Form {...form}>
			<div className="flex space-x-8 mb-8">
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
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
