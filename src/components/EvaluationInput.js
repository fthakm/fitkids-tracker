import { useState } from "react";
import { evaluationCriteria } from "../utils/evaluationCriteria";
import { addEvaluation } from "
  ../services/evaluationService";
import { Button } from "@/components/ui/button";

export default function EvaluationInput({ student, onSuccess }) {
  const [date, setDate] = useState("");
  const [values, setValues] = useState({});
  const ageGroup = getAgeGroup(student.birthdate);

  const criteria = evaluationCriteria[ageGroup] || [];

  const handleChange = (test, value) => {
    setValues((prev) => ({ ...prev, [test]: value }));
  };

  const handleSave = async () => {
    const results = criteria.map((c) => {
      const raw = values[c.test] || "";
      return {
        category: c.category,
        test: c.test,
        value: raw,
        label: getLabel(c, raw),
      };
    });

    await addEvaluation({
      studentId: student.id,
      date,
      ageGroup,
      results,
    });

    if (onSuccess) onSuccess();
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Input Evaluasi {student.name}</h2>

      <input
        type="date"
        className="border p-2 mb-4 w-full"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {criteria.map((c) => (
        <div key={c.test} className="mb-2">
          <label className="block font-medium">{c.test}</label>
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Isi nilai..."
            value={values[c.test] || ""}
            onChange={(e) => handleChange(c.test, e.target.value)}
          />
        </div>
      ))}

      <Button onClick={handleSave} className="mt-4">Simpan</Button>
    </div>
  );
}

// --- Helpers ---
function getAgeGroup(birthdate) {
  const age = Math.floor((Date.now() - new Date(birthdate)) / (365 * 24 * 60 * 60 * 1000));
  if (age <= 8) return "6-8";
  if (age <= 11) return "9-11";
  if (age <= 15) return "12-15";
  return "16+";
}

function getLabel(criteria, value) {
  const num = parseFloat(value);
  for (const r of criteria.ranges) {
    // cek sederhana, real logic bisa di-custom sesuai "condition"
    if (r.condition.includes("<") && num < parseFloat(r.condition.replace("<", ""))) {
      return r.label;
    }
    if (r.condition.includes(">") && num > parseFloat(r.condition.replace(">", ""))) {
      return r.label;
    }
    // range "a - b"
    if (r.condition.includes("-")) {
      const [min, max] = r.condition.split("-").map((s) => parseFloat(s));
      if (num >= min && num <= max) {
        return r.label;
      }
    }
  }
  return "Kurang";
      }
