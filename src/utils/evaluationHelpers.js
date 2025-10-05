import { evaluationCriteria } from "./evaluationCriteria";

export function getAgeGroup(age) {
  if (age >= 6 && age <= 8) return "6-8";
  if (age >= 9 && age <= 11) return "9-11";
  if (age >= 12 && age <= 15) return "12-15";
  if (age >= 16) return "16+";
  return null;
}

export function getCriteriaByAge(age) {
  const group = getAgeGroup(age);
  return group ? evaluationCriteria[group] : [];
}

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

function checkCondition(value, condition) {
  condition = String(condition).trim();
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
  if (!isNaN(num)) return value === num;
  return false;
}


// AUTO-ADDED placeholder for 'cl' — implement real logic
export const cl = async (...args) => {
  console.warn('placeholder cl called');
  return null;
};
