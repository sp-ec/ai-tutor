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
  math: z.string()
});

const ExplanationSchema = z.object({
  formulas: z.array(Formula).max(10).nullable().optional(),
  steps: z.array(Step).max(10),
  final_answer: z.string(),
});

const QuizSchema = z.object({
  multiple_choice_questions: z.array(
    z.object({
      question: z.string(),
      choices: z.array(
        z.object({
          item: z.string(),
          correct: z.boolean(),
        })
      ),
      correct_answer_reason: z.string().nullable().optional(),
    })
  ).max(10).nullable().optional(),
  free_response_questions: z.array(
    z.object({
      question: z.string(),
    })
  ).max(10).nullable().optional(),
})

export async function streamExplanationResponse(prompt: string, model: string, res: Response) {

  console.log(`Streaming explanation response for model: ${model}`);

  const stream = await openai.chat.completions.stream({
    model,
    messages: [
      {
        role: 'system',
        content: `
        You are a helpful tutor. 
        
        1. Solve the problem by breaking it into simple, logical steps. Use more steps for more complex problems.
        2. For each step, explain how to solve it without revealing the final answer.
        3. After the explanation, present the full solution.
        4. List any formulas used, and give them clear titles.
        5. All mathematical expressions should be in LaTeX format, wrapped in \`\\(\` and \`\\)\` for inline math, or \`\\[\` and \`\\]\` for display math.
        6. This includes math in the explanations, titles, solutions, and final answer.
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
    console.log("Streaming explanation response:", parsed);
  })
  .on("content.done", (props) => {
    //console.log(props);
  });

  await stream.done();
}

export async function streamQuizResponse(prompt: string, model: string, numMultipleChoice: number, numFreeResponse: number,res: Response) {

  const stream = await openai.chat.completions.stream({
    model,
    messages: [
      {
        role: 'system',
        content: `
        You are a helpful tutor. 
        
        1. Generate a quiz based on the provided prompt.
        2. Include ${numMultipleChoice} multiple choice questions and ${numFreeResponse} free response questions.
        3. For multiple choice questions, provide 4 choices with one correct answer.
        4. For free response questions, give a clear description of the question.
        5. Provide explanations for the correct answers.
        6. Use clear, concise language appropriate for the subject matter.
        `,
      },
      { role: 'user', content: prompt },
    ],
    response_format: zodResponseFormat(QuizSchema, "quiz"),
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
