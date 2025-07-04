import { ValidationRule, ConditionalRule } from '../types/form';

/**
 * Validates a field value against validation rules
 */
export function validateField(value: any, rules: ValidationRule[]): string | null {
  for (const rule of rules) {
    const error = validateRule(value, rule);
    if (error) {
      return error;
    }
  }
  return null;
}

/**
 * Validates a single validation rule
 */
export function validateRule(value: any, rule: ValidationRule): string | null {
  switch (rule.type) {
    case 'required':
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return rule.message;
      }
      break;

    case 'email':
      if (value && !isValidEmail(value)) {
        return rule.message;
      }
      break;

    case 'min':
      if (typeof value === 'string' && value.length < rule.value) {
        return rule.message;
      }
      if (typeof value === 'number' && value < rule.value) {
        return rule.message;
      }
      break;

    case 'max':
      if (typeof value === 'string' && value.length > rule.value) {
        return rule.message;
      }
      if (typeof value === 'number' && value > rule.value) {
        return rule.message;
      }
      break;

    case 'pattern':
      if (value && !new RegExp(rule.value).test(value)) {
        return rule.message;
      }
      break;

    case 'custom':
      if (rule.validator && !rule.validator(value)) {
        return rule.message;
      }
      break;
  }
  return null;
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates form data against schema
 */
export function validateFormData(
  data: Record<string, any>,
  validationRules: Record<string, ValidationRule[]>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [fieldName, rules] of Object.entries(validationRules)) {
    const error = validateField(data[fieldName], rules);
    if (error) {
      errors[fieldName] = error;
    }
  }

  return errors;
}

/**
 * Evaluates conditional rules for visibility
 */
export function evaluateConditionalRule(
  rule: ConditionalRule,
  formData: Record<string, any>
): boolean {
  const fieldValue = formData[rule.field];
  
  let result = false;
  
  switch (rule.operator) {
    case 'equals':
      result = fieldValue === rule.value;
      break;
    case 'notEquals':
      result = fieldValue !== rule.value;
      break;
    case 'contains':
      result = Array.isArray(fieldValue) 
        ? fieldValue.includes(rule.value)
        : String(fieldValue).includes(String(rule.value));
      break;
    case 'notContains':
      result = Array.isArray(fieldValue) 
        ? !fieldValue.includes(rule.value)
        : !String(fieldValue).includes(String(rule.value));
      break;
    case 'greaterThan':
      result = Number(fieldValue) > Number(rule.value);
      break;
    case 'lessThan':
      result = Number(fieldValue) < Number(rule.value);
      break;
    case 'in':
      result = Array.isArray(rule.value) && rule.value.includes(fieldValue);
      break;
    case 'notIn':
      result = Array.isArray(rule.value) && !rule.value.includes(fieldValue);
      break;
  }

  // Handle nested rules with logic operators
  if (rule.rules && rule.rules.length > 0) {
    const nestedResults = rule.rules.map(nestedRule => 
      evaluateConditionalRule(nestedRule, formData)
    );

    if (rule.logic === 'and') {
      result = result && nestedResults.every(Boolean);
    } else if (rule.logic === 'or') {
      result = result || nestedResults.some(Boolean);
    }
  }

  return result;
}

/**
 * Checks if a component should be visible based on visibleIf conditions
 */
export function shouldShowComponent(
  visibleIf: ConditionalRule | undefined,
  formData: Record<string, any>
): boolean {
  if (!visibleIf) {
    return true;
  }
  
  return evaluateConditionalRule(visibleIf, formData);
}

/**
 * Debounced validation function
 */
export function createDebouncedValidator(
  validator: (value: any) => string | null,
  delay: number = 300
) {
  let timeoutId: NodeJS.Timeout;
  
  return (value: any, callback: (error: string | null) => void) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const error = validator(value);
      callback(error);
    }, delay);
  };
}

/**
 * Common validation rules factory
 */
export const ValidationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    type: 'required',
    message,
  }),
  
  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    type: 'email',
    message,
  }),
  
  minLength: (length: number, message?: string): ValidationRule => ({
    type: 'min',
    value: length,
    message: message || `Must be at least ${length} characters long`,
  }),
  
  maxLength: (length: number, message?: string): ValidationRule => ({
    type: 'max',
    value: length,
    message: message || `Must not exceed ${length} characters`,
  }),
  
  pattern: (pattern: string, message: string): ValidationRule => ({
    type: 'pattern',
    value: pattern,
    message,
  }),
  
  custom: (validator: (value: any) => boolean, message: string): ValidationRule => ({
    type: 'custom',
    validator,
    message,
  }),
};
