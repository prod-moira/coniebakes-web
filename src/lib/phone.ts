/** Keeps digits and common phone formatting characters only. */
export function sanitizePhoneInput(value: string): string {
  return value.replace(/[^\d+\-\s()]/g, '');
}
