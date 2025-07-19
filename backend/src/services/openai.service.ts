import OpenAI from 'openai';
import { z } from 'zod';
import { zodTextFormat, zodResponseFormat } from 'openai/helpers/zod';
import { Request, Response } from 'express';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const Step = z.object({
  title: z.string(),
  explanation: z.string(),
  solution: z.string(),
});

const Formula = z.object({
  title: z.string(),
  math: z.string().transform((val) => {
    if (!val.startsWith('$$')) val = `$$${val}`;
    if (!val.endsWith('$$')) val = `${val}$$`;
    return val;
  }),
});

const ExplanationSchema = z.object({
  formulas: z.array(Formula).max(10).nullable().optional(),
  steps: z.array(Step).max(10),
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
        `
        You are a helpful math tutor. Solve the problem by breaking it down into simple steps, with more complex problems containing more steps.
        Explain how to solve the step in the explanation without revealing the answer. Do not repeat information between the explanation and the solution.
        List any formulas needed to solve the problem. Use proper LaTeX formatting when possible.
        `
    },
      { role: "user", content: text },
    ],
    response_format: zodResponseFormat(ExplanationSchema, "explanation"),
  });

  return res.output_parsed;
}

export async function streamExplanationResponse(prompt: string, model: string, res: Response) {

  const stream = await openai.chat.completions.stream({
    model,
    messages: [
      {
        role: 'system',
        content: `
        You are a helpful math tutor. Solve the problem by breaking it down into simple steps, with more complex problems containing more steps.
        Explain how to solve the step in the explanation without revealing the answer. Do not repeat information between the explanation and the solution.
        List any formulas needed to solve the problem. Use proper LaTeX formatting when possible.
        `,
      },
      { role: 'user', content: prompt },
    ],
    response_format: zodResponseFormat(ExplanationSchema, "explanation"),
  })
  .on("refusal.done", () => console.log("request refused"))
  .on("content.delta", ({ snapshot, parsed }) => {
    //console.log("content:", snapshot);
    //console.log("parsed:", parsed);
    res.write(JSON.stringify(parsed) + "\n\n");
  })
  .on("content.done", (props) => {
    //console.log(props);
  });

  await stream.done();

  const finalCompletion = await stream.finalChatCompletion();

  console.log(finalCompletion);
}
