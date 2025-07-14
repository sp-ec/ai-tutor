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

export function PromptForm() {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		axios
			.post(`${API_URL}/openai`, { prompt: data.prompt })
			.then((response) => {
				// handle success, e.g. show response data
				console.log(response.data);
			})
			.catch((error) => {
				// handle error, e.g. show error message
				console.error(error);
			});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
				<Button type="submit" className="ml-4">
					Quiz
				</Button>
			</form>
		</Form>
	);
}
