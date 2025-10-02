-- Tabel hasil latihan
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  exercise TEXT NOT NULL,
  value INT NOT NULL,
  target INT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  badge TEXT
);
