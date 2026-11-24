import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI with server-side injected GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Server-side Gemini multi-turn chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { model, systemInstruction, history, message } = req.body;

    // Validate allowed models
    const validModel = ['gemini-4-argon', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'].includes(model)
      ? model
      : 'gemini-3.8-flash';

    // Build contents from multi-turn history + new user message
    const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      let foundFirstUser = false;
      for (const item of history) {
        if (item.role === 'user') foundFirstUser = true;
        if (foundFirstUser && (item.role === 'user' || item.role === 'model')) {
          formattedContents.push({
            role: item.role,
            parts: [{ text: item.text || '' }]
          });
        }
      }
    }

    formattedContents.push({
      role: 'user',
      parts: [{ text: message || '' }]
    });

    const response = await ai.models.generateContent({
      model: validModel,
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction || 'You are an intelligent AI assistant for the Smart Campus Integrated Management System.',
      }
    });

    res.json({
      reply: response.text || 'I could not generate a response. Please try again.',
      model: validModel,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to process AI chat request.',
      fallback: true
    });
  }
});

async function startServer() {
  // Mount Vite development server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Campus dev server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
