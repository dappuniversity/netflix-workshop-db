CREATE TABLE IF NOT EXISTS series (
  id           TEXT PRIMARY KEY,
  title        TEXT    NOT NULL,
  tagline      TEXT,
  year         INTEGER,
  seasons      INTEGER,
  rating       TEXT,
  match        INTEGER,
  description  TEXT,
  creator      TEXT,
  genres       TEXT[],
  cast_members TEXT[],
  poster_path  TEXT,
  backdrop_path TEXT,
  video_path   TEXT
);
