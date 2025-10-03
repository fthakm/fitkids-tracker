import React, { useState } from "react";

export default function StudentDialog({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    birthdate: "",
    gender: "L",
    address: "",
  });

  if (!open) return null;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit() {
    if (!form.name || !form.birthdate) {
      alert("Nama & tanggal lahir wajib diisi!");
      return;
    }
    onSave(form);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-96">
        <h2 className="font-bold text-lg">Tambah Siswa</h2>

        <input
          className="border p-1 w-full mt-2"
          placeholder="Nama"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          className="border p-1 w-full mt-2"
          type="date"
          name="birthdate"
          value={form.birthdate}
          onChange={handleChange}
        />

        <select
          className="border p-1 w-full mt-2"
          name="gender"
          value={form.gender}
          onChange={handleChange}
        >
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>

        <textarea
          className="border p-1 w-full mt-2"
          placeholder="Alamat"
          name="address"
          value={form.address}
          onChange={handleChange}
        />

        <div className="mt-3 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
