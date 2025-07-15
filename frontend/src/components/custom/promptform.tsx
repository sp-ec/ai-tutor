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
	onDataFetched: (data: ResponseStep[]) => void;
}

export function PromptForm({ onDataFetched }: PromptFormProps) {
	const [data, setData] = useState("");

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
		try {
		  const res = await axios.get<ResponseStep[]>(`${API_URL}/openai`, {
			params: { prompt: values.prompt }
		  });
		  onDataFetched(res.data);
		} catch (err) {
		  console.error(err);
		}
	  };

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
