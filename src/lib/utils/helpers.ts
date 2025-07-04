import { DataSource, SelectOption } from '../types/form';

/**
 * Fetches data from external API and transforms it into options
 */
export async function fetchDataSource(dataSource: DataSource): Promise<SelectOption[]> {
  try {
    const url = new URL(dataSource.url);
    
    // Add query parameters if provided
    if (dataSource.params) {
      Object.entries(dataSource.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await fetch(url.toString(), {
      method: dataSource.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...dataSource.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform data using custom transformer or default field mapping
    if (dataSource.transform) {
      return dataSource.transform(data);
    }
    
    return transformDataToOptions(data, dataSource.valueField, dataSource.labelField);
  } catch (error) {
    console.error('Error fetching data source:', error);
    return [];
  }
}

/**
 * Transforms raw data into SelectOption format
 */
export function transformDataToOptions(
  data: any[],
  valueField = 'value',
  labelField = 'label'
): SelectOption[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(item => ({
    value: item[valueField] || item.id || item.value,
    label: item[labelField] || item.name || item.label || String(item),
  }));
}

/**
 * Caches data sources to avoid repeated API calls
 */
class DataSourceCache {
  private cache = new Map<string, { data: SelectOption[]; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(dataSource: DataSource): string {
    return JSON.stringify({
      url: dataSource.url,
      method: dataSource.method,
      params: dataSource.params,
    });
  }

  async get(dataSource: DataSource): Promise<SelectOption[]> {
    const key = this.getCacheKey(dataSource);
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const data = await fetchDataSource(dataSource);
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const dataSourceCache = new DataSourceCache();

/**
 * Utility function to merge class names
 */
export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generates a unique ID for components
 */
export function generateId(prefix = 'component'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep clones an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as any;
  }

  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Checks if two objects are deeply equal
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (obj1 == null || obj2 == null) {
    return false;
  }

  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  if (typeof obj1 !== 'object') {
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }

    if (!deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Formats file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validates file type against accept pattern
 */
export function validateFileType(file: File, accept: string): boolean {
  if (!accept) return true;

  const acceptedTypes = accept.split(',').map(type => type.trim());
  
  return acceptedTypes.some(type => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    return file.type.match(type.replace('*', '.*'));
  });
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttles a function call
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
