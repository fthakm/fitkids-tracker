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

  // Range (contoh: "20 - 30")
  if (condition.includes("-")) {
    const [minStr, maxStr] = condition.split("-").map((s) => s.trim());
    const min = parseFloat(minStr);
    const max = parseFloat(maxStr);
    return value >= min && value <= max;
  }

  // Lebih kecil (contoh: "< 30")
  if (condition.startsWith("<")) {
    const num = parseFloat(condition.replace("<", "").trim());
    return value < num;
  }

  // Lebih besar (contoh: "> 30")
  if (condition.startsWith(">")) {
    const num = parseFloat(condition.replace(">", "").trim());
    return value > num;
  }

  // Sama dengan angka (contoh: "0 cm")
  const num = parseFloat(condition);
  if (!isNaN(num)) {
    return value === num;
  }

  return false;
}
