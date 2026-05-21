import pool from './db.js';

// Map a DB row (snake_case) back to the camelCase shape the frontend expects
const toSeries = (row) => ({
  id:           row.id,
  title:        row.title,
  tagline:      row.tagline,
  year:         row.year,
  seasons:      row.seasons,
  rating:       row.rating,
  match:        row.match,
  description:  row.description,
  creator:      row.creator,
  genres:       row.genres,
  cast:         row.cast_members,
  posterPath:   row.poster_path,
  backdropPath: row.backdrop_path,
  videoPath:    row.video_path,
});

export const getAllSeries = async () => {
  const { rows } = await pool.query('SELECT * FROM series ORDER BY match DESC');
  return rows.map(toSeries);
};

export const findSeries = async (id) => {
  const { rows } = await pool.query('SELECT * FROM series WHERE id = $1', [id]);
  return rows[0] ? toSeries(rows[0]) : null;
};

export const getFeaturedSeries = async () => {
  const featured = await findSeries('night-signal');
  return featured ?? (await getAllSeries())[0] ?? null;
};

export const getGenres = async () => {
  const { rows } = await pool.query(
    'SELECT DISTINCT unnest(genres) AS genre FROM series ORDER BY genre'
  );
  return rows.map((r) => r.genre);
};

export const getMoreLikeThis = async (series, limit = 6) => {
  const { rows } = await pool.query(
    `SELECT s.*,
       cardinality(ARRAY(
         SELECT unnest(s.genres) INTERSECT SELECT unnest($2::text[])
       )) AS score
     FROM series s
     WHERE s.id != $1
     ORDER BY score DESC, s.match DESC
     LIMIT $3`,
    [series.id, series.genres, limit]
  );
  return rows.map(toSeries);
};
