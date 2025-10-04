export const ALLOWED_VARIABLES = [
    { key: 'name', label: 'Name', description: 'Lead name' },
    { key: 'firstName', label: 'First Name', description: 'Lead first name' },
    { key: 'lastName', label: 'Last Name', description: 'Lead last name' },
    { key: 'email', label: 'Email', description: 'Lead email address' },
    { key: 'phone', label: 'Phone', description: 'Lead phone number' },
    { key: 'company', label: 'Company', description: 'Company name' },
    { key: 'discount', label: 'Discount', description: 'Discount amount' },
    { key: 'product', label: 'Product', description: 'Product name' },
    { key: 'orderNumber', label: 'Order Number', description: 'Order reference' },
  ] as const;
  
export const ALLOWED_VARIABLE_KEYS = ALLOWED_VARIABLES.map(v => v.key) as unknown as typeof ALLOWED_VARIABLES[number]['key'][];

  