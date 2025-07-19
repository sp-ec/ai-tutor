import OpenAI from 'openai';
import { z } from 'zod';
import { zodTextFormat } from 'openai/helpers/zod';
import { Request, Response } from 'express';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const Step = z.object({
  explanation: z.string(),
  solution: z.string(),
  title: z.string()
});

const Formula = z.object({
  math: z.string().transform((val) => {
    if (!val.startsWith('$$')) val = `$$${val}`;
    if (!val.endsWith('$$')) val = `${val}$$`;
    return val;
  }),
  title: z.string(),
});

const MathReasoning = z.object({
  steps: z.array(Step).max(10),
  final_answer: z.string(),
  formulas: z.array(Formula).max(10).nullable().optional()
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
    text: {
      format: zodTextFormat(MathReasoning, "math_reasoning"),
    },
  });

  return res.output_parsed;
}

export async function streamExplanationResponse(prompt: string, model: string, res: Response) {

  const stream = await openai.responses.stream({
    model,
    input: [
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
    text: {
      format: zodTextFormat(MathReasoning, 'math_reasoning'),
    },
  });

  let buffer = '';

  for await (const chunk of stream) {
    const textChunk = typeof chunk === 'string' ? chunk : JSON.stringify(chunk);
    buffer += textChunk;

    try {
      const parsed = JSON.parse(buffer);
      res.write(`data: ${JSON.stringify(parsed)}\n\n`);
      buffer = ''; // reset buffer if successful
    } catch {
      // wait for more text until valid JSON
    }   
  }

  res.write(`event: end\ndata: done\n\n`);
  res.end();
}
