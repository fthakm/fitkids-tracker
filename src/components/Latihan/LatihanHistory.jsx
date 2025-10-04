import React, { useState, useEffect } from "react";
import { Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getAllLatihan } from "../../services/latihanService";

export default function LatihanHistory({ onClose }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllLatihan().then(setData).catch(console.error);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Typography variant="h6" className="text-blue-600 font-semibold">
          Riwayat Latihan
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Tanggal</th>
              <th className="p-3 text-left">Jenis Latihan</th>
              <th className="p-3 text-left">Target</th>
              <th className="p-3 text-left">Peserta</th>
            </tr>
          </thead>
          <tbody>
            {data.map((l) => (
              <tr key={l.id} className="border-b hover:bg-blue-50">
                <td className="p-3">{new Date(l.date).toLocaleDateString()}</td>
                <td className="p-3">{l.type}</td>
                <td className="p-3">{l.target}</td>
                <td className="p-3">
                  {l.participants?.length
                    ? l.participants.map((p) => p.name).join(", ")
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
