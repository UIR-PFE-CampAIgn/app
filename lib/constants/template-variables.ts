export const ALLOWED_VARIABLES = [
  { key: 'name', label: 'Name', description: 'Lead name from WhatsApp profile' },
  { key: 'phone', label: 'Phone', description: 'Phone number' },
] as const;
  
export const ALLOWED_VARIABLE_KEYS = ALLOWED_VARIABLES.map(v => v.key) as unknown as typeof ALLOWED_VARIABLES[number]['key'][];

  