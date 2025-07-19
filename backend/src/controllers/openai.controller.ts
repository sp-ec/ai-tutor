import { Request, Response } from 'express';
import { fetchOpenAIResponse, streamExplanationResponse } from '../services/openai.service';
import { OpenAIModel } from '../types/openai.types';


export const getAIResponse = async (req: Request, res: Response) => {
  const prompt = req.query.prompt as string;
  const model = req.query.model as string;

  if (!prompt) return res.status(400).json({ error: 'Prompt is required.' });
  if (!model) return res.status(400).json({ error: 'Model is required.' });

  try {
    console.log(`Using model ${model}`);
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

export const getExplanationResponse = async (req: Request, res: Response) => {
  const { prompt, model } = req.body as { prompt?: string; model?: string };

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
