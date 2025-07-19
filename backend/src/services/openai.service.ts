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
  solution: z.string().nullable().optional(),
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
        You are a helpful math tutor. 
        
        1. Solve the problem by breaking it into simple, logical steps. Use more steps for more complex problems.
        2. For each step, explain how to solve it without revealing the final answer.
        3. After the explanation, present the full solution.
        4. List any formulas used, and give them clear titles. Use correct LaTeX formatting:
          - For inline math, wrap the expression with '\\(' and '\\)'. Do not use $...$.
          - For display math, place '\\[' on a new line before the expression, and '\\]' on a new line after it. Do not use $$...$$.
        5. Do not include LaTeX in formula titles—only in the formula expressions, step explanations, and solutions.
        6. Do not repeat information between the explanation and the solution.

        Always output valid LaTeX that renders properly in frontend environments that use MathJax or KaTeX.
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
}
