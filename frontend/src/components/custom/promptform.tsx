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
import type { Explanation, ExplanationResponse } from "@/types/responseTypes";

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
});

interface PromptFormProps {
	onDataFetched: (data: Explanation) => void;
}

export function PromptForm({ onDataFetched }: PromptFormProps) {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
		console.log("Submitting prompt:", values.prompt);
		try {
			const res = await axios.post<ExplanationResponse>(`${API_URL}/openai`, {
				prompt: values.prompt,
				model: "gpt-4o",
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
								<Textarea
									placeholder="Explain your question in clear terms."
									className="resize-none h-36"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Explain</Button>
				{/* <Button type="submit" className="ml-4">
					Quiz
				</Button> */}
			</form>
		</Form>
	);
}
