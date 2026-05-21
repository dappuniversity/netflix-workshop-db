import 'dotenv/config';
import pg from 'pg';
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const catalog = require('../src/data/catalog.json');
const schema = readFileSync(join(__dirname, '../schema.sql'), 'utf8');

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create table if it doesn't exist
    await client.query(schema);

    for (const show of catalog) {
      await client.query(
        `INSERT INTO series
           (id, title, tagline, year, seasons, rating, match, description, creator,
            genres, cast_members, poster_path, backdrop_path, video_path)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         ON CONFLICT (id) DO UPDATE SET
           title         = EXCLUDED.title,
           tagline       = EXCLUDED.tagline,
           year          = EXCLUDED.year,
           seasons       = EXCLUDED.seasons,
           rating        = EXCLUDED.rating,
           match         = EXCLUDED.match,
           description   = EXCLUDED.description,
           creator       = EXCLUDED.creator,
           genres        = EXCLUDED.genres,
           cast_members  = EXCLUDED.cast_members,
           poster_path   = EXCLUDED.poster_path,
           backdrop_path = EXCLUDED.backdrop_path,
           video_path    = EXCLUDED.video_path`,
        [
          show.id,
          show.title,
          show.tagline,
          show.year,
          show.seasons,
          show.rating,
          show.match,
          show.description,
          show.creator,
          show.genres,
          show.cast,
          show.posterPath,
          show.backdropPath,
          show.videoPath,
        ]
      );
    }

    await client.query('COMMIT');
    console.log(`Seeded ${catalog.length} shows into the series table.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
