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
      let raw = "";
      let parsedSoFar: any = {};

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

		let chunk = decoder.decode(value, { stream: true });
		
		raw += chunk;
		console.log("Raw chunk:", raw);
		// Split the chunk by newlines to handle multiple JSON objects
		const parts = raw.split("\n\n");
		raw = parts.pop() || ""; // Keep the last part for next iteration

		// Process each complete JSON object
		for (const part of parts) {
		  if (part.trim() === "") continue; // Skip empty parts
		  try {
			const result = JSON.parse(part);
			if (result !== undefined) {
			  parsedSoFar = result as Explanation;
			  onDataFetched(parsedSoFar);
			}
		  } catch (err) {
			console.warn("Partial JSON parsing error:", err);
		  }
		}

		// Log the current chunk for debugging
		console.log("Received chunk:", chunk);

        try {
		  const result = JSON.parse(raw);
          if (result !== undefined) {
            parsedSoFar = result as Explanation;
            onDataFetched(parsedSoFar);
          }
        } catch (err) {
          // Not enough data yet; ignore until more comes in
		  console.warn("Partial JSON parsing error:", err);
        }
      }
	} catch (error) {
	  console.error("Error fetching OpenAI response:", error);
	  onDataFetched({
		steps: [],
		final_answer: "An error occurred while processing your request.",
		formulas: [],
	  });
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
