import OpenAI from 'openai';
import { z } from 'zod';
import { zodTextFormat } from 'openai/helpers/zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const Step = z.object({
  explanation: z.string(),
  solution: z.string(),
  title: z.string()
});

const MathReasoning = z.object({
  steps: z.array(Step),
  final_answer: z.string(),
});

export async function fetchOpenAIResponse(text: string, model: string) {
  console.log(`Sending request to OpenAI: ${text}`)
  const res = await openai.responses.parse({
    model: model,
    input: [
    {
      role: "system",
      content:
        "You are a helpful math tutor. Guide the user through the solution step by step. Explain how to solve the step in the explanation without revealing the answer.",
    },
    { role: "user", content: text },
    ],
    text: {
      format: zodTextFormat(MathReasoning, "math_reasoning"),
    },
  });

  return res.output_parsed;
}
