import { Request, Response } from 'express';
import { streamQuizResponse, streamExplanationResponse } from '../services/openai.service';
import { OpenAIModel } from '../types/openai.types';


export const getExplanationResponse = async (req: Request, res: Response) => {
  const { prompt, model} = req.body as { prompt?: string; model?: string; };

  if (!prompt) return res.status(400).json({ error: 'Prompt is required.' });
  if (!model) return res.status(400).json({ error: 'Model is required.' });

  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); 

    await streamExplanationResponse(prompt, model, res);

  } catch (error: any) {
    res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

export const getQuizResponse = async (req: Request, res: Response) => {
  const { prompt, model, numMultipleChoice, numFreeResponse } = req.body as { prompt?: string; model?: string; numMultipleChoice?: number; numFreeResponse?: number };

  if (!prompt) return res.status(400).json({ error: 'Prompt is required.' });
  if (!model) return res.status(400).json({ error: 'Model is required.' });
  if (!numMultipleChoice) return res.status(400).json({ error: 'Number of multiple choice questions is required.' });
  if (!numFreeResponse) return res.status(400).json({ error: 'Number of free response questions is required.' });

  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); 

    await streamQuizResponse(prompt, model, numMultipleChoice, numFreeResponse, res);

  } catch (error: any) {
    res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};
