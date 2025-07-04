import { DataSource, DataSourceSchema, ColumnSchema } from '../types/datasource';
import { FormSchema, ComponentConfig, ValidationRule } from '../types/form';

export interface SchemaGenerationConfig {
  dataSource: DataSource;
  table: string;
  columns: ColumnMapping[];
  formConfig: {
    title: string;
    description: string;
    submitAction: 'create' | 'update' | 'delete';
    includeValidation: boolean;
    includeDefaultValues: boolean;
  };
}

export interface ColumnMapping {
  column: ColumnSchema;
  componentType: string;
  label: string;
  required: boolean;
  validation?: ValidationRule[];
  defaultValue?: any;
  options?: { value: string; label: string }[];
}

export class FormSchemaGenerator {
  static generateFromDataSource(config: SchemaGenerationConfig): FormSchema {
    const { dataSource, table, columns, formConfig } = config;
    
    const components: ComponentConfig[] = [];
    const initialValues: Record<string, any> = {};
    
    // Generate components for each column
    columns.forEach((mapping, index) => {
      const component = this.generateComponentFromColumn(mapping, index, formConfig);
      if (component) {
        components.push(component);
        
        // Set initial values for form inputs
        if (formConfig.includeDefaultValues && mapping.defaultValue !== undefined) {
          const formInput = component as any;
          if (formInput.name) {
            initialValues[formInput.name] = mapping.defaultValue;
          }
        }
      }
    });
    
    // Add submit button
    components.push({
      id: 'submit-button',
      type: 'button',
      label: `${formConfig.submitAction.charAt(0).toUpperCase() + formConfig.submitAction.slice(1)} Record`,
      variant: 'primary',
      buttonType: 'submit',
      className: 'mt-6'
    });
    
    // Generate form schema
    const formSchema: FormSchema = {
      title: formConfig.title,
      description: formConfig.description,
      components,
      initialValues,
      onSubmit: (data: any) => {
        console.log(`${formConfig.submitAction} data:`, data);
      }
    };
    
    return formSchema;
  }
  
  private static generateComponentFromColumn(
    mapping: ColumnMapping, 
    index: number, 
    formConfig: SchemaGenerationConfig['formConfig']
  ): ComponentConfig | null {
    const { column, componentType, label, required } = mapping;
    
    // Skip primary keys for create forms
    if (column.isPrimaryKey && formConfig.submitAction === 'create') {
      return null;
    }
    
    // Create basic component config
    const baseComponent = {
      id: `field-${column.name}`,
      name: column.name,
      label: label,
      required: required,
    };
    
    // Add validation if requested
    const validation: ValidationRule[] = [];
    if (formConfig.includeValidation) {
      if (required) {
        validation.push({
          type: 'required',
          message: `${label} is required`
        });
      }
      
      // Add type-specific validation
      if (componentType === 'email') {
        validation.push({
          type: 'email',
          message: 'Please enter a valid email address'
        });
      }
      
      if (column.constraints?.maxLength) {
        validation.push({
          type: 'pattern',
          value: `.{0,${column.constraints.maxLength}}`,
          message: `Maximum length is ${column.constraints.maxLength} characters`
        });
      }
      
      if (column.constraints?.minLength) {
        validation.push({
          type: 'pattern',
          value: `.{${column.constraints.minLength},}`,
          message: `Minimum length is ${column.constraints.minLength} characters`
        });
      }
    }
    
    // Return typed component based on type
    switch (componentType) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'date':
      case 'time':
      case 'datetime-local':
        return {
          ...baseComponent,
          type: componentType,
          validation: validation.length > 0 ? validation : undefined,
          ...(column.constraints?.maxLength && { maxLength: column.constraints.maxLength }),
          ...(column.constraints?.minLength && { minLength: column.constraints.minLength }),
        } as any;
      
      case 'textarea':
        return {
          ...baseComponent,
          type: 'textarea',
          validation: validation.length > 0 ? validation : undefined,
          rows: 4,
          ...(column.constraints?.maxLength && { maxLength: column.constraints.maxLength }),
        } as any;
      
      case 'select':
        const isArrayType = column.type === 'array' || column.type.includes('[]');
        return {
          ...baseComponent,
          type: 'select',
          multiple: isArrayType, // Set multiple for array types
          options: mapping.options || [],
          validation: validation.length > 0 ? validation : undefined,
        } as any;
      
      case 'radio':
        return {
          ...baseComponent,
          type: 'radio',
          options: mapping.options || [],
          validation: validation.length > 0 ? validation : undefined,
        } as any;
      
      case 'checkbox':
        return {
          ...baseComponent,
          type: 'checkbox',
          validation: validation.length > 0 ? validation : undefined,
        } as any;
      
      case 'file':
        return {
          ...baseComponent,
          type: 'file',
          validation: validation.length > 0 ? validation : undefined,
        } as any;
      
      default:
        return {
          ...baseComponent,
          type: 'text',
          validation: validation.length > 0 ? validation : undefined,
        } as any;
    }
  }
  
  static exportToFile(formSchema: FormSchema, filename: string = 'form-schema') {
    const dataStr = JSON.stringify(formSchema, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${filename}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
  
  static generateValidationRules(column: ColumnSchema, componentType?: string): ValidationRule[] {
    const rules: ValidationRule[] = [];
    
    if (!column.nullable) {
      rules.push({
        type: 'required',
        message: `${column.name} is required`
      });
    }
    
    if (column.type === 'string' && componentType === 'email') {
      rules.push({
        type: 'email',
        message: 'Please enter a valid email address'
      });
    }
    
    if (column.constraints?.maxLength) {
      rules.push({
        type: 'pattern',
        value: `.{0,${column.constraints.maxLength}}`,
        message: `Maximum length is ${column.constraints.maxLength} characters`
      });
    }
    
    if (column.constraints?.minLength) {
      rules.push({
        type: 'pattern',
        value: `.{${column.constraints.minLength},}`,
        message: `Minimum length is ${column.constraints.minLength} characters`
      });
    }
    
    return rules;
  }
}
