import React from "react";
import { Box, Typography } from "@mui/material";

export default function Leaderboard({ students }) {
  const leaderboard = [...students].sort(
    (a, b) =>
      b.results?.filter(r => r.value >= r.target).length - a.results?.filter(r => r.value >= r.target).length
  );

  return (
    <Box mt={3}>
      <Typography variant="h5" gutterBottom>Leaderboard</Typography>
      <ol>
        {leaderboard.map((s) => (
          <li key={s.id || s.name}>
            <strong>{s.name}</strong> ({s.age}) - ✔ {s.results?.filter(r => r.value >= r.target).length} latihan memenuhi target
          </li>
        ))}
      </ol>
    </Box>
  );
}
