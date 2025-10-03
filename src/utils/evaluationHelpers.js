// src/utils/evaluationHelpers.js

import { evaluationCriteria } from "./evaluationCriteria";

// Tentukan kelompok umur dari usia
export function getAgeGroup(age) {
  if (age >= 6 && age <= 8) return "6-8";
  if (age >= 9 && age <= 11) return "9-11";
  if (age >= 12 && age <= 15) return "12-15";
  if (age >= 16) return "16+";
  return null;
}

// Ambil daftar kriteria berdasarkan usia
export function getCriteriaByAge(age) {
  const group = getAgeGroup(age);
  return group ? evaluationCriteria[group] : [];
}

// Evaluasi skor terhadap range kriteria
export function evaluateScore(test, score, age) {
  const criteriaList = getCriteriaByAge(age);
  const testCriteria = criteriaList.find((c) => c.test === test);

  if (!testCriteria) return "Tidak ada kriteria";

  for (const range of testCriteria.ranges) {
    if (checkCondition(score, range.condition)) {
      return range.label;
    }
  }

  return "Tidak terdefinisi";
}

// Fungsi bantu untuk ngecek kondisi string (misal: "< 30", "20 - 30")
function checkCondition(value, condition) {
  condition = condition.trim();

  if (condition.includes("-")) {
    const [minStr, maxStr] = condition.split("-").map((s) => s.trim());
    const min = parseFloat(minStr);
    const max = parseFloat(maxStr);
    return value >= min && value <= max;
  }

  if (condition.startsWith("<")) {
    const num = parseFloat(condition.replace("<", "").trim());
    return value < num;
  }

  if (condition.startsWith(">")) {
    const num = parseFloat(condition.replace(">", "").trim());
    return value > num;
  }

  const num = parseFloat(condition);
  if (!isNaN(num)) {
    return value === num;
  }

  return false;
}

// --- FUNGSI TAMBAHAN BIAR LENGKAP ---

// Klasifikasi skor umum
export function classifyScore(score) {
  if (score >= 85) return "Sangat Baik";
  if (score >= 70) return "Baik";
  if (score >= 50) return "Cukup";
  return "Kurang";
}

// Hitung rata-rata dari daftar skor
export function calculateAverage(scores) {
  if (!scores || scores.length === 0) return 0;
  const sum = scores.reduce((acc, val) => acc + val, 0);
  return sum / scores.length;
}

// Ambil skor maksimum
export function getMaxScore(scores) {
  return scores && scores.length > 0 ? Math.max(...scores) : 0;
}

// Ambil skor minimum
export function getMinScore(scores) {
  return scores && scores.length > 0 ? Math.min(...scores) : 0;
}

// Hitung status evaluasi untuk satu tes (pakai evaluateScore + classifyScore)
export function getEvaluationStatus(test, score, age) {
  const evalResult = evaluateScore(test, score, age);
  const classification = classifyScore(score);
  return `${evalResult} (${classification})`;
}
