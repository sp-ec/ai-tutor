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
import { useEffect, useState } from "react";
import type { Explanation, ExplanationResponse } from "@/types/response.types";
import { ModelSelector } from "./ModelSelector";
import { ActionSelector } from "./ActionSelector";
import { AutosizeTextarea } from "../ui/autosizetextarea";
import { on } from "events";
import { parse } from "partial-json";

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
			let currentData: Explanation = {
				steps: [],
				final_answer: "",
				formulas: [],
			};

			onDataFetched(currentData); // reset state

			const response = await fetch(`${API_URL}/openai/explain`, {
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
			let jsonText = "";

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value, { stream: true });

				const lines = chunk.split("\n");

				for (const line of lines) {
					if (!line.startsWith("data: ")) continue;

					const jsonStr = line.slice("data: ".length).trim();
					if (!jsonStr || jsonStr === "[DONE]") continue;

					try {
						const parsed = JSON.parse(jsonStr);
						if (parsed.delta) {
							jsonText += parsed.delta;

							// Try to parse what we have so far
							try {
								const partial = JSON.parse(jsonText);
								console.log("Partial data:", partial);
								onDataFetched(partial); // partial update
							} catch {}
						}
					} catch (err) {
						console.warn("Bad JSON chunk:", jsonStr);
					}
				}

				console.log("Accumulated JSON text:", jsonText);
				onDataFetched(currentData); // update state with current data
			}

			// Done reading; now parse the accumulated full JSON
			const explanation = JSON.parse(jsonText) as Explanation;
			onDataFetched(explanation);
			console.log("Full explanation:", explanation);
		} catch (err) {
			console.error("Streaming error:", err);
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
