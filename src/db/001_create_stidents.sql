-- Tabel siswa
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age TEXT NOT NULL,
  birthdate DATE,
  gender TEXT,
  location TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
