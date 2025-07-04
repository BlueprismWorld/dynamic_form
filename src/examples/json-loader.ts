import { FormSchema } from '../lib/types/form';
import completeShowcaseData from './complete-showcase.json';

// Function to load JSON schema and convert to FormSchema
export function loadCompleteShowcaseSchema(): FormSchema {
  // Deep clone the data to avoid any reference issues
  const clonedData = JSON.parse(JSON.stringify(completeShowcaseData));
  
  return {
    title: clonedData.title,
    description: clonedData.description,
    components: clonedData.components as any[], // Type assertion for JSON import
    initialValues: clonedData.initialValues,
    onSubmit: (data) => {
      console.log('Complete showcase form submitted:', data);
      alert('Form submitted successfully! Check the console for data.');
    }
  };
}

// Export the schema directly
export const CompleteShowcaseSchema = loadCompleteShowcaseSchema();
