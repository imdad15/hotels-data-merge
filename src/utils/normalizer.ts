/**
 * Normalizes amenity names by:
 * - Converting to lowercase
 * - Preserving spaces, slashes, and hyphens
 * - Removing only unwanted special characters
 */
export function normalizeAmenity(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s\/-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}