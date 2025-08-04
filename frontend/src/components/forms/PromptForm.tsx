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
import { ModelSelector } from "@/components/forms/ModelSelector";
import { AutosizeTextarea } from "../ui/autosizetextarea";
import { OpenAIModelValues } from "@/types/openai.types";
import { useState, useEffect, useRef } from "react";
import LoadingIcons from "react-loading-icons";
import { CiStop1 } from "react-icons/ci";
import { IoMdSend } from "react-icons/io";

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
  model: z.enum(OpenAIModelValues),
  action: z.enum(["explain", "quiz", "tutor"]),
});

interface PromptFormProps {
  onDataFetched: (data: PromptFormResponse) => void;
  handleLoading: (isLoading: boolean) => void;
}

export function PromptForm({ onDataFetched, handleLoading }: PromptFormProps) {
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<"explain" | "quiz" | "tutor">(
    "explain"
  );
  const cancelledRef = useRef(false);

  useEffect(() => {
    handleLoading(loading);
  }, [loading]);

  const handleActionChange = (value: "explain" | "quiz" | "tutor") => {
    setActionType(value);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      model: `${OpenAIModelValues[0]}`,
      action: "explain",
    },
  });

  const processJsonPart = (
    part: string,
    action: string,
    currentData: PromptFormResponse
  ) => {
    if (part.trim() === "") return;

    try {
      const result = JSON.parse(part);
      if (result !== undefined) {
        if (action === "explain") {
          // For explanation, we expect an Explanation object
          const parsedSoFar = result as Explanation;
          currentData.explanation = parsedSoFar;
        } else if (action === "quiz") {
          // For quiz, we expect a Quiz object
          const parsedSoFar = result as Quiz;
          currentData.quiz = parsedSoFar;
        }
        onDataFetched(currentData);
      }
    } catch (err) {
      console.warn("Partial JSON parsing error:", err);
    }
  };

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    console.log(
      `Submitting prompt: ${values.prompt} with action ${actionType}`
    );

    try {
      let currentData: PromptFormResponse = {
        error_message: null,
        explanation: null,
        quiz: null,
      };

      setLoading(true);
      cancelledRef.current = false;

      const response = await fetch(`${API_URL}/openai/${actionType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: values.prompt,
          model: values.model,
          action: actionType,
          numMultipleChoice: actionType === "quiz" ? 5 : undefined,
          numFreeResponse: actionType === "quiz" ? 2 : undefined,
        }),
      });

      if (!response.body) throw new Error("Readable stream not available");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let raw = "";

      try {
        while (true) {
          if (cancelledRef.current) {
            console.log("Stream cancelled by user");
            onDataFetched({
              explanation: currentData.explanation,
              quiz: currentData.quiz,
              error_message: "Stream cancelled by user.",
            } as PromptFormResponse);
            break;
          }
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          let chunk = decoder.decode(value, { stream: true });
          raw += chunk;

          // Split the chunk by newlines to handle multiple JSON objects
          const parts = raw.split(/\r?\n\n(?=\{)/);
          raw = parts.pop() || ""; // Keep the last part for next iteration

          // Process each complete JSON object
          for (const part of parts) {
            processJsonPart(part, actionType, currentData);
          }
        }
      } finally {
        // Always close the reader when done
        reader.releaseLock();
        console.log("Reader released");
      }
    } catch (error) {
      console.error("Error fetching OpenAI response:", error);
      onDataFetched({
        explanation: null,
        quiz: null,
        error_message: "Failed to fetch response from OpenAI.",
      } as PromptFormResponse);
    } finally {
      console.log("Stream finished");
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <div className="flex space-x-8 mb-2">
        <FormField
          control={form.control}
          name="action"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action</FormLabel>
              <FormControl>
                <ActionSelector {...field} onChange={handleActionChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
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
        />
      </div>
      <div className="mb-8">
        <FormDescription>
          {actionType == "explain"
            ? "Breaks down the problem into simple steps and describes any necessary formulas."
            : actionType == "quiz"
            ? "Generates a quiz consisting of multiple choice and free response questions."
            : "Continually tutors you on the topic, answering questions and providing explanations."}
        </FormDescription>
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
                  placeholder={
                    actionType == "explain"
                      ? "Describe the problem you want to have explained."
                      : actionType == "quiz"
                      ? "Describe the topic you want to be quizzed on."
                      : "Describe what you would like to be tutored on."
                  }
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
        {loading ? (
          <div className="flex flex-col justify-start items-start space-y-5">
            <Button
              type="button"
              className="bg-red-900 text-white hover:bg-red-800"
              onClick={() => {
                cancelledRef.current = true;
              }}
            >
              <div className="flex items-center gap-2 -ml-1">
                <CiStop1 /> Cancel
              </div>
            </Button>
            <div className="inline-flex items-center">
              Generating response
              <LoadingIcons.ThreeDots className="max-w-6 max-h-6 mr-4 ml-4" />
            </div>
          </div>
        ) : (
          <Button type="submit">
            <div className="flex items-center gap-2 -ml-1">
              <IoMdSend /> Submit
            </div>
          </Button>
        )}
      </form>
    </Form>
  );
}
