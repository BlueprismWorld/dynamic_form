// Data Source Types
export interface DataSource {
  id: string;
  name: string;
  type: 'supabase' | 'rest' | 'soap';
  config: SupabaseConfig | RestApiConfig | SoapApiConfig;
  connected: boolean;
  schema?: DataSourceSchema;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  tables?: string[];
}

export interface RestApiConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  authentication?: {
    type: 'bearer' | 'api_key' | 'basic';
    token?: string;
    apiKey?: string;
    username?: string;
    password?: string;
  };
}

export interface SoapApiConfig {
  wsdlUrl: string;
  endpoint: string;
  namespace?: string;
  authentication?: {
    type: 'basic' | 'wss';
    username?: string;
    password?: string;
  };
}

export interface DataSourceSchema {
  tables: TableSchema[];
  endpoints?: EndpointSchema[];
}

export interface TableSchema {
  name: string;
  columns: ColumnSchema[];
  relationships?: RelationshipSchema[];
}

export interface ColumnSchema {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'json' | 'array';
  nullable: boolean;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  description?: string;
  defaultValue?: any;
  constraints?: {
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    enum?: any[];
  };
}

export interface RelationshipSchema {
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  targetTable: string;
  foreignKey: string;
  targetKey: string;
}

export interface EndpointSchema {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description?: string;
  parameters?: ParameterSchema[];
  requestBody?: SchemaObject;
  responses?: Record<string, SchemaObject>;
}

export interface ParameterSchema {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  required: boolean;
  description?: string;
}

export interface SchemaObject {
  type: string;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
}

export interface SchemaProperty {
  type: string;
  description?: string;
  enum?: any[];
  items?: SchemaProperty;
}

// Form Builder Types
export interface ComponentTemplate {
  id: string;
  type: string;
  label: string;
  icon: React.ReactNode;
  category: 'input' | 'layout' | 'display' | 'data';
  defaultProps: Record<string, any>;
  dataBindable?: boolean;
}

export interface DragItem {
  type: string;
  componentType: string;
  component?: ComponentTemplate;
  index?: number;
}

export interface DropResult {
  type: string;
  index: number;
}
