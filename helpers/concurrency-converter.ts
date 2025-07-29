export const salaryRanges = [
  "0-1000000",
  "1000000-2000000",
  "2000000-3000000",
  "3000000-4000000",
  "4000000-5000000",
  "5000000-6000000",
  "6000000-7000000",
  "7000000-8000000",
  "8000000-9000000",
  "9000000-10000000",
  "10000000-12000000",
  "12000000-20000000",
  "20000000-25000000",
  "25000000-999999999",
] as const;

export const salaryRangeOptions = salaryRanges.map((range) => {
  const [min, max] = range.split("-").map(Number);
  if (range === "25000000-999999999") {
    return { label: "More than 25.000.000", value: range };
  }
  return {
    label: `${min.toLocaleString("id-ID")} - ${max.toLocaleString("id-ID")}`,
    value: range,
  };
});

export function convertApiSalaryToRange(apiSalary: string): string {
  const cleaned = apiSalary.replace(/\s/g, "");
  const exactMatch = salaryRanges.find((range) => range === cleaned);
  if (exactMatch) return exactMatch;
  const [minStr, maxStr] = cleaned.split("-");
  const min = parseInt(minStr);
  const max = parseInt(maxStr);
  const containingRange = salaryRanges.find((range) => {
    const [rangeMin, rangeMax] = range.split("-").map(Number);
    return min >= rangeMin && max <= rangeMax;
  });
  return containingRange || cleaned;
}

export function formatSalaryRangePublic(range: string): string {
  if (!range) return "-";

  const [min, max] = range.split("-").map((val) => parseInt(val.trim(), 10));

  // Khusus kalau nilai max sangat besar (misal 999999999), artikan sebagai "More than"
  if (max >= 999999999) {
    return `More than Rp${min.toLocaleString("id-ID")}`;
  }

  return `Rp${min.toLocaleString("id-ID")} - Rp${max.toLocaleString("id-ID")}`;
}