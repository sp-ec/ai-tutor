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
  steps: z.array(Step).max(10),
  final_answer: z.string(),
  concepts: z.array(z.string()).max(10),
  formulas: z.array(z.string()).max(10).nullable().optional()
});

export async function fetchOpenAIResponse(text: string, model: string) {
  console.log(`Sending request to OpenAI: ${text}`)
  const res = await openai.responses.parse({
    model: model,
    input: [
    {
      role: "system",
      content:
        "You are a helpful math tutor. Solve the problem by breaking it down into simple steps, with more complex problems containing more steps. Explain how to solve the step in the explanation without revealing the answer. List the names of any important concepts, and any formulas necessary to solve the problem.",
    },
    { role: "user", content: text },
    ],
    text: {
      format: zodTextFormat(MathReasoning, "math_reasoning"),
    },
  });

  return res.output_parsed;
}
