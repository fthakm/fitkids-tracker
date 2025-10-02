import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { fetchStudents } from "../services/studentService";

export default function Leaderboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => { fetchStudents().then(setStudents); }, []);

  const sorted = [...students].sort((a, b) => {
    const aScore = a.results?.filter(r => r.value >= r.target).length || 0;
    const bScore = b.results?.filter(r => r.value >= r.target).length || 0;
    return bScore - aScore;
  });

  return (
    <Box mt={3}>
      <Typography variant="h5">Leaderboard</Typography>
      <ol>
        {sorted.map(s => (
          <li key={s.id}>{s.name} ({s.age_group}) - ✔ {s.results?.filter(r => r.value >= r.target).length || 0} latihan
            {s.results?.every(r => r.value >= r.target) && " 🏅"}
          </li>
        ))}
      </ol>
    </Box>
  );
}
