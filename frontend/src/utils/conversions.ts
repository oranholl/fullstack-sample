export function cmToFeetInches(heightInCm: number): string {
  const heightInInches = Math.round(heightInCm / 2.54);
  const feet = Math.floor(heightInInches / 12);
  const inches = heightInInches % 12;
  return `${feet}' ${inches.toString().padStart(2, "0")}"`;
}

export function kgToLbs(weightInKg: number): string {
  return (weightInKg * 2.20462).toFixed(1);
}

export function formatPokedexNumber(num: number | string): string {
  return num.toString().padStart(4, "0");
}