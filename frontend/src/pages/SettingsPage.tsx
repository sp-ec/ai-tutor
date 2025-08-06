import React from "react";
import { FaGear } from "react-icons/fa6";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
	Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";

function SettingsPage() {
	const FormSchema = z.object({
		api_key: z.string(),
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			api_key: "",
		},
	});

	return (
		<div className="flex flex-col items-center justify-center w-full mb-64">
			<div className="w-full max-w-4xl px-4">
				<h1 className="text-3xl mt-8 mb-8 mozilla-headline flex items-center gap-2">
					<FaGear />
					Settings
				</h1>

				<Form {...form}>
					<FormField
						control={form.control}
						name="api_key"
						render={({ field }) => (
							<FormItem>
								<FormLabel>OpenRouter API Key</FormLabel>
								<FormControl>
									<Input placeholder="Enter your API key" {...field} />
								</FormControl>
								<FormDescription>How do I get this?</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="mt-8">
						<div className="flex items-center gap-2">Save</div>
					</Button>
				</Form>
			</div>
		</div>
	);
}

export default SettingsPage;
