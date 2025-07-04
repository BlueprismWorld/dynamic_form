import { 
  DataSource, 
  DataSourceSchema, 
  SupabaseConfig, 
  RestApiConfig, 
  SoapApiConfig,
  TableSchema,
  ColumnSchema
} from '../types/datasource';

export interface DataSourceConnection {
  connect(): Promise<boolean>;
  fetchSchema(): Promise<DataSourceSchema>;
  fetchSampleData(tableName: string): Promise<any>;
  testConnection(): Promise<boolean>;
}

export class SupabaseConnection implements DataSourceConnection {
  private config: SupabaseConfig;

  constructor(config: SupabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.url}/rest/v1/`, {
        headers: {
          'apikey': this.config.anonKey,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Supabase connection failed:', error);
      return false;
    }
  }

  async fetchSchema(): Promise<DataSourceSchema> {
    try {
      // Get all tables
      const tablesResponse = await fetch(`${this.config.url}/rest/v1/`, {
        headers: {
          'apikey': this.config.anonKey,
          'Content-Type': 'application/json'
        }
      });

      if (!tablesResponse.ok) {
        throw new Error('Failed to fetch tables');
      }

      const tablesData = await tablesResponse.json();
      const tableNames = tablesData.definitions ? Object.keys(tablesData.definitions) : [];

      // For each table, get its schema
      const tables: TableSchema[] = [];
      
      for (const tableName of tableNames) {
        try {
          const columns = await this.fetchTableColumns(tableName);
          tables.push({
            name: tableName,
            columns: columns,
            relationships: [] // TODO: Implement relationship fetching
          });
        } catch (error) {
          console.warn(`Failed to fetch schema for table ${tableName}:`, error);
        }
      }

      return {
        tables: tables
      };
    } catch (error) {
      console.error('Failed to fetch Supabase schema:', error);
      throw error;
    }
  }

  private async fetchTableColumns(tableName: string): Promise<ColumnSchema[]> {
    try {
      // Use Supabase's PostgREST API to get table schema
      const response = await fetch(`${this.config.url}/rest/v1/${tableName}?limit=0`, {
        headers: {
          'apikey': this.config.anonKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch schema for table ${tableName}`);
      }

      // Get column information from response headers or make a separate request
      const sampleResponse = await fetch(`${this.config.url}/rest/v1/${tableName}?limit=1`, {
        headers: {
          'apikey': this.config.anonKey,
          'Content-Type': 'application/json'
        }
      });

      if (sampleResponse.ok) {
        const sampleData = await sampleResponse.json();
        if (sampleData.length > 0) {
          const sample = sampleData[0];
          return Object.keys(sample).map(key => ({
            name: key,
            type: this.inferTypeFromValue(sample[key]),
            nullable: sample[key] === null,
            isPrimaryKey: key === 'id',
            description: `Column ${key} from table ${tableName}`
          }));
        }
      }

      // Fallback: return empty array
      return [];
    } catch (error) {
      console.error(`Failed to fetch columns for table ${tableName}:`, error);
      return [];
    }
  }

  private inferTypeFromValue(value: any): ColumnSchema['type'] {
    if (value === null || value === undefined) return 'string';
    if (typeof value === 'string') {
      if (value.match(/^\d{4}-\d{2}-\d{2}/) || value.match(/^\d{4}-\d{2}-\d{2}T/)) {
        return 'date';
      }
      return 'string';
    }
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'json';
    return 'string';
  }

  async fetchSampleData(tableName: string): Promise<any> {
    try {
      const response = await fetch(`${this.config.url}/rest/v1/${tableName}?limit=1`, {
        headers: {
          'apikey': this.config.anonKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch sample data for table ${tableName}`);
      }

      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error(`Failed to fetch sample data for table ${tableName}:`, error);
      return null;
    }
  }

  async testConnection(): Promise<boolean> {
    return this.connect();
  }
}

export class RestApiConnection implements DataSourceConnection {
  private config: RestApiConfig;

  constructor(config: RestApiConfig) {
    this.config = config;
  }

  async connect(): Promise<boolean> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...this.config.headers
      };

      if (this.config.authentication) {
        switch (this.config.authentication.type) {
          case 'bearer':
            headers['Authorization'] = `Bearer ${this.config.authentication.token}`;
            break;
          case 'api_key':
            headers['X-API-Key'] = this.config.authentication.apiKey || '';
            break;
          case 'basic':
            const credentials = btoa(`${this.config.authentication.username}:${this.config.authentication.password}`);
            headers['Authorization'] = `Basic ${credentials}`;
            break;
        }
      }

      const response = await fetch(this.config.baseUrl, {
        method: 'GET',
        headers
      });

      return response.ok;
    } catch (error) {
      console.error('REST API connection failed:', error);
      return false;
    }
  }

  async fetchSchema(): Promise<DataSourceSchema> {
    try {
      // For REST APIs, we'll try to fetch OpenAPI/Swagger spec
      const swaggerUrl = `${this.config.baseUrl}/swagger.json`;
      const openApiUrl = `${this.config.baseUrl}/openapi.json`;
      
      let schemaResponse;
      try {
        schemaResponse = await fetch(swaggerUrl);
        if (!schemaResponse.ok) {
          schemaResponse = await fetch(openApiUrl);
        }
      } catch (error) {
        // If no OpenAPI spec, create a basic schema
        return {
          tables: [],
          endpoints: [{
            path: '/',
            method: 'GET',
            description: 'Base endpoint'
          }]
        };
      }

      if (schemaResponse.ok) {
        const spec = await schemaResponse.json();
        return this.parseOpenApiSpec(spec);
      }

      return {
        tables: [],
        endpoints: []
      };
    } catch (error) {
      console.error('Failed to fetch REST API schema:', error);
      throw error;
    }
  }

  private parseOpenApiSpec(spec: any): DataSourceSchema {
    const endpoints = [];
    
    if (spec.paths) {
      for (const path in spec.paths) {
        for (const method in spec.paths[path]) {
          const endpoint = spec.paths[path][method];
          const methodUpper = method.toUpperCase();
          
          // Only include supported HTTP methods
          if (['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(methodUpper)) {
            endpoints.push({
              path: path,
              method: methodUpper as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
              description: endpoint.summary || endpoint.description || '',
              parameters: endpoint.parameters || [],
              requestBody: endpoint.requestBody?.content?.['application/json']?.schema,
              responses: endpoint.responses
            });
          }
        }
      }
    }

    return {
      tables: [],
      endpoints: endpoints
    };
  }

  async fetchSampleData(endpoint: string): Promise<any> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...this.config.headers
      };

      if (this.config.authentication) {
        switch (this.config.authentication.type) {
          case 'bearer':
            headers['Authorization'] = `Bearer ${this.config.authentication.token}`;
            break;
          case 'api_key':
            headers['X-API-Key'] = this.config.authentication.apiKey || '';
            break;
          case 'basic':
            const credentials = btoa(`${this.config.authentication.username}:${this.config.authentication.password}`);
            headers['Authorization'] = `Basic ${credentials}`;
            break;
        }
      }

      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch sample data from ${endpoint}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch sample data from ${endpoint}:`, error);
      return null;
    }
  }

  async testConnection(): Promise<boolean> {
    return this.connect();
  }
}

export class SoapApiConnection implements DataSourceConnection {
  private config: SoapApiConfig;

  constructor(config: SoapApiConfig) {
    this.config = config;
  }

  async connect(): Promise<boolean> {
    try {
      const response = await fetch(this.config.wsdlUrl);
      return response.ok;
    } catch (error) {
      console.error('SOAP API connection failed:', error);
      return false;
    }
  }

  async fetchSchema(): Promise<DataSourceSchema> {
    try {
      const response = await fetch(this.config.wsdlUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch WSDL');
      }

      const wsdlText = await response.text();
      // Parse WSDL (simplified implementation)
      const parser = new DOMParser();
      const wsdlDoc = parser.parseFromString(wsdlText, 'application/xml');
      
      // Extract operations from WSDL
      const operations = Array.from(wsdlDoc.querySelectorAll('operation')).map(op => ({
        path: op.getAttribute('name') || '',
        method: 'POST' as const,
        description: op.querySelector('documentation')?.textContent || ''
      }));

      return {
        tables: [],
        endpoints: operations
      };
    } catch (error) {
      console.error('Failed to fetch SOAP schema:', error);
      throw error;
    }
  }

  async fetchSampleData(operationName: string): Promise<any> {
    // SOAP sample data fetching would require creating a SOAP envelope
    // This is a simplified implementation
    return null;
  }

  async testConnection(): Promise<boolean> {
    return this.connect();
  }
}

export function createDataSourceConnection(dataSource: DataSource): DataSourceConnection {
  switch (dataSource.type) {
    case 'supabase':
      return new SupabaseConnection(dataSource.config as SupabaseConfig);
    case 'rest':
      return new RestApiConnection(dataSource.config as RestApiConfig);
    case 'soap':
      return new SoapApiConnection(dataSource.config as SoapApiConfig);
    default:
      throw new Error(`Unsupported data source type: ${dataSource.type}`);
  }
}

// Utility functions for components
export async function fetchDataSourceSchema(dataSource: DataSource): Promise<DataSourceSchema> {
  const connection = createDataSourceConnection(dataSource);
  return connection.fetchSchema();
}

export async function fetchSampleData(dataSource: DataSource, tableName: string): Promise<any> {
  const connection = createDataSourceConnection(dataSource);
  return connection.fetchSampleData(tableName);
}

export async function testDataSourceConnection(dataSource: DataSource): Promise<boolean> {
  const connection = createDataSourceConnection(dataSource);
  return connection.testConnection();
}
