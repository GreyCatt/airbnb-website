const express = require('express');
const fs = require('node:fs/promises');
const path = require('node:path');

const app = express();
const port = Number(process.env.PORT) || 3000;
const imagesFile = path.join(__dirname, 'data', 'images.json');
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:8080';

app.disable('x-powered-by');

app.use((request, response, next) => {
  if (request.headers.origin === allowedOrigin) {
    response.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    response.setHeader('Vary', 'Origin');
  }
  next();
});

async function readImages() {
  const contents = await fs.readFile(imagesFile, 'utf8');
  const data = JSON.parse(contents);

  if (!Array.isArray(data.images)) {
    throw new Error('images.json must contain an images array');
  }

  return data.images.sort((first, second) => first.displayOrder - second.displayOrder);
}

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/images', async (_request, response, next) => {
  try {
    response.setHeader('Cache-Control', 'no-store');
    response.json({ images: await readImages() });
  } catch (error) {
    next(error);
  }
});

app.get('/api/images/:id', async (request, response, next) => {
  try {
    const image = (await readImages()).find((item) => item.id === request.params.id);
    if (!image) return response.status(404).json({ error: 'Image not found' });
    response.setHeader('Cache-Control', 'no-store');
    return response.json({ image });
  } catch (error) {
    return next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: 'Unable to load image data' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Balinese Retreat API listening on port ${port}`);
});
