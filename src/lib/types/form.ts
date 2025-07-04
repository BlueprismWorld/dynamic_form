// Core types for the dynamic form renderer system

export interface BaseComponentConfig {
  id: string;
  type: string;
  className?: string;
  style?: React.CSSProperties;
  visibleIf?: ConditionalRule;
  styleConfig?: StyleConfig;
}

export interface StyleConfig {
  // Layout & Positioning
  width?: string;
  height?: string;
  margin?: string;
  padding?: string;
  
  // Typography
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: string;
  
  // Background
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  
  // Border
  border?: string;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: string;
  
  // Box Shadow
  boxShadow?: string;
  
  // Flexbox
  display?: string;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: string;
  
  // Grid
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridGap?: string;
  
  // Position
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: number;
  
  // Animation
  transition?: string;
  transform?: string;
  
  // Visibility
  opacity?: number;
  visibility?: 'visible' | 'hidden';
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
}

export interface FormInputConfig extends BaseComponentConfig {
  name: string;
  label?: string;
  placeholder?: string;
  value?: any;
  onChange?: (value: any, name: string) => void;
  disabled?: boolean;
  required?: boolean;
  validation?: ValidationRule[];
  readOnly?: boolean;
}

export interface TextInputConfig extends FormInputConfig {
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'datetime-local';
  min?: string | number;
  max?: string | number;
  step?: string | number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}

export interface TextareaConfig extends FormInputConfig {
  type: 'textarea';
  rows?: number;
  cols?: number;
  maxLength?: number;
  minLength?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export interface SelectConfig extends FormInputConfig {
  type: 'select';
  options: SelectOption[];
  multiple?: boolean;
  dataSource?: DataSource;
}

export interface RadioConfig extends FormInputConfig {
  type: 'radio';
  options: RadioOption[];
}

export interface CheckboxConfig extends FormInputConfig {
  type: 'checkbox';
  options?: CheckboxOption[];
  single?: boolean; // For single checkbox
}

export interface FileConfig extends FormInputConfig {
  type: 'file';
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
}

// UI Component Configs
export interface ButtonConfig extends BaseComponentConfig {
  type: 'button';
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  buttonType?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

export interface TabsConfig extends BaseComponentConfig {
  type: 'tabs';
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
}

export interface StepperConfig extends BaseComponentConfig {
  type: 'stepper';
  steps: Step[];
  currentStep: number;
  onStepChange?: (step: number) => void;
  allowSkip?: boolean;
}

export interface AccordionConfig extends BaseComponentConfig {
  type: 'accordion';
  panels: AccordionPanel[];
  defaultOpen?: string[];
  allowMultiple?: boolean;
}

export interface CardConfig extends BaseComponentConfig {
  type: 'card';
  header?: ComponentConfig;
  content: ComponentConfig[];
  footer?: ComponentConfig;
  variant?: 'default' | 'outlined' | 'elevated';
}

export interface ModalConfig extends BaseComponentConfig {
  type: 'modal';
  trigger: ComponentConfig;
  title?: string;
  content: ComponentConfig[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClose?: () => void;
  closeOnOverlay?: boolean;
}

export interface TableConfig extends BaseComponentConfig {
  type: 'table';
  columns: TableColumn[];
  data: any[];
  sortable?: boolean;
  pagination?: PaginationConfig;
  selectable?: boolean;
  onRowSelect?: (row: any) => void;
}

export interface ProgressBarConfig extends BaseComponentConfig {
  type: 'progress-bar';
  value: number;
  max?: number;
  label?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showPercentage?: boolean;
}

export interface NotificationConfig extends BaseComponentConfig {
  type: 'notification';
  message: string;
  title?: string;
  variant: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

export interface BadgeConfig extends BaseComponentConfig {
  type: 'badge';
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export interface BreadcrumbsConfig extends BaseComponentConfig {
  type: 'breadcrumbs';
  items: BreadcrumbItem[];
  separator?: string;
  maxItems?: number;
}

export interface ChipsConfig extends BaseComponentConfig {
  type: 'chips';
  items: ChipItem[];
  selectable?: boolean;
  selected?: string[];
  onSelectionChange?: (selected: string[]) => void;
  variant?: 'default' | 'outlined' | 'filled';
}

export interface TooltipConfig extends BaseComponentConfig {
  type: 'tooltip';
  content: string;
  children: ComponentConfig;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
}

export interface GridConfig extends BaseComponentConfig {
  type: 'grid';
  columns: number | string;
  gap?: string | number;
  children: ComponentConfig[];
}

// Union type for all component configurations
export type ComponentConfig = 
  | TextInputConfig
  | TextareaConfig
  | SelectConfig
  | RadioConfig
  | CheckboxConfig
  | FileConfig
  | ButtonConfig
  | TabsConfig
  | StepperConfig
  | AccordionConfig
  | CardConfig
  | ModalConfig
  | TableConfig
  | ProgressBarConfig
  | NotificationConfig
  | BadgeConfig
  | BreadcrumbsConfig
  | ChipsConfig
  | TooltipConfig
  | GridConfig;

// Supporting types
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface CheckboxOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface Tab {
  id: string;
  label: string;
  content: ComponentConfig[];
  disabled?: boolean;
  icon?: string;
}

export interface Step {
  id: string;
  label: string;
  content: ComponentConfig[];
  optional?: boolean;
  completed?: boolean;
}

export interface AccordionPanel {
  id: string;
  title: string;
  content: ComponentConfig[];
  disabled?: boolean;
}

export interface TableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  width?: string | number;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface PaginationConfig {
  pageSize: number;
  currentPage?: number;
  total?: number;
  onPageChange?: (page: number) => void;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  current?: boolean;
}

export interface ChipItem {
  id: string;
  label: string;
  value?: string | number;
  removable?: boolean;
  onRemove?: () => void;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

export interface ConditionalRule {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'greaterThan' | 'lessThan' | 'in' | 'notIn';
  value: any;
  logic?: 'and' | 'or';
  rules?: ConditionalRule[];
}

export interface DataSource {
  url: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  valueField?: string;
  labelField?: string;
  transform?: (data: any) => SelectOption[];
}

export interface FormSchema {
  title?: string;
  description?: string;
  components: ComponentConfig[];
  validation?: ValidationRule[];
  onSubmit?: (data: any) => void;
  initialValues?: Record<string, any>;
}

export interface FormContextType {
  formData: Record<string, any>;
  updateField: (name: string, value: any) => void;
  errors: Record<string, string>;
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  isSubmitting: boolean;
  validateField: (name: string, value: any) => string | null;
}
