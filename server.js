import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {DatabaseSync} from 'node:sqlite';
import {createServer as createViteServer} from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('--prod');
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';

const dataDir = path.join(__dirname, 'data');
fs.mkdirSync(dataDir, {recursive: true});

const db = new DatabaseSync(path.join(dataDir, 'aina-feedback.sqlite'));

db.exec(`
  CREATE TABLE IF NOT EXISTS feedback (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    page_path TEXT NOT NULL,
    comment TEXT NOT NULL,
    status TEXT NOT NULL,
    element_tag TEXT NOT NULL,
    element_label TEXT NOT NULL,
    element_selector TEXT NOT NULL,
    element_text TEXT NOT NULL,
    rect_json TEXT NOT NULL,
    viewport_json TEXT NOT NULL
  )
`);

const listStatement = db.prepare(`
  SELECT
    id,
    created_at AS createdAt,
    page_path AS pagePath,
    comment,
    status,
    element_tag AS elementTag,
    element_label AS elementLabel,
    element_selector AS elementSelector,
    element_text AS elementText,
    rect_json AS rectJson,
    viewport_json AS viewportJson
  FROM feedback
  ORDER BY created_at DESC
`);

const insertStatement = db.prepare(`
  INSERT INTO feedback (
    id,
    created_at,
    page_path,
    comment,
    status,
    element_tag,
    element_label,
    element_selector,
    element_text,
    rect_json,
    viewport_json
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const updateStatusStatement = db.prepare('UPDATE feedback SET status = ? WHERE id = ?');
const deleteStatement = db.prepare('DELETE FROM feedback WHERE id = ?');
const clearStatement = db.prepare('DELETE FROM feedback');

function toFeedback(row) {
  return {
    id: row.id,
    createdAt: row.createdAt,
    pagePath: row.pagePath,
    comment: row.comment,
    status: row.status,
    elementTag: row.elementTag,
    elementLabel: row.elementLabel,
    elementSelector: row.elementSelector,
    elementText: row.elementText,
    rect: JSON.parse(row.rectJson),
    viewport: JSON.parse(row.viewportJson),
  };
}

function readText(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function assertFeedbackPayload(body) {
  const comment = readText(body.comment);

  if (!comment) {
    const error = new Error('Feedback comment is required.');
    error.statusCode = 400;
    throw error;
  }

  return {
    id: readText(body.id, `${Date.now()}-${Math.random().toString(16).slice(2)}`),
    createdAt: readText(body.createdAt, new Date().toISOString()),
    pagePath: readText(body.pagePath, '/'),
    comment,
    status: readText(body.status, 'new'),
    elementTag: readText(body.elementTag, 'element'),
    elementLabel: readText(body.elementLabel, 'Selected element'),
    elementSelector: readText(body.elementSelector, ''),
    elementText: readText(body.elementText, ''),
    rect: body.rect ?? {x: 0, y: 0, width: 0, height: 0},
    viewport: body.viewport ?? {width: 0, height: 0},
  };
}

async function createApp() {
  const app = express();

  app.use(express.json({limit: '1mb'}));

  app.get('/api/feedback', (_request, response) => {
    response.json(listStatement.all().map(toFeedback));
  });

  app.post('/api/feedback', (request, response, next) => {
    try {
      const item = assertFeedbackPayload(request.body);

      insertStatement.run(
        item.id,
        item.createdAt,
        item.pagePath,
        item.comment,
        item.status,
        item.elementTag,
        item.elementLabel,
        item.elementSelector,
        item.elementText,
        JSON.stringify(item.rect),
        JSON.stringify(item.viewport),
      );

      response.status(201).json(item);
    } catch (error) {
      next(error);
    }
  });

  app.patch('/api/feedback/:id', (request, response) => {
    const status = readText(request.body?.status, 'new');

    if (!['new', 'reviewed', 'resolved'].includes(status)) {
      response.status(400).json({error: 'Invalid status.'});
      return;
    }

    updateStatusStatement.run(status, request.params.id);
    response.status(204).end();
  });

  app.delete('/api/feedback/:id', (request, response) => {
    deleteStatement.run(request.params.id);
    response.status(204).end();
  });

  app.delete('/api/feedback', (_request, response) => {
    clearStatement.run();
    response.status(204).end();
  });

  app.use((error, _request, response, _next) => {
    response.status(error.statusCode || 500).json({
      error: error.message || 'Unexpected server error.',
    });
  });

  if (isProduction) {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_request, response) => {
      response.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'spa',
    });

    app.use(vite.middlewares);
  }

  return app;
}

const app = await createApp();

app.listen(port, host, () => {
  console.log(`AINA app running at http://127.0.0.1:${port}/`);
  console.log(`Feedback admin: http://127.0.0.1:${port}/admin`);
});

