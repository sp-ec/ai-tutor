import { Request, Response } from 'express';
import { fetchOpenAIResponse } from '../services/openai.service';
import { OpenAIModel } from '../types/openai.types';

export const getAIResponse = async (req: Request, res: Response) => {
  const { prompt, model } = req.body as { prompt?: string; model?: string };

  if (!prompt) return res.status(400).json({ error: 'Prompt is required.' });
  if (!model) return res.status(400).json({ error: 'Model is required.' });

  try {
    const response = await fetchOpenAIResponse(prompt, model);
    res.json({ success: true, prompt, response });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to get response from OpenAI.',
      error: error.message,
    });
  }
};
