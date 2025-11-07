/**
 * Convert height from centimeters to feet and inches
 * @param heightInCm Height in centimeters
 * @returns Formatted string like "5' 07""
 */
export function cmToFeetInches(heightInCm: number): string {
  const heightInInches = Math.round(heightInCm / 2.54);
  const feet = Math.floor(heightInInches / 12);
  const inches = heightInInches % 12;
  return `${feet}' ${inches.toString().padStart(2, "0")}"`;
}

/**
 * Convert weight from kilograms to pounds
 * @param weightInKg Weight in kilograms
 * @returns Weight in pounds with 1 decimal place
 */
export function kgToLbs(weightInKg: number): string {
  return (weightInKg * 2.20462).toFixed(1);
}

/**
 * Format Pokemon number with leading zeros
 * @param num Pokemon number
 * @returns Formatted string like "0001"
 */
export function formatPokedexNumber(num: number | string): string {
  return num.toString().padStart(4, "0");
}
