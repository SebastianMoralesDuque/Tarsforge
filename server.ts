import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;

app.use('/api/ollama', async (req, res) => {
  try {
    if (!OLLAMA_API_KEY) {
      res.status(500).json({ error: 'OLLAMA_API_KEY not configured' });
      return;
    }

    const body = req.body;
    const model = body.model || 'nemotron-3-super:cloud';

    const ollamaBody = {
      model,
      messages: body.messages,
      stream: body.stream || false,
    };

    const response = await fetch('https://ollama.com/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OLLAMA_API_KEY}`,
      },
      body: JSON.stringify(ollamaBody),
    });

    if (body.stream) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Transfer-Encoding', 'chunked');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      const stream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(decoder.decode(value, { stream: true }));
          }
          res.end();
        } catch (err) {
          res.end();
        }
      };

      stream();
    } else {
      const data = await response.json();
      const openAIFormat = {
        id: data.id || `chatcmpl-${Date.now()}`,
        object: 'chat.completion',
        created: data.created || Math.floor(Date.now() / 1000),
        model: data.model || model,
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: data.message?.content || '',
            },
            finish_reason: 'stop',
          },
        ],
        usage: data.usage || {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
        },
      };
      res.json(openAIFormat);
    }
  } catch (err) {
    console.error('Ollama Cloud proxy error:', err.message);
    res.status(502).json({ error: 'Failed to reach Ollama Cloud' });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});