import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const getDirname = () => {
  if (typeof import.meta.url !== 'undefined' && import.meta.url.startsWith('file://')) {
    return path.dirname(fileURLToPath(import.meta.url));
  }
  return process.cwd();
};

const __dirname = getDirname();

console.log('__dirname resolved to:', __dirname);
console.log('dist path:', path.join(__dirname, 'dist'));
console.log('index.html exists:', fs.existsSync(path.join(__dirname, 'dist', 'index.html')));

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
    const model = body.model || 'minimax-m2.7:cloud';

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
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Transfer-Encoding', 'chunked');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.flushHeaders();

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const stream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;
              try {
                const ollamaChunk = JSON.parse(trimmed);
                const openAIChunk = {
                  id: `chatcmpl-${Date.now()}`,
                  object: 'chat.completion.chunk',
                  created: Math.floor(Date.now() / 1000),
                  model: ollamaChunk.model || model,
                  choices: [{
                    index: 0,
                    delta: {
                      content: ollamaChunk.message?.content || '',
                    },
                    finish_reason: ollamaChunk.done ? 'stop' : null,
                  }],
                };
                res.write(`data: ${JSON.stringify(openAIChunk)}\n`);
              } catch { /* skip malformed JSON */ }
            }
          }
          if (buffer.trim()) {
            try {
              const ollamaChunk = JSON.parse(buffer.trim());
              const openAIChunk = {
                id: `chatcmpl-${Date.now()}`,
                object: 'chat.completion.chunk',
                created: Math.floor(Date.now() / 1000),
                model: ollamaChunk.model || model,
                choices: [{
                  index: 0,
                  delta: { content: ollamaChunk.message?.content || '' },
                  finish_reason: ollamaChunk.done ? 'stop' : null,
                }],
              };
              res.write(`data: ${JSON.stringify(openAIChunk)}\n`);
            } catch { /* skip */ }
          }
          res.write('data: [DONE]\n');
          res.end();
        } catch (err) {
          console.error('Stream error:', err.message);
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