import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {
  getAllSeries,
  findSeries,
  getFeaturedSeries,
  getGenres,
  getMoreLikeThis,
} from './catalog.js';

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// GET /api/catalog — all series
app.get('/api/catalog', async (_req, res) => {
  res.json(await getAllSeries());
});

// GET /api/catalog/featured — the hero series
// NOTE: must be registered before /api/catalog/:id
app.get('/api/catalog/featured', async (_req, res) => {
  res.json(await getFeaturedSeries());
});

// GET /api/catalog/genres — unique sorted genres
// NOTE: must be registered before /api/catalog/:id
app.get('/api/catalog/genres', async (_req, res) => {
  res.json(await getGenres());
});

// GET /api/search?q= — search stub (workshop exercise)
app.get('/api/search', async (req, res) => {
  const q = (req.query.q ?? '').toLowerCase();
  const all = await getAllSeries();
  if (!q) return res.json(all);
  // TODO: implement real search logic (Workshop: full-text search exercise)
  return res.json(all);
});

// GET /api/catalog/:id — single series
app.get('/api/catalog/:id', async (req, res) => {
  const series = await findSeries(req.params.id);
  if (!series) return res.status(404).json({ error: 'Not found' });
  res.json(series);
});

// GET /api/catalog/:id/more-like-this — genre-based recommendations
app.get('/api/catalog/:id/more-like-this', async (req, res) => {
  const series = await findSeries(req.params.id);
  if (!series) return res.status(404).json({ error: 'Not found' });
  res.json(await getMoreLikeThis(series));
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
